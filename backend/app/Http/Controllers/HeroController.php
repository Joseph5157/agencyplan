<?php

namespace App\Http\Controllers;

use App\Models\HeroSlide;
use App\Models\School;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class HeroController extends Controller
{
    public function show(Request $request): JsonResponse
    {
        /** @var School $school */
        $school = $request->attributes->get('school');

        return response()->json([
            'content' => $school->heroContent,
            'slides' => $school->heroSlides()->orderBy('sort_order')->get(),
        ]);
    }

    public function update(Request $request): JsonResponse
    {
        /** @var School $school */
        $school = $request->attributes->get('school');

        $payload = $request->validate([
            'heading' => ['required', 'string', 'max:255'],
            'subheading' => ['nullable', 'string', 'max:255'],
            'cta_text' => ['nullable', 'string', 'max:100'],
            'cta_link' => ['nullable', 'url', 'max:500'],
        ]);

        $content = $school->heroContent()->updateOrCreate(
            ['school_id' => $school->id],
            $payload,
        );

        return response()->json($content);
    }

    public function storeSlide(Request $request): JsonResponse
    {
        /** @var School $school */
        $school = $request->attributes->get('school');

        $payload = $request->validate([
            'image_path' => ['required', 'string', 'max:500'],
            'sort_order' => ['nullable', 'integer', 'min:0'],
        ]);

        $slide = $school->heroSlides()->create([
            'image_path' => $payload['image_path'],
            'sort_order' => $payload['sort_order'] ?? 0,
        ]);

        return response()->json($slide, 201);
    }

    public function destroySlide(Request $request, int $id): JsonResponse
    {
        /** @var School $school */
        $school = $request->attributes->get('school');

        /** @var HeroSlide|null $slide */
        $slide = $school->heroSlides()->find($id);
        if (! $slide) {
            return response()->json(['message' => 'Hero slide not found.'], 404);
        }

        $slide->delete();

        return response()->json(null, 204);
    }
}
