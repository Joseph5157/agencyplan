<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ContactInfo extends Model
{
    use HasFactory;

    protected $table = 'contact_info';

    protected $fillable = [
        'school_id',
        'address',
        'phone',
        'email',
        'maps_url',
        'whatsapp',
    ];

    public function school(): BelongsTo
    {
        return $this->belongsTo(School::class);
    }
}
