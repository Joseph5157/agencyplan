<?php

namespace Tests\Feature;

use App\Models\AboutContent;
use App\Models\AdminUser;
use App\Models\HeroContent;
use App\Models\Notice;
use App\Models\School;
use App\Models\Stat;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;
use Tests\TestCase;

class Phase1BackendFeatureTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();

        config()->set('jwt.secret', 'test-jwt-secret');
        config()->set('uploads.disk', 'public');
    }

    public function test_known_active_school_domain_is_accepted(): void
    {
        $school = $this->createSchool('active-school.test', true);

        $response = $this->getJson($this->apiUrl('active-school.test', '/api/school'));

        $response->assertOk()->assertJsonPath('id', $school->id);
    }

    public function test_unknown_school_domain_is_rejected(): void
    {
        $response = $this->getJson($this->apiUrl('unknown-school.test', '/api/school'));

        $response->assertStatus(404);
    }

    public function test_inactive_school_domain_is_rejected(): void
    {
        $this->createSchool('inactive-school.test', false);

        $response = $this->getJson($this->apiUrl('inactive-school.test', '/api/school'));

        $response->assertStatus(403);
    }

    public function test_public_school_endpoint_returns_detected_school(): void
    {
        $school = $this->createSchool('public-school.test', true);

        $response = $this->getJson($this->apiUrl('public-school.test', '/api/school'));

        $response->assertOk()
            ->assertJsonPath('id', $school->id)
            ->assertJsonPath('domain', 'public-school.test');
    }

    public function test_hero_endpoint_returns_only_detected_school_data(): void
    {
        $schoolA = $this->createSchool('school-a.test', true);
        $schoolB = $this->createSchool('school-b.test', true);

        HeroContent::create([
            'school_id' => $schoolA->id,
            'heading' => 'School A Hero',
            'subheading' => 'A',
            'cta_text' => 'A CTA',
            'cta_link' => 'https://school-a.test',
        ]);
        HeroContent::create([
            'school_id' => $schoolB->id,
            'heading' => 'School B Hero',
            'subheading' => 'B',
            'cta_text' => 'B CTA',
            'cta_link' => 'https://school-b.test',
        ]);

        $response = $this->getJson($this->apiUrl('school-a.test', '/api/school/hero'));

        $response->assertOk()
            ->assertJsonPath('content.school_id', $schoolA->id)
            ->assertJsonPath('content.heading', 'School A Hero')
            ->assertJsonMissing(['heading' => 'School B Hero']);
    }

    public function test_about_endpoint_returns_only_detected_school_data(): void
    {
        $schoolA = $this->createSchool('about-a.test', true);
        $schoolB = $this->createSchool('about-b.test', true);

        AboutContent::create([
            'school_id' => $schoolA->id,
            'heading' => 'About A',
            'description' => 'Description A',
            'established_year' => '2001',
        ]);
        AboutContent::create([
            'school_id' => $schoolB->id,
            'heading' => 'About B',
            'description' => 'Description B',
            'established_year' => '2002',
        ]);

        $response = $this->getJson($this->apiUrl('about-a.test', '/api/school/about'));

        $response->assertOk()
            ->assertJsonPath('school_id', $schoolA->id)
            ->assertJsonPath('heading', 'About A')
            ->assertJsonMissing(['heading' => 'About B']);
    }

    public function test_stats_endpoint_returns_only_detected_school_stats(): void
    {
        $schoolA = $this->createSchool('stats-a.test', true);
        $schoolB = $this->createSchool('stats-b.test', true);

        Stat::create(['school_id' => $schoolA->id, 'number' => '100', 'label' => 'A Stat', 'sort_order' => 1]);
        Stat::create(['school_id' => $schoolB->id, 'number' => '200', 'label' => 'B Stat', 'sort_order' => 1]);

        $response = $this->getJson($this->apiUrl('stats-a.test', '/api/school/stats'));

        $response->assertOk()
            ->assertJsonCount(1)
            ->assertJsonPath('0.school_id', $schoolA->id)
            ->assertJsonPath('0.label', 'A Stat')
            ->assertJsonMissing(['label' => 'B Stat']);
    }

    public function test_notices_endpoint_returns_only_active_notices_for_detected_school(): void
    {
        $schoolA = $this->createSchool('notices-a.test', true);
        $schoolB = $this->createSchool('notices-b.test', true);

        Notice::create([
            'school_id' => $schoolA->id,
            'title' => 'Active A',
            'description' => 'Visible',
            'notice_date' => '2026-05-20',
            'is_active' => true,
        ]);
        Notice::create([
            'school_id' => $schoolA->id,
            'title' => 'Inactive A',
            'description' => 'Hidden',
            'notice_date' => '2026-05-21',
            'is_active' => false,
        ]);
        Notice::create([
            'school_id' => $schoolB->id,
            'title' => 'Active B',
            'description' => 'Other School',
            'notice_date' => '2026-05-22',
            'is_active' => true,
        ]);

        $response = $this->getJson($this->apiUrl('notices-a.test', '/api/school/notices'));

        $response->assertOk()
            ->assertJsonCount(1)
            ->assertJsonPath('0.title', 'Active A')
            ->assertJsonMissing(['title' => 'Inactive A'])
            ->assertJsonMissing(['title' => 'Active B']);
    }

    public function test_public_api_does_not_leak_other_school_data(): void
    {
        $schoolA = $this->createSchool('leak-a.test', true);
        $schoolB = $this->createSchool('leak-b.test', true);

        Stat::create(['school_id' => $schoolA->id, 'number' => '1', 'label' => 'Only A', 'sort_order' => 1]);
        Stat::create(['school_id' => $schoolB->id, 'number' => '2', 'label' => 'Only B', 'sort_order' => 1]);

        $response = $this->getJson($this->apiUrl('leak-a.test', '/api/school/stats'));

        $response->assertOk()
            ->assertJsonCount(1)
            ->assertJsonPath('0.label', 'Only A')
            ->assertJsonMissing(['label' => 'Only B']);
    }

    public function test_admin_login_succeeds_with_valid_credentials_for_detected_school(): void
    {
        $school = $this->createSchool('login-ok.test', true);
        $this->createAdmin($school, 'admin@login-ok.test', 'Passw0rd!123');

        $response = $this->postJson($this->apiUrl('login-ok.test', '/api/admin/login'), [
            'email' => 'admin@login-ok.test',
            'password' => 'Passw0rd!123',
        ]);

        $response->assertOk()
            ->assertJsonStructure(['token_type', 'access_token', 'expires_in', 'admin_user'])
            ->assertJsonPath('admin_user.school_id', $school->id);
    }

    public function test_admin_login_fails_with_invalid_credentials(): void
    {
        $school = $this->createSchool('login-fail.test', true);
        $this->createAdmin($school, 'admin@login-fail.test', 'Passw0rd!123');

        $response = $this->postJson($this->apiUrl('login-fail.test', '/api/admin/login'), [
            'email' => 'admin@login-fail.test',
            'password' => 'wrong-password',
        ]);

        $response->assertStatus(422);
    }

    public function test_admin_login_fails_for_credentials_from_another_school_domain(): void
    {
        $schoolA = $this->createSchool('domain-a.test', true);
        $this->createSchool('domain-b.test', true);
        $this->createAdmin($schoolA, 'admin@domain-a.test', 'Passw0rd!123');

        $response = $this->postJson($this->apiUrl('domain-b.test', '/api/admin/login'), [
            'email' => 'admin@domain-a.test',
            'password' => 'Passw0rd!123',
        ]);

        $response->assertStatus(422);
    }

    public function test_admin_me_requires_valid_token(): void
    {
        $this->createSchool('me-auth.test', true);

        $response = $this->getJson($this->apiUrl('me-auth.test', '/api/admin/me'));

        $response->assertStatus(401);
    }

    public function test_admin_me_succeeds_with_valid_token(): void
    {
        $school = $this->createSchool('me-valid.test', true);
        $this->createAdmin($school, 'admin@me-valid.test', 'Passw0rd!123');

        $login = $this->postJson($this->apiUrl('me-valid.test', '/api/admin/login'), [
            'email' => 'admin@me-valid.test',
            'password' => 'Passw0rd!123',
        ]);

        $token = $login->json('access_token');

        $response = $this->withHeader('Authorization', 'Bearer '.$token)
            ->getJson($this->apiUrl('me-valid.test', '/api/admin/me'));

        $response->assertOk()
            ->assertJsonPath('school_id', $school->id)
            ->assertJsonPath('email', 'admin@me-valid.test');
    }

    public function test_upload_requires_authentication(): void
    {
        $this->createSchool('upload-auth.test', true);

        $response = $this->postJson($this->apiUrl('upload-auth.test', '/api/admin/upload'), [
            'section' => 'hero',
        ]);

        $response->assertStatus(401);
    }

    public function test_upload_accepts_valid_image_for_allowed_image_sections(): void
    {
        Storage::fake('public');

        $school = $this->createSchool('upload-image.test', true);
        $token = $this->loginAndGetToken($school, 'admin@upload-image.test', 'Passw0rd!123');
        $file = UploadedFile::fake()->create('hero.jpg', 120, 'image/jpeg');

        $response = $this->withHeader('Authorization', 'Bearer '.$token)
            ->withHeader('Accept', 'application/json')
            ->post($this->apiUrl('upload-image.test', '/api/admin/upload'), [
                'section' => 'hero',
                'file' => $file,
            ]);

        $response->assertStatus(201);
        $path = $response->json('path');
        $this->assertStringStartsWith("schools/{$school->id}/hero/", $path);
        Storage::disk('public')->assertExists($path);
    }

    public function test_upload_accepts_valid_pdf_for_notices(): void
    {
        Storage::fake('public');

        $school = $this->createSchool('upload-pdf.test', true);
        $token = $this->loginAndGetToken($school, 'admin@upload-pdf.test', 'Passw0rd!123');
        $file = UploadedFile::fake()->create('notice.pdf', 128, 'application/pdf');

        $response = $this->withHeader('Authorization', 'Bearer '.$token)
            ->withHeader('Accept', 'application/json')
            ->post($this->apiUrl('upload-pdf.test', '/api/admin/upload'), [
                'section' => 'notices',
                'file' => $file,
            ]);

        $response->assertStatus(201);
        $path = $response->json('path');
        $this->assertStringStartsWith("schools/{$school->id}/notices/", $path);
        Storage::disk('public')->assertExists($path);
    }

    public function test_upload_rejects_invalid_file_type(): void
    {
        Storage::fake('public');

        $school = $this->createSchool('upload-reject.test', true);
        $token = $this->loginAndGetToken($school, 'admin@upload-reject.test', 'Passw0rd!123');
        $file = UploadedFile::fake()->create('bad.pdf', 100, 'application/pdf');

        $response = $this->withHeader('Authorization', 'Bearer '.$token)
            ->withHeader('Accept', 'application/json')
            ->post($this->apiUrl('upload-reject.test', '/api/admin/upload'), [
                'section' => 'hero',
                'file' => $file,
            ]);

        $response->assertStatus(422);
    }

    private function createSchool(string $domain, bool $isActive): School
    {
        return School::create([
            'name' => ucfirst(str_replace('.test', '', $domain)),
            'domain' => $domain,
            'template' => 'template-one',
            'is_active' => $isActive,
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
