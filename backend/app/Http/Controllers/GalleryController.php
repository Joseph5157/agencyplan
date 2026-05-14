<?php

namespace App\Http\Controllers;

use App\Models\GalleryImage;
use App\Models\School;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class GalleryController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        /** @var School $school */
        $school = $request->attributes->get('school');

        return response()->json($school->galleryImages()->orderBy('sort_order')->get());
    }

    public function store(Request $request): JsonResponse
    {
        /** @var School $school */
        $school = $request->attributes->get('school');

        $payload = $request->validate([
            'image_path' => ['required', 'string', 'max:500'],
            'caption' => ['nullable', 'string', 'max:255'],
            'category' => ['nullable', 'string', 'max:100'],
            'sort_order' => ['nullable', 'integer', 'min:0'],
        ]);

        $image = $school->galleryImages()->create($payload);

        return response()->json($image, 201);
    }

    public function destroy(Request $request, int $id): JsonResponse
    {
        /** @var School $school */
        $school = $request->attributes->get('school');

        /** @var GalleryImage|null $image */
        $image = $school->galleryImages()->find($id);
        if (! $image) {
            return response()->json(['message' => 'Gallery image not found.'], 404);
        }

        $image->delete();

        return response()->json(null, 204);
    }
}
