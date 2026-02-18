<?php

namespace App\Http\Controllers;

use App\Helpers\ApiResponse;
use App\Models\Notification;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class NotificationController extends Controller
{
    /**
     * Get notifications for the authenticated user.
     */
    public function getUserNotifications(Request $request): JsonResponse
    {
        $notifications = Notification::where('user_id', $request->user()->id)
            ->where('is_read', false)
            ->orderBy('created_at', 'desc')
            ->get();

        return ApiResponse::success($notifications, 'Notifications retrieved successfully');
    }

    /**
     * Mark a notification as read.
     */
    public function markAsRead($id): JsonResponse
    {
        try {
            $notification = Notification::findOrFail($id);
            $notification->update(['is_read' => true]);

            return ApiResponse::success($notification, 'Notification marked as read');

        } catch (\Exception $e) {
            return ApiResponse::error('Notification not found', 404);
        }
    }

    /**
     * Create a new notification.
     */
    public function createNotification(Request $request): JsonResponse
    {
        try {
            $validated = $request->validate([
                'user_id' => 'required|exists:users,id',
                'message' => 'required|string',
                'type' => 'required|string|max:50',
            ]);

            $notification = Notification::create($validated);

            return ApiResponse::success($notification, 'Notification created successfully', 201);

        } catch (\Exception $e) {
            return ApiResponse::error('Validation failed', 422, $e->errors());
        }
    }
}
