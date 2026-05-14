<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;

class School extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'domain',
        'template',
        'is_active',
    ];

    protected $casts = [
        'is_active' => 'boolean',
    ];

    public function adminUser(): HasOne
    {
        return $this->hasOne(AdminUser::class);
    }

    public function heroContent(): HasOne
    {
        return $this->hasOne(HeroContent::class);
    }

    public function aboutContent(): HasOne
    {
        return $this->hasOne(AboutContent::class);
    }

    public function contactInfo(): HasOne
    {
        return $this->hasOne(ContactInfo::class);
    }

    public function schoolSetting(): HasOne
    {
        return $this->hasOne(SchoolSetting::class);
    }

    public function heroSlides(): HasMany
    {
        return $this->hasMany(HeroSlide::class);
    }

    public function stats(): HasMany
    {
        return $this->hasMany(Stat::class);
    }

    public function facilities(): HasMany
    {
        return $this->hasMany(Facility::class);
    }

    public function faculty(): HasMany
    {
        return $this->hasMany(Faculty::class);
    }

    public function galleryImages(): HasMany
    {
        return $this->hasMany(GalleryImage::class);
    }

    public function notices(): HasMany
    {
        return $this->hasMany(Notice::class);
    }

    public function testimonials(): HasMany
    {
        return $this->hasMany(Testimonial::class);
    }
}
