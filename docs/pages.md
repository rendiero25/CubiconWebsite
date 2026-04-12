# Cubicon — Page Structure Recap

## 🎨 Design System
- **UI Theme:** Neo-Brutalism
- **Font Logo & Heading:** Syne (ExtraBold 800 / Bold 700 / SemiBold 600)
- **Font Body:** Epilogue (Regular 400 / Medium 500)
- **Stack:** React + Vite, Tailwind, GSAP, Supabase

### Typography
```css
@import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=Epilogue:wght@400;500;600&display=swap');

:root {
  --font-display: 'Syne', sans-serif;
  --font-body: 'Epilogue', sans-serif;
}
```

| Role | Font | Weight |
|------|------|--------|
| Logo | Syne | ExtraBold 800 |
| H1 / Display | Syne | Bold 700 |
| H2 / H3 | Syne | SemiBold 600 |
| Body / Paragraph | Epilogue | Regular 400 |
| Caption / Label | Epilogue | Medium 500 |

### Color Palette — Electric Blue
| Role | Color | Hex |
|------|-------|-----|
| Background | Off-white | `#F5F7FF` |
| Primary Accent | Electric Blue | `#3B5BDB` |
| Text | Near Black | `#1A1A1A` |
| Border | Black | `#000000` |
| Secondary | Light Blue | `#E8EDFF` |

---

## 📄 Pages Overview

| Page | Route | Keterangan |
|------|-------|------------|
| Home | `/` | Landing page utama |
| Generate | `/app` | Core app generator |
| Features | `/features` | Fitur lengkap |
| Explore | `/explore` | Public gallery komunitas |
| Pricing | `/pricing` | Paket & harga |
| Contact | `/contact` | Form kontak |
| Dashboard | `/dashboard` | Member area |
| Login | `/login` | Auth |
| Signup | `/signup` | Auth + 2 free icon 1K |
| Privacy Policy | `/privacy` | Legal |
| Terms of Service | `/terms` | Legal |

---

## 🏠 Home (`/`)

### 1. Navbar
- Logo **cubicon**
- Nav links: Generate · Features · Pricing · Explore
- CTA Button: **"Start Free"**

### 2. Hero Section — Interactive
- Headline bold & punchy, langsung ke pain point
- Subheadline 1-2 kalimat
- **Mini Prompt Bar** — User ketik nama icon langsung di hero, klik "Generate", redirect ke /app dengan prompt terisi otomatis
- CTA Secondary: "See Examples" → scroll ke Explore section
- Visual: Animated 3D isometric icon showcase

### 3. How It Works (3 Steps)
1. **Describe** — Ketik icon yang kamu mau
2. **Generate** — AI render dalam detik
3. **Download** — Export PNG transparan, siap pakai

### 4. Explore / Gallery Preview
- Grid showcase hasil icon komunitas
- Filter by category (App, Finance, Nature, Tech, dll)
- Hover: tampil tombol "Generate Similar"

### 5. Pricing Section
- 4 tier: Starter · Basic · Pro · Studio
- Badge **"Most Popular"** di Pro
- CTA per tier

### 6. FAQ
- Apa itu credit?
- Format file apa saja?
- Bisa remove background?
- Apakah bisa refund?

### 7. Footer
- Logo **cubicon** + tagline
- Links: Generate · Features · Pricing · Explore
- Contact: Email / link form kontak
- Privacy Policy · Terms of Service
- Social media icons

---

## ⚡ Generate (`/app`)

### Layout Overview
```
┌─────────────────────────────────────────────┐
│ Navbar (logo + credit badge + dashboard)    │
├───────────────────┬─────────────────────────┤
│                   │                         │
│   LEFT PANEL      │     RIGHT PANEL         │
│   (Input)         │     (Preview)           │
│                   │                         │
└───────────────────┴─────────────────────────┘
```

### 📝 Left Panel — Input (Step by Step)

**Step 1 — Mode Selector**
- Pill toggle: **`Single`** · **`Batch`**

**Step 2 — Prompt Input**
- Single: 1 text field — *"Describe your icon..."*
- Batch: Text area — tiap baris = 1 icon, counter "3/10 icons"
- Placeholder: *"Shopping cart", "Cloud storage", "Analytics dashboard"*

