# Research: School Website Platform

## Decision 1: Use Laravel API with session-based admin authentication

- Decision: Use Laravel as the backend API and admin source of truth, with
  session or Sanctum-backed authentication for admin users.
- Rationale: The platform has one institutional admin surface, benefits from
  Laravel's native authorization and validation stack, and does not require a
  broad third-party API access model for the initial feature.
- Alternatives considered:
  - Token-only stateless auth for all admin requests: rejected because it adds
    more credential handling overhead than needed for a first-party admin panel.
  - Separate admin backend framework: rejected because it duplicates domain and
    authorization logic already required in Laravel.

## Decision 2: Keep the public site fixed and drive only content through CMS records

- Decision: Model only predefined content domains and render them into
  hard-coded Nuxt page sections.
- Rationale: This is required by the constitution and prevents the project from
  drifting into a generic page-builder or open-ended CMS.
- Alternatives considered:
  - Block-based page composition: rejected because it would allow layout-level
    editing that violates fixed presentation rules.
  - Raw HTML page editing: rejected because it weakens validation, safety, and
    visual consistency.

## Decision 3: Use MySQL for structured content and relational admin metadata

- Decision: Store content, publication state, sort order, and audit fields in
  MySQL tables designed around explicit institutional content domains.
- Rationale: The system is relational by nature, requires consistent filtering,
  validation, and ordering, and does not need polyglot persistence for the
  initial feature.
- Alternatives considered:
  - Document storage for content blobs: rejected because it weakens schema
    enforcement for tightly structured domains such as courses and faculty.
  - Flat-file CMS storage: rejected because concurrent admin workflows and
    auditability are better served by relational storage.

## Decision 4: Separate public content endpoints from admin management endpoints

- Decision: Expose read-only public endpoints for published content and secured
  admin endpoints for content CRUD, media association, and publication control.
- Rationale: This keeps the frontend integration clear, reduces accidental data
  exposure, and aligns contracts to the different needs of visitors and admins.
- Alternatives considered:
  - Single mixed endpoint set for all consumers: rejected because permission and
    response-shape concerns become harder to reason about.
  - Server-render everything from Laravel only: rejected because the requested
    frontend is Vue/Nuxt and benefits from dedicated route/view composition.

## Decision 5: Model site-wide text and contact content as structured singleton records

- Decision: Use singleton-style records for contact details and named static
  content sections, with list-based records for notices, courses, faculty, and
  gallery items.
- Rationale: Some content domains represent one canonical record per site,
  while others are repeatable collections with sorting and publication rules.
- Alternatives considered:
  - Store all content in one generic table: rejected because it obscures
    validation and encourages unbounded content shapes.
  - Hard-code all static text in frontend files: rejected because routine
    institutional updates must be manageable by admins.

## Decision 6: Enforce upload constraints and safe rendering at the backend boundary

- Decision: Validate file type, file size, dimensions where needed, and allowed
  rendering fields in Laravel before content becomes public.
- Rationale: The backend is the authoritative control point for content safety,
  consistency, and cross-client behavior.
- Alternatives considered:
  - Frontend-only validation: rejected because it is bypassable and cannot
    enforce consistent persistence rules.
  - Allow unrestricted rich text uploads: rejected because it increases XSS and
    formatting inconsistency risk.
