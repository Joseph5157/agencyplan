<?php

namespace Database\Seeders;

use App\Models\AboutContent;
use App\Models\ContactInfo;
use App\Models\Facility;
use App\Models\Faculty;
use App\Models\GalleryImage;
use App\Models\HeroContent;
use App\Models\HeroSlide;
use App\Models\Notice;
use App\Models\School;
use App\Models\SchoolSetting;
use App\Models\Stat;
use App\Models\Testimonial;
use Illuminate\Database\Seeder;

class SchoolSeeder extends Seeder
{
    /**
     * Seed one school and safe dummy content for all public sections.
     */
    public function run(): void
    {
        $school = School::updateOrCreate(
            ['domain' => 'greenfield.test'],
            [
                'name' => 'Greenfield Public School',
                'template' => 'template-one',
                'is_active' => true,
            ],
        );

        HeroContent::updateOrCreate(
            ['school_id' => $school->id],
            [
                'heading' => 'Learning with Purpose',
                'subheading' => 'A sample school profile for local platform testing.',
                'cta_text' => 'View Admission Steps',
                'cta_link' => 'https://greenfield.test/admissions',
            ],
        );

        $this->seedCollection(
            HeroSlide::class,
            $school->id,
            [
                ['image_path' => 'seed/hero/slide-1.jpg', 'sort_order' => 1],
                ['image_path' => 'seed/hero/slide-2.jpg', 'sort_order' => 2],
            ],
        );

        AboutContent::updateOrCreate(
            ['school_id' => $school->id],
            [
                'heading' => 'About Our School',
                'description' => 'Greenfield Public School is a fictional institution used for end-to-end application testing.',
                'image_path' => 'seed/about/campus.jpg',
                'principal_name' => 'Dr. Ananya Roy',
                'principal_message' => 'This message is placeholder content for QA and demo use only.',
                'principal_photo' => 'seed/about/principal.jpg',
                'established_year' => 2001,
            ],
        );

        $this->seedCollection(
            Stat::class,
            $school->id,
            [
                ['number' => '1200+', 'label' => 'Students', 'sort_order' => 1],
                ['number' => '85', 'label' => 'Teachers & Staff', 'sort_order' => 2],
                ['number' => '98%', 'label' => 'Board Pass Rate', 'sort_order' => 3],
                ['number' => '40+', 'label' => 'Activities', 'sort_order' => 4],
            ],
        );

        $this->seedCollection(
            Facility::class,
            $school->id,
            [
                [
                    'name' => 'Science Laboratory',
                    'description' => 'Demonstration-grade lab setup for practical classes.',
                    'image_path' => 'seed/facilities/science-lab.jpg',
                    'sort_order' => 1,
                ],
                [
                    'name' => 'Library',
                    'description' => 'Quiet reading space with sample catalog content.',
                    'image_path' => 'seed/facilities/library.jpg',
                    'sort_order' => 2,
                ],
            ],
        );

        $this->seedCollection(
            Faculty::class,
            $school->id,
            [
                [
                    'name' => 'Priya Sharma',
                    'designation' => 'Mathematics Teacher',
                    'qualification' => 'M.Sc. Mathematics, B.Ed.',
                    'experience' => '8 years',
                    'photo_path' => 'seed/faculty/priya-sharma.jpg',
                    'sort_order' => 1,
                ],
                [
                    'name' => 'Rahul Sen',
                    'designation' => 'Physics Teacher',
                    'qualification' => 'M.Sc. Physics, B.Ed.',
                    'experience' => '10 years',
                    'photo_path' => 'seed/faculty/rahul-sen.jpg',
                    'sort_order' => 2,
                ],
            ],
        );

        $this->seedCollection(
            GalleryImage::class,
            $school->id,
            [
                [
                    'image_path' => 'seed/gallery/annual-day.jpg',
                    'caption' => 'Annual Day rehearsal (sample image)',
                    'category' => 'Events',
                    'sort_order' => 1,
                ],
                [
                    'image_path' => 'seed/gallery/sports-day.jpg',
                    'caption' => 'Sports Day opening ceremony (sample image)',
                    'category' => 'Sports',
                    'sort_order' => 2,
                ],
            ],
        );

        $this->seedCollection(
            Notice::class,
            $school->id,
            [
                [
                    'title' => 'Parent Orientation Schedule',
                    'description' => 'Sample notice entry used to validate notice-board rendering.',
                    'notice_date' => '2026-06-01',
                    'attachment_path' => 'seed/notices/orientation-schedule.pdf',
                    'is_active' => true,
                ],
                [
                    'title' => 'Summer Break Announcement',
                    'description' => 'This is test data and not an official school announcement.',
                    'notice_date' => '2026-06-15',
                    'attachment_path' => null,
                    'is_active' => true,
                ],
            ],
            ['title'],
        );

        $this->seedCollection(
            Testimonial::class,
            $school->id,
            [
                [
                    'name' => 'Meera Das',
                    'quote' => 'A placeholder testimonial for previewing section layout during QA.',
                    'photo_path' => 'seed/testimonials/meera-das.jpg',
                    'relation' => 'Parent',
                    'sort_order' => 1,
                ],
                [
                    'name' => 'Arjun Paul',
                    'quote' => 'Demo content helps us validate typography and spacing before go-live.',
                    'photo_path' => 'seed/testimonials/arjun-paul.jpg',
                    'relation' => 'Alumnus',
                    'sort_order' => 2,
                ],
            ],
        );

        ContactInfo::updateOrCreate(
            ['school_id' => $school->id],
            [
                'address' => '123 Learning Avenue, Springfield, Test State',
                'phone' => '+1-555-0100',
                'email' => 'info@greenfield.test',
                'maps_url' => 'https://maps.example.com/greenfield-public-school',
                'whatsapp' => '+1-555-0199',
            ],
        );

        SchoolSetting::updateOrCreate(
            ['school_id' => $school->id],
            [
                'logo_path' => 'seed/settings/logo.png',
                'favicon_path' => 'seed/settings/favicon.png',
                'tagline' => 'Grow. Learn. Lead.',
                'meta_title' => 'Greenfield Public School | Sample School Site',
                'meta_description' => 'Sample tenant content for testing the school website MVP.',
                'facebook_url' => 'https://facebook.com/greenfield-sample',
                'instagram_url' => 'https://instagram.com/greenfield-sample',
                'youtube_url' => 'https://youtube.com/@greenfield-sample',
                'copyright_text' => '© 2026 Greenfield Public School. Test content only.',
            ],
        );
    }

    /**
     * Replace section collections idempotently for a given school.
     *
     * @param  class-string<\Illuminate\Database\Eloquent\Model>  $modelClass
     * @param  array<int, array<string, mixed>>  $rows
     * @param  array<int, string>  $uniqueColumns
     */
    private function seedCollection(string $modelClass, int $schoolId, array $rows, array $uniqueColumns = ['sort_order']): void
    {
        $modelClass::query()->where('school_id', $schoolId)->delete();

        foreach ($rows as $row) {
            $attributes = ['school_id' => $schoolId];
            foreach ($uniqueColumns as $column) {
                if (array_key_exists($column, $row)) {
                    $attributes[$column] = $row[$column];
                }
            }

            $modelClass::updateOrCreate($attributes, ['school_id' => $schoolId, ...$row]);
        }
    }
}

