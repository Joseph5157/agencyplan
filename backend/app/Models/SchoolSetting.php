<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class SchoolSetting extends Model
{
    use HasFactory;

    protected $fillable = [
        'school_id',
        'logo_path',
        'favicon_path',
        'tagline',
        'meta_title',
        'meta_description',
        'facebook_url',
        'instagram_url',
        'youtube_url',
        'copyright_text',
    ];

    public function school(): BelongsTo
    {
        return $this->belongsTo(School::class);
    }
}
