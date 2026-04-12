# Cubicon — Product Requirements Document (PRD)

**Version:** 1.0  
**Date:** April 2026  
**Status:** Active Development

---

## 1. Product Overview

### 1.1 Product Name
**Cubicon** — 3D Isometric Icon Generator

### 1.2 One-liner
Generate stunning 3D isometric icons from text in seconds — no design skills needed.

### 1.3 Problem Statement
Designer dan developer sering butuh icon 3D isometric berkualitas tinggi untuk UI, presentasi, atau konten. Membuat sendiri butuh skill dan waktu. Alternatif yang ada (Flaticon, Freepik) terbatas, tidak custom, dan sering tidak konsisten.

### 1.4 Solution
Web app berbasis AI yang menggenerate icon 3D isometric dari prompt teks dalam hitungan detik, dengan berbagai style, resolusi, dan opsi background.

### 1.5 Target Users
| Segmen | Pain Point |
|--------|-----------|
| UI/UX Designer | Butuh icon set konsisten tanpa buat dari scratch |
| Frontend Developer | Tidak punya skill desain tapi butuh aset visual |
| Content Creator | Perlu visual menarik untuk thumbnail / konten |
| Startup / Product Team | Butuh branding asset cepat dan murah |

---

## 2. Goals & Success Metrics

### 2.1 Business Goals
- Monetisasi via credit system (pay-per-use)
- Target break-even dalam 3 bulan
- Margin profit ~35% per transaksi

### 2.2 Key Metrics
| Metric | Target (Month 1) |
|--------|-----------------|
| Registered Users | 500 |
| Paid Conversions | 5% (25 user) |
| Revenue | Rp3.000.000+ |
| Icons Generated | 2.000+ |

---

## 3. Features & Requirements

### 3.1 Core: Icon Generation

#### Single Generate
- User input 1 prompt → generate 1 icon
- Pilih: style, resolusi, background
- Prompt Enhancer berjalan otomatis di background

#### Batch Generate
- Minimal 3 icon per batch, maksimal 10
- Input tiap icon dipisah baris baru
- Credit preview tampil sebelum generate

#### Style Options
| Style | Deskripsi |
|-------|-----------|
| Clay Pastel | Soft clay, pastel, matte, rounded |
| Realistic Dark | Dark metallic, dramatic lighting |
| Neon Flat | Flat shading, neon, dark bg |
| Matte Minimal | Monochromatic, clean, minimal |
| Glass Morphism | Translucent, frosted, light refraction |

#### Resolution & Credits
| Resolusi | Ukuran | Credit |
|----------|--------|--------|
| 1K | 1024×1024 | 1 cr |
| 2K | 2048×2048 | 2 cr |
| 4K | 4096×4096 | 3 cr |

#### Background Options
- Transparent (PNG, auto remove BG)
- Solid color (color picker)
- Gradient (2 color picker)

#### Variations ×3
- Opsional, default OFF
- Generate 3 variasi dari 1 prompt
- Credit = jumlah icon × resolusi credit × 3
- Warning credit tampil sebelum konfirmasi

#### Style Reference Upload
- Upload gambar referensi gaya
- AI meniru style dari gambar

### 3.2 Output & Download
- Remove background: `@imgly/background-removal` (client-side)
- Download single: PNG
- Download batch: ZIP file
- Share to Explore: toggle public/private

### 3.3 Gallery & History
- **Personal Dashboard**: semua history generate, bisa download ulang
- **Public Explore**: showcase icon dari semua user, filter by style/category/resolution

### 3.4 Credit System
- Free tier: 2 icon 1K saat signup (tidak berulang)
- Free tier restrictions: no batch, no variation, 1K only
- Credit tidak expired
- Real-time credit display di navbar

### 3.5 Payment (Mayar.id)
- Produk: Membership / Digital Download
- Fee dibebankan ke customer (Opsi A)
- Channel: QRIS, E-Wallet, VA, Kartu Kredit, Minimarket

| Paket | Credit | Harga |
|-------|--------|-------|
| Starter | 30 cr | Rp39.000 |
| Basic | 100 cr | Rp129.000 |
| Pro | 300 cr | Rp399.000 |
| Studio | 1.000 cr | Rp1.299.000 |

### 3.6 Auth
- Email/Password + Google OAuth (Supabase)
- Post-signup: welcome modal "2 free icons!" → redirect /app
- Welcome email otomatis via Supabase

---

## 4. Pages

| Page | Route | Prioritas |
|------|-------|-----------|
| Home | `/` | P0 |
| Generate | `/app` | P0 |
| Login | `/login` | P0 |
| Signup | `/signup` | P0 |
| Dashboard | `/dashboard` | P0 |
| Pricing | `/pricing` | P1 |
| Explore | `/explore` | P1 |
| Features | `/features` | P2 |
| Contact | `/contact` | P2 |
| Privacy Policy | `/privacy` | P2 |
| Terms of Service | `/terms` | P2 |

---

## 5. Design System

### 5.1 UI Theme
**Neo-Brutalism** — border hitam tebal, shadow offset, clean, bold.

### 5.2 Typography
| Role | Font | Weight |
|------|------|--------|
| Logo | Syne | 800 |
| H1 / Display | Syne | 700 |
| H2 / H3 | Syne | 600 |
| Body | Epilogue | 400 |
| Caption / Label | Epilogue | 500 |

### 5.3 Color Palette — Electric Blue
| Role | Hex |
|------|-----|
| Background | `#F5F7FF` |
| Primary Accent | `#3B5BDB` |
| Text | `#1A1A1A` |
| Border | `#000000` |
| Secondary | `#E8EDFF` |

---

## 6. Tech Stack

| Layer | Teknologi |
|-------|-----------|
| Frontend | React + Vite |
| Styling | Tailwind CSS |
| Animation | GSAP |
| AI Image | Gemini (`gemini-3.1-flash-image-preview`) |
| API Security | Vercel Edge Function |
| Auth + DB | Supabase |
| Image Storage | Cloudinary |
| Remove BG | `@imgly/background-removal` |
| Payment | Mayar.id |
| Deployment | Vercel |

---

## 7. Non-Functional Requirements

| Requirement | Target |
|-------------|--------|
| Generate speed | < 15 detik per icon |
| Uptime | 99%+ |
| Mobile responsive | Yes (tablet + mobile) |
| Free tier abuse prevention | Rate limit via Supabase RLS |

---

## 8. Out of Scope (v1)

- Edit & Regenerate (ditunda ke v2)
- API access untuk developer
- Team / Organization plan
- Custom style training

---

## 9. Risks

| Risk | Mitigasi |
|------|----------|
| Gemini API down | Error handling + retry UI |
| Credit abuse free tier | RLS Supabase + server-side validation |
| Mayar.id webhook gagal | Logging + manual top-up fallback |
| Remove BG lambat di HP low-end | Progressive UI + loading state |
