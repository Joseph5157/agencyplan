<?php

namespace Tests\Feature;

use App\Models\AdminUser;
use App\Models\Notice;
use App\Models\School;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Hash;
use Tests\TestCase;

class AdminContentRoutesTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        config()->set('jwt.secret', 'test-jwt-secret');
    }

    public function test_admin_can_update_hero_for_detected_school_only(): void
    {
        $schoolA = $this->createSchool('admin-a.test');
        $schoolB = $this->createSchool('admin-b.test');
        $token = $this->loginAndGetToken($schoolA, 'admin@admin-a.test', 'Passw0rd!123');

        $ok = $this->withHeader('Authorization', 'Bearer '.$token)
            ->putJson($this->apiUrl('admin-a.test', '/api/admin/hero'), [
                'heading' => 'Updated Heading',
                'subheading' => 'Updated subheading',
                'cta_text' => 'Apply Now',
                'cta_link' => 'https://admin-a.test/admissions',
            ]);

        $ok->assertOk()->assertJsonPath('heading', 'Updated Heading');
        $this->assertDatabaseHas('hero_content', [
            'school_id' => $schoolA->id,
            'heading' => 'Updated Heading',
        ]);

        $forbidden = $this->withHeader('Authorization', 'Bearer '.$token)
            ->putJson($this->apiUrl('admin-b.test', '/api/admin/hero'), [
                'heading' => 'Should Not Save',
                'subheading' => 'Nope',
            ]);

        $forbidden->assertStatus(403);
        $this->assertDatabaseMissing('hero_content', [
            'school_id' => $schoolB->id,
            'heading' => 'Should Not Save',
        ]);
    }

    public function test_admin_settings_rejects_template_changes(): void
    {
        $school = $this->createSchool('settings-lock.test');
        $token = $this->loginAndGetToken($school, 'admin@settings-lock.test', 'Passw0rd!123');

        $response = $this->withHeader('Authorization', 'Bearer '.$token)
            ->putJson($this->apiUrl('settings-lock.test', '/api/admin/settings'), [
                'tagline' => 'Safe update',
                'template' => 'template_two',
            ]);

        $response->assertStatus(422)->assertJsonValidationErrors(['template']);
    }

    public function test_public_notices_are_active_only_but_admin_notices_include_active_and_inactive_for_same_school(): void
    {
        $schoolA = $this->createSchool('notices-admin-a.test');
        $schoolB = $this->createSchool('notices-admin-b.test');
        $tokenA = $this->loginAndGetToken($schoolA, 'admin@notices-admin-a.test', 'Passw0rd!123');

        Notice::create([
            'school_id' => $schoolA->id,
            'title' => 'A Active',
            'description' => 'Visible public',
            'notice_date' => '2026-05-20',
            'is_active' => true,
        ]);
        Notice::create([
            'school_id' => $schoolA->id,
            'title' => 'A Inactive',
            'description' => 'Hidden public',
            'notice_date' => '2026-05-21',
            'is_active' => false,
        ]);
        Notice::create([
            'school_id' => $schoolB->id,
            'title' => 'B Active',
            'description' => 'Other school',
            'notice_date' => '2026-05-22',
            'is_active' => true,
        ]);

        $public = $this->getJson($this->apiUrl('notices-admin-a.test', '/api/school/notices'));
        $public->assertOk()
            ->assertJsonCount(1)
            ->assertJsonPath('0.title', 'A Active')
            ->assertJsonMissing(['title' => 'A Inactive'])
            ->assertJsonMissing(['title' => 'B Active']);

        $admin = $this->withHeader('Authorization', 'Bearer '.$tokenA)
            ->getJson($this->apiUrl('notices-admin-a.test', '/api/admin/notices'));
        $admin->assertOk()
            ->assertJsonCount(2)
            ->assertJsonFragment(['title' => 'A Active'])
            ->assertJsonFragment(['title' => 'A Inactive'])
            ->assertJsonMissing(['title' => 'B Active']);
    }

    private function createSchool(string $domain): School
    {
        return School::create([
            'name' => ucfirst(str_replace('.test', '', $domain)),
            'domain' => $domain,
            'template' => 'template-one',
            'is_active' => true,
        ]);
    }

    private function createAdmin(School $school, string $email, string $plainPassword): AdminUser
    {
        return AdminUser::create([
            'school_id' => $school->id,
            'email' => $email,
            'password' => Hash::make($plainPassword),
        ]);
    }

    private function loginAndGetToken(School $school, string $email, string $password): string
    {
        $this->createAdmin($school, $email, $password);

        $response = $this->postJson($this->apiUrl($school->domain, '/api/admin/login'), [
            'email' => $email,
            'password' => $password,
        ]);

        $response->assertOk();

        return (string) $response->json('access_token');
    }

    private function apiUrl(string $domain, string $path): string
    {
        return "http://{$domain}{$path}";
    }
}
