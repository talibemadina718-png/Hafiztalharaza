# Hafiz Talha Raza Attari — Master Portfolio, Online Quran Academy & Private Admin Portal

A production-grade, self-contained personal portfolio and online Quran teaching academy website for **Hafiz Talha Raza Attari** (Hafiz-e-Quran, Dars-e-Nizami Scholar, Graphic Designer, Computer Course & AI Graduate), modeled on the dark luxury aesthetic of [**Zain Ali Digital**](https://zainalidigital.com/).

---

## 🌟 Visual Benchmark: Zain Ali Digital Aesthetics

- **Color Palette:** Deep obsidian/carbon black (`#060606`, `#0f0f0f`), dark graphite cards (`#141414`), refined metallic gold accents (`#D4AF37`, `#F5D77E`, `#B8942E`), soft ivory typography, and accessible muted gray.
- **Hero Presentation:** Features an animated rotating gold stroke ring framing the profile portrait. The portrait area is kept clean with **no overlaid text or clutter**.
- **Hero Typography:** Metallic gold gradient name, uppercase letter-spaced role, and an animated headline cycling through core educational strengths.
- **Honest Trust Indicators:** Non-numeric, genuine descriptors (*1-on-1 Personal Classes*, *100% Tajweed Focus*, *3 Days Free Trial*, *Flexible Global Timings*), avoiding inflated statistics.
- **Full Zero-Horizontal-Scroll Mobile Optimization:** Built with responsive fluid units, auto-wrapping flex containers, and scaled media queries tested across 320px, 360px, 375px, 390px, 414px, 430px, and larger viewports.

---

## 🔒 Security Architecture & Admin Privacy

In strict accordance with enterprise privacy standards:
1. **Public Website (`index.html`):** Displays only published content. All admin buttons, editor drawers, and editing controls have been **completely removed** from the public-facing view. Unauthorized visitors see only the polished website.
2. **Private Admin Portal (`admin.html`):** Accessible exclusively through the private authenticated admin interface:
   - **Login Authentication Screen:** Requires Username and Password (`admin` / `admin@talha2026` by default).
   - **Session Token Management:** Validates administrative session state in `sessionStorage`.
   - **Admin Credential Manager:** Allows the administrator to change username and master password securely.
   - **Content & Media Editor:** Live customization of hero text, bio, profile portrait, contact WhatsApp, email, gold accent color, and border radius.
   - **Data Backup & Restore:** Export and import full website configurations in JSON format.
   - **Published Synchronization:** Saved changes automatically sync to the public site via shared persistence key.
   - **Secure Logout:** Terminates the admin session immediately.
3. **Production Backend Configurations (`server-config.md`):** Complete server-side authentication implementations for deployment with Node.js/Express (HTTP-only cookies & bcrypt), PHP 8+ sessions, Nginx reverse proxy HTTP Basic Auth, and Apache `.htaccess`.

---

## 🚀 Key Modules & Implemented Features

### 1. Four-Language Interface Engine
A dictionary-driven translation system (not a simple font swap) supporting:
1. **English** (`en` - LTR, Google Fonts Poppins / Inter)
2. **اردو** (`ur` - RTL, Google Fonts Noto Nastaliq Urdu)
3. **Roman Urdu** (`ro-ur` - LTR, Google Fonts Poppins / Inter)
4. **العربية** (`ar` - RTL, Google Fonts Amiri Quran)

Switching languages immediately updates navigation, hero headings, about biography, 5 qualification cards, courses & outcomes, portfolio labels, admission form fields, error messages, and testimonials.

### 2. Complete Sections
- **Header & Navigation:** Sticky blur navigation with active section highlighting, 4-language switcher, compact mobile branding, and mobile drawer menu.
- **Hero Section:** "Hafiz Talha Raza Attari", multidisciplinary professional, primary CTA: "Book a Free Demo Class", secondary CTA: "Explore My Portfolio", direct WhatsApp contact.
- **About Me:** Polished biography covering Quran memorization, Dars-e-Nizami Alim course, graphic design & AI tools integration, and child-friendly teaching philosophy.
- **5 Education & Qualification Cards:**
  1. *Hifz-e-Quran* — Completed
  2. *Dars-e-Nizami (Alim Course)* — Ongoing
  3. *Graphic Designing Course* — Completed
  4. *Computer Application Course* — Completed
  5. *AI Course Graduate* — Completed
- **Online Quran Academy:** Structured cards for *Online Madani Qaida*, *Nazra Quran with Tajweed*, and *Islamic Studies & Masnoon Duas* with 3-day free trial demo hooks.
- **Graphic Design Portfolio:** Filterable gallery (*All*, *Islamic Typography*, *Social Media Posts*, *Brand & Logo Design*, *Educational Slides*) with an image lightbox preview modal.
- **Facebook-Style Student Reviews (8 Cards):** Modeled on Facebook comment threads across English, Urdu, and Roman Urdu with user avatars, verified badges, reaction counts, and interactive Like buttons.
- **Student Admission Form (The 7 Exact Required Fields):**
  1. `Student Name`
  2. `Father Name`
  3. `Age`
  4. `Qualification`
  5. `Contact Number / WhatsApp`
  6. `Address & City / Country`
  7. `Date Of Birth`
  *(Plus Selected Course & Preferred Timing)*
  - Client-side validation
  - Auto-formats a registration slip and dispatches directly to WhatsApp (**`+92 312 6571673`**)
  - Shows an on-screen **Admission Receipt Slip Modal** with print capability.
  - Transparent privacy notice.
- **Contact Channels & Footer:** Direct WhatsApp (`03126571673`), Email (`hafiztalharazaattari@gmail.com`), Facebook and Instagram placeholder URLs, and Back-to-Top action.

---

## 📁 File Structure

```text
c:\Users\IT POINT\Desktop\Gemini prompt\
├── index.html                  # Public production website (zero admin UI, responsive)
├── admin.html                  # Private authenticated Admin Portal & Customizer
├── server-config.md            # Production server authentication (Node, PHP, Nginx, Apache)
├── README.md                   # Project documentation & operational guide
└── assets/
    └── images/
        ├── talha-hero.jpg      # Active Hero Portrait (Green Turban)
        └── talha-profile.jpg   # Secondary Portrait (Black Kurta & Turban)
```

---

## 💻 How to Run & Test

1. **Public Website:**
   - Double-click `index.html` or open in any modern browser.
   - Notice that the public view has **no editor button** or editing drawer.
   - Resize your browser or open DevTools Device Toolbar (320px, 360px, 375px, 390px, 430px) to verify **zero horizontal scroll**.
2. **Admin Portal:**
   - Open `admin.html` in your browser.
   - Log in with default credentials:
     - **Username:** `admin`
     - **Password:** `admin@talha2026`
   - Test changing the hero name, bio, profile photo, or accent color.
   - Click **"Publish All Changes to Website"**.
   - Reopen `index.html` to observe your published changes applied instantly.
