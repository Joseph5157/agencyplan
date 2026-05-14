---

description: "Task list for School Website Platform MVP implementation"
---

# Tasks: School Website Platform MVP

**Input**: Design documents from `/specs/002-school-platform-mvp/`

**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/

**Tests**: Tests are included because this feature changes tenant isolation, domain routing, permissions, uploads, contracts, and public rendering.

**Organization**: Tasks are grouped by build phase and user story so implementation can start with backend foundation and still preserve independently testable story slices.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

- **Backend**: `backend/` for Laravel API
- **Public frontend**: `frontend/` for public Nuxt website
- **Admin panel**: `admin/` for Nuxt admin panel
- **Contracts**: `specs/002-school-platform-mvp/contracts/`

## Phase 1: Backend Foundation (Start Here)

**Purpose**: Complete the initial Laravel and tenant-aware backend foundation in the exact build order requested.

- [X] T001 Create the Laravel project skeleton and baseline Composer configuration in `backend/composer.json`
- [X] T002 Configure backend environment defaults for MySQL, JWT, filesystem, and app URLs in `backend/.env.example` and `backend/config/`
- [X] T003 Create the core MySQL migrations for schools and admin users in `backend/database/migrations/`
- [X] T004 [P] Create section-content migrations for hero, hero_slides, about_content, stats, facilities, faculty, gallery_images, notices, testimonials, contact_info, and school_settings in `backend/database/migrations/`
- [X] T005 Create the `School` model with tenant identity rules in `backend/app/Models/School.php`
- [X] T006 [P] Create the `AdminUser` model and JWT-ready auth relationships in `backend/app/Models/AdminUser.php`
- [X] T007 [P] Create tenant-scoped content models for all MVP sections in `backend/app/Models/`
- [X] T008 Implement domain detection middleware in `backend/app/Http/Middleware/IdentifySchool.php`
- [X] T009 Register tenant resolution middleware and API bootstrapping in `backend/bootstrap/app.php`, `backend/app/Http/Kernel.php`, and `backend/routes/api.php`
- [X] T010 Seed one active school and one school admin for backend verification in `backend/database/seeders/SchoolSeeder.php`, `backend/database/seeders/AdminUserSeeder.php`, and `backend/database/seeders/DatabaseSeeder.php`
- [X] T011 Implement public school identity and section read controllers in `backend/app/Http/Controllers/SchoolController.php`, `backend/app/Http/Controllers/HeroController.php`, `backend/app/Http/Controllers/AboutController.php`, `backend/app/Http/Controllers/StatsController.php`, `backend/app/Http/Controllers/FacilitiesController.php`, `backend/app/Http/Controllers/FacultyController.php`, `backend/app/Http/Controllers/GalleryController.php`, `backend/app/Http/Controllers/NoticeController.php`, `backend/app/Http/Controllers/TestimonialController.php`, `backend/app/Http/Controllers/ContactController.php`, and `backend/routes/api.php`
- [X] T012 Implement school-admin JWT login and auth guard flow in `backend/app/Http/Controllers/AuthController.php`, `backend/config/auth.php`, and `backend/routes/api.php`
- [X] T013 Implement validated upload handling for images and PDF notice attachments in `backend/app/Http/Controllers/UploadController.php`, `backend/app/Http/Requests/UploadRequest.php`, and `backend/config/filesystems.php`
- [X] T014 Add backend feature coverage for domain detection, public API responses, admin login, and upload validation in `backend/tests/Feature/`

**Checkpoint**: Backend foundation complete: Laravel project runs, school is resolved by domain, public APIs respond, admin login works, and uploads are validated.

---

## Phase 2: User Story 2 - Update Safe Content Zones (Priority: P2)

**Goal**: Allow school admins to manage only the approved safe fields for the MVP sections without any layout or template control.

**Independent Test**: Sign in as a school admin, edit safe fields for each section, upload supported media, and confirm invalid fields or forbidden presentation changes are blocked.

