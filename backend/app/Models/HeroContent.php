<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class HeroContent extends Model
{
    use HasFactory;

    protected $table = 'hero_content';

    protected $fillable = [
        'school_id',
        'heading',
        'subheading',
        'cta_text',
        'cta_link',
    ];

    public function school(): BelongsTo
    {
        return $this->belongsTo(School::class);
    }
}
