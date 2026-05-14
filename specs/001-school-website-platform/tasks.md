---

description: "Task list for School Website Platform implementation"
---

# Tasks: School Website Platform

**Input**: Design documents from `/specs/001-school-website-platform/`

**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/

**Tests**: Tests are OPTIONAL unless the feature spec requests them, or the change modifies validation rules, permissions, contracts, or rendering behavior that can regress managed content. This feature includes test tasks because it changes validation rules, permissions, contracts, and public rendering.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

- **Web app**: `backend/` for Laravel API and `frontend/` for Nuxt application
- Backend tests live in `backend/tests/`
- Frontend tests live in `frontend/tests/`

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and base workspace setup

- [ ] T001 Create the Laravel API application skeleton in `backend/` with baseline Composer configuration in `backend/composer.json`
- [ ] T002 Create the Nuxt frontend application skeleton in `frontend/` with baseline package configuration in `frontend/package.json`
- [ ] T003 [P] Add repository-level setup documentation and environment templates in `backend/.env.example`, `frontend/.env.example`, and `README.md`
- [ ] T004 [P] Configure backend code style and test tooling in `backend/phpunit.xml` and `backend/pest.php` or `backend/phpunit.xml`
- [ ] T005 [P] Configure frontend linting and test tooling in `frontend/eslint.config.*`, `frontend/vitest.config.*`, and `frontend/playwright.config.*`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**CRITICAL**: No user story work can begin until this phase is complete

- [ ] T006 Configure Laravel API routes, exception handling, and API response conventions in `backend/routes/api.php`, `backend/app/Exceptions/Handler.php`, and `backend/app/Providers/AppServiceProvider.php`
- [ ] T007 Implement admin authentication and session handling in `backend/app/Http/Controllers/Auth/AdminAuthController.php`, `backend/app/Http/Middleware/Authenticate.php`, and `backend/routes/api.php`
- [ ] T008 Create foundational migrations for admin users, media assets, site sections, notices, courses, faculty profiles, gallery items, and contact details in `backend/database/migrations/`
- [ ] T009 Create foundational Eloquent models for shared content entities in `backend/app/Models/AdminUser.php`, `backend/app/Models/MediaAsset.php`, `backend/app/Models/SiteSection.php`, `backend/app/Models/Notice.php`, `backend/app/Models/Course.php`, `backend/app/Models/FacultyProfile.php`, `backend/app/Models/GalleryItem.php`, and `backend/app/Models/ContactDetail.php`
- [ ] T010 Implement shared validation request classes for content and media constraints in `backend/app/Http/Requests/Admin/`
- [ ] T011 Implement admin authorization policies and role checks in `backend/app/Policies/`, `backend/app/Providers/AuthServiceProvider.php`, and `backend/app/Models/AdminUser.php`
- [ ] T012 Implement shared content services and audit metadata handling in `backend/app/Services/Content/` and `backend/app/Observers/`
- [ ] T013 Seed baseline admin account and fixed site section keys in `backend/database/seeders/AdminUserSeeder.php`, `backend/database/seeders/SiteSectionSeeder.php`, and `backend/database/seeders/DatabaseSeeder.php`
- [ ] T014 Configure frontend application shell, public layout, admin layout, and shared API client in `frontend/app/app.vue`, `frontend/app/layouts/default.vue`, `frontend/app/layouts/admin.vue`, and `frontend/app/composables/useApi.ts`
- [ ] T015 Implement shared frontend stores and route middleware for auth and published content fetching in `frontend/app/stores/auth.ts`, `frontend/app/stores/site.ts`, and `frontend/app/middleware/`

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - Browse Institutional Information (Priority: P1) MVP

**Goal**: Deliver the fixed public website experience where visitors can browse institutional sections, courses, faculty, notices, gallery, and contact information.

**Independent Test**: Load the public site, navigate all main public sections, and confirm published content appears in the fixed layout with empty-state handling for missing datasets.

### Tests for User Story 1

