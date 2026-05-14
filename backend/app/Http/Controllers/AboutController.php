<?php

namespace App\Http\Controllers;

use App\Models\School;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class AboutController extends Controller
{
    public function show(Request $request): JsonResponse
    {
        /** @var School $school */
        $school = $request->attributes->get('school');

        return response()->json($school->aboutContent);
    }

    public function update(Request $request): JsonResponse
    {
        /** @var School $school */
        $school = $request->attributes->get('school');

        $payload = $request->validate([
            'heading' => ['required', 'string', 'max:255'],
            'description' => ['required', 'string'],
            'image_path' => ['nullable', 'string', 'max:500'],
            'principal_name' => ['nullable', 'string', 'max:200'],
            'principal_message' => ['nullable', 'string'],
            'principal_photo' => ['nullable', 'string', 'max:500'],
            'established_year' => ['nullable', 'string', 'max:10'],
        ]);

        $content = $school->aboutContent()->updateOrCreate(
            ['school_id' => $school->id],
            $payload,
        );

        return response()->json($content);
    }
}
