<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('about_content', function (Blueprint $table) {
            $table->id();
            $table->foreignId('school_id')
                ->constrained('schools')
                ->cascadeOnDelete()
                ->unique();
            $table->string('heading', 255);
            $table->text('description');
            $table->string('image_path', 500)->nullable();
            $table->string('principal_name', 200)->nullable();
            $table->text('principal_message')->nullable();
            $table->string('principal_photo', 500)->nullable();
            $table->string('established_year', 10)->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('about_content');
    }
};