### Tests for User Story 2

- [ ] T015 [P] [US2] Add backend feature tests for school-scoped content updates and safe-field validation in `backend/tests/Feature/Admin/AdminContentUpdateTest.php`
- [ ] T016 [P] [US2] Add backend feature tests for forbidden layout/template modification attempts in `backend/tests/Feature/Admin/AdminPresentationLockTest.php`
- [ ] T017 [P] [US2] Add admin end-to-end tests for login and section editing flows in `admin/tests/e2e/admin-content-editing.spec.ts`

### Implementation for User Story 2

- [X] T018 [US2] Create the Nuxt admin application scaffold and shared configuration in `admin/package.json`, `admin/nuxt.config.ts`, and `admin/app/app.vue`
- [ ] T019 [US2] Build admin auth state, JWT session handling, and route protection in `admin/app/stores/auth.ts`, `admin/app/composables/useAuth.ts`, and `admin/app/middleware/auth.ts`
- [X] T020 [US2] Build the admin login page and school dashboard in `admin/app/pages/login.vue` and `admin/app/pages/dashboard.vue`
- [X] T021 [US2] Implement backend update endpoints for hero, about, stats, facilities, faculty, gallery, notices, testimonials, contact, and settings in `backend/app/Http/Controllers/` and `backend/routes/api.php`
- [ ] T022 [US2] Implement backend validation requests for all safe section fields and upload constraints in `backend/app/Http/Requests/`
- [ ] T023 [P] [US2] Build hero, about, and stats editor pages in `admin/app/pages/hero.vue`, `admin/app/pages/about.vue`, and `admin/app/pages/stats.vue`
- [ ] T024 [P] [US2] Build facilities, faculty, and gallery editor pages in `admin/app/pages/facilities.vue`, `admin/app/pages/faculty.vue`, and `admin/app/pages/gallery.vue`
- [ ] T025 [P] [US2] Build notices, testimonials, contact, and settings editor pages in `admin/app/pages/notices.vue`, `admin/app/pages/testimonials.vue`, `admin/app/pages/contact.vue`, and `admin/app/pages/settings.vue`
- [ ] T026 [P] [US2] Build shared admin form controls for safe content editing and media preview in `admin/app/components/FormField.vue`, `admin/app/components/ImageUploader.vue`, and `admin/app/components/RichTextEditor.vue`
- [ ] T027 [US2] Connect admin pages to school-scoped content APIs with success and validation feedback in `admin/app/composables/useSectionApi.ts` and `admin/app/stores/sections.ts`

**Checkpoint**: School admins can update approved safe content fields only, and cannot alter layout, colors, CSS, section order, or templates.

---

## Phase 3: User Story 1 - Browse a School Website (Priority: P1) MVP

**Goal**: Deliver the public school website for one working template with all 10 sections loaded from the resolved school's content.

**Independent Test**: Visit a configured school domain and verify the fixed public website renders the correct tenant content across all 10 sections.

### Tests for User Story 1

- [ ] T028 [P] [US1] Add backend feature tests for public tenant-scoped section endpoints in `backend/tests/Feature/Public/PublicSchoolWebsiteTest.php`
- [ ] T029 [P] [US1] Add public end-to-end tests for domain-based rendering of the full template in `frontend/tests/e2e/public-school-site.spec.ts`

### Implementation for User Story 1

