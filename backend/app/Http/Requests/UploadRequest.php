<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UploadRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    /**
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        return [
            'section' => [
                'required',
                'string',
                Rule::in(['hero', 'about', 'facilities', 'faculty', 'gallery', 'testimonials', 'settings', 'logo', 'favicon', 'notices']),
            ],
            'file' => ['required', 'file', 'max:'.(int) config('uploads.max_size_kb', 10240)],
        ];
    }

    public function withValidator($validator): void
    {
        $validator->after(function ($validator): void {
            $file = $this->file('file');
            $section = $this->input('section');

            if (! $file || ! $section) {
                return;
            }

            if ($section === 'notices') {
                $extension = strtolower((string) $file->getClientOriginalExtension());
                $allowedPdfMimes = ['application/pdf', 'application/x-pdf'];
                if ($extension !== 'pdf' || ! in_array($file->getMimeType(), $allowedPdfMimes, true)) {
                    $validator->errors()->add('file', 'Notices accept PDF files only.');
                }

                return;
            }

            $allowedImageMimes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
            if (! in_array($file->getMimeType(), $allowedImageMimes, true)) {
                $validator->errors()->add('file', 'This section accepts image files only (jpeg, png, webp, gif).');
            }
        });
    }
}
