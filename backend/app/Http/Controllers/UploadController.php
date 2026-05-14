<?php

namespace App\Http\Controllers;

use App\Http\Requests\UploadRequest;
use App\Models\AdminUser;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class UploadController extends Controller
{
    public function store(UploadRequest $request): JsonResponse
    {
        /** @var AdminUser $adminUser */
        $adminUser = $request->attributes->get('admin_user');
        $section = $request->string('section')->toString();
        $file = $request->file('file');
        $disk = (string) config('uploads.disk', 'public');

        $folder = sprintf('schools/%d/%s', $adminUser->school_id, $section);
        $filename = Str::uuid()->toString().'.'.$file->getClientOriginalExtension();
        $path = $file->storeAs($folder, $filename, $disk);

        return response()->json([
            'path' => $path,
            'url' => Storage::disk($disk)->url($path),
            'section' => $section,
            'disk' => $disk,
        ], 201);
    }
}
