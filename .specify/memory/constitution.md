<!--
Sync Impact Report
- Version change: 1.0.0 -> 2.0.0
- Modified principles:
  - I. Fixed Presentation System -> I. Agency-Controlled Fixed Presentation
  - II. Controlled Content Surface -> II. Predefined Safe Content Boundaries
  - III. Contract-First Laravel and Nuxt Boundary -> III. Multi-Tenant Laravel and Nuxt Contract Boundary
  - IV. Safe Content Operations -> IV. Tenant-Scoped Safe Content Operations
  - V. Role-Secured Administration and Traceability -> V. Tenant-Scoped Administration and Traceability
- Added sections:
  - Platform Scope and Tenancy Constraints
  - Delivery Workflow and Quality Gates
- Removed sections:
  - Technology and Content Constraints
- Templates requiring updates:
  - updated: .specify/templates/plan-template.md
  - updated: .specify/templates/spec-template.md
  - updated: .specify/templates/tasks-template.md
  - reviewed: .specify/templates/commands/ (directory not present)
  - reviewed: AGENTS.md
- Follow-up TODOs:
  - None
-->
# Schoolweb Constitution

## Core Principles

### I. Agency-Controlled Fixed Presentation
All public-facing layouts, CSS, colors, typography, section order, navigation,
and template structure MUST remain code-defined and agency-controlled. School
admins MUST NOT receive controls to change layout, CSS, colors, section order,
templates, page composition, or runtime presentation logic. Template selection,
template changes, and visual redesigns are implementation-managed decisions and
require code changes, review, and deployment. Rationale: the platform sells a
fixed-layout CMS where design safety is non-negotiable.

### II. Predefined Safe Content Boundaries
School admins MAY edit only predefined safe content fields exposed by the
product specification for each locked section. Every editable field MUST have an
explicit schema, validation rules, media constraints, and publication behavior.
Admins MUST NOT create arbitrary new sections, custom widgets, free-form page
types, undocumented fields, or unbounded HTML content. New editable areas or
field expansions require specification and implementation updates controlled by
the development team.

### III. Multi-Tenant Laravel and Nuxt Contract Boundary
Laravel is the authoritative backend for tenant resolution, validation,
authorization, business rules, uploads, and content delivery. Vue 3 and Nuxt
MUST consume explicit backend contracts and render the correct tenant and
template without hidden assumptions. Every public and admin request MUST resolve
the current school tenant correctly by domain or authenticated school context.
Contract changes MUST be synchronized across backend validation, tenant scoping,
frontend rendering, and feature documentation in the same delivery.

### IV. Tenant-Scoped Safe Content Operations
All content persistence, uploads, and retrieval MUST be safely scoped to a
single school tenant. The system MUST validate allowed file types, file sizes,
and relevant content rules before persistence, and it MUST prevent cross-tenant
data leakage in reads, writes, caching, and file access. Rich text, if allowed,
MUST be explicitly constrained and sanitized. Domain-aware public responses MUST
fail safely when a school is inactive, missing, or misconfigured.

### V. Tenant-Scoped Administration and Traceability
Only authenticated, authorized school admins MAY modify that school's managed
content, and they MAY modify only the predefined safe fields for their tenant.
Admin actions affecting public content MUST be attributable through actor and
timestamp metadata or equivalent audit trails. The platform MUST enforce tenant
ownership for admin access, uploads, and settings updates. Rationale: this is a
multi-school managed platform where operational accountability and tenant
isolation are mandatory.

## Platform Scope and Tenancy Constraints

- The required stack is Laravel backend, Vue 3 plus Nuxt frontend, and MySQL
  persistence.
- The platform is multi-school and multi-tenant: one codebase serves many
  schools while keeping content, settings, and administration isolated per
  school.
- Each school MUST be mapped to its own custom domain or configured host
  identity, and public content resolution MUST be tenant-aware by default.
- The product is a fixed-layout CMS. Safe editable domains include only the
  predefined section fields such as hero, about, stats, facilities, faculty,
  gallery, notices, testimonials, contact, footer/settings, and other approved
  schema-backed records.
- Template systems MAY support multiple agency-built templates, but schools MAY
  only use the template assigned or exposed by product rules; tenant admins
  cannot alter template structure or visual tokens.
- School admins MUST NOT manage infrastructure settings, environment variables,
  deployment concerns, tenant routing internals, or other agency-only controls.

## Delivery Workflow and Quality Gates

- Every feature spec MUST identify tenant impact, domain-routing impact,
  contract impact, and whether any change touches locked template behavior.
- Every implementation plan MUST pass a constitution check covering fixed-layout
  preservation, safe-field boundaries, tenant isolation, domain-aware routing,
  Laravel authority over contracts, validation and sanitization, and admin
  authorization.
- Tasks that touch managed content MUST include the relevant migration or schema
  work, backend validation, tenant scoping, admin UI updates, frontend rendering
  updates, and verification steps.
- Testing is required for changes that affect tenant resolution, admin
  permissions, uploads, validation, cross-tenant isolation, or public rendering.
- Reviews MUST reject features that introduce tenant data leakage, admin-driven
  layout changes, unsafe custom HTML surfaces, undocumented editable fields, or
  school-controlled visual customization of locked templates.

## Governance

This constitution supersedes conflicting local conventions for the project.
Amendments require this file and any affected templates or guidance artifacts to
be updated together, with rationale recorded in the Sync Impact Report.
Versioning follows semantic versioning: MAJOR for governance changes that alter
project obligations or redefine the platform model, MINOR for new principles or
materially expanded guidance, and PATCH for clarifications that do not change
obligations. Compliance review is mandatory during planning, implementation, and
review. Any exception MUST be explicitly justified in the implementation plan's
complexity tracking section before work proceeds.

**Version**: 2.0.0 | **Ratified**: 2026-05-13 | **Last Amended**: 2026-05-13
