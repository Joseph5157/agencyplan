<?php

use App\Http\Controllers\AboutController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\ContactController;
use App\Http\Controllers\FacilitiesController;
use App\Http\Controllers\FacultyController;
use App\Http\Controllers\GalleryController;
use App\Http\Controllers\HeroController;
use App\Http\Controllers\NoticeController;
use App\Http\Controllers\SchoolController;
use App\Http\Controllers\StatsController;
use App\Http\Controllers\TestimonialController;
use App\Http\Controllers\UploadController;
use Illuminate\Support\Facades\Route;

Route::middleware('identify.school')->group(function (): void {
    Route::get('/school', [SchoolController::class, 'show']);
    Route::get('/school/hero', [HeroController::class, 'show']);
    Route::get('/school/about', [AboutController::class, 'show']);
    Route::get('/school/stats', [StatsController::class, 'index']);
    Route::get('/school/facilities', [FacilitiesController::class, 'index']);
    Route::get('/school/faculty', [FacultyController::class, 'index']);
    Route::get('/school/gallery', [GalleryController::class, 'index']);
    Route::get('/school/notices', [NoticeController::class, 'index']);
    Route::get('/school/testimonials', [TestimonialController::class, 'index']);
    Route::get('/school/contact', [ContactController::class, 'show']);
    Route::get('/school/settings', [SchoolController::class, 'settings']);

    Route::prefix('admin')->group(function (): void {
        Route::post('/login', [AuthController::class, 'login']);

        Route::middleware('admin.auth')->group(function (): void {
            Route::get('/me', [AuthController::class, 'me']);
            Route::post('/upload', [UploadController::class, 'store']);
            Route::put('/hero', [HeroController::class, 'update']);
            Route::post('/hero/slides', [HeroController::class, 'storeSlide']);
            Route::delete('/hero/slides/{id}', [HeroController::class, 'destroySlide']);
            Route::put('/about', [AboutController::class, 'update']);
            Route::put('/stats', [StatsController::class, 'update']);
            Route::post('/stats', [StatsController::class, 'store']);
            Route::delete('/stats/{id}', [StatsController::class, 'destroy']);
            Route::post('/facilities', [FacilitiesController::class, 'store']);
            Route::put('/facilities/{id}', [FacilitiesController::class, 'update']);
            Route::delete('/facilities/{id}', [FacilitiesController::class, 'destroy']);
            Route::post('/faculty', [FacultyController::class, 'store']);
            Route::put('/faculty/{id}', [FacultyController::class, 'update']);
            Route::delete('/faculty/{id}', [FacultyController::class, 'destroy']);
            Route::post('/gallery', [GalleryController::class, 'store']);
            Route::delete('/gallery/{id}', [GalleryController::class, 'destroy']);
            Route::get('/notices', [NoticeController::class, 'adminIndex']);
            Route::post('/notices', [NoticeController::class, 'store']);
            Route::put('/notices/{id}', [NoticeController::class, 'update']);
            Route::delete('/notices/{id}', [NoticeController::class, 'destroy']);
            Route::post('/testimonials', [TestimonialController::class, 'store']);
            Route::put('/testimonials/{id}', [TestimonialController::class, 'update']);
            Route::delete('/testimonials/{id}', [TestimonialController::class, 'destroy']);
            Route::put('/contact', [ContactController::class, 'update']);
            Route::put('/settings', [SchoolController::class, 'updateSettings']);
        });
    });
});
