<?php

namespace App\Http\Controllers;

use App\Models\AdminUser;
use App\Models\School;
use App\Services\JwtTokenService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    public function __construct(private readonly JwtTokenService $jwtTokenService) {}

    /**
     * @throws ValidationException
     */
    public function login(Request $request): JsonResponse
    {
        $credentials = $request->validate([
            'email' => ['required', 'email'],
            'password' => ['required', 'string'],
        ]);

        /** @var School $school */
        $school = $request->attributes->get('school');

        $adminUser = AdminUser::query()
            ->where('school_id', $school->id)
            ->where('email', $credentials['email'])
            ->first();

        if (! $adminUser || ! Hash::check($credentials['password'], $adminUser->password)) {
            throw ValidationException::withMessages([
                'email' => ['The provided credentials are incorrect.'],
            ]);
        }

        $ttl = (int) config('jwt.ttl', 7200);
        $token = $this->jwtTokenService->issue($adminUser, $ttl);

        return response()->json([
            'token_type' => 'Bearer',
            'access_token' => $token,
            'expires_in' => $ttl,
            'admin_user' => [
                'id' => $adminUser->id,
                'email' => $adminUser->email,
                'school_id' => $adminUser->school_id,
            ],
        ]);
    }

    public function me(Request $request): JsonResponse
    {
        /** @var AdminUser $adminUser */
        $adminUser = $request->attributes->get('admin_user');

        return response()->json([
            'id' => $adminUser->id,
            'email' => $adminUser->email,
            'school_id' => $adminUser->school_id,
        ]);
    }
}