- [ ] T016 [P] [US1] Add backend feature tests for published public content endpoints in `backend/tests/Feature/Public/PublicContentEndpointsTest.php`
- [ ] T017 [P] [US1] Add frontend end-to-end navigation coverage for public pages in `frontend/tests/e2e/public-site.spec.ts`

### Implementation for User Story 1

- [ ] T018 [US1] Implement public content controllers and endpoint wiring for sections, notices, courses, faculty, gallery, and contact details in `backend/app/Http/Controllers/Public/` and `backend/routes/api.php`
- [ ] T019 [US1] Implement public resource transformers for fixed content response shapes in `backend/app/Http/Resources/Public/`
- [ ] T020 [P] [US1] Build the public homepage and shared fixed-section components in `frontend/app/pages/index.vue` and `frontend/app/components/public/sections/`
- [ ] T021 [P] [US1] Build the notices and courses public pages in `frontend/app/pages/notices.vue`, `frontend/app/pages/courses/index.vue`, and `frontend/app/components/public/notices/`
- [ ] T022 [P] [US1] Build the faculty, gallery, and contact public pages in `frontend/app/pages/faculty.vue`, `frontend/app/pages/gallery.vue`, `frontend/app/pages/contact.vue`, and `frontend/app/components/public/`
- [ ] T023 [US1] Implement public content fetching composables, empty states, and published-only rendering rules in `frontend/app/composables/usePublicContent.ts` and `frontend/app/stores/site.ts`
- [ ] T024 [US1] Add responsive navigation and fixed-layout integration for all public routes in `frontend/app/components/public/SiteHeader.vue`, `frontend/app/components/public/SiteFooter.vue`, and `frontend/app/layouts/default.vue`

**Checkpoint**: User Story 1 should be fully functional and testable independently

---

## Phase 4: User Story 2 - Manage Predefined Content (Priority: P2)

**Goal**: Allow authorized administrators to manage predefined content types through validated admin workflows without changing public layout structure.

**Independent Test**: Sign in as an admin, create and edit each managed content type, upload valid images, reject invalid content, and verify published changes appear on the public site.

### Tests for User Story 2

- [ ] T025 [P] [US2] Add backend feature tests for admin content CRUD, validation, and media upload constraints in `backend/tests/Feature/Admin/AdminContentManagementTest.php`
- [ ] T026 [P] [US2] Add frontend end-to-end coverage for admin sign-in and content management flows in `frontend/tests/e2e/admin-content-management.spec.ts`
- [ ] T027 [P] [US2] Add validation regression coverage for required fields and rejected media uploads in `backend/tests/Feature/Admin/AdminContentValidationTest.php`

### Implementation for User Story 2

- [ ] T028 [US2] Implement admin dashboard and authentication endpoints in `backend/app/Http/Controllers/Admin/AdminDashboardController.php`, `backend/app/Http/Controllers/Auth/AdminAuthController.php`, and `backend/routes/api.php`
- [ ] T029 [US2] Implement admin CRUD controllers and services for notices, courses, faculty profiles, gallery items, and contact details in `backend/app/Http/Controllers/Admin/` and `backend/app/Services/Content/`
- [ ] T030 [US2] Implement fixed site section update endpoints and singleton content management rules in `backend/app/Http/Controllers/Admin/SiteSectionController.php` and `backend/app/Services/Content/SiteSectionService.php`
- [ ] T031 [US2] Implement media upload handling, storage, and image metadata validation in `backend/app/Http/Controllers/Admin/MediaController.php`, `backend/app/Services/Media/MediaUploadService.php`, and `backend/app/Models/MediaAsset.php`
- [ ] T032 [P] [US2] Build admin authentication screens and route protection in `frontend/app/pages/admin/login.vue`, `frontend/app/middleware/admin-auth.ts`, and `frontend/app/stores/auth.ts`
- [ ] T033 [P] [US2] Build admin notices and courses management screens in `frontend/app/pages/admin/notices.vue`, `frontend/app/pages/admin/courses.vue`, and `frontend/app/components/admin/forms/`
- [ ] T034 [P] [US2] Build admin faculty, gallery, and contact management screens in `frontend/app/pages/admin/faculty.vue`, `frontend/app/pages/admin/gallery.vue`, `frontend/app/pages/admin/contact.vue`, and `frontend/app/components/admin/forms/`
- [ ] T035 [P] [US2] Build fixed section editor and media upload UI in `frontend/app/pages/admin/sections.vue`, `frontend/app/components/admin/forms/SiteSectionForm.vue`, and `frontend/app/components/admin/forms/MediaUploadField.vue`
- [ ] T036 [US2] Connect admin pages to backend contracts with validation feedback, publish toggles, and optimistic refresh behavior in `frontend/app/composables/useAdminContent.ts` and `frontend/app/stores/admin-content.ts`

