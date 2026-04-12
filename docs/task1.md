# Cubicon — Task 1: Project Setup & Preparation

**Phase:** 0 — Pre-Development  
**Goal:** Semua akun, API key, dan boilerplate siap sebelum nulis kode fitur

---

## 🛠️ Bagian A — Akun & Services yang Perlu Disiapkan

### A1. Supabase (Auth + Database)
**URL:** https://supabase.com

**Steps:**
1. Buat akun (gratis)
2. Create new project → catat:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
3. Enable Google OAuth:
   - Dashboard → Authentication → Providers → Google → Enable
   - Butuh Google Cloud Console OAuth credentials (lihat A2)
4. Buat tabel (nanti di Task 2, tapi siapkan akun dulu)

---

### A2. Google Cloud Console (OAuth untuk Supabase)
**URL:** https://console.cloud.google.com

**Steps:**
1. Buat project baru (atau pakai yang ada)
2. APIs & Services → Credentials → Create OAuth 2.0 Client ID
3. Application type: **Web application**
4. Authorized redirect URIs:
   ```
   https://<your-project>.supabase.co/auth/v1/callback
   ```
5. Catat:
   - `Client ID`
   - `Client Secret`
6. Paste ke Supabase → Authentication → Providers → Google

---

### A3. Google AI Studio (Gemini API)
**URL:** https://aistudio.google.com

**Steps:**
1. Login dengan Google account
2. Get API Key → catat:
   - `GEMINI_API_KEY`
3. Model yang dipakai: `gemini-3.1-flash-image-preview` (Nano Banana 2)
4. Cek quota & billing di: https://ai.google.dev/gemini-api/docs/pricing
   - Set budget alert di Google Cloud agar tidak jebol

> ⚠️ **Penting:** API key ini JANGAN diekspos ke frontend. Harus lewat Vercel Edge Function.

---

### A4. Cloudinary (Image Storage)
**URL:** https://cloudinary.com

**Steps:**
1. Buat akun gratis (25GB storage + 25GB bandwidth)
2. Dashboard → Settings → catat:
   - `CLOUDINARY_CLOUD_NAME`
   - `CLOUDINARY_API_KEY`
   - `CLOUDINARY_API_SECRET`
3. Buat folder: `cubicon/icons`
4. Set default delivery: Auto format + Auto quality

---

### A5. Vercel (Deployment + Edge Functions)
**URL:** https://vercel.com

**Steps:**
1. Buat akun (gratis, login via GitHub)
2. Nanti saat deploy: connect ke GitHub repo Cubicon
3. Edge Function akan dipakai untuk:
   - Proxy request ke Gemini API (hide API key)
   - Upload ke Cloudinary (hide credentials)

---

### A6. Mayar.id (Payment Gateway)
**URL:** https://mayar.id

**Steps:**
1. Daftar akun seller (gratis — paket Starter)
2. Lengkapi data bisnis / KTP untuk verifikasi
3. Buat produk untuk tiap paket:
   - Starter — Rp39.000 (30 credit)
   - Basic — Rp129.000 (100 credit)
   - Pro — Rp399.000 (300 credit)
   - Studio — Rp1.299.000 (1000 credit)
4. Aktifkan: **"Fee dibebankan ke customer (Opsi A)"**
5. Catat webhook URL → akan diisi setelah deploy ke Vercel
6. Catat:
   - `MAYAR_API_KEY`
   - Webhook secret

---

### A7. GitHub
**Steps:**
1. Buat repo baru: `cubicon` (private dulu)
2. Ini jadi source of truth — connect ke Vercel nanti

---

## 💻 Bagian B — Local Environment Setup

### B1. Requirement Tools
Pastikan sudah terinstall:

```bash
# Check versions
node --version    # Butuh v18+
npm --version     # Butuh v9+
git --version
```

Install jika belum ada:
- Node.js: https://nodejs.org (LTS version)
- Git: https://git-scm.com

---

### B2. Init Project React + Vite

```bash
npm create vite@latest cubicon -- --template react
cd cubicon
npm install
```

---

### B3. Install Dependencies

```bash
# Styling
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p

# Routing
npm install react-router-dom

# Animation
npm install gsap

# Supabase client
npm install @supabase/supabase-js

# Background removal
npm install @imgly/background-removal

# Icons (opsional, untuk UI)
npm install lucide-react

# ZIP untuk batch download
npm install jszip

# Utility
npm install clsx
```

---

### B4. Setup Tailwind CSS

Edit `tailwind.config.js`:
```js
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'electric-blue': '#3B5BDB',
        'light-blue': '#E8EDFF',
        'off-white': '#F5F7FF',
        'near-black': '#1A1A1A',
      },
      fontFamily: {
        display: ['Syne', 'sans-serif'],
        body: ['Epilogue', 'sans-serif'],
      },
      boxShadow: {
        'brutal': '4px 4px 0px #000000',
        'brutal-lg': '6px 6px 0px #000000',
        'brutal-sm': '2px 2px 0px #000000',
      },
    },
  },
  plugins: [],
}
```

Edit `src/index.css`:
```css
@import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=Epilogue:wght@400;500;600&display=swap');

@tailwind base;
@tailwind components;
@tailwind utilities;

:root {
  --font-display: 'Syne', sans-serif;
  --font-body: 'Epilogue', sans-serif;
  --color-bg: #F5F7FF;
  --color-primary: #3B5BDB;
  --color-text: #1A1A1A;
  --color-border: #000000;
  --color-secondary: #E8EDFF;
}

body {
  background-color: var(--color-bg);
  font-family: var(--font-body);
  color: var(--color-text);
}
```

