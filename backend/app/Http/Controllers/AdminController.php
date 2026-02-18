<?php

namespace App\Http\Controllers;

use App\Helpers\ApiResponse;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

class AdminController extends Controller
{
    /**
     * Get all users with pagination.
     * Excludes admin users for security.
     */
    public function listUsers(Request $request): JsonResponse
    {
        // Don't show admin users in user management
        $users = User::where('role', '!=', 'admin')->paginate(15);
        return ApiResponse::success($users, 'Users retrieved successfully');
    }

    /**
     * Create a new user.
     * Cannot create admin users through this endpoint.
     */
    public function createUser(Request $request): JsonResponse
    {
        try {
            $validated = $request->validate([
                'name' => 'required|string|max:255',
                'email' => 'required|string|email|max:255|unique:users',
                'password' => 'required|string|min:8',
                'role' => 'required|in:instructor,student',
            ]);

            $user = User::create([
                'name' => $validated['name'],
                'email' => $validated['email'],
                'password' => Hash::make($validated['password']),
                'role' => $validated['role'],
            ]);

            return ApiResponse::success($user, 'User created successfully', 201);

        } catch (ValidationException $e) {
            return ApiResponse::error('Validation failed', 422, $e->errors());
        }
    }

    /**
     * Update an existing user.
     * Cannot update admin users.
     */
    public function updateUser(Request $request, $id): JsonResponse
    {
        try {
            $user = User::findOrFail($id);

            // Prevent updating admin users
            if ($user->role === 'admin') {
                return ApiResponse::error('Admin users cannot be modified', 403);
            }

            $validated = $request->validate([
                'name' => 'sometimes|string|max:255',
                'email' => 'sometimes|string|email|max:255|unique:users,email,' . $id,
                'password' => 'sometimes|string|min:8',
                'role' => 'sometimes|in:instructor,student',
            ]);

            if (isset($validated['password'])) {
                $validated['password'] = Hash::make($validated['password']);
            }

            $user->update($validated);

            return ApiResponse::success($user, 'User updated successfully');

        } catch (ValidationException $e) {
            return ApiResponse::error('Validation failed', 422, $e->errors());
        } catch (\Exception $e) {
            return ApiResponse::error('User not found', 404);
        }
    }

    /**
     * Delete a user.
     * Cannot delete admin users.
     */
    public function deleteUser($id): JsonResponse
    {
        try {
            $user = User::findOrFail($id);

            // Prevent deleting admin users
            if ($user->role === 'admin') {
                return ApiResponse::error('Admin users cannot be deleted', 403);
            }

            $user->delete();

            return ApiResponse::success(null, 'User deleted successfully');

        } catch (\Exception $e) {
            return ApiResponse::error('User not found', 404);
        }
    }
}