**Checkpoint**: User Stories 1 and 2 should both work independently

---

## Phase 5: User Story 3 - Trust Official Updates (Priority: P3)

**Goal**: Enforce content permissions and traceable audit history so official updates are controlled and attributable.

**Independent Test**: Confirm unauthorized users cannot access admin content actions and that each successful content change records the acting admin and timestamp.

### Tests for User Story 3

- [ ] T037 [P] [US3] Add backend feature tests for admin authorization and audit logging in `backend/tests/Feature/Admin/AdminAuthorizationAuditTest.php`
- [ ] T038 [P] [US3] Add frontend end-to-end coverage for unauthorized admin access handling in `frontend/tests/e2e/admin-authorization.spec.ts`

### Implementation for User Story 3

- [ ] T039 [US3] Enforce per-resource admin policy checks across content controllers in `backend/app/Http/Controllers/Admin/` and `backend/app/Policies/`
- [ ] T040 [US3] Implement persistent audit logging for content create, update, publish, and delete actions in `backend/database/migrations/`, `backend/app/Models/ContentAuditLog.php`, and `backend/app/Services/Audit/ContentAuditLogger.php`
- [ ] T041 [US3] Expose admin audit summaries and last-modified metadata in `backend/app/Http/Controllers/Admin/AdminDashboardController.php` and `backend/app/Http/Resources/Admin/`
- [ ] T042 [US3] Surface authorization failures, actor metadata, and last-updated status in `frontend/app/pages/admin/index.vue`, `frontend/app/components/admin/AuditMetaPanel.vue`, and `frontend/app/composables/useAdminContent.ts`

**Checkpoint**: All user stories should now be independently functional

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories

- [ ] T043 [P] Update implementation and local run documentation in `README.md` and `specs/001-school-website-platform/quickstart.md`
- [ ] T044 Harden API and frontend error handling for empty states, unpublished records, and expired notices in `backend/app/Http/Controllers/Public/`, `backend/app/Services/Content/`, and `frontend/app/components/public/`
- [ ] T045 [P] Add final smoke coverage for end-to-end public and admin workflows in `frontend/tests/e2e/` and `backend/tests/Feature/`
- [ ] T046 Verify no generic CMS, layout builder, or undocumented content fields were introduced in `backend/app/`, `frontend/app/pages/admin/`, and `specs/001-school-website-platform/contracts/openapi.yaml`

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - blocks all user stories
- **User Story 1 (Phase 3)**: Depends on Foundational completion
- **User Story 2 (Phase 4)**: Depends on Foundational completion and benefits from User Story 1 public rendering being available for publish verification
- **User Story 3 (Phase 5)**: Depends on Foundational completion and on User Story 2 admin flows existing so policy and audit behavior can be exercised
- **Polish (Phase 6)**: Depends on all desired user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational - establishes the public website MVP
- **User Story 2 (P2)**: Can start after Foundational - uses the public site to verify admin publishing outcomes
- **User Story 3 (P3)**: Can start after User Story 2 because audit and permission checks apply to admin content workflows

### Within Each User Story