- [ ] T030 [US1] Create the Nuxt public application scaffold and runtime config in `frontend/package.json`, `frontend/nuxt.config.ts`, and `frontend/app/app.vue`
- [ ] T031 [US1] Implement school data and template-loading composables in `frontend/app/composables/useSchoolData.ts` and `frontend/app/composables/useTemplate.ts`
- [ ] T032 [US1] Build Template One layout shell in `frontend/app/templates/TemplateOne/Layout.vue`
- [ ] T033 [P] [US1] Build Hero, About, and Stats public sections in `frontend/app/templates/TemplateOne/Hero.vue`, `frontend/app/templates/TemplateOne/About.vue`, and `frontend/app/templates/TemplateOne/Stats.vue`
- [ ] T034 [P] [US1] Build Facilities, Faculty, and Gallery public sections in `frontend/app/templates/TemplateOne/Facilities.vue`, `frontend/app/templates/TemplateOne/Faculty.vue`, and `frontend/app/templates/TemplateOne/Gallery.vue`
- [ ] T035 [P] [US1] Build NoticeBoard, Testimonials, Contact, and Footer public sections in `frontend/app/templates/TemplateOne/NoticeBoard.vue`, `frontend/app/templates/TemplateOne/Testimonials.vue`, `frontend/app/templates/TemplateOne/Contact.vue`, and `frontend/app/templates/TemplateOne/Footer.vue`
- [ ] T036 [US1] Wire the public homepage to render the resolved school's template and all 10 sections in `frontend/app/pages/index.vue`
- [ ] T037 [US1] Add school-level SEO metadata and empty-state handling in `frontend/app/composables/useSeo.ts` and `frontend/app/components/ui/`

**Checkpoint**: One complete public template renders the correct school content for a configured domain.

---

## Phase 4: User Story 3 - Operate Multi-School Domain Delivery (Priority: P3)

**Goal**: Ensure multiple schools can run on one platform with correct domain mapping, tenant isolation, and scoped admin behavior.

**Independent Test**: Configure two schools and verify each domain, public site, admin session, and upload stays isolated to the correct school.

### Tests for User Story 3

- [ ] T038 [P] [US3] Add backend feature tests for cross-tenant isolation and inactive-domain handling in `backend/tests/Feature/Tenant/TenantIsolationTest.php`
- [ ] T039 [P] [US3] Add cross-tenant end-to-end tests for public and admin separation in `frontend/tests/e2e/multi-school-domain.spec.ts` and `admin/tests/e2e/multi-school-admin.spec.ts`

### Implementation for User Story 3

- [ ] T040 [US3] Harden tenant scoping across controllers, models, and queries in `backend/app/Http/Controllers/`, `backend/app/Models/`, and `backend/app/Services/`
- [ ] T041 [US3] Add school-activation and unknown-domain failure responses in `backend/app/Http/Middleware/IdentifySchool.php` and `backend/app/Exceptions/Handler.php`
- [ ] T042 [US3] Enforce school-scoped admin ownership checks in `backend/app/Policies/` and `backend/app/Http/Controllers/AuthController.php`
- [ ] T043 [US3] Add school-aware runtime handling in the public and admin Nuxt apps for wrong-domain or unauthorized cases in `frontend/app/composables/useSchoolData.ts`, `admin/app/composables/useAuth.ts`, and `admin/app/middleware/auth.ts`

**Checkpoint**: Multi-school isolation is verified for domains, content, admin access, and uploads.

---

## Phase 5: Polish & Cross-Cutting Concerns

**Purpose**: Improve developer readiness and finish the MVP implementation slice

- [ ] T044 [P] Update developer setup guidance for backend, frontend, and admin apps in `README.md` and `specs/002-school-platform-mvp/quickstart.md`
- [ ] T045 [P] Add final smoke tests for backend foundation, admin editing, and public rendering in `backend/tests/Feature/`, `frontend/tests/e2e/`, and `admin/tests/e2e/`
- [ ] T046 Verify the implementation still respects fixed-layout CMS rules and no school-admin layout controls were introduced in `backend/app/`, `frontend/app/templates/`, and `admin/app/pages/`

---

## Dependencies & Execution Order

### Phase Dependencies

