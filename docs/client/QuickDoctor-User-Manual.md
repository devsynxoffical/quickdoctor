# QuickDoctor — Complete User Manual

**Platform:** https://quickdoctor.ie  
**Version:** 1.0 · July 2026  
**Audience:** Patients, Doctors, Administrators, and Platform Owners

---

## Table of Contents

1. [Introduction](#1-introduction)
2. [Getting Started](#2-getting-started)
3. [Patient Guide](#3-patient-guide)
4. [Doctor Guide](#4-doctor-guide)
5. [Administrator Guide](#5-administrator-guide)
6. [Public Website & Marketing Pages](#6-public-website--marketing-pages)
7. [Payments & Pricing](#7-payments--pricing)
8. [Video Consultations](#8-video-consultations)
9. [Prescriptions (Online)](#9-prescriptions-online)
10. [Medical Certificates](#10-medical-certificates)
11. [Email Notifications](#11-email-notifications)
12. [Timezone & Scheduling](#12-timezone--scheduling)
13. [Refunds & Cancellations](#13-refunds--cancellations)
14. [Privacy, GDPR & Account Settings](#14-privacy-gdpr--account-settings)
15. [Maintenance Mode & CMS](#15-maintenance-mode--cms)
16. [Demo Accounts](#16-demo-accounts)
17. [Troubleshooting](#17-troubleshooting)
18. [URL Quick Reference](#18-url-quick-reference)

---

## 1. Introduction

### 1.1 What is QuickDoctor?

QuickDoctor is an online healthcare platform that connects patients in Ireland with Irish-registered GPs for:

- **Video consultations** — live appointments with booking and secure payment
- **Online prescription reviews** — condition-specific questionnaires reviewed by a GP (from €25)
- **Medical certificates** — sick leave / fit notes reviewed and issued online (€30)
- **Medical records** — prescriptions and certificates stored in the patient portal with PDF download

All consultations and reviews are conducted with the same confidentiality as face-to-face care. Doctors who write prescriptions live and work in Ireland.

### 1.2 Who can use the service?

The service is available to people **physically located in the Republic of Ireland**. Patients must be **18 or older** unless otherwise stated on a specific service page.

### 1.3 User roles

| Role | Login URL | Purpose |
|------|-----------|---------|
| **Patient** | `/login` → `/dashboard` | Book care, pay, view records |
| **Doctor** | `/login` → `/doctor` | Consultations, prescriptions, certificates |
| **Administrator** | `/login` → `/admin` | Manage platform, users, content, settings |

---

## 2. Getting Started

### 2.1 System requirements

- Modern web browser (Chrome, Safari, Firefox, Edge)
- Stable internet connection
- For video calls: webcam and microphone; join link opens 5 minutes before appointment
- Email address for account verification and notifications

### 2.2 Creating a patient account

**URL:** https://quickdoctor.ie/register

**Step-by-step:**

1. Open **Create patient account** (or Register from the login page).
2. Enter **first name**, **last name**, **date of birth**, **email**, and **password** (minimum 8 characters).
3. Click **Send code** next to your email field.
4. Check your inbox for a **6-digit verification code** (valid for 10 minutes).
5. Enter the code in the **Verification code** field.
6. Click **Create account**.
7. You are signed in automatically and redirected to your dashboard (or back to booking if you came from a booking link).

**Welcome email:** After registration, you receive a welcome email with links to find a doctor and your patient dashboard.

**Booking intent:** If you registered while trying to book, the site returns you to complete your booking after signup.

### 2.3 Signing in

**URL:** https://quickdoctor.ie/login

1. Enter your **email** and **password**.
2. Click **Sign in**.
3. You are redirected by role:
   - **Patient** → `/dashboard`
   - **Doctor** → `/doctor` (or pending-approval screen if not yet approved)
   - **Admin** → `/admin`

### 2.4 Forgot password

**URL:** https://quickdoctor.ie/forgot-password

1. Enter your registered email.
2. Click submit — if an account exists, a **reset link** is emailed (valid 1 hour).
3. Open the link → `/reset-password` → enter new password (min 8 characters).
4. Sign in with your new password.

### 2.5 Becoming a doctor on the platform

**URL:** https://quickdoctor.ie/doctor/apply

Doctors apply separately from patients. See [Section 4.1](#41-doctor-registration--application).

---

## 3. Patient Guide

### 3.1 Patient dashboard overview

**URL:** https://quickdoctor.ie/dashboard

After login, patients see:

- **Overview** — upcoming appointment summary, quick actions
- **Appointments** — all bookings and payment status
- **Medical records** — prescriptions and certificates
- **Settings** — profile, data export, account deactivation

**Sidebar navigation:**

| Menu item | URL | Description |
|-----------|-----|-------------|
| Overview | `/dashboard` | Home dashboard |
| Appointments | `/dashboard/appointments` | Bookings & video join |
| Medical records | `/dashboard/records` | Prescriptions & certificates |
| Settings | `/dashboard/settings` | Account & privacy |

### 3.2 Finding and booking a GP (video consultation)

This is the primary flow for **live video appointments**.

#### Step 1 — Browse doctors

**URL:** https://quickdoctor.ie/doctors

- View list of **approved** doctors with specialty, fee, and ratings.
- Click a doctor to open their profile.

#### Step 2 — Doctor profile & slot selection

**URL:** https://quickdoctor.ie/doctors/{doctor-id}

1. Read doctor bio, specialty, and consultation fee (set by each doctor, typically around €49).
2. Select a **date** from the calendar (only days the doctor has availability are bookable).
3. Choose an available **time slot** (15-minute intervals).
4. All times are shown in **Poland time (CET/CEST)** — see [Section 12](#12-timezone--scheduling).
5. Optionally add **notes** for the doctor (symptoms, reason for visit).
6. Optionally enter a **coupon code** and click apply to see discounted price.

#### Step 3 — Payment

1. Click **Book & pay** (or equivalent checkout button).
2. You must be **signed in as a patient**.
3. You are redirected to **Stripe Checkout** (secure card payment).
4. Complete payment on Stripe’s page.

#### Step 4 — Confirmation

- After successful payment, you return to **Appointments** (`/dashboard/appointments`).
- You receive a **confirmation email** with:
  - Doctor name
  - Date and time (Poland time)
  - Appointment reference
  - Fee paid
  - **Join video consultation** link (when Zoom is configured)
  - Meeting password (if applicable)
- The appointment status becomes **CONFIRMED**.

#### Step 5 — Joining the video call

1. Go to **Dashboard → Appointments**.
2. Open the appointment — **Join** becomes available **5 minutes before** the scheduled time.
3. Alternatively use `/dashboard/video-call/{appointment-id}`.
4. Click **Join** — opens Zoom (or dev placeholder in test environments).

#### Cancelling unpaid bookings

- Appointments in **PENDING_PAYMENT** expire after **15 minutes** if not paid.
- You can cancel pending bookings from the appointments page.

#### Reviews

After a **completed** consultation, you may leave a **star rating and comment** from your appointments list.

### 3.3 Online prescription services (€25)

For conditions listed under **Prescriptions** — no live video required for the initial request; a GP reviews your questionnaire asynchronously.

#### Available services (examples)

Access from https://quickdoctor.ie/prescriptions:

- Contraceptive pill / patch / ring
- Period delay, cystitis, thrush, BV
- Migraine, asthma, hay fever, eczema, acne, rosacea
- Erectile dysfunction, hair loss, stop smoking
- Travel vaccines, HPV, weight management, and more

Each service has its own page with clinical questions and eligibility criteria.

#### Prescription request flow

1. **Choose service** on `/prescriptions` or from the navbar dropdown.
2. **Start questionnaire** on the condition page (e.g. `/prescriptions/migraine-treatment`).
3. Answer all steps honestly (suitability, medical history, medications, consent).
4. Click **Submit** on the final step.
5. You are sent to **Secure checkout** (`/prescriptions/checkout`).
6. **Sign in** as a patient if not already logged in.
7. Review price (**€25.00** standard) and click **Pay** → Stripe Checkout.
8. After payment:
   - Confirmation email sent
   - Request assigned to a GP for review (usually within **1 business day**)
9. If medically suitable, doctor **issues prescription** in the portal.
10. You receive email notification → view and **download PDF** at **Medical records** (`/dashboard/records`).
11. Take the prescription to any **Irish pharmacy** to collect medication (QuickDoctor is not a pharmacy).

**Refund:** Full refund if the doctor determines you are not medically suitable. See [Section 13](#13-refunds--cancellations).

### 3.4 Medical certificates (€30)

**URL:** https://quickdoctor.ie/medical-certificates

For employer sick leave documentation (electronic certificate — not for Department of Social Protection).

#### Certificate request flow

1. **Step 1 — Form:**
   - Personal details (name, address, email, phone)
   - Acknowledgement (18+, requesting for yourself, not emergency care)
   - Symptom screening (red-flag symptoms — seek urgent care if applicable)
   - Absence type (Work / Study)
   - Reason for sick leave
   - Illness timeline description
   - **From** and **To** dates (max **7 days** per request)
2. Click **Continue to Payment**.
3. **Step 2 — Payment:**
   - Review total **€30.00**
   - Sign in if required
   - Pay via **Stripe**
4. GP reviews your request (typically within **1 business day**).
5. If approved, certificate issued → email + download from **Medical records**.

**Important:** This electronic sick leave cert is for employers; for Social Protection purposes, visit a GP in person (stated on the page).

### 3.5 Medical records

**URL:** https://quickdoctor.ie/dashboard/records

**Tabs:**

- **Prescriptions** — medication name, dosage, instructions, issuing doctor, date; **Download PDF**
- **Sick certificates** — reason, date range, doctor; **Download PDF**

PDFs are professionally branded QuickDoctor documents suitable for printing or sharing.

### 3.6 Patient settings

**URL:** https://quickdoctor.ie/dashboard/settings

- View profile information
- **Export my data** (GDPR JSON export)
- **Deactivate account** (with email confirmation)
- Privacy consent records

### 3.7 Notifications

Patients receive:

- **In-app notifications** (bell icon in dashboard)
- **Email** for bookings, prescriptions, certificates, and service confirmations

See [Section 11](#11-email-notifications).

---

## 4. Doctor Guide

### 4.1 Doctor registration & application

**URL:** https://quickdoctor.ie/doctor/apply

**Required information:**

- Email and password
- First and last name
- **Specialty category** (from admin-managed list)
- **Medical license number**
- Bio and years of experience (optional fields may apply)

**After submission:**

- Account created with status **PENDING**
- You can sign in at `/doctor` but full portal access waits for **admin approval**
- Check status at `/doctor/apply/status`

**Admin actions:**

- **Approve** → you receive approval email; account activated
- **Reject** → rejection email with reason; contact support or re-apply

### 4.2 Doctor portal overview

**URL:** https://quickdoctor.ie/doctor

**Sidebar:**

| Section | URL | Purpose |
|---------|-----|---------|
| Overview | `/doctor` | Dashboard summary |
| Consultations | `/doctor/consultations` | All appointments |
| Prescriptions | `/doctor/prescriptions` | Issued prescriptions list |
| Certificates | `/doctor/certificates` | Issued certificates list |
| Schedule | `/doctor/settings` | Availability (redirects to settings) |
| Settings | `/doctor/settings` | Profile, fee, weekly hours |

### 4.3 Profile & availability settings

**URL:** https://quickdoctor.ie/doctor/settings

**Profile:**

- First name, last name, bio
- Medical license number
- **Consultation fee** (in EUR cents — e.g. 4900 = €49.00)

**Weekly availability:**

- Enable/disable each day (**Monday–Sunday**)
- Set **start time**, **end time**, and **slot length** (default 15 minutes)
- Patients can only book on enabled days within these hours
- Times use **Poland time (CET/CEST)**

**Important:** Profile must be marked complete and availability set before patients can book you on the public directory.

### 4.4 Consultations list

**URL:** https://quickdoctor.ie/doctor/consultations

View all appointments assigned to you:

- Video consultations (confirmed/completed)
- Async **prescription review** requests (paid questionnaire)
- Async **medical certificate** requests (paid form)

Filter by status and open any row for details.

### 4.5 Consultation room (core clinical workspace)

**URL:** https://quickdoctor.ie/doctor/consultations/room?id={appointment-id}

This is where doctors manage each patient encounter.

**Patient panel shows:**

- Patient name, date of birth, gender
- Patient notes from booking
- **Questionnaire answers** (for prescription/certificate async requests) — JSON summary
- Whether prescription/certificate already issued

**Tabs:**

#### Notes

- Write and save **clinical notes** (visible to you; stored on appointment)
- Click **Save notes**

#### Prescription

- Add one or more medicines: **name**, **dosage**, **instructions**
- **Issue prescription** (or update if already issued)
- Patient notified by email and in-app alert
- Download **Rx PDF** preview

#### Certificate

- Enter **reason**, **start date**, **end date**
- **Issue certificate** (or update)
- Patient notified; PDF available in their records

**Complete consultation:**

- Mark appointment **completed** when finished
- For video calls, use **Start meeting** / host Zoom link from the room or `/doctor/video-call/room?id=`

### 4.6 Video consultations (doctor)

**URL:** https://quickdoctor.ie/doctor/video-call/room?id={appointment-id}

- Join as **host** via Zoom link (when Zoom credentials configured on server)
- Your name is passed to Zoom for patient identification
- Join available around scheduled time (5 minutes before for patients)

### 4.7 Prescriptions & certificates lists

- **Prescriptions:** `/doctor/prescriptions` — table of all prescriptions you issued with patient names and dates; PDF download
- **Certificates:** `/doctor/certificates` — same for medical certificates

---

## 5. Administrator Guide

**URL:** https://quickdoctor.ie/admin

Administrators manage the entire platform. Sign in with an admin account.

### 5.1 Admin dashboard

**URL:** `/admin`

- Total patients, doctors, appointments, revenue statistics
- Recent user registrations table
- Quick platform health overview

### 5.2 Doctor applications

**URL:** `/admin/applications`

**Workflow:**

1. Filter by **PENDING**, **APPROVED**, or **REJECTED**
2. Open an application to review license, specialty, bio
3. **Approve** — activates doctor account; approval email sent automatically
4. **Reject** — enter reason; rejection email sent

### 5.3 All doctors

**URL:** `/admin/doctors`

Read-only table: name, email, specialty, status (PENDING/APPROVED/REJECTED/SUSPENDED), consultation fee.

### 5.4 All patients

**URL:** `/admin/patients`

Read-only table: patient name, email, phone, registration date.

### 5.5 Specialty categories

**URL:** `/admin/categories`

- Create and manage specialty categories (e.g. General Practice, Dermatology)
- Used when doctors apply and on public doctor listings

### 5.6 Appointments

**URL:** `/admin/appointments`

- View **all** appointments across the platform
- **Manually create** a confirmed appointment:
  - Select patient, doctor, date/time
  - Useful for phone bookings or support cases
  - Bypasses Stripe (admin-created = confirmed)

### 5.7 Payments

**URL:** `/admin/payments`

- List recent payment records
- Amount, status (PENDING, SUCCEEDED, FAILED, REFUNDED), linked appointment

### 5.8 Coupons

**URL:** `/admin/coupons`

Create promotional discount codes:

| Field | Description |
|-------|-------------|
| Code | e.g. WELCOME10 |
| Type | **PERCENT** or **FIXED** (euro amount) |
| Value | Percentage or cents off |
| Min order | Optional minimum spend |
| Max uses | Optional usage cap |
| Expiry | Optional end date |
| Active | Enable/disable |

Patients enter codes during **video booking checkout** or **service checkout**. 100% discount codes complete booking without Stripe (if under minimum thresholds).

### 5.9 Financial reports

**URL:** `/admin/analytics`

- Revenue and appointment analytics
- Recent payments summary

### 5.10 System settings & maintenance mode

**URL:** `/admin/settings`

**Maintenance mode:**

- **Enable** — public marketing site shows maintenance message; new bookings blocked for patients
- **Custom message** — text shown to visitors
- **Admin bypass** — admins can still browse site when enabled
- Bypass paths always work: `/login`, `/register`, `/dashboard`, `/doctor`, `/admin`

Use during deployments or emergencies.

**Links** to coupons, CMS, and categories from this page.

### 5.11 Site content (CMS)

**URL:** `/admin/cms`

Manage all marketing and legal page content without code changes.

**Capabilities:**

- **Sync all pages** — creates CMS entries from built-in page registry
- Edit any page: Home, About, FAQs, each prescription landing page, consultation pages, legal pages
- **Section types:** Hero, Text, FAQ, Call-to-action, Features, Stats, HTML blocks, etc.
- **Publish / Draft** status per page
- **SEO** title and description
- **Blog posts** — type `BLOG_POST`; appear on `/blog` and `/p/{slug}`

**Note:** `/admin/blog` in the sidebar is a placeholder UI; manage real blog content in **Site content (CMS)**.

### 5.12 Admin workflow summary

| Task | Where |
|------|-------|
| Approve new doctor | Applications |
| Change site homepage text | CMS → Home |
| Add blog article | CMS → New BLOG_POST |
| Create discount code | Coupons |
| Put site in maintenance | Settings |
| Book appointment for patient | Appointments → Create |
| View revenue | Analytics / Dashboard |

---

## 6. Public Website & Marketing Pages

### 6.1 Main navigation

| Link | URL |
|------|-----|
| Home | `/` |
| Consultations | `/consultation` (+ female/male/Portuguese/Spanish sub-pages) |
| Medical Certificates | `/medical-certificates` |
| Prescriptions | `/prescriptions` (+ 27 condition pages) |
| Find a GP | `/doctors` |
| For doctors | `/doctor/apply` |
| Contact | `/contact` |
| Book appointment | `/doctors` |

### 6.2 Legal & information pages

| Page | URL |
|------|-----|
| Patient Guide | `/patient-guide` |
| FAQs | `/faqs` |
| Terms of Service | `/terms` |
| Privacy Policy | `/privacy` |
| Cookie Policy | `/cookies` |
| Refund Policy | `/refund-policy` |
| Blog | `/blog` |

### 6.3 Contact

**URL:** `/contact` — contact information and inquiry display (operational handling outside the app).

---

## 7. Payments & Pricing

### 7.1 Payment provider

All card payments are processed by **Stripe** (PCI-compliant). QuickDoctor does not store full card numbers.

### 7.2 Price list

| Service | Price | How to access |
|---------|-------|---------------|
| Video consultation | **Doctor sets fee** (default ~€49) | `/doctors/{id}` |
| Prescription review | **€25.00** | `/prescriptions/*` → checkout |
| Medical certificate | **€30.00** | `/medical-certificates` |
| Coupon discounts | Variable | Applied at checkout |

### 7.3 Payment flow (all types)

1. Patient authenticated (patient role)
2. Order created with status **PENDING_PAYMENT**
3. Redirect to Stripe Checkout
4. On success → webhook confirms payment → appointment **CONFIRMED**
5. Confirmation emails sent
6. For video: Zoom meeting created automatically (when configured)

### 7.4 Slot holds (video only)

- Unpaid video bookings hold the slot for **15 minutes**
- After 15 minutes, hold expires and slot becomes available again
- Slots are only **reserved after payment succeeds** (not at checkout start)

### 7.5 Failed / conflict payments

If two patients pay for the same slot simultaneously, the second payment is **automatically refunded** via Stripe and the appointment cancelled, with an explanatory message.

---

## 8. Video Consultations

### 8.1 Technology

- **Zoom** integration (when `ZOOM_*` credentials configured on server)
- Patient receives **join URL**; doctor receives **host URL**
- Optional meeting password in confirmation email

### 8.2 Before the call

- Test camera/microphone
- Join from a private, quiet location
- Join link active **5 minutes before** scheduled time
- Use **Dashboard → Appointments** or email link

### 8.3 During the call

- Doctor may take clinical notes in consultation room
- Doctor may issue prescription or certificate during or after the call

### 8.4 After the call

- Doctor marks consultation **completed**
- Patient can leave a **review**
- Documents available in medical records

### 8.5 Concurrent meetings

Default Zoom Pro allows **one concurrent meeting** per Zoom account. For multiple simultaneous doctors, Zoom Business + concurrent meeting add-on is required.

---

## 9. Prescriptions (Online)

### 9.1 What is included

- GP clinical review of your questionnaire
- Prescription issued to your account if medically appropriate
- PDF download for pharmacy

### 9.2 What is not included

- Dispensing medication (visit a pharmacy)
- Controlled drugs where online prescribing is not appropriate (each page lists exclusions)
- Emergency or urgent care

### 9.3 Clinical responsibility

All prescribing decisions are made by an **Irish-registered doctor** after reviewing your answers. False or incomplete information may result in refusal and refund per policy.

### 9.4 Full prescription service list

See `/prescriptions` for the live list. Includes but not limited to:

Contraception, period delay, thrush, BV, cystitis, migraine, asthma, hay fever, eczema, acne, rosacea, cold sores, psoriasis, erectile dysfunction, hair loss, stop smoking, hypothyroidism, HPV vaccine, travel vaccines, jet lag, weight management, self-injectable, anaphylaxis, and more.

---

## 10. Medical Certificates

### 10.1 Use cases

- Employer-requested sick leave documentation
- Up to **7 consecutive days** per request
- Work or study absence

### 10.2 Safety screening

The form asks about serious symptoms (chest pain, stroke symptoms, etc.). If you have these, **do not use this service** — seek urgent/emergency care.

### 10.3 Delivery

- Email notification when ready
- PDF in patient medical records
- Tamper-evident branded PDF format

### 10.4 Limitations

- Not for Department of Social Protection claims
- Not a replacement for emergency assessment
- Subject to GP approval; refund if unable to help

---

## 11. Email Notifications

| Event | Recipient | Content |
|-------|-----------|---------|
| Registration OTP | Patient | 6-digit code |
| Welcome | New patient | Dashboard & find doctor links |
| Password reset | User | Reset link (1 hour) |
| Video booking confirmed | Patient | Time, doctor, fee, Zoom link |
| New booking | Doctor | Patient name, time, host link |
| Prescription issued | Patient | Medications summary, records link |
| Certificate issued | Patient | Dates, reason, records link |
| Prescription request paid | Patient | Review in progress |
| Certificate request paid | Patient | Review in progress |
| New service request | Doctor | Questionnaire to review |
| Doctor approved | Doctor | Portal link |
| Doctor rejected | Doctor | Reason |

**Email provider:** Resend (from `noreply@quickdoctor.ie` when configured).

---

## 12. Timezone & Scheduling

- **All appointment times** display as **Poland time (CET/CEST)** — `Europe/Warsaw`
- Booking calendars, confirmation emails, and dashboards use this consistently
- Ireland and Poland share the same CET/CEST offset year-round in practice for patient display
- Server scheduling uses Warsaw timezone for slot generation

---

## 13. Refunds & Cancellations

### 13.1 Policy summary (patient-facing)

Documented on `/refund-policy`, `/patient-guide`, and `/terms`:

| Situation | Outcome |
|-----------|---------|
| Cancel within **3 hours** of purchase (or next working-day window) | Refund to original card (1–10 working days) |
| Doctor deems treatment **unsafe/unsuitable** | **Full refund** or safe alternative |
| Prescription **already issued** after cancellation period | No refund |
| Patient fails to provide requested info within **3 days** | No refund |
| Video format unsuitable | Refund + advise local GP |
| Slot conflict after payment (technical) | **Automatic refund** |

### 13.2 In-app cancellation

- **Unpaid** appointments: cancel from appointments page or wait for 15-minute expiry
- **Paid** refunds for policy cases: contact support (no self-service refund button in app)

### 13.3 Marketing guarantee

“**Full refund if our doctors cannot help**” — shown on prescription and certificate pages.

---

## 14. Privacy, GDPR & Account Settings

- **Privacy policy:** `/privacy`
- **Cookies:** `/cookies`
- **Patient data export:** Dashboard → Settings → Export my data (JSON)
- **Account deactivation:** Settings → Deactivate (confirmation required)
- **Consent records** stored for regulatory compliance
- Doctor–patient confidentiality applies to all online consultations

---

## 15. Maintenance Mode & CMS

### 15.1 Maintenance mode

When enabled by admin:

- Public visitors see maintenance message
- Patients cannot start new checkouts
- Admins (and optionally bypass) can still access portals
- Use during upgrades or incidents

### 15.2 CMS content management

Admins edit site content at `/admin/cms` without developer involvement:

- Homepage hero, features, stats
- Service landing pages
- Legal text updates
- Blog posts

**Sync registry** button ensures new pages from software updates appear in CMS.

---

## 16. Demo Accounts

For training and UAT (change passwords in production):

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@quickdoctor.com | password123 |
| Doctor | doctor@quickdoctor.com | password123 |
| Patient | patient@quickdoctor.com | password123 |

**Seed data includes:** Dr. Sarah Johnson (approved GP, €49, Mon–Fri 9–17), sample appointments, specialty categories, and homepage CMS content.

---

## 17. Troubleshooting

### Cannot receive OTP email

- Check spam folder
- Verify `RESEND_API_KEY` and DNS on server (admin/dev)
- Click **Resend** on register page (new 10-minute code)

### Payment succeeded but appointment not confirmed

- Wait 30 seconds and refresh appointments page
- Check email for confirmation
- Admin: verify Stripe webhook endpoint `/api/webhooks/stripe`

### Cannot join video call

- Join only within **5 minutes before** start time
- Verify Zoom credentials on server
- Try different browser; allow camera/microphone

### No available slots

- Doctor may not have enabled that day in settings
- Slot may be taken — try another time
- Unpaid holds expire after 15 minutes

### Doctor not visible on Find a GP

- Doctor must be **APPROVED**, **profile complete**, and have **availability** set

### Prescription page says “Request submitted” without payment

- Ensure latest site version deployed (`service-checkout` feature)
- Must complete **Stripe checkout** at `/prescriptions/checkout`

### Wrong time on appointment

- All times are **Poland (CET/CEST)** — not device local time if different

---

## 18. URL Quick Reference

### Public

| URL | Purpose |
|-----|---------|
| https://quickdoctor.ie | Home |
| /doctors | Find a GP |
| /doctors/{id} | Book doctor |
| /prescriptions | Prescription services |
| /prescriptions/checkout | Pay for Rx request |
| /medical-certificates | Certificate request |
| /register | Patient signup |
| /login | Sign in |

### Patient portal

| URL | Purpose |
|-----|---------|
| /dashboard | Overview |
| /dashboard/appointments | Appointments |
| /dashboard/records | Prescriptions & certs |
| /dashboard/settings | Account |
| /dashboard/video-call/{id} | Video join |

### Doctor portal

| URL | Purpose |
|-----|---------|
| /doctor | Dashboard |
| /doctor/consultations | List |
| /doctor/consultations/room?id= | Clinical room |
| /doctor/settings | Profile & hours |
| /doctor/apply | Apply |

### Admin portal

| URL | Purpose |
|-----|---------|
| /admin | Dashboard |
| /admin/applications | Doctor approvals |
| /admin/appointments | All appointments |
| /admin/coupons | Promo codes |
| /admin/cms | Site content |
| /admin/settings | Maintenance |

### API health (technical)

| URL | Purpose |
|-----|---------|
| https://quickdoctor.ie/api/health | API & integration status |

---

## Document control

| Field | Value |
|-------|-------|
| Product | QuickDoctor.ie |
| Document | End-user manual |
| Version | 1.0 |
| Date | July 2026 |
| Support | Contact via /contact or your platform administrator |

---

*End of document*
