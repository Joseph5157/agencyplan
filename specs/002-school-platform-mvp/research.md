# Research: School Website Platform MVP

## Decision 1: Use domain-based tenant detection in Laravel for all public school requests

- Decision: Resolve the active school tenant from the incoming request host in
  Laravel middleware before loading public content.
- Rationale: The product spec requires one codebase to serve many schools on
  their own domains, and domain-based resolution is the primary public entry
  point for the MVP.
- Alternatives considered:
  - Query-string or path-based school selection: rejected because it does not
    match the custom-domain product model.
  - Separate deployment per school: rejected because it breaks the multi-tenant
    platform goal and increases operational overhead.

## Decision 2: Keep public site and admin panel as separate Nuxt applications

- Decision: Use `frontend/` for the public website and `admin/` for the school
  admin panel as distinct Nuxt applications.
- Rationale: This follows the source spec, allows clearer tenant and auth
  boundaries, and avoids mixing public SEO rendering concerns with admin flows.
- Alternatives considered:
  - Single Nuxt app with route partitions: rejected because the requested folder
    structure explicitly separates the public and admin applications.
  - Laravel-rendered admin pages: rejected because the product spec requires a
    Nuxt admin panel.

## Decision 3: Model the MVP as explicit section-based tables rather than a generic CMS table

- Decision: Represent hero, about, stats, facilities, faculty, gallery,
  notices, testimonials, contact info, and school settings as separate schema
  families tied to a school.
- Rationale: The fixed-layout CMS depends on explicit safe fields and does not
  allow arbitrary content composition.
- Alternatives considered:
  - One generic content block table: rejected because it weakens validation and
    invites unsafe layout-like flexibility.
  - Hard-coded content in templates: rejected because school admins must update
    approved safe zones without developer intervention.

## Decision 4: Support one active template in MVP while preserving template assignment at the school level

- Decision: Store the assigned template per school but implement only Template
  One in the MVP public frontend.
- Rationale: The source spec defines template choice as part of the business
  model, while the MVP explicitly limits delivery to one working template.
- Alternatives considered:
  - Removing template assignment entirely from MVP: rejected because school
    records still need a consistent model for future expansion.
  - Implementing all three templates now: rejected because it exceeds MVP scope.

## Decision 5: Use JWT-backed school-admin authentication for the admin app

- Decision: Authenticate school admins through Laravel-issued JWT-backed access
  for the separate admin application.
- Rationale: The source spec explicitly calls for JWT-based sessions and a
  separate admin panel, and the auth boundary must remain school-scoped.
- Alternatives considered:
  - Cookie session auth only: rejected because it diverges from the provided
    product spec and cross-app auth expectations.
  - Shared public/admin identity for visitors: rejected because only school
    admins need authenticated access in the MVP.

## Decision 6: Allow image uploads across sections and PDF uploads for notices only

- Decision: Support validated image uploads for all approved image fields and
  PDF upload support only for notice attachments.
- Rationale: This exactly matches the MVP scope and section rules from the
  source product specification.
- Alternatives considered:
  - Unrestricted file uploads: rejected because it violates safe content rules.
  - PDF support across unrelated sections: rejected because the source spec only
    requires PDF attachments for notices.

## Decision 7: Follow the documented build order as implementation phases

- Decision: Plan delivery in this order: backend foundation, admin panel,
  public website, then deployment/domain go-live preparation.
- Rationale: The product spec already defines the intended implementation order,
  and it aligns with dependency flow: tenant/content foundation first, then
  administration, then public rendering.
- Alternatives considered:
  - Frontend-first implementation: rejected because domain-based content
    resolution and data contracts depend on backend readiness.
  - Admin and public implementation before schema completion: rejected because
    safe-field editing depends on explicit backend models and validation.
