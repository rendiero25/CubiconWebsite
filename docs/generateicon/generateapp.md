# Update: Sistem Generate Icon — Cubicon

Instruksi ini untuk mengupdate sistem generate icon di halaman generateapp.

---

## 🔀 2 Mode Generate

Tambahkan toggle di atas area input untuk memilih mode:

| Mode | Keterangan |
|------|-----------|
| 🎨 **Preset** | User pilih style + angle + ketik nama objek |
| ✏️ **Free Prompt** | User tulis prompt bebas, tanpa pilih style atau angle |

---

## 🎨 Mode 1 — Preset

### Style (6 Pilihan)

| Key | Label |
|-----|-------|
| `clay_pastel` | 🏺 Clay Pastel |
| `studio_float` | 📸 Studio Float |
| `frosted_glass` | 🧊 Frosted Glass |
| `obsidian` | ⚫ Obsidian |
| `holographic` | 🌈 Holographic |
| `soft_render` | 🎯 Soft Render |

### Angle (5 Pilihan)

| Key | Label |
|-----|-------|
| `isometric` | Isometric |
| `front_34` | Front 3/4 |
| `top_down` | Top-Down |
| `cinematic` | Cinematic |
| `floating_sym` | Floating Symmetrical |

### Prompt Input
- User ketik nama objek saja, contoh: `"shopping cart"`, `"coffee cup"`
- Sistem handle sisanya lewat `generatePrompt()`

---

## ✏️ Mode 2 — Free Prompt

- Sembunyikan style selector dan angle selector
- Tampilkan hanya text area besar
- User tulis prompt bebas apapun
- Sistem append suffix force 3D icon otomatis lewat `generateFreePrompt()`

---

## 🖼️ Style Reference Upload

- Tersedia di **kedua mode** sebagai opsi opsional (collapsed by default)
- Jika user upload gambar → `hasStyleRef = true` → suffix append otomatis ke prompt
- Suffix: `", closely matching the visual style of the uploaded reference image"`

---

## ⚙️ Fungsi Prompt — Gunakan File `promptMaster.js`

```js
import { generatePrompt, generateFreePrompt } from './promptMaster.js'

// Mode Preset
const prompt = generatePrompt(userInput, style, angle, hasStyleRef)

// Mode Free Prompt
const prompt = generateFreePrompt(userCustomPrompt, hasStyleRef)
```

Kedua fungsi return **single line string** siap dikirim ke Gemini API.

---

## 💳 Sistem Credit

Credit dipotong berdasarkan **resolusi**, bukan mode atau style.

| Resolusi | Credit |
|----------|--------|
| 1K (1024×1024) | 1 cr |
| 2K (2048×2048) | 2 cr |
| 4K (4096×4096) | 3 cr |

**Batch:** `jumlah icon × credit per resolusi`

**Variation ×3:** `hasil di atas × 3`

### Aturan Credit di UI
- Credit summary selalu tampil sebelum tombol Generate
- Contoh: *"This will use 2 credits · You have 28 remaining"*
- Setelah generate: animasi angka berkurang (GSAP)
- Jika credit habis → modal "You're out of credits" + CTA upgrade
- Free tier: hanya 1K, 2 icon total, no batch, no variation

---

## 🔁 Variation ×3

- Tersedia di confirm modal sebelum generate (default OFF)
- Berlaku di **kedua mode**
- Prompt tidak diubah — fungsi generate dipanggil 3x dengan prompt yang sama
- Tampilkan warning credit sebelum user konfirmasi

---

## 🚨 Edge Cases

| Kondisi | UI Response |
|---------|-------------|
| Credit habis | Modal upgrade |
| Prompt kosong | Shake animation + inline error |
| Batch < 3 icon | Warning minimum 3 |
| Generate gagal | Error toast + "Try Again" |
| Free user pilih 2K/4K | Lock modal + CTA upgrade |