- Tests for a story should be added before or alongside implementation and must fail before the implementation is considered complete
- Backend contracts and services precede frontend integration for the same story
- Shared UI components can be built in parallel when they target different files
- Story completion requires validation against that story's independent test

### Parallel Opportunities

- T003, T004, and T005 can run in parallel after initial app scaffolding
- T014 and T015 can run in parallel once backend foundational contracts are being established
- T016 and T017 can run in parallel for User Story 1
- T020, T021, and T022 can run in parallel after T018 and T019 define public response shapes
- T025, T026, and T027 can run in parallel for User Story 2
- T032, T033, T034, and T035 can run in parallel after backend admin endpoints are defined
- T037 and T038 can run in parallel for User Story 3
- T043 and T045 can run in parallel during polish

---

## Parallel Example: User Story 1

```text
Task: "T016 [US1] Add backend feature tests for published public content endpoints in backend/tests/Feature/Public/PublicContentEndpointsTest.php"
Task: "T017 [US1] Add frontend end-to-end navigation coverage for public pages in frontend/tests/e2e/public-site.spec.ts"

Task: "T020 [US1] Build the public homepage and shared fixed-section components in frontend/app/pages/index.vue and frontend/app/components/public/sections/"
Task: "T021 [US1] Build the notices and courses public pages in frontend/app/pages/notices.vue, frontend/app/pages/courses/index.vue, and frontend/app/components/public/notices/"
Task: "T022 [US1] Build the faculty, gallery, and contact public pages in frontend/app/pages/faculty.vue, frontend/app/pages/gallery.vue, frontend/app/pages/contact.vue, and frontend/app/components/public/"
```

---

## Parallel Example: User Story 2

```text
Task: "T025 [US2] Add backend feature tests for admin content CRUD, validation, and media upload constraints in backend/tests/Feature/Admin/AdminContentManagementTest.php"
Task: "T026 [US2] Add frontend end-to-end coverage for admin sign-in and content management flows in frontend/tests/e2e/admin-content-management.spec.ts"
Task: "T027 [US2] Add validation regression coverage for required fields and rejected media uploads in backend/tests/Feature/Admin/AdminContentValidationTest.php"

Task: "T033 [US2] Build admin notices and courses management screens in frontend/app/pages/admin/notices.vue, frontend/app/pages/admin/courses.vue, and frontend/app/components/admin/forms/"
Task: "T034 [US2] Build admin faculty, gallery, and contact management screens in frontend/app/pages/admin/faculty.vue, frontend/app/pages/admin/gallery.vue, frontend/app/pages/admin/contact.vue, and frontend/app/components/admin/forms/"
Task: "T035 [US2] Build fixed section editor and media upload UI in frontend/app/pages/admin/sections.vue, frontend/app/components/admin/forms/SiteSectionForm.vue, and frontend/app/components/admin/forms/MediaUploadField.vue"
```

---

## Parallel Example: User Story 3

```text
Task: "T037 [US3] Add backend feature tests for admin authorization and audit logging in backend/tests/Feature/Admin/AdminAuthorizationAuditTest.php"
Task: "T038 [US3] Add frontend end-to-end coverage for unauthorized admin access handling in frontend/tests/e2e/admin-authorization.spec.ts"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational
3. Complete Phase 3: User Story 1
4. Validate the public site independently before expanding into admin workflows

### Incremental Delivery

1. Deliver the public browsing experience first through User Story 1
2. Add admin content management in User Story 2 and verify changes flow to the public site
3. Add permission hardening and traceability in User Story 3
4. Finish with polish, smoke testing, and constitution compliance review

### Suggested MVP Scope

- Complete through Phase 3 (User Story 1) for the first deliverable
- If admin editing is required in the first release, extend MVP to include the minimum subset of User Story 2 for notices, contact details, and site sections

## Notes

- Total tasks: 46
- User Story 1 tasks: 9
- User Story 2 tasks: 12
- User Story 3 tasks: 6
- All tasks follow the required checklist format with task ID, optional parallel marker, story label where required, and concrete file paths
