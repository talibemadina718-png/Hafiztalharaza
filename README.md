# Hafiz Talha Raza Attari — Master Portfolio, Online Quran Academy & Live Admin Editor

A production-grade, self-contained personal portfolio and online Quran teaching website for **Hafiz Talha Raza Attari** (Hafiz-e-Quran, Dars-e-Nizami Scholar, Graphic Designer, Computer Course & AI Graduate), modeled on the dark luxury aesthetic of [**Zain Ali Digital**](https://zainalidigital.com/).

---

## 🌟 Visual Benchmark: Zain Ali Digital Aesthetics

- **Color Palette:** Deep obsidian/carbon black (`#060606`, `#0f0f0f`), dark graphite cards (`#141414`), refined metallic gold accents (`#D4AF37`, `#F5D77E`, `#B8942E`), soft ivory typography, and accessible muted gray.
- **Hero Presentation:** Features an animated rotating gold stroke border (`hero-photo-ring`) framing the profile portrait. The portrait area is kept clean with **no overlaid text or clutter**.
- **Hero Typography:** Metallic gold gradient name, uppercase letter-spaced role, and an animated headline cycling through core educational strengths.
- **Honest Trust Indicators:** Non-numeric, genuine descriptors (*1-on-1 Personal Classes*, *100% Tajweed Focus*, *3 Days Free Trial*, *Flexible Global Timings*), avoiding inflated statistics.

---

## 🚀 Key Modules & Implemented Features

### 1. Four-Language Interface Engine
A dictionary-driven translation system (not a simple font swap) supporting:
1. **English** (`en` - LTR, Google Fonts Poppins / Inter)
2. **اردو** (`ur` - RTL, Google Fonts Noto Nastaliq Urdu)
3. **Roman Urdu** (`ro-ur` - LTR, Google Fonts Poppins / Inter)
4. **العربية** (`ar` - RTL, Google Fonts Amiri Quran)
Switching languages immediately updates:
- Navigation bar
- Hero headings & cycling text
- About biography & educational points
- 5 Qualification cards
- Course cards & curriculum outcomes
- Graphic design portfolio labels
- Admission form fields, error messages & privacy notice
- Footer & contact labels

### 2. Complete Sections
- **Header & Navigation:** Sticky blur navigation with active section highlighting, 4-language switcher, mobile drawer menu, and Editor Panel trigger.
- **Hero Section:** "Hafiz Talha Raza Attari", multidisciplinary professional, primary CTA: "Book a Free Demo Class", secondary CTA: "Explore My Portfolio", WhatsApp contact button.
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

### 3. Full Website Live Admin Editor Drawer
Click the **"Editor Panel"** button in the navigation bar to open the slide-out customization panel:
- **Tab 1: Content Editor:** Modify owner name, role, bio paragraph, WhatsApp number, and email. Includes an **In-line Click-to-Edit Mode** to edit headings directly on the page.
- **Tab 2: Media Manager:** Switch between the green turban portrait (`assets/images/talha-hero.jpg`), the black kurta portrait (`assets/images/talha-profile.jpg`), or enter a custom image URL.
- **Tab 3: Theme Controls:** Pick a custom gold accent color with the live color picker and adjust card corner radius.
- **Tab 4: Backup & Reset:** Export website configuration as JSON, import JSON backups, or restore factory defaults.
- All edits persist automatically in browser **`localStorage`**.

---

## 📁 File Structure

```text
c:\Users\IT POINT\Desktop\Gemini prompt\
├── index.html                  # Master self-contained production website
├── README.md                   # Documentation & instructions
└── assets/
    └── images/
        ├── talha-hero.jpg      # Active Hero Portrait (Green Turban)
        └── talha-profile.jpg   # Secondary Portrait (Black Kurta & Turban)
```

---

## 💻 How to Run the Website

Double-click `index.html` or open it with any web browser (Google Chrome, Microsoft Edge, Firefox, Safari). The site is completely self-contained with zero server configuration or build tools required.
