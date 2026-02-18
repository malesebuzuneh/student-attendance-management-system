<?php

namespace App\Http\Middleware;

use App\Helpers\ApiResponse;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class RoleMiddleware
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next, string ...$roles): Response
    {
        if (!$request->user()) {
            return ApiResponse::error('Unauthenticated', 401);
        }

        $userRole = $request->user()->role;

        if (!in_array($userRole, $roles)) {
            return ApiResponse::error(
                'Unauthorized. You do not have permission to access this resource.',
                403,
                [],
                'FORBIDDEN'
            );
        }

        return $next($request);
    }
}
