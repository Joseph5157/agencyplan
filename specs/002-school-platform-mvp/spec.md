# Feature Specification: School Website Platform MVP

**Feature Branch**: `002-school-platform-mvp`

**Created**: 2026-05-13

**Status**: Draft

**Input**: User description: "Create the main feature specification for the School Website Platform using docs/SCHOOL_PLATFORM_SPEC.md as the source. Focus on MVP only: one working template, all 10 website sections, admin editing for safe content zones, Laravel API, Nuxt public frontend, Nuxt admin panel, MySQL schema, image and PDF uploads, domain-based school detection"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Browse a School Website (Priority: P1)

As a parent, student, or visitor, I want to open a school's website on its own
domain and view complete, trustworthy school information so I can understand the
school and take the next step confidently.

**Why this priority**: The public website is the primary customer-facing value
of the platform. Without a working public site for each school domain, the
platform does not deliver its core business outcome.

**Independent Test**: Can be fully tested by opening a configured school domain
and confirming that the public site displays one complete template with all 10
sections populated from that school's published content.

**Acceptance Scenarios**:

1. **Given** a visitor opens a configured school domain, **When** the platform
resolves that school, **Then** it shows the correct school website using the
assigned template and that school's content only.
2. **Given** published school content exists for all required sections,
**When** a visitor navigates the public site, **Then** they can view hero,
about, stats, facilities, faculty, gallery, notice board, testimonials,
contact, and footer information in the fixed layout.

---

### User Story 2 - Update Safe Content Zones (Priority: P2)

As a school admin, I want to update only the approved content fields for my
school website so I can keep the site current without risking the design or
breaking the layout.

**Why this priority**: The platform's operational value depends on school staff
being able to maintain content safely after launch without needing developer
intervention for routine updates.

**Independent Test**: Can be tested by signing in as a school admin, updating
the predefined fields for each of the 10 sections, uploading supported media,
and confirming the public site reflects only valid saved changes.

**Acceptance Scenarios**:

1. **Given** an authenticated school admin accesses the admin panel, **When**
they update predefined section fields or upload allowed media, **Then** the
platform saves the changes for that school and reflects them on the public site.
2. **Given** a school admin attempts to modify anything outside the approved
safe fields, **When** they use the admin panel, **Then** the platform prevents
layout, color, CSS, section-order, or template changes.

---

### User Story 3 - Operate Multi-School Domain Delivery (Priority: P3)

As the platform operator, I want the system to route each school domain to the
correct school data set so multiple schools can run on one platform without
content mixing or manual site duplication.

**Why this priority**: Multi-school delivery is a key business capability, but
it depends on the public and admin experiences already existing.

**Independent Test**: Can be tested by configuring more than one school domain
and confirming that each domain loads its own content, admin access stays scoped
to the correct school, and no cross-school data appears.

**Acceptance Scenarios**:

1. **Given** two active schools exist on the platform, **When** each domain is
opened, **Then** the platform resolves and serves the correct school's content
without exposing another school's data.
2. **Given** a school admin is authenticated for one school, **When** they edit
content, **Then** only that school's records and uploads are changed.

---

### Edge Cases

- What happens when a school domain is unknown, inactive, or not fully
  configured yet?
- How does the platform handle missing content in one or more required sections
  while still keeping the fixed public layout intact?
- What happens when a school admin uploads an unsupported image or PDF file, or
  a file that exceeds allowed limits?
- How does the platform behave when a school has no active notices, no gallery
  entries, or fewer repeatable items than the design can display?
- What happens if two schools have similar branding or content but must remain
  strictly isolated?

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The system MUST support multiple schools on one platform while
  keeping each school's public content, uploads, settings, and admin actions
  scoped to that school only.
- **FR-002**: The system MUST resolve the active school by domain and render the
  correct school website for that domain.
- **FR-003**: The system MUST provide one working public website template for
  the MVP.
- **FR-004**: The public website MUST include all 10 required sections: hero,
  about, stats, facilities, faculty, gallery, notice board, testimonials,
  contact, and footer.
- **FR-005**: The system MUST allow school admins to update only predefined safe
  content fields for the 10 required sections.
- **FR-006**: The system MUST prevent school admins from changing layout, CSS,
  colors, section order, templates, or any other locked presentation controls.
