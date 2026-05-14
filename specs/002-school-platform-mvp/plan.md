# Implementation Plan: School Website Platform MVP

**Branch**: `002-school-platform-mvp` | **Date**: 2026-05-13 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `/specs/002-school-platform-mvp/spec.md`

**Note**: This template is filled in by the `/speckit-plan` command. See `.specify/templates/plan-template.md` for the execution workflow.

## Summary

Build the MVP of a multi-tenant school website platform with a Laravel API
backend, separate Nuxt public and admin applications, MySQL persistence,
domain-based school detection, one fixed public template, all 10 required
website sections, safe admin editing zones, and image/PDF upload support.

## Technical Context

**Language/Version**: PHP 8.x for Laravel 11 backend, TypeScript on Node 20.x for Vue 3 and Nuxt 3 frontend and admin applications

**Primary Dependencies**: Laravel 11, JWT authentication package, Vue 3, Nuxt 3, Pinia, Tailwind CSS, MySQL driver, media/upload handling library, tenant/domain detection middleware

**Storage**: MySQL for tenant content data, local or S3-compatible storage for images and PDF notice attachments

**Testing**: PHPUnit or Pest for backend feature coverage, Vitest for frontend and admin unit coverage, Playwright for cross-app end-to-end flows

**Target Platform**: Linux hosting environment, modern desktop and mobile browsers, custom school domains

**Project Type**: Multi-tenant Laravel backend with separate Vue/Nuxt public and admin web applications

**Performance Goals**: Configured school domains render their public site in under 2 seconds on standard broadband, and normal admin content saves complete in under 3 seconds excluding large uploads

**Constraints**: Fixed layout CMS, tenant-scoped data, custom domain routing, school admins cannot change templates/layout/CSS/colors/section order, MVP includes only one active template

**Scale/Scope**: One shared codebase serving multiple schools, one admin account per school in MVP, all 10 required website sections, single-template MVP with later template expansion deferred

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- Fixed presentation preserved: pass. The MVP uses one locked public template,
  and school admins cannot change template structure, CSS, colors, layout, or
  section order.
- Content scope bounded: pass. Admin editing is restricted to predefined safe
  fields for the 10 required sections and related school settings content.
- Tenant isolation explicit: pass. Domain-based school detection, school-scoped
  content, and per-school admin access are core design requirements.
- Laravel source of truth: pass. Tenant resolution, validation, authorization,
  uploads, and content contracts are defined through the backend API.
- Validation and audit rules defined: pass. Required fields, file constraints,
  school scoping, and authorized content updates are all part of the design.

## Project Structure

### Documentation (this feature)

```text
specs/002-school-platform-mvp/
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
├── contracts/
│   └── openapi.yaml
└── tasks.md
```

### Source Code (repository root)

```text
backend/
├── app/
│   ├── Http/
│   │   ├── Controllers/
│   │   ├── Middleware/
│   │   └── Requests/
│   ├── Models/
│   ├── Policies/
│   └── Services/
├── database/
│   ├── migrations/
│   └── seeders/
├── routes/
│   └── api.php
└── tests/
    ├── Feature/
    └── Unit/

frontend/
├── app/
│   ├── components/
│   │   ├── sections/
│   │   └── ui/
│   ├── composables/
│   ├── pages/
│   ├── stores/
│   └── templates/
└── tests/
    ├── e2e/
    └── unit/

admin/
├── app/
│   ├── components/
│   ├── composables/
│   ├── middleware/
│   ├── pages/
│   └── stores/
└── tests/
    ├── e2e/
    └── unit/
```

**Structure Decision**: Use `backend/` for the Laravel API and tenant-aware
content logic, `frontend/` for the public Nuxt school website, and `admin/` for
the separate Nuxt school admin panel, matching the source product specification
and preserving clear boundaries between public rendering and administrative
content workflows.

## Complexity Tracking

No constitution violations are currently required.
