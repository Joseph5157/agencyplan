<?php

namespace App\Http\Controllers;

use App\Models\Notice;
use App\Models\School;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class NoticeController extends Controller
{
    public function adminIndex(Request $request): JsonResponse
    {
        /** @var School $school */
        $school = $request->attributes->get('school');

        return response()->json(
            $school->notices()
                ->orderByDesc('notice_date')
                ->get(),
        );
    }

    public function index(Request $request): JsonResponse
    {
        /** @var School $school */
        $school = $request->attributes->get('school');

        return response()->json(
            $school->notices()
                ->where('is_active', true)
                ->orderByDesc('notice_date')
                ->get(),
        );
    }

    public function store(Request $request): JsonResponse
    {
        /** @var School $school */
        $school = $request->attributes->get('school');

        $payload = $request->validate([
            'title' => ['required', 'string', 'max:255'],
            'description' => ['required', 'string'],
            'notice_date' => ['required', 'date'],
            'attachment_path' => ['nullable', 'string', 'max:500'],
            'is_active' => ['sometimes', 'boolean'],
        ]);

        $notice = $school->notices()->create($payload);

        return response()->json($notice, 201);
    }

    public function update(Request $request, int $id): JsonResponse
    {
        /** @var School $school */
        $school = $request->attributes->get('school');

        /** @var Notice|null $notice */
        $notice = $school->notices()->find($id);
        if (! $notice) {
            return response()->json(['message' => 'Notice not found.'], 404);
        }

        $payload = $request->validate([
            'title' => ['required', 'string', 'max:255'],
            'description' => ['required', 'string'],
            'notice_date' => ['required', 'date'],
            'attachment_path' => ['nullable', 'string', 'max:500'],
            'is_active' => ['sometimes', 'boolean'],
        ]);

        $notice->update($payload);

        return response()->json($notice->fresh());
    }

    public function destroy(Request $request, int $id): JsonResponse
    {
        /** @var School $school */
        $school = $request->attributes->get('school');

        /** @var Notice|null $notice */
        $notice = $school->notices()->find($id);
        if (! $notice) {
            return response()->json(['message' => 'Notice not found.'], 404);
        }

        $notice->delete();

        return response()->json(null, 204);
    }
}
