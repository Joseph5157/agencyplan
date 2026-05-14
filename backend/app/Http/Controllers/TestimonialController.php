<?php

namespace App\Http\Controllers;

use App\Models\School;
use App\Models\Testimonial;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class TestimonialController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        /** @var School $school */
        $school = $request->attributes->get('school');

        return response()->json($school->testimonials()->orderBy('sort_order')->get());
    }

    public function store(Request $request): JsonResponse
    {
        /** @var School $school */
        $school = $request->attributes->get('school');

        $payload = $request->validate([
            'name' => ['required', 'string', 'max:200'],
            'quote' => ['required', 'string'],
            'photo_path' => ['nullable', 'string', 'max:500'],
            'relation' => ['nullable', 'string', 'max:200'],
            'sort_order' => ['nullable', 'integer', 'min:0'],
        ]);

        $testimonial = $school->testimonials()->create($payload);

        return response()->json($testimonial, 201);
    }

    public function update(Request $request, int $id): JsonResponse
    {
        /** @var School $school */
        $school = $request->attributes->get('school');

        /** @var Testimonial|null $testimonial */
        $testimonial = $school->testimonials()->find($id);
        if (! $testimonial) {
            return response()->json(['message' => 'Testimonial not found.'], 404);
        }

        $payload = $request->validate([
            'name' => ['required', 'string', 'max:200'],
            'quote' => ['required', 'string'],
            'photo_path' => ['nullable', 'string', 'max:500'],
            'relation' => ['nullable', 'string', 'max:200'],
            'sort_order' => ['nullable', 'integer', 'min:0'],
        ]);

        $testimonial->update($payload);

        return response()->json($testimonial->fresh());
    }

    public function destroy(Request $request, int $id): JsonResponse
    {
        /** @var School $school */
        $school = $request->attributes->get('school');

        /** @var Testimonial|null $testimonial */
        $testimonial = $school->testimonials()->find($id);
        if (! $testimonial) {
            return response()->json(['message' => 'Testimonial not found.'], 404);
        }

        $testimonial->delete();

        return response()->json(null, 204);
    }
}
