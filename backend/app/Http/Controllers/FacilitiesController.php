<?php

namespace App\Http\Controllers;

use App\Models\Facility;
use App\Models\School;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class FacilitiesController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        /** @var School $school */
        $school = $request->attributes->get('school');

        return response()->json($school->facilities()->orderBy('sort_order')->get());
    }

    public function store(Request $request): JsonResponse
    {
        /** @var School $school */
        $school = $request->attributes->get('school');

        $payload = $request->validate([
            'name' => ['required', 'string', 'max:200'],
            'description' => ['required', 'string'],
            'image_path' => ['nullable', 'string', 'max:500'],
            'sort_order' => ['nullable', 'integer', 'min:0'],
        ]);

        $facility = $school->facilities()->create($payload);

        return response()->json($facility, 201);
    }

    public function update(Request $request, int $id): JsonResponse
    {
        /** @var School $school */
        $school = $request->attributes->get('school');

        /** @var Facility|null $facility */
        $facility = $school->facilities()->find($id);
        if (! $facility) {
            return response()->json(['message' => 'Facility not found.'], 404);
        }

        $payload = $request->validate([
            'name' => ['required', 'string', 'max:200'],
            'description' => ['required', 'string'],
            'image_path' => ['nullable', 'string', 'max:500'],
            'sort_order' => ['nullable', 'integer', 'min:0'],
        ]);

        $facility->update($payload);

        return response()->json($facility->fresh());
    }

    public function destroy(Request $request, int $id): JsonResponse
    {
        /** @var School $school */
        $school = $request->attributes->get('school');

        /** @var Facility|null $facility */
        $facility = $school->facilities()->find($id);
        if (! $facility) {
            return response()->json(['message' => 'Facility not found.'], 404);
        }

        $facility->delete();

        return response()->json(null, 204);
    }
}