**Step 3 — Icon Style**
- Pill selector horizontal dengan preview thumbnail kecil:
  - 🏺 Clay Pastel
  - 🖤 Realistic Dark
  - 🌈 Neon Flat
  - 🤍 Matte Minimal
  - 🔮 Glass Morphism
- Klik style → preview thumbnail berubah

**Step 4 — Resolution**
- 3 card: **1K · 2K · 4K** + credit cost tiap card
- Free user: 2K & 4K di-lock dengan badge 🔒

**Step 5 — Background**
- Toggle 3 opsi:
  - Transparent (PNG — auto remove BG)
  - Solid → color picker
  - Gradient → 2 color picker

**Step 6 — Style Reference** *(opsional, collapsed by default)*
- Accordion: "Upload style reference (optional)"
- Drag & drop image area saat dibuka

### 🔘 Generate Button Area
- Credit summary sebelum tombol: *"This will use **2 credits** · You have **28 remaining**"*
- Tombol besar: **"Generate Icon"**

### ✅ Confirm Modal
```
┌────────────────────────────┐
│  Ready to generate?        │
│                            │
│  📦 Shopping cart          │
│  🏺 Clay Pastel · 2K       │
│  💳 Cost: 2 credits        │
│                            │
│  ┌──────────────────────┐  │
│  │ ✨ Variations ×3      │  │
│  │              [ OFF ] │  │
│  └──────────────────────┘  │
│  *Will use 6 credits*      │
│                            │
│  [Cancel]  [Generate Now]  │
└────────────────────────────┘
```
- Variation default **OFF**, user aktifkan sendiri
- Credit update real-time saat variation di-toggle

### 🖼️ Right Panel — Preview States

| State | Tampilan |
|-------|----------|
| Empty | Ilustrasi placeholder + *"Your icon will appear here"* |
| Generating | Animated cube loading (GSAP) + *"Crafting your icon..."* |
| Result Single | Icon besar + action buttons |
| Result Batch | Grid semua icon + "Download All (.zip)" |

### ⬇️ Action Buttons (Result)

| Background Pilihan | Download | Remove BG Button |
|---|---|---|
| Transparent | PNG transparan otomatis | ❌ Tidak muncul |
| Solid | PNG dengan warna solid | ✅ Muncul sebagai opsi |
| Gradient | PNG dengan gradient | ✅ Muncul sebagai opsi |

Action buttons lain: **Regenerate** · **Share to Explore** (toggle public)

### 📊 Credit Badge (Navbar)
- Selalu visible: **⚡ 28 credits**
- Klik → dropdown: usage summary + "Buy Credits"
- Setelah generate: animasi angka berkurang (GSAP)

### 🚨 Edge Cases & Error Handling
| Kondisi | UI Response |
|---------|-------------|
| Credit habis | Modal: "You're out of credits" + CTA upgrade |
| Prompt kosong | Shake animation + inline error |
| Batch < 3 icon | Warning: "Minimum 3 icons for batch" |
| Generate gagal | Error toast + "Try Again" button |
| Free user pilih 2K/4K | Lock modal + CTA upgrade |

### Credit System
| Resolusi | Credit |
|----------|--------|
| 1K | 1 cr |
| 2K | 2 cr |
| 4K | 3 cr |

### Free Tier
- 2 icon resolusi 1K untuk user baru (signup)

---

## ✨ Features (`/features`)

### 1. Page Header
- Headline + subheadline benefit-focused

### 2. Hero Feature (WOW section)
- AI-Powered Generation — visual besar + mini prompt demo

### 3. Feature Grid (Card Neo-Brutalism)
| Feature | Deskripsi |
|---------|-----------|
| AI Generation | Generate icon dari teks dalam detik |
| 3D Isometric Style | Konsisten, clean, siap pakai |
| Multi Resolution | Export 1K / 2K / 4K |
| Remove Background | Otomatis background transparan |
| Fast Render | Hasil dalam hitungan detik |
| PNG Export | Format universal, langsung pakai |
| History | Semua generate tersimpan di dashboard |
| Credit System | Bayar sesuai kebutuhan, no subscription trap |

### 4. Before / After Comparison
- Icon flat biasa vs hasil Cubicon 3D isometric
- Visual slider atau side-by-side

