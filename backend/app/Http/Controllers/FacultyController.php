<?php

namespace App\Http\Controllers;

use App\Models\Faculty;
use App\Models\School;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class FacultyController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        /** @var School $school */
        $school = $request->attributes->get('school');

        return response()->json($school->faculty()->orderBy('sort_order')->get());
    }

    public function store(Request $request): JsonResponse
    {
        /** @var School $school */
        $school = $request->attributes->get('school');

        $payload = $request->validate([
            'name' => ['required', 'string', 'max:200'],
            'designation' => ['required', 'string', 'max:200'],
            'qualification' => ['nullable', 'string', 'max:200'],
            'experience' => ['nullable', 'string', 'max:100'],
            'photo_path' => ['nullable', 'string', 'max:500'],
            'sort_order' => ['nullable', 'integer', 'min:0'],
        ]);

        $faculty = $school->faculty()->create($payload);

        return response()->json($faculty, 201);
    }

    public function update(Request $request, int $id): JsonResponse
    {
        /** @var School $school */
        $school = $request->attributes->get('school');

        /** @var Faculty|null $faculty */
        $faculty = $school->faculty()->find($id);
        if (! $faculty) {
            return response()->json(['message' => 'Faculty not found.'], 404);
        }

        $payload = $request->validate([
            'name' => ['required', 'string', 'max:200'],
            'designation' => ['required', 'string', 'max:200'],
            'qualification' => ['nullable', 'string', 'max:200'],
            'experience' => ['nullable', 'string', 'max:100'],
            'photo_path' => ['nullable', 'string', 'max:500'],
            'sort_order' => ['nullable', 'integer', 'min:0'],
        ]);

        $faculty->update($payload);

        return response()->json($faculty->fresh());
    }

    public function destroy(Request $request, int $id): JsonResponse
    {
        /** @var School $school */
        $school = $request->attributes->get('school');

        /** @var Faculty|null $faculty */
        $faculty = $school->faculty()->find($id);
        if (! $faculty) {
            return response()->json(['message' => 'Faculty not found.'], 404);
        }

        $faculty->delete();

        return response()->json(null, 204);
    }
}