---

### B5. Setup Environment Variables

Buat file `.env.local` di root project:
```env
# Supabase
VITE_SUPABASE_URL=https://xxxx.supabase.co
VITE_SUPABASE_ANON_KEY=xxxx

# Cloudinary (public — untuk upload dari client, pakai unsigned preset)
VITE_CLOUDINARY_CLOUD_NAME=xxxx
VITE_CLOUDINARY_UPLOAD_PRESET=cubicon_unsigned

# Vercel Edge Function base URL (isi setelah deploy)
VITE_API_BASE_URL=http://localhost:3000

# --- SERVER SIDE ONLY (untuk Vercel Edge Functions, bukan VITE_) ---
GEMINI_API_KEY=xxxx
CLOUDINARY_API_KEY=xxxx
CLOUDINARY_API_SECRET=xxxx
MAYAR_API_KEY=xxxx
MAYAR_WEBHOOK_SECRET=xxxx
```

> ⚠️ Tambahkan `.env.local` ke `.gitignore` — jangan pernah commit file ini!

---

### B6. Setup Folder Structure

```
cubicon/
├── public/
│   └── favicon.ico
├── src/
│   ├── api/              # Supabase client, fetch wrappers
│   ├── components/       # Reusable UI components
│   │   ├── ui/           # Button, Input, Modal, Badge, dll
│   │   └── layout/       # Navbar, Footer
│   ├── hooks/            # Custom React hooks
│   ├── pages/            # Page components (Home, App, Pricing, dll)
│   ├── stores/           # State management (Context / Zustand)
│   ├── utils/            # Helper functions
│   ├── styles/           # Global CSS
│   ├── App.jsx
│   └── main.jsx
├── api/                  # Vercel Edge Functions
│   ├── generate.js       # Proxy ke Gemini API
│   └── upload.js         # Upload ke Cloudinary
├── .env.local
├── .gitignore
├── tailwind.config.js
├── vite.config.js
└── package.json
```

---

### B7. Setup React Router

Edit `src/App.jsx`:
```jsx
import { BrowserRouter, Routes, Route } from 'react-router-dom'

// Pages (buat file kosong dulu)
import Home from './pages/Home'
import GenerateApp from './pages/GenerateApp'
import Login from './pages/Login'
import Signup from './pages/Signup'
import Dashboard from './pages/Dashboard'
import Pricing from './pages/Pricing'
import Explore from './pages/Explore'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/app" element={<GenerateApp />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/pricing" element={<Pricing />} />
        <Route path="/explore" element={<Explore />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
```

---

### B8. Setup Supabase Client

Buat `src/api/supabase.js`:
```js
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseKey)
```

---

### B9. Vercel CLI (untuk test Edge Functions lokal)

```bash
npm install -g vercel

# Login
vercel login

# Link ke project (nanti setelah buat repo)
vercel link

# Jalankan lokal dengan Edge Functions
vercel dev
```

---

### B10. Git Init & First Commit

```bash
git init
git add .
git commit -m "chore: initial project setup"

# Push ke GitHub
git remote add origin https://github.com/USERNAME/cubicon.git
git branch -M main
git push -u origin main
```

---

## ✅ Checklist Sebelum Lanjut ke Task 2

Centang semua sebelum mulai coding fitur:

### Akun & API Keys
- [x] Supabase project dibuat + URL & anon key dicatat
- [x] Google OAuth credentials dibuat + dipasang di Supabase
- [x] Gemini API key didapat dari AI Studio
- [x] Cloudinary akun dibuat + cloud name & upload preset dicatat
- [ ] Vercel akun dibuat + CLI terinstall
- [ ] Mayar.id akun terdaftar (verifikasi mungkin butuh 1-2 hari)
- [ ] GitHub repo dibuat

### Local Setup
- [ ] Node.js v18+ terinstall
- [ ] Project React + Vite berhasil dibuat
- [ ] Semua npm dependencies terinstall
- [ ] Tailwind terkonfigurasi dengan warna + font Cubicon
- [x] `.env.local` sudah diisi dengan semua keys
- [ ] Folder structure sudah dibuat
- [ ] React Router sudah setup + semua route terdaftar
- [x] Supabase client sudah dibuat
- [ ] Vercel CLI terinstall + linked ke repo
- [ ] `npm run dev` berjalan tanpa error
- [ ] First commit sudah di-push ke GitHub

---

## 📋 Urutan Task Selanjutnya

| Task | Isi |
|------|-----|
| **Task 2** | Database schema Supabase (tabel users, credits, icons) + RLS |
| **Task 3** | Auth pages — Login, Signup, Google OAuth |
| **Task 4** | Navbar + Layout + Design System components |
| **Task 5** | Home / Landing page |
| **Task 6** | Generate page `/app` — Left panel (input) |
| **Task 7** | Vercel Edge Function — Gemini API proxy |
| **Task 8** | Generate page — Right panel (preview + hasil) |
| **Task 9** | Credit system (deduction, display, modal) |
| **Task 10** | Dashboard + History |
| **Task 11** | Explore / Public gallery |
| **Task 12** | Pricing page + Mayar.id integration |
| **Task 13** | Remove background + ZIP download |
| **Task 14** | Remaining pages (Features, Contact, Legal) |
| **Task 15** | Testing, polish, deploy production |
