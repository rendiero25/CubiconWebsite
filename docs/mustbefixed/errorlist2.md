# Error List 2 — UI Issues (April 2026)

Generated from honest UI audit of the Cubicon frontend.

---

## 🔴 Kritis

### 1. Contact Form Palsu
- **File:** `src/pages/Contact.tsx:68`
- **Masalah:** Form submit mensimulasikan sukses (900ms delay) tanpa benar-benar mengirim pesan. Ada TODO yang belum dikerjakan.
- **Kode bermasalah:**
  ```ts
  // TODO: wire to Supabase or email provider
  await new Promise<void>((r) => setTimeout(r, 900))
  setSent(true) // fake success
  ```
- **Fix:** Integrasikan dengan email service (Resend, SendGrid) atau Supabase Edge Function.

### 2. Dashboard Settings Tab Kosong
- **File:** `src/pages/Dashboard.tsx:809–817`
- **Masalah:** Tab Settings hanya berisi satu tombol Sign Out. Semua pengaturan akun lainnya belum ada (stub).
- **Fix:** Lengkapi dengan pengaturan akun: ganti email, ganti password, notifikasi, hapus akun, dll. Atau gabungkan ke tab Profile.

---

## 🟠 Serius (Aksesibilitas ~40%)

### 3. Modal Tidak Ada ARIA
- **File:** Semua halaman yang menggunakan modal (GenerateApp, Login, Signup, Dashboard)
- **Masalah:** Modal tidak memiliki `role="dialog"`, `aria-modal="true"`, atau `aria-labelledby`. Screen reader tidak bisa mengidentifikasi modal.
- **Fix:** Tambahkan atribut ARIA ke semua modal wrapper.

### 4. Dashboard Tabs Tidak Semantik
- **File:** `src/pages/Dashboard.tsx`
- **Masalah:** Tab navigation tidak menggunakan `role="tablist"`, `role="tab"`, dan `aria-selected`. Tidak accessible via keyboard.
- **Fix:** Tambahkan ARIA roles dan keyboard navigation (arrow keys).

### 5. Banyak Tombol Tanpa `aria-label`
- **File:** Tersebar di seluruh halaman (GenerateApp, Explore, Dashboard, Login, Signup)
- **Masalah:** Icon-only buttons (close, download, delete, toggle) tidak punya label yang bisa dibaca screen reader.
- **Fix:** Tambahkan `aria-label` deskriptif pada setiap icon button.

### 6. Error Form Tidak Di-announce
- **File:** `src/pages/Login.tsx:46`, `src/pages/Signup.tsx:51`, `src/pages/Contact.tsx:45`
- **Masalah:** Shake animation muncul saat error, tapi tidak ada `aria-live="assertive"` sehingga screen reader tidak tahu ada error.
- **Fix:** Tambahkan `aria-live="assertive"` pada error message container.

---

## 🟡 Medium

### 7. Posisi Kartu Hero Hardcoded — Overlap di Mobile
- **File:** `src/pages/home/HeroSection.tsx:133–134`
- **Masalah:** Posisi kartu emoji menggunakan persentase hardcoded (absolute positioning). Di layar < 480px, kartu overlap dan keluar dari container.
- **Kode bermasalah:**
  ```js
  top: `${[10, 5, 45, 50, 15, 55][i]}%`,
  left: `${[5, 50, 65, 15, 30, 45][i]}%`,
  ```
- **Fix:** Sesuaikan posisi lewat CSS media query atau React state berdasarkan viewport width.

### 8. `document.body.style.overflow = 'hidden'` Agresif
- **File:** `src/pages/Explore.tsx:58`
- **Masalah:** Menonaktifkan semua scroll di seluruh halaman. Jika ada konten overflow, user tidak bisa mengaksesnya.
- **Fix:** Gunakan `overflow-hidden` pada wrapper div spesifik, bukan `document.body`.

### 9. Carousel Auto-Play Tidak Berhenti Saat User Klik
- **File:** `src/pages/home/HomeRight.tsx`
- **Masalah:** Ada 5 interval auto-play (8s, 9.5s, 8.7s, 10s, 8s) yang tidak berhenti saat user berinteraksi dengan carousel. Tidak ada indikator bahwa carousel sedang auto-rotating.
- **Fix:** Pause auto-play saat user klik/hover, resume setelah beberapa detik idle. Tambahkan indikator dot atau progress bar.

### 10. Warna Hex Hardcoded
- **File:** `src/pages/home/HeroSection.tsx` (beberapa baris)
- **Masalah:** Menggunakan `#FFC300` dan `#0A1628` langsung, bukan CSS variable atau Tailwind class.
- **Contoh:**
  ```jsx
  <Sparkles size={14} className="text-[#FFC300]" />
  ```
- **Fix:** Ganti dengan class Tailwind yang sudah terdefinisi (`text-electric-yellow`, dll.) atau gunakan CSS variable.

### 11. Google OAuth SVG Duplikat
- **File:** `src/pages/Login.tsx:134–139`, `src/pages/Signup.tsx:117–129`
- **Masalah:** Inline SVG logo Google di-copy-paste di dua tempat.
- **Fix:** Ekstrak ke komponen `<GoogleLogo />` di `src/components/ui/`.

### 12. Magic Numbers Tanpa Nama
- **File:** `src/pages/Explore.tsx:50`, `src/pages/Dashboard.tsx:13`, berbagai timeout
- **Masalah:** Angka seperti `21`, `10`, `900`, `500` tersebar tanpa nama konstanta yang bermakna.
- **Fix:** Pindahkan ke `src/utils/constants.js` dengan nama semantik (mis. `EXPLORE_PAGE_SIZE`, `CONTACT_SUBMIT_DELAY_MS`).

### 13. Tidak Ada Error Boundary
- **File:** Semua halaman (tidak ada `ErrorBoundary` wrapper)
- **Masalah:** Jika satu sub-komponen crash, seluruh halaman ikut crash tanpa pesan yang ramah user.
- **Fix:** Bungkus halaman utama dengan React Error Boundary untuk degradasi yang graceful.

---

## Ringkasan

| Kategori | Jumlah Issue |
|---|---|
| Kritis | 2 |
| Serius (Aksesibilitas) | 4 |
| Medium | 7 |
| **Total** | **13** |
