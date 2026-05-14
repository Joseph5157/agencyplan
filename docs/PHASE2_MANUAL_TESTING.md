## Phase 2 Manual Browser Testing Guide

### 1. Start XAMPP MySQL
1. Open **XAMPP Control Panel**.
2. Click **Start** for `MySQL`.
3. Confirm status turns green.

### 2. Start Laravel backend
From `backend/`:
1. Ensure `.env` is configured (DB + JWT).
2. Run migrations/seed if needed:
   - `C:\xampp\php\php.exe artisan migrate --seed`
3. Start server:
   - `C:\xampp\php\php.exe artisan serve`
4. Keep this terminal running.

### 3. Start Nuxt admin
From `admin/`:
1. Set API base env if needed:
   - PowerShell: `$env:NUXT_PUBLIC_API_BASE="http://127.0.0.1:8000/api"`
2. Start admin:
   - `npm run dev`
3. Open the shown local URL (usually `http://localhost:3000`).

### 4. Correct backend API base URL
Use:
- `http://127.0.0.1:8000/api`  
(or `http://localhost:8000/api` if your backend runs there)

---

## Test flows

### 5. Login test
1. Open `/login`.
2. Enter valid admin email/password.
3. Expect redirect to `/dashboard`.
4. Enter invalid password once and verify error message appears.

### 6. Dashboard test
1. Open `/dashboard`.
2. Verify:
   - welcome header
   - stat cards load (faculty, gallery, active notices)
   - quick links exist for all editors.
3. Open `/dashboard` in logged-out state and confirm redirect to `/login`.

### 7. One test per admin editor page

- **Hero (`/hero`)**: change heading + CTA, save, refresh, confirm persisted.
- **About (`/about`)**: edit heading/description, save, refresh.
- **Stats (`/stats`)**: add one stat, edit one stat, delete one stat.
- **Facilities (`/facilities`)**: add facility with description, save.
- **Faculty (`/faculty`)**: add faculty member with designation, save.
- **Gallery (`/gallery`)**: upload image, add record with caption, verify grid card.
- **Notices (`/notices`)**: add notice, then edit title and save.
- **Testimonials (`/testimonials`)**: add testimonial with quote, save.
- **Contact (`/contact`)**: update address/phone/email, save.
- **Settings (`/settings`)**: update tagline/meta fields, save. Confirm template is read-only.

### 8. Upload test steps
Test from pages using upload:
- Hero slide upload
- About image/principal photo
- Facilities image
- Faculty photo
- Gallery image
- Notices PDF
- Testimonials photo
- Settings logo/favicon

For each:
1. Upload file.
2. Confirm success message.
3. Confirm preview/link appears.
4. Save relevant record.
5. Refresh and verify it remains.

### 9. Notice active/inactive test
1. In `/notices`, add one notice with `Active = true`.
2. Add one notice with `Active = false`.
3. Verify **both** appear in admin notice list.
4. Toggle one and save.
5. Public endpoint check (optional, browser/Postman): `GET /api/school/notices` should show only active notices.

### 10. Logout test
1. Click `Logout` in admin header.
2. Confirm redirect to `/login`.
3. Try opening `/dashboard` directly; should redirect back to `/login`.

---

## Common errors and fixes

- **401 Unauthorized on pages**
  - Token missing/expired. Log out/in again.
- **CORS/network error**
  - Verify admin API base is `http://127.0.0.1:8000/api`.
  - Ensure Laravel server is running.
- **DB connection error in backend**
  - Confirm XAMPP MySQL is running and `.env` DB settings are correct.
- **Upload fails**
  - For notices use PDF only.
  - Other sections require image file types.
- **Login fails for valid user**
  - Confirm seeded/admin account exists for that school domain context.
- **Route not found**
  - Ensure latest backend code is running and server restarted after route changes.
