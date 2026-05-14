# Data Model: School Website Platform

## Overview

The platform uses explicit content-domain entities rather than a generic CMS
table. Each entity includes standard lifecycle metadata for publication state,
ordering when relevant, and audit fields.

## Common Conventions

- `id`: Primary key
- `created_at`, `updated_at`: System timestamps
- `created_by`, `updated_by`: Admin actor references for traceability
- `is_published`: Public visibility flag where applicable
- `sort_order`: Optional integer ordering field for repeatable content lists

## Entities

### Admin User

- Purpose: Authenticated user allowed to manage predefined content
- Fields:
  - `id`
  - `name`
  - `email`
  - `password_hash`
  - `role`
  - `is_active`
  - `last_login_at`
- Validation:
  - `email` must be unique and valid
  - `role` must be one of the approved admin roles
  - inactive users cannot authenticate
- Relationships:
  - one-to-many with content records through `created_by` and `updated_by`

### Site Section

- Purpose: Represents a fixed public section with editable static content slots
- Fields:
  - `id`
  - `key` such as `home-hero`, `about-intro`, `admissions-summary`
  - `title`
  - `body`
  - `image_asset_id` nullable
  - `is_published`
- Validation:
  - `key` must be unique and from an approved list
  - `title` required for titled sections
  - `body` length constrained per section policy
- Relationships:
  - optional many-to-one with Media Asset

### Notice

- Purpose: Official published announcement
- Fields:
  - `id`
  - `title`
  - `summary`
  - `body`
  - `publish_date`
  - `expiry_date` nullable
  - `is_published`
  - `sort_order`
- Validation:
  - `title` required
  - `publish_date` required
  - `expiry_date` must not be earlier than `publish_date`
- State transitions:
  - draft -> published
  - published -> unpublished
  - published -> archived by expiry or manual action

### Course

- Purpose: Structured academic offering shown on the public site
- Fields:
  - `id`
  - `name`
  - `slug`
  - `summary`
  - `description`
  - `duration`
  - `eligibility`
  - `intake_capacity` nullable
  - `is_published`
  - `sort_order`
- Validation:
  - `name` required
  - `slug` unique
  - `summary` required
  - `duration` required
- Relationships:
  - optional many-to-many with Faculty Profile if course ownership is shown

### Faculty Profile

- Purpose: Public faculty or staff profile
- Fields:
  - `id`
  - `name`
  - `designation`
  - `department`
  - `bio`
  - `photo_asset_id` nullable
  - `email` nullable
  - `phone` nullable
  - `is_published`
  - `sort_order`
- Validation:
  - `name` required
  - `designation` required
  - `bio` constrained to allowed formatting rules
- Relationships:
  - optional many-to-one with Media Asset
  - optional many-to-many with Course

### Gallery Item

- Purpose: Public image-based gallery content
- Fields:
  - `id`
  - `title`
  - `caption` nullable
  - `media_asset_id`
  - `category` nullable
  - `event_date` nullable
  - `is_published`
  - `sort_order`
- Validation:
  - `media_asset_id` required
  - title or caption required by content policy
- Relationships:
  - many-to-one with Media Asset

### Contact Detail

- Purpose: Canonical institutional contact information
- Fields:
  - `id`
  - `label`
  - `type` such as `phone`, `email`, `address`, `office_hours`, `map_link`
  - `value`
  - `is_primary`
  - `is_published`
  - `sort_order`
- Validation:
  - `type` required from approved set
  - `value` required
  - one primary contact per type when business rules require it

### Media Asset

- Purpose: Managed uploaded image used by public content
- Fields:
  - `id`
  - `file_name`
  - `storage_path`
  - `mime_type`
  - `file_size`
  - `width` nullable
  - `height` nullable
  - `alt_text`
  - `uploaded_by`
  - `is_active`
- Validation:
  - allowed mime types restricted to approved image formats
  - size limit enforced
  - `alt_text` required for public rendering
- Relationships:
  - one-to-many with Site Section, Faculty Profile, and Gallery Item

## Relationship Summary

- Admin User creates and updates all content-domain entities
- Media Asset is referenced by Site Section, Faculty Profile, and Gallery Item
- Course and Faculty Profile may have an optional many-to-many relationship
- Contact Detail and Site Section behave as constrained administrative content,
  not open-ended user-generated records
