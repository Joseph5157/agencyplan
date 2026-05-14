<?php

namespace App\Http\Controllers;

use App\Models\School;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class SchoolController extends Controller
{
    public function show(Request $request): JsonResponse
    {
        /** @var School $school */
        $school = $request->attributes->get('school');

        return response()->json([
            'id' => $school->id,
            'name' => $school->name,
            'domain' => $school->domain,
            'template' => $school->template,
            'is_active' => $school->is_active,
        ]);
    }

    public function settings(Request $request): JsonResponse
    {
        /** @var School $school */
        $school = $request->attributes->get('school');

        return response()->json($school->schoolSetting);
    }

    public function updateSettings(Request $request): JsonResponse
    {
        /** @var School $school */
        $school = $request->attributes->get('school');

        $payload = $request->validate([
            'logo_path' => ['nullable', 'string', 'max:500'],
            'favicon_path' => ['nullable', 'string', 'max:500'],
            'tagline' => ['nullable', 'string', 'max:255'],
            'meta_title' => ['nullable', 'string', 'max:255'],
            'meta_description' => ['nullable', 'string'],
            'facebook_url' => ['nullable', 'url', 'max:500'],
            'instagram_url' => ['nullable', 'url', 'max:500'],
            'youtube_url' => ['nullable', 'url', 'max:500'],
            'copyright_text' => ['nullable', 'string', 'max:255'],
            'template' => ['prohibited'],
        ]);

        $settings = $school->schoolSetting()->updateOrCreate(
            ['school_id' => $school->id],
            $payload,
        );

        return response()->json($settings);
    }
}
