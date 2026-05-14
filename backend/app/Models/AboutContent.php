<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class AboutContent extends Model
{
    use HasFactory;

    protected $table = 'about_content';

    protected $fillable = [
        'school_id',
        'heading',
        'description',
        'image_path',
        'principal_name',
        'principal_message',
        'principal_photo',
        'established_year',
    ];

    public function school(): BelongsTo
    {
        return $this->belongsTo(School::class);
    }
}
