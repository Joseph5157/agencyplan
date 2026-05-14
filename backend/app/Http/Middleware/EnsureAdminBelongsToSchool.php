<?php

namespace App\Http\Middleware;

use App\Models\AdminUser;
use App\Models\School;
use Closure;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EnsureAdminBelongsToSchool
{
    public function handle(Request $request, Closure $next): Response
    {
        /** @var AdminUser|null $adminUser */
        $adminUser = $request->attributes->get('admin_user');
        /** @var School|null $school */
        $school = $request->attributes->get('school');

        if (! $adminUser || ! $school || $adminUser->school_id !== $school->id) {
            return new JsonResponse(['message' => 'Forbidden for this school.'], 403);
        }

        return $next($request);
    }
}

