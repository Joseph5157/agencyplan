<?php

namespace App\Http\Controllers;

use App\Models\School;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ContactController extends Controller
{
    public function show(Request $request): JsonResponse
    {
        /** @var School $school */
        $school = $request->attributes->get('school');

        return response()->json($school->contactInfo);
    }

    public function update(Request $request): JsonResponse
    {
        /** @var School $school */
        $school = $request->attributes->get('school');

        $payload = $request->validate([
            'address' => ['required', 'string'],
            'phone' => ['required', 'string', 'max:200'],
            'email' => ['required', 'email', 'max:200'],
            'maps_url' => ['nullable', 'url'],
            'whatsapp' => ['nullable', 'string', 'max:20'],
        ]);

        $contact = $school->contactInfo()->updateOrCreate(
            ['school_id' => $school->id],
            $payload,
        );

        return response()->json($contact);
    }
}
