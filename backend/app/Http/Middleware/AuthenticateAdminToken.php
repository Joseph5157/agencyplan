<?php

namespace App\Http\Middleware;

use App\Models\AdminUser;
use App\Services\JwtTokenService;
use Closure;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class AuthenticateAdminToken
{
    public function __construct(private readonly JwtTokenService $jwtTokenService) {}

    public function handle(Request $request, Closure $next): Response
    {
        $token = $request->bearerToken();
        if (! $token) {
            return new JsonResponse(['message' => 'Missing bearer token.'], 401);
        }

        $payload = $this->jwtTokenService->verify($token);
        if (! $payload || ! isset($payload['sub'])) {
            return new JsonResponse(['message' => 'Invalid or expired token.'], 401);
        }

        $adminUser = AdminUser::query()->find($payload['sub']);
        if (! $adminUser) {
            return new JsonResponse(['message' => 'Admin user not found.'], 401);
        }

        $request->attributes->set('admin_user', $adminUser);
        $request->attributes->set('admin_token_payload', $payload);

        return $next($request);
    }
}

