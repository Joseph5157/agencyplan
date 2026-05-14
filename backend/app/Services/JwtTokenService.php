<?php

namespace App\Services;

use App\Models\AdminUser;
use RuntimeException;

class JwtTokenService
{
    public function issue(AdminUser $adminUser, int $ttlSeconds = 7200): string
    {
        $ttlSeconds = (int) config('jwt.ttl', $ttlSeconds);
        $now = time();
        $payload = [
            'sub' => $adminUser->id,
            'school_id' => $adminUser->school_id,
            'iat' => $now,
            'exp' => $now + $ttlSeconds,
        ];

        return $this->encode($payload);
    }

    /**
     * @return array<string, mixed>|null
     */
    public function verify(string $token): ?array
    {
        $parts = explode('.', $token);
        if (count($parts) !== 3) {
            return null;
        }

        [$encodedHeader, $encodedPayload, $encodedSignature] = $parts;
        $signature = $this->base64UrlDecode($encodedSignature);
        if ($signature === false) {
            return null;
        }

        $expectedSignature = hash_hmac('sha256', $encodedHeader.'.'.$encodedPayload, $this->secret(), true);
        if (! hash_equals($expectedSignature, $signature)) {
            return null;
        }

        $payload = json_decode((string) $this->base64UrlDecode($encodedPayload), true);
        if (! is_array($payload) || ! isset($payload['exp']) || time() >= (int) $payload['exp']) {
            return null;
        }

        return $payload;
    }

    /**
     * @param  array<string, mixed>  $payload
     */
    private function encode(array $payload): string
    {
        $header = ['alg' => 'HS256', 'typ' => 'JWT'];
        $encodedHeader = $this->base64UrlEncode(json_encode($header, JSON_THROW_ON_ERROR));
        $encodedPayload = $this->base64UrlEncode(json_encode($payload, JSON_THROW_ON_ERROR));

        $signature = hash_hmac('sha256', $encodedHeader.'.'.$encodedPayload, $this->secret(), true);

        return $encodedHeader.'.'.$encodedPayload.'.'.$this->base64UrlEncode($signature);
    }

    private function secret(): string
    {
        $rawKey = (string) config('jwt.secret', '');
        if ($rawKey === '') {
            $rawKey = (string) config('app.key', '');
        }

        if ($rawKey === '') {
            throw new RuntimeException('APP_KEY is required for JWT signing.');
        }

        if (str_starts_with($rawKey, 'base64:')) {
            $decoded = base64_decode(substr($rawKey, 7), true);

            return $decoded !== false ? $decoded : $rawKey;
        }

        return $rawKey;
    }

    private function base64UrlEncode(string $value): string
    {
        return rtrim(strtr(base64_encode($value), '+/', '-_'), '=');
    }

    private function base64UrlDecode(string $value): string|false
    {
        $padded = str_pad($value, strlen($value) + (4 - strlen($value) % 4) % 4, '=', STR_PAD_RIGHT);

        return base64_decode(strtr($padded, '-_', '+/'), true);
    }
}
