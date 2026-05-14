<?php

namespace App\Http\Middleware;

use App\Models\School;
use Closure;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class IdentifySchool
{
    public function handle(Request $request, Closure $next): Response
    {
        $host = $request->getHost();
        $normalizedHost = strtolower($host);
        $normalizedHost = preg_replace('/:\d+$/', '', $normalizedHost) ?? $normalizedHost;
        $hostWithoutWww = preg_replace('/^www\./', '', $normalizedHost) ?? $normalizedHost;

        $school = School::query()
            ->where('domain', $normalizedHost)
            ->orWhere('domain', $hostWithoutWww)
            ->first();

        if (! $school) {
            return new JsonResponse([
                'message' => 'School not found for this domain.',
            ], 404);
        }

        if (! $school->is_active) {
            return new JsonResponse([
                'message' => 'School is inactive.',
            ], 403);
        }

        $request->attributes->set('school', $school);

        return $next($request);
    }
}