- **Phase 1 Backend Foundation**: No dependencies and MUST be completed first
- **Phase 2 User Story 2**: Depends on backend foundation because safe-field editing needs auth, models, and update endpoints
- **Phase 3 User Story 1**: Depends on backend foundation and benefits from section contracts stabilized during admin editing work
- **Phase 4 User Story 3**: Depends on backend foundation and on both admin and public flows existing to validate tenant isolation end to end
- **Phase 5 Polish**: Depends on all desired implementation phases being complete

### User Story Dependencies

- **User Story 2 (P2)**: Starts first after backend foundation because the requested build order places admin work before public frontend work
- **User Story 1 (P1)**: Can proceed once backend APIs are stable; it is still the business MVP outcome
- **User Story 3 (P3)**: Requires both public and admin flows to validate multi-school isolation completely

### Within Each User Story

- Tests for a story should be added before or alongside implementation and must fail before the story is considered complete
- Backend contracts and validation precede frontend/admin integration for the same story
- Pages that touch different files may be built in parallel after shared APIs are defined

### Parallel Opportunities

- T004, T006, and T007 can run in parallel after the Laravel skeleton exists
- T015, T016, and T017 can run in parallel for the admin editing story
- T023, T024, and T025 can run in parallel after T021 and T022 define the update APIs
- T028 and T029 can run in parallel for the public website story
- T033, T034, and T035 can run in parallel after T031 and T032 define the public rendering shell
- T038 and T039 can run in parallel for the tenant-isolation story
- T044 and T045 can run in parallel during polish

---

## Parallel Example: Backend Foundation

```text
Task: "T004 Create section-content migrations for hero, hero_slides, about_content, stats, facilities, faculty, gallery_images, notices, testimonials, contact_info, and school_settings in backend/database/migrations/"
Task: "T006 Create the AdminUser model and JWT-ready auth relationships in backend/app/Models/AdminUser.php"
Task: "T007 Create tenant-scoped content models for all MVP sections in backend/app/Models/"
```

---

## Parallel Example: User Story 2

```text
Task: "T015 [US2] Add backend feature tests for school-scoped content updates and safe-field validation in backend/tests/Feature/Admin/AdminContentUpdateTest.php"
Task: "T016 [US2] Add backend feature tests for forbidden layout/template modification attempts in backend/tests/Feature/Admin/AdminPresentationLockTest.php"
Task: "T017 [US2] Add admin end-to-end tests for login and section editing flows in admin/tests/e2e/admin-content-editing.spec.ts"

Task: "T023 [US2] Build hero, about, and stats editor pages in admin/app/pages/hero.vue, admin/app/pages/about.vue, and admin/app/pages/stats.vue"
Task: "T024 [US2] Build facilities, faculty, and gallery editor pages in admin/app/pages/facilities.vue, admin/app/pages/faculty.vue, and admin/app/pages/gallery.vue"
Task: "T025 [US2] Build notices, testimonials, contact, and settings editor pages in admin/app/pages/notices.vue, admin/app/pages/testimonials.vue, admin/app/pages/contact.vue, and admin/app/pages/settings.vue"
```

---

## Implementation Strategy

### Start Slice

1. Complete T001 through T014 first.
2. This satisfies the exact Phase 1 backend foundation you requested:
   Laravel setup, MySQL migrations, School model, domain detection middleware,
   public API routes, admin authentication, and upload endpoint.
3. Validate the backend before starting admin or public Nuxt implementation.

### MVP First

1. Backend foundation
2. Admin safe-content editing workflows
3. Public Template One rendering
4. Multi-school tenant-isolation hardening
5. Polish and smoke validation

### Suggested MVP Scope

- Immediate implementation start: Phase 1 Backend Foundation only
- First full business MVP: complete through User Story 1 after backend and admin flows are available

## Notes

- Total tasks: 46
- User Story 1 tasks: 10
- User Story 2 tasks: 13
- User Story 3 tasks: 6
- The first 14 tasks are the exact backend Phase 1 slice requested by the user
- All tasks follow the required checklist format with task IDs, optional parallel markers, story labels where required, and exact file paths
