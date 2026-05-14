<?php

namespace Database\Seeders;

use App\Models\AdminUser;
use App\Models\School;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class AdminUserSeeder extends Seeder
{
    /**
     * Seed one admin account for the seeded test school.
     */
    public function run(): void
    {
        $school = School::query()->where('domain', 'greenfield.test')->first();

        if (! $school) {
            return;
        }

        AdminUser::updateOrCreate(
            ['school_id' => $school->id, 'email' => 'admin@greenfield.test'],
            ['password' => Hash::make('Passw0rd!123')],
        );
    }
}

