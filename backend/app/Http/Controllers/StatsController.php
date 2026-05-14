<?php

namespace App\Http\Controllers;

use App\Models\School;
use App\Models\Stat;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class StatsController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        /** @var School $school */
        $school = $request->attributes->get('school');

        return response()->json($school->stats()->orderBy('sort_order')->get());
    }

    public function update(Request $request): JsonResponse
    {
        /** @var School $school */
        $school = $request->attributes->get('school');

        $payload = $request->validate([
            'stats' => ['required', 'array', 'min:1', 'max:4'],
            'stats.*.number' => ['required', 'string', 'max:50'],
            'stats.*.label' => ['required', 'string', 'max:100'],
            'stats.*.sort_order' => ['nullable', 'integer', 'min:0'],
        ]);

        $school->stats()->delete();

        foreach ($payload['stats'] as $index => $item) {
            $school->stats()->create([
                'number' => $item['number'],
                'label' => $item['label'],
                'sort_order' => $item['sort_order'] ?? $index,
            ]);
        }

        return response()->json($school->stats()->orderBy('sort_order')->get());
    }

    public function store(Request $request): JsonResponse
    {
        /** @var School $school */
        $school = $request->attributes->get('school');

        $payload = $request->validate([
            'number' => ['required', 'string', 'max:50'],
            'label' => ['required', 'string', 'max:100'],
            'sort_order' => ['nullable', 'integer', 'min:0'],
        ]);

        $stat = $school->stats()->create([
            'number' => $payload['number'],
            'label' => $payload['label'],
            'sort_order' => $payload['sort_order'] ?? 0,
        ]);

        return response()->json($stat, 201);
    }

    public function destroy(Request $request, int $id): JsonResponse
    {
        /** @var School $school */
        $school = $request->attributes->get('school');

        /** @var Stat|null $stat */
        $stat = $school->stats()->find($id);
        if (! $stat) {
            return response()->json(['message' => 'Stat not found.'], 404);
        }

        $stat->delete();

        return response()->json(null, 204);
    }
}
