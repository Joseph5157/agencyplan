# School Website Platform
## Project Specification & Building Guide

> **Prepared by:** Syed Websites  
> **Product:** School Website Platform  
> **Document type:** GitHub Project Spec Kit  
> **Date:** 2026-05-13  
> **Version:** 1.0

---

## Table of Contents

1. [Project Overview](#1-project-overview)
2. [Business Model](#2-business-model)
3. [System Architecture](#3-system-architecture)
4. [Technology Stack](#4-technology-stack)
5. [Project Folder Structure](#5-project-folder-structure)
6. [CMS Philosophy](#6-cms-philosophy)
7. [Website Sections](#7-website-sections)
8. [Admin Panel Features](#8-admin-panel-features)
9. [Database Schema](#9-database-schema)
10. [API Routes](#10-api-routes)
11. [Template System](#11-template-system)
12. [Domain & Hosting Model](#12-domain--hosting-model)
13. [Environment Variables](#13-environment-variables)
14. [Build Order](#14-build-order)
15. [MVP Scope](#15-mvp-scope)

---

## 1. Project Overview

A multi-school website platform built by Syed Websites that allows each school to have its own professionally designed website with a custom domain. Schools manage their own content through a simple admin panel without any ability to break or alter the design.

The platform uses a **Fixed Layout CMS** approach — the developer controls the layout and design permanently. The school admin only edits content inside predefined safe zones.

### Key Goals

- Deploy beautiful, professional school websites rapidly
- Give school admins a simple, foolproof content editing panel
- Maintain full design control on the developer/agency side
- Support multiple design templates per school preference
- Each school operates on their own custom domain
- One codebase serves all schools (multi-tenant)

---

## 2. Business Model

| Item | Detail |
|---|---|
| Client type | Schools (primary/secondary) |
| Service type | Website design + hosting + CMS |
| Delivered by | Syed Websites |
| Template choice | School picks one template at onboarding |
| Domain | Each school owns their own domain |
| Content control | School admin edits content only |
| Layout control | Syed Websites only |
| Onboarding | Agency sets up school, provides admin login |

---

## 3. System Architecture

```
┌─────────────────────────────────────────────────┐
│              PUBLIC SCHOOL WEBSITE              │
│         school.com (Vue/Nuxt frontend)          │
│                                                 │
│  Hero | About | Stats | Facilities | Faculty    │
│  Gallery | Notice Board | Testimonials          │
│  Contact | Footer                               │
└──────────────────┬──────────────────────────────┘
                   │ Fetch content via API
                   ↓
┌─────────────────────────────────────────────────┐
│               BACKEND (Laravel API)             │
│                                                 │
│   Multi-tenant aware                           │
│   Serves content per school domain             │
│   Handles admin authentication                 │
│   Manages media uploads                        │
└──────┬───────────────────────┬─────────────────┘
       │                       │
       ↓                       ↓
  MySQL Database          File Storage
  (per-school data)       (images, PDFs)
       │
       ↑
┌──────┴───────────────────────────────────────────┐
│              SCHOOL ADMIN PANEL                  │
│         (Vue/Nuxt — separate app or route)       │
│                                                  │
│   Edit content only — layout is locked           │
│   Hero text, images, faculty list, notices, etc. │
└──────────────────────────────────────────────────┘
```

### Multi-Tenant Flow

```
school-a.com → Laravel detects domain → loads School A data → serves School A website
school-b.com → Laravel detects domain → loads School B data → serves School B website
```

One codebase. One deployment. Content separated per school by domain mapping in the database.

---

## 4. Technology Stack

| Layer | Tool | Reason |
|---|---|---|
| Frontend (public site) | Vue 3 + Nuxt | SSR for SEO, fast page loads |
| Admin panel | Vue 3 + Nuxt (separate) | Same ecosystem, consistent DX |
| Backend API | Laravel 11 | Robust, fast API development |
| Database | MySQL | Relational, school data fits well |
| File storage | Local or S3-compatible | Images, PDFs, gallery uploads |
| Hosting | VPS or shared (per school domain) | Custom domain per school |
| CSS | Tailwind CSS | Rapid, consistent UI |

---

## 5. Project Folder Structure

```
school-platform/
│
├── frontend/                        # Public school website (Nuxt)
│   ├── components/
│   │   ├── sections/
│   │   │   ├── HeroSection.vue
│   │   │   ├── AboutSection.vue
│   │   │   ├── StatsSection.vue
│   │   │   ├── FacilitiesSection.vue
│   │   │   ├── FacultySection.vue
│   │   │   ├── GallerySection.vue
│   │   │   ├── NoticeBoardSection.vue
│   │   │   ├── TestimonialsSection.vue
│   │   │   ├── ContactSection.vue
│   │   │   └── FooterSection.vue
│   │   └── ui/                      # Shared UI components
│   ├── templates/
│   │   ├── TemplateOne/             # Template 1 layout
│   │   ├── TemplateTwo/             # Template 2 layout
│   │   └── TemplateThree/           # Template 3 layout
│   ├── composables/
│   │   └── useSchoolData.js         # Fetch school content from API
│   ├── pages/
│   │   └── index.vue                # Homepage
│   ├── nuxt.config.js
│   └── .env
│
├── admin/                           # School admin panel (Nuxt)
│   ├── pages/
│   │   ├── login.vue
│   │   ├── dashboard.vue
│   │   ├── hero.vue
│   │   ├── about.vue
│   │   ├── stats.vue
│   │   ├── facilities.vue
│   │   ├── faculty.vue
│   │   ├── gallery.vue
│   │   ├── notices.vue
│   │   ├── testimonials.vue
│   │   ├── contact.vue
│   │   └── settings.vue
│   ├── components/
│   │   ├── ImageUploader.vue
│   │   ├── RichTextEditor.vue
│   │   └── FormField.vue
│   └── nuxt.config.js
│
├── backend/                         # Laravel API
│   ├── app/
│   │   ├── Http/
│   │   │   ├── Controllers/
│   │   │   │   ├── SchoolController.php
│   │   │   │   ├── HeroController.php
│   │   │   │   ├── AboutController.php
│   │   │   │   ├── StatsController.php
│   │   │   │   ├── FacilitiesController.php
│   │   │   │   ├── FacultyController.php
│   │   │   │   ├── GalleryController.php
│   │   │   │   ├── NoticeController.php
│   │   │   │   ├── TestimonialController.php
│   │   │   │   ├── ContactController.php
│   │   │   │   └── AuthController.php
│   │   │   └── Middleware/
│   │   │       ├── IdentifySchool.php   # Detect school from domain
│   │   │       └── AdminAuth.php
│   │   └── Models/
│   │       ├── School.php
│   │       ├── Hero.php
│   │       ├── About.php
│   │       ├── Stat.php
│   │       ├── Facility.php
│   │       ├── Faculty.php
│   │       ├── GalleryImage.php
│   │       ├── Notice.php
│   │       ├── Testimonial.php
│   │       └── ContactInfo.php
│   ├── database/
│   │   └── migrations/
│   ├── routes/
│   │   └── api.php
│   └── .env
│
└── README.md
```

---

## 6. CMS Philosophy

### Fixed Layout CMS — Core Rules

The layout of every school website is **designed and locked by Syed Websites**. The school admin panel only allows editing within safe content zones.

| What Admin CAN do | What Admin CANNOT do |
|---|---|
| Edit hero heading and subheading | Change section order |
| Replace hero background image | Add new sections |
| Update about text and image | Remove sections |
| Edit stats numbers and labels | Change fonts or colors |
| Add/edit/delete facilities | Modify layout or spacing |
| Add/edit/delete faculty members | Access code or templates |
| Upload gallery images | Change the template |
| Post/delete notices | Edit footer design |
| Edit testimonials | Change any CSS |
| Update contact details | |

### Safe Zone Concept

Each section has a predefined content schema. The admin fills in only the fields defined for that section. Nothing outside those fields can be changed.

---

## 7. Website Sections

### 1. Hero Section
| Field | Type | Notes |
|---|---|---|
| Main heading | Text | School name or tagline |
| Subheading | Text | Secondary message |
| Background image | Image upload | Carousel (up to 5 images) |
| CTA button text | Text | e.g. "Admissions Open" |
| CTA button link | URL | |

### 2. About Section
| Field | Type | Notes |
|---|---|---|
| About heading | Text | |
| About description | Rich text | |
| About image | Image upload | |
| Principal name | Text | |
| Principal message | Rich text | |
| Principal photo | Image upload | |
| Established year | Text | |

### 3. Stats Section
| Field | Type | Notes |
|---|---|---|
| Stat 1 number | Number | e.g. 1200 |
| Stat 1 label | Text | e.g. Students |
| Stat 2 number | Number | e.g. 80 |
| Stat 2 label | Text | e.g. Teachers |
| Stat 3 number | Number | e.g. 25 |
| Stat 3 label | Text | e.g. Years of Excellence |
| Stat 4 number | Number | e.g. 95 |
| Stat 4 label | Text | e.g. Pass Rate % |

### 4. Facilities Section
| Field | Type | Notes |
|---|---|---|
| Facility name | Text | e.g. Science Lab |
| Facility description | Text | Short description |
| Facility icon/image | Image upload | |
| (repeatable — up to 12) | | |

### 5. Faculty Section
| Field | Type | Notes |
|---|---|---|
| Faculty name | Text | |
| Designation | Text | e.g. Mathematics Teacher |
| Photo | Image upload | |
| Qualification | Text | |
| Experience | Text | e.g. 10 years |
| (repeatable — unlimited) | | |

### 6. Gallery Section
| Field | Type | Notes |
|---|---|---|
| Image | Image upload | |
| Caption | Text | Optional |
| Category | Text | e.g. Sports, Events, Classrooms |
| (repeatable — unlimited) | | |

### 7. Notice Board Section
| Field | Type | Notes |
|---|---|---|
| Notice title | Text | |
| Notice description | Text | |
| Date | Date | |
| Attachment | PDF upload | Optional |
| Is active | Toggle | Show/hide notice |
| (repeatable — unlimited) | | |

### 8. Testimonials Section
| Field | Type | Notes |
|---|---|---|
| Parent/student name | Text | |
| Quote | Text | |
| Photo | Image upload | Optional |
| Relation | Text | e.g. Parent of Class 5 student |
| (repeatable — unlimited) | | |

### 9. Contact Section
| Field | Type | Notes |
|---|---|---|
| Address | Text | |
| Phone number(s) | Text | |
| Email | Text | |
| Google Maps embed URL | URL | |
| WhatsApp number | Text | Optional |

### 10. Footer Section
| Field | Type | Notes |
|---|---|---|
| School logo | Image upload | |
| School tagline | Text | |
| Quick links | Auto-generated | From section headings |
| Social media links | URLs | Facebook, Instagram, YouTube |
| Copyright text | Text | |

---

## 8. Admin Panel Features

### Dashboard
- Welcome message with school name
- Quick stats: total faculty, gallery images, active notices
- Last updated timestamp per section

### Per Section Pages
- Each section has its own admin page
- Form fields match the section schema exactly
- Image upload with preview
- Save button with success/error feedback
- Changes reflect on live site immediately after save

### Settings Page
- School name
- School logo
- Template selection (view only — contact Syed Websites to change)
- Admin password change
- SEO: meta title, meta description, favicon

### Authentication
- Simple email + password login
- One admin account per school
- JWT token based session
- Auto logout after inactivity

---

## 9. Database Schema

### schools
```sql
CREATE TABLE schools (
  id              INT PRIMARY KEY AUTO_INCREMENT,
  name            VARCHAR(200),
  domain          VARCHAR(200) UNIQUE,   -- school.com
  template        VARCHAR(50),           -- template_one / template_two
  is_active       BOOLEAN DEFAULT TRUE,
  created_at      TIMESTAMP DEFAULT NOW()
);
```

### admin_users
```sql
CREATE TABLE admin_users (
  id          INT PRIMARY KEY AUTO_INCREMENT,
  school_id   INT REFERENCES schools(id),
  email       VARCHAR(200),
  password    VARCHAR(255),             -- hashed
  created_at  TIMESTAMP DEFAULT NOW()
);
```

### hero_content
```sql
CREATE TABLE hero_content (
  id           INT PRIMARY KEY AUTO_INCREMENT,
  school_id    INT REFERENCES schools(id),
  heading      VARCHAR(255),
  subheading   VARCHAR(255),
  cta_text     VARCHAR(100),
  cta_link     VARCHAR(500),
  updated_at   TIMESTAMP
);
```

### hero_slides
```sql
CREATE TABLE hero_slides (
  id          INT PRIMARY KEY AUTO_INCREMENT,
  school_id   INT REFERENCES schools(id),
  image_path  VARCHAR(500),
  sort_order  INT DEFAULT 0
);
```

### about_content
```sql
CREATE TABLE about_content (
  id                  INT PRIMARY KEY AUTO_INCREMENT,
  school_id           INT REFERENCES schools(id),
  heading             VARCHAR(255),
  description         TEXT,
  image_path          VARCHAR(500),
  principal_name      VARCHAR(200),
  principal_message   TEXT,
  principal_photo     VARCHAR(500),
  established_year    VARCHAR(10),
  updated_at          TIMESTAMP
);
```

### stats
```sql
CREATE TABLE stats (
  id          INT PRIMARY KEY AUTO_INCREMENT,
  school_id   INT REFERENCES schools(id),
  number      VARCHAR(50),
  label       VARCHAR(100),
  sort_order  INT DEFAULT 0
);
```

### facilities
```sql
CREATE TABLE facilities (
  id           INT PRIMARY KEY AUTO_INCREMENT,
  school_id    INT REFERENCES schools(id),
  name         VARCHAR(200),
  description  TEXT,
  image_path   VARCHAR(500),
  sort_order   INT DEFAULT 0
);
```

### faculty
```sql
CREATE TABLE faculty (
  id             INT PRIMARY KEY AUTO_INCREMENT,
  school_id      INT REFERENCES schools(id),
  name           VARCHAR(200),
  designation    VARCHAR(200),
  qualification  VARCHAR(200),
  experience     VARCHAR(100),
  photo_path     VARCHAR(500),
  sort_order     INT DEFAULT 0
);
```

### gallery_images
```sql
CREATE TABLE gallery_images (
  id          INT PRIMARY KEY AUTO_INCREMENT,
  school_id   INT REFERENCES schools(id),
  image_path  VARCHAR(500),
  caption     VARCHAR(255),
  category    VARCHAR(100),
  sort_order  INT DEFAULT 0
);
```

### notices
```sql
CREATE TABLE notices (
  id              INT PRIMARY KEY AUTO_INCREMENT,
  school_id       INT REFERENCES schools(id),
  title           VARCHAR(255),
  description     TEXT,
  notice_date     DATE,
  attachment_path VARCHAR(500),
  is_active       BOOLEAN DEFAULT TRUE,
  created_at      TIMESTAMP DEFAULT NOW()
);
```

### testimonials
```sql
CREATE TABLE testimonials (
  id          INT PRIMARY KEY AUTO_INCREMENT,
  school_id   INT REFERENCES schools(id),
  name        VARCHAR(200),
  quote       TEXT,
  photo_path  VARCHAR(500),
  relation    VARCHAR(200),
  sort_order  INT DEFAULT 0
);
```

### contact_info
```sql
CREATE TABLE contact_info (
  id            INT PRIMARY KEY AUTO_INCREMENT,
  school_id     INT REFERENCES schools(id),
  address       TEXT,
  phone         VARCHAR(200),
  email         VARCHAR(200),
  maps_url      TEXT,
  whatsapp      VARCHAR(20),
  updated_at    TIMESTAMP
);
```

### school_settings
```sql
CREATE TABLE school_settings (
  id               INT PRIMARY KEY AUTO_INCREMENT,
  school_id        INT REFERENCES schools(id),
  logo_path        VARCHAR(500),
  favicon_path     VARCHAR(500),
  tagline          VARCHAR(255),
  meta_title       VARCHAR(255),
  meta_description TEXT,
  facebook_url     VARCHAR(500),
  instagram_url    VARCHAR(500),
  youtube_url      VARCHAR(500),
  copyright_text   VARCHAR(255),
  updated_at       TIMESTAMP
);
```

---

## 10. API Routes

### Public (Nuxt fetches these to render website)

```
GET  /api/school                    School basic info + template
GET  /api/school/hero               Hero content + slides
GET  /api/school/about              About content
GET  /api/school/stats              Stats list
GET  /api/school/facilities         Facilities list
GET  /api/school/faculty            Faculty list
GET  /api/school/gallery            Gallery images
GET  /api/school/notices            Active notices
GET  /api/school/testimonials       Testimonials list
GET  /api/school/contact            Contact info
GET  /api/school/settings           SEO + footer + social links
```

> All public routes are domain-aware. Laravel middleware detects the school from the request domain automatically.

### Admin (authenticated)

```
POST /api/admin/login

PUT  /api/admin/hero
POST /api/admin/hero/slides
DELETE /api/admin/hero/slides/:id

PUT  /api/admin/about
PUT  /api/admin/stats
POST /api/admin/stats
DELETE /api/admin/stats/:id

PUT  /api/admin/facilities/:id
POST /api/admin/facilities
DELETE /api/admin/facilities/:id

PUT  /api/admin/faculty/:id
POST /api/admin/faculty
DELETE /api/admin/faculty/:id

POST /api/admin/gallery
DELETE /api/admin/gallery/:id

POST /api/admin/notices
PUT  /api/admin/notices/:id
DELETE /api/admin/notices/:id

PUT  /api/admin/testimonials/:id
POST /api/admin/testimonials
DELETE /api/admin/testimonials/:id

PUT  /api/admin/contact
PUT  /api/admin/settings

POST /api/admin/upload             Single image/file upload
```

---

## 11. Template System

Each school picks one template at onboarding. Templates share the same section components but differ in:

- Color scheme
- Font pairing
- Section layout style
- Hero style (full screen / split / carousel)
- Card design for faculty, facilities
- Navigation style

### Template Structure (Nuxt)

```
templates/
├── TemplateOne/
│   ├── Layout.vue
│   ├── Hero.vue
│   ├── About.vue
│   ├── Stats.vue
│   ├── Facilities.vue
│   ├── Faculty.vue
│   ├── Gallery.vue
│   ├── NoticeBoard.vue
│   ├── Testimonials.vue
│   ├── Contact.vue
│   └── Footer.vue
├── TemplateTwo/
│   └── (same structure, different design)
└── TemplateThree/
    └── (same structure, different design)
```

### Template Selection Logic (Nuxt)

```js
// composables/useTemplate.js
const template = school.template  // 'template_one' / 'template_two'
const components = await import(`~/templates/${template}/`)
```

---

## 12. Domain & Hosting Model

Each school gets their own custom domain (e.g. `greenvalleyschool.com`).

### How It Works

```
1. School purchases domain (they manage DNS)
2. Syed Websites points domain to server
3. Domain is registered in schools table
4. Laravel IdentifySchool middleware reads request host
5. All API queries are scoped to that school_id
6. Nuxt fetches school-specific content and renders site
```

### DNS Setup per School

```
A Record:  @  →  YOUR_SERVER_IP
CNAME:     www → school.com
```

### Nginx Config per School (or wildcard)

```nginx
server {
    server_name greenvalleyschool.com www.greenvalleyschool.com;
    # proxy to Nuxt + Laravel
}
```

> Long term: use a wildcard SSL + single Nginx config to serve all schools without adding per-school server blocks.

---

## 13. Environment Variables

### Backend (Laravel)

```env
APP_NAME=SchoolPlatform
APP_URL=https://api.yourdomain.com
DB_CONNECTION=mysql
DB_HOST=
DB_PORT=3306
DB_DATABASE=school_platform
DB_USERNAME=
DB_PASSWORD=
FILESYSTEM_DISK=local
JWT_SECRET=
```

### Frontend (Nuxt)

```env
NUXT_PUBLIC_API_BASE=https://api.yourdomain.com
```

---

## 14. Build Order

### Phase 1 — Backend Foundation
```
[ ] 1. Laravel project setup
[ ] 2. MySQL database + all migrations
[ ] 3. IdentifySchool middleware (domain detection)
[ ] 4. Seed one test school record
[ ] 5. All public API routes returning dummy data
[ ] 6. Admin auth (login + JWT)
[ ] 7. Image upload endpoint
```

### Phase 2 — Admin Panel
```
[ ] 8. Nuxt admin project setup
[ ] 9. Login page
[ ] 10. Dashboard page
[ ] 11. Hero editor (text + image upload + slides)
[ ] 12. About editor
[ ] 13. Stats editor (add/edit/delete)
[ ] 14. Facilities editor
[ ] 15. Faculty editor
[ ] 16. Gallery manager
[ ] 17. Notice board manager
[ ] 18. Testimonials editor
[ ] 19. Contact editor
[ ] 20. Settings page (logo, SEO, social links)
```

### Phase 3 — Public Website
```
[ ] 21. Nuxt frontend project setup
[ ] 22. Template One — all 10 sections
[ ] 23. Connect all sections to API data
[ ] 24. SEO meta tags per school
[ ] 25. Mobile responsive QA for all sections
[ ] 26. Template Two — all 10 sections
[ ] 27. Template Three — all 10 sections
[ ] 28. Template switching logic
```

### Phase 4 — Domain & Deployment
```
[ ] 29. VPS setup + Nginx config
[ ] 30. Deploy Laravel API
[ ] 31. Deploy Nuxt frontend (SSR)
[ ] 32. Deploy Nuxt admin panel
[ ] 33. SSL certificates
[ ] 34. Test with first real school domain
[ ] 35. Onboard test school — full content entry
[ ] 36. QA on live domain
[ ] 37. Go live
```

---

## 15. MVP Scope

### Included in MVP

- One working template (Template One)
- All 10 sections with admin editing
- Fixed layout — content editing only
- Custom domain per school
- Image and PDF upload
- Notice board with active/inactive toggle
- Mobile responsive public website
- Simple admin login
- SEO meta fields

### Deferred to Later

- Template Two and Template Three
- Multi-language support
- Online admissions form
- Fee payment integration
- Student/parent login portal
- Event calendar
- Blog / news section
- Push notifications for notices
- Analytics dashboard for school admin
- Super admin panel (Syed Websites manages all schools)

---

## Contact & Credits

**Agency:** Syed Websites  
**Contact:** 8885736702 / 9700504860  
**Stack:** Vue 3 + Nuxt + Laravel + MySQL  

---

*Internal implementation document. Layout, design, and architecture decisions are controlled by Syed Websites. School admins have content access only.*