- **FR-007**: The system MUST allow school admins to upload supported image
  files for approved content fields.
- **FR-008**: The system MUST allow school admins to upload PDF attachments for
  notices where attachments are supported.
- **FR-009**: The system MUST validate required fields, media types, file size
  constraints, and permitted input formats before saving content changes.
- **FR-010**: The system MUST provide a school admin sign-in flow and restrict
  editing access to that school's authorized admin only.
- **FR-011**: The system MUST provide section-specific editing workflows for the
  10 required sections, including repeatable item management where the section
  schema allows it.
- **FR-012**: The system MUST support a notice board with active and inactive
  status control so only intended notices appear publicly.
- **FR-013**: The system MUST store and retrieve structured school content in a
  persistent relational data model.
- **FR-014**: The public site MUST present the current published content for the
  resolved school without exposing another school's records.
- **FR-015**: The system MUST support school-level footer and settings content
  including logo, tagline, social links, and search metadata fields for the
  MVP.

### Content Governance & Admin Boundaries *(mandatory for content/admin features)*

- This feature is limited to predefined safe content management for the 10 MVP
  website sections and does not include a generic page builder or open-ended CMS.
- Admin-editable fields are restricted to the approved schema-backed fields for
  hero, about, stats, facilities, faculty, gallery, notice board,
  testimonials, contact, and footer/settings content.
- The public presentation remains fixed. No school-admin workflow may change
  layout, template structure, colors, CSS, spacing, fonts, section order, or
  navigation design.
- Each editable field must have validation rules, media constraints where
  relevant, and clear save behavior.
- The backend content contract consumed by the public site and admin panel must
  remain stable enough that safe content updates do not alter locked templates.

### Multi-Tenant Scope *(mandatory for tenant-aware features)*

- The current school is identified by the request domain for the public website
  and by school-scoped authenticated admin access for the admin panel.
- The MVP includes school-specific domain mapping, school-specific content, and
  school-specific uploads.
- The feature must prevent cross-school data reads, writes, and media exposure.
- Agency-controlled template assignment exists at the school level, but the MVP
  includes only one working template and no school-admin template switching.

### Key Entities *(include if feature involves data)*

- **School**: A tenant record representing one school, including domain,
  assigned template, status, and core identity.
- **School Admin**: The authorized user who manages safe content fields for one
  school only.
- **Hero Content**: The homepage lead content including heading, subheading,
  calls to action, and hero images.
- **About Content**: The school's overview content including description,
  principal message, supporting image, and established year.
- **Stat Item**: A repeatable statistics record with numeric value and label.
- **Facility Item**: A repeatable facility record with title, description, and
  supporting image.
- **Faculty Profile**: A repeatable faculty record with name, designation,
  qualifications, experience, and image.
- **Gallery Item**: A repeatable gallery record with image, caption, and
  category.
- **Notice**: A school announcement with title, description, date, active
  status, and optional PDF attachment.
- **Testimonial**: A repeatable quote record with name, relation, quote, and
  optional image.
- **Contact Information**: The school's address, contact methods, map link, and
  related footer/settings details.
- **School Settings**: Shared school-level brand assets and metadata such as
  logo, favicon, social links, and search metadata.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: At least 95% of acceptance-test visits to configured school
  domains load the correct school's public site without cross-school content
  leakage.
- **SC-002**: School admins can complete a standard content update for any of
  the 10 MVP sections in 5 minutes or less during acceptance testing.
- **SC-003**: 100% of attempted layout, template, CSS, color, or section-order
  changes from the school-admin experience are blocked in acceptance testing.
- **SC-004**: 100% of invalid or unsupported image and PDF uploads are rejected
  before publication during acceptance testing.
- **SC-005**: One full template with all 10 sections can be published and
  reviewed on a configured school domain in the MVP release.

## Assumptions

- The MVP serves schools on one shared platform with one active template, even
  though additional templates may be added later.
- Each school has one primary admin account for the MVP, with more advanced
  multi-user administration deferred.
- Agency staff handle onboarding steps such as school setup, domain mapping, and
  template assignment outside this MVP feature specification.
- The public site and admin panel rely on a common backend content source and
  use the same approved section schema definitions.
- School admins can modify only predefined safe content fields and cannot change
  layout, CSS, colors, templates, or section order.
