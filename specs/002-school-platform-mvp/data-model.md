# Data Model: School Website Platform MVP

## Overview

The MVP uses explicit tenant-scoped tables for each fixed website section and
shared school metadata. Every content record is linked to exactly one school.

## Common Conventions

- `id`: Primary key
- `school_id`: Required tenant key for every school-scoped record
- `created_at`, `updated_at`: Lifecycle timestamps
- `sort_order`: Ordering field for repeatable collections where needed

## Entities

### School

- Purpose: Represents one school tenant on the platform
- Fields:
  - `id`
  - `name`
  - `domain`
  - `template`
  - `is_active`
  - `created_at`
- Validation:
  - `domain` must be unique
  - `template` must be an allowed template identifier
  - inactive schools must not resolve to a public site
- Relationships:
  - one-to-one or one-to-many with all school-scoped content entities

### Admin User

- Purpose: Authenticated school admin for one tenant
- Fields:
  - `id`
  - `school_id`
  - `email`
  - `password_hash`
  - `created_at`
- Validation:
  - `email` must be valid
  - `school_id` required
- Relationships:
  - belongs to School

### Hero Content

- Purpose: Fixed hero section content for one school
- Fields:
  - `id`
  - `school_id`
  - `heading`
  - `subheading`
  - `cta_text`
  - `cta_link`
  - `updated_at`
- Validation:
  - `heading` required
  - `cta_link` must be a valid URL when provided
- Relationships:
  - belongs to School
  - one-to-many with Hero Slide

### Hero Slide

- Purpose: Repeatable hero background images
- Fields:
  - `id`
  - `school_id`
  - `image_path`
  - `sort_order`
- Validation:
  - `image_path` required
  - maximum 5 slides per school for MVP
- Relationships:
  - belongs to School

### About Content

- Purpose: Fixed about section and principal content
- Fields:
  - `id`
  - `school_id`
  - `heading`
  - `description`
  - `image_path`
  - `principal_name`
  - `principal_message`
  - `principal_photo`
  - `established_year`
  - `updated_at`
- Validation:
  - `heading` required
  - rich text fields constrained to approved safe formatting
- Relationships:
  - belongs to School

### Stat Item

- Purpose: Repeatable statistics items
- Fields:
  - `id`
  - `school_id`
  - `number`
  - `label`
  - `sort_order`
- Validation:
  - `number` required
  - `label` required
  - maximum 4 stats for MVP display rules
- Relationships:
  - belongs to School

### Facility Item

- Purpose: Repeatable facilities entries
- Fields:
  - `id`
  - `school_id`
  - `name`
  - `description`
  - `image_path`
  - `sort_order`
- Validation:
  - `name` required
  - maximum 12 facilities per school for MVP
- Relationships:
  - belongs to School

### Faculty Profile

- Purpose: Repeatable faculty records
- Fields:
  - `id`
  - `school_id`
  - `name`
  - `designation`
  - `qualification`
  - `experience`
  - `photo_path`
  - `sort_order`
- Validation:
  - `name` required
  - `designation` required
- Relationships:
  - belongs to School

### Gallery Item

- Purpose: Repeatable gallery images
- Fields:
  - `id`
  - `school_id`
  - `image_path`
  - `caption`
  - `category`
  - `sort_order`
- Validation:
  - `image_path` required
- Relationships:
  - belongs to School

### Notice

- Purpose: Notice board entry with optional PDF attachment
- Fields:
  - `id`
  - `school_id`
  - `title`
  - `description`
  - `notice_date`
  - `attachment_path`
  - `is_active`
  - `created_at`
- Validation:
  - `title` required
  - `notice_date` required
  - `attachment_path` must be a supported PDF when present
- State transitions:
  - active -> inactive
  - inactive -> active
- Relationships:
  - belongs to School

### Testimonial

- Purpose: Repeatable testimonial content
- Fields:
  - `id`
  - `school_id`
  - `name`
  - `quote`
  - `photo_path`
  - `relation`
  - `sort_order`
- Validation:
  - `name` required
  - `quote` required
- Relationships:
  - belongs to School

### Contact Info

- Purpose: Fixed contact section content
- Fields:
  - `id`
  - `school_id`
  - `address`
  - `phone`
  - `email`
  - `maps_url`
  - `whatsapp`
  - `updated_at`
- Validation:
  - `address`, `phone`, and `email` required for MVP completeness
  - `maps_url` must be a valid URL when present
- Relationships:
  - belongs to School

### School Settings

- Purpose: Footer and school-level presentation metadata allowed in safe zones
- Fields:
  - `id`
  - `school_id`
  - `logo_path`
  - `favicon_path`
  - `tagline`
  - `meta_title`
  - `meta_description`
  - `facebook_url`
  - `instagram_url`
  - `youtube_url`
  - `copyright_text`
  - `updated_at`
- Validation:
  - URLs must be valid when present
  - assets must be approved file types
- Relationships:
  - belongs to School

## Relationship Summary

- School owns all content and settings records
- Admin User belongs to one School
- Hero Content and Hero Slide are linked by school ownership
- All repeatable section items are school-scoped collections
- No entity may be shared across schools in the MVP
