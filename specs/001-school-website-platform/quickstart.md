# Quickstart: School Website Platform

## Goal

Stand up the Laravel API, Nuxt frontend, MySQL database, and authenticated
admin workflow for the fixed-design school website platform.

## Prerequisites

- PHP 8.x and Composer
- Node.js 20.x and npm
- MySQL 8.x
- A writable local filesystem path for uploaded images

## Repository Layout

- `backend/` contains the Laravel API, database migrations, policies, and tests
- `frontend/` contains the Nuxt public site, admin panel screens, and frontend tests
- `specs/001-school-website-platform/` contains the planning artifacts for this feature

## Setup Steps

1. Create the Laravel project in `backend/` and install the API/auth
   dependencies required for admin access and content validation.
2. Create the Nuxt project in `frontend/` with route groups for public pages and
   authenticated admin pages.
3. Provision a MySQL database and configure backend environment variables for
   database connection, session/auth settings, and file storage.
4. Create migrations and models for admin users, site sections, notices,
   courses, faculty profiles, gallery items, contact details, and media assets.
5. Seed the application with baseline fixed sections and one admin user.
6. Implement the public content endpoints and admin CRUD endpoints described in
   `contracts/openapi.yaml`.
7. Build the Nuxt public pages to consume published content endpoints only.
8. Build the admin panel forms to manage predefined content domains with
   validation feedback and publish controls.
9. Add audit metadata capture for all admin write operations.
10. Run backend, frontend, and end-to-end tests for public browsing and admin
    content management flows.

## Verification Flow

1. Sign in as an admin user.
2. Create or update a notice, course, faculty profile, gallery item, and
   contact detail.
3. Confirm each record appears correctly on the public site only when published.
4. Attempt invalid content and invalid media uploads to verify the system blocks
   them with clear errors.
5. Confirm no admin interface allows creating arbitrary page layouts or custom
   widgets.
6. Confirm content changes record the acting administrator and timestamp.

## Deliverable Checkpoints

- Public visitors can navigate fixed pages for institutional information,
  courses, faculty, notices, gallery, and contact details.
- Admin users can manage only predefined content types.
- MySQL stores structured content with auditability.
- Laravel contracts and Nuxt rendering stay aligned with the fixed design.