### 5. Use Cases
- **UI/UX Designer** — Icon set konsisten untuk app
- **Developer** — Cepat generate tanpa desainer
- **Content Creator** — Thumbnail, presentasi, konten sosmed
- **Startup / Product Team** — Branding asset cepat

### 6. CTA Banner
- "Ready to create your first icon?" → Start Free

---

## 🌐 Explore (`/explore`)

### 1. Page Header
- Headline: "Explore icons made by the community"

### 2. Filter & Search
- Search by keyword
- Filter: Category · Resolution · Style
- Sort: Latest · Most Downloaded · Trending

### 3. Icon Gallery Grid
- Setiap card: preview icon, nama icon, avatar + username, tombol "Generate Similar"
- Hover: zoom + shadow Neo-Brutalism

### 4. Load More / Infinite Scroll

### 5. CTA Banner
- "Create your own icon" → /app

---

## 💰 Pricing (`/pricing`)

### 1. Page Header
- Headline + subheadline

### 2. Pricing Cards

| | Starter | Basic | Pro | Studio |
|--|---------|-------|-----|--------|
| **Credit** | 30 cr | 100 cr | 300 cr | 1000 cr |
| **Harga** | Rp39.000 | Rp129.000 | Rp399.000 | Rp1.299.000 |
| **Badge** | — | — | 🔥 Popular | 💎 Best Value |

### 3. Credit Calculator (Interaktif)
- User input jumlah icon yang mau dibuat
- Muncul rekomendasi tier yang paling cocok

### 4. FAQ Mini
- Credit expired?
- Bisa top-up?
- Metode pembayaran?

### 5. CTA Banner
- "Mulai gratis, upgrade kapanpun"

---

## 📬 Contact (`/contact`)

### 1. Page Header
- Headline: "Ada pertanyaan? Hubungi kami"

### 2. Contact Form
- Nama
- Email
- Subjek (dropdown: General / Billing / Bug Report / Partnership)
- Pesan
- Tombol "Kirim Pesan"

### 3. Info Kontak
- Email resmi
- Estimasi response: "We reply within 24 hours"

### 4. Social Media Links

---

## 🧑‍💼 Dashboard (`/dashboard`)

### Fitur Utama
- History generate (semua icon yang pernah dibuat)
- Credit balance & usage
- Upgrade plan
- Settings (default public/private saat generate)

### Sistem Public / Private
- Checkbox "Select All" + satuan per icon
- Toggle Public / Private per icon atau batch
- 🌐 Public → tampil di Explore
- 🔒 Private → hanya visible di dashboard sendiri
- Default bisa diatur di Settings

---

## 🔐 Auth

### UI Concept — Split Screen
- **Kiri:** Form login/signup
- **Kanan:** Animated showcase — icon 3D isometric floating & muncul satu-satu

### Neo-Brutalism Touch
- Input field border hitam tebal
- Button dengan shadow offset khas brutalism
- Shake animation saat error + border merah tebal
- Checkmark animation sebelum redirect
- Background: subtle grid pattern

### Signup (`/signup`)

**Form Fields**
- Name
- Email
- Password
- Confirm Password
- Tombol: **"Create Account — It's Free"**
- Already have account? → Login

**Auth Options**
- Email / Password
- **"Continue with Google"** (Supabase Google OAuth)

**Post-Signup Flow**
1. ✅ Account created
2. 🎉 Welcome modal — *"You got 2 free icons!"* (slight rotation, Neo-Brutalism style)
3. Redirect ke `/app`
4. 📧 Email welcome otomatis terkirim via Supabase Email

**Welcome Email**
- Subject: *"Welcome to Cubicon 🎉"*
- Konten: nama user, info 2 free icon, CTA "Start Generating"

### Login (`/login`)

**Form Fields**
- Email
- Password
- Remember me checkbox
- Forgot Password? link
- Tombol: **"Let's Create"**
- Don't have account? → Signup

**Auth Options**
- Email / Password
- **"Continue with Google"** (Supabase Google OAuth)

**Forgot Password Flow**
- Klik → slide/expand form inline (tidak pindah halaman)
- Input email → "Send Reset Link"
- Success state langsung di halaman yang sama

---

## ⚖️ Legal
- **Privacy Policy** (`/privacy`)
- **Terms of Service** (`/terms`)
