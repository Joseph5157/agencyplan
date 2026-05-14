# Quickstart: School Website Platform MVP

## Goal

Stand up the MVP using the required folder structure:

- `backend/` for the Laravel API
- `frontend/` for the public Nuxt website
- `admin/` for the Nuxt admin panel

The implementation order follows the source build order: backend foundation,
admin panel, public website, then deployment preparation.

## Prerequisites

- PHP 8.x and Composer
- Node.js 20.x and npm
- MySQL 8.x
- Writable file storage for images and PDF uploads
- One or more local domains or host mappings for school-domain testing

## Phase 1: Backend Foundation

1. Create the Laravel project in `backend/`.
2. Configure MySQL connection and application environment variables.
3. Add migrations for schools, admin users, and all school-scoped section
   tables.
4. Implement domain-based school detection middleware.
5. Seed one active test school and one school admin account.
6. Add all public API routes with contract-compliant responses.
7. Add admin authentication and upload endpoints.

## Phase 2: Admin Panel

1. Create the Nuxt admin project in `admin/`.
2. Build the login flow for school admins.
3. Build the dashboard showing school context and content status summaries.
4. Build safe editing pages for hero, about, stats, facilities, faculty,
   gallery, notices, testimonials, contact, and settings.
5. Add image upload and PDF upload flows with validation feedback.

## Phase 3: Public Website

1. Create the Nuxt public site in `frontend/`.
2. Implement Template One only.
3. Build all 10 sections in the fixed layout.
4. Connect each section to the public school content endpoints.
5. Apply school-level SEO metadata and responsive QA checks.

## Phase 4: Deployment Preparation

1. Prepare runtime configuration for Laravel API, public frontend, and admin app.
2. Validate custom domain routing to the correct school.
3. Test end-to-end content entry for one real or staging school.

## Verification Flow

1. Load a configured school domain and confirm the correct school site appears.
2. Sign in to the admin panel as that school's admin.
3. Update each of the 10 sections through safe-field forms only.
4. Upload approved images and a PDF notice attachment.
5. Confirm updates appear on the matching school domain and do not appear on any
   other school domain.
6. Confirm no admin workflow can change template, layout, CSS, colors, or
   section order.
