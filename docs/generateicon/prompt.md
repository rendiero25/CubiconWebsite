# Cubicon — Prompt Final & Flow
> Instruksi lengkap sistem prompt untuk implementasi di codebase.

---

## 🔀 2 MODE GENERATE

| Mode | Fungsi | Style | Angle | Prompt |
|------|--------|-------|-------|--------|
| 🎨 **Preset** | `generatePrompt()` | Wajib pilih | Wajib pilih | Nama objek |
| ✏️ **Free Prompt** | `generateFreePrompt()` | ❌ Tidak ada | ❌ Tidak ada | Bebas tulis apapun |

---

## 🎨 MODE 1 — PRESET

### ANGLE MAP (5 Pilihan)

| Key | Label UI | Injected ke Prompt |
|-----|----------|--------------------|
| `isometric` | Isometric | isometric 45-degree equal-axis angle view |
| `front_34` | Front 3/4 | front three-quarter view, slight perspective depth |
| `top_down` | Top-Down | top-down bird's eye view, looking straight down |
| `cinematic` | Cinematic | low cinematic angle, slight upward tilt, dramatic perspective |
| `floating_sym` | Floating Symmetrical | perfectly centered front-facing view, fully symmetrical |

---

### STYLE MAP (6 Pilihan)

**🏺 Clay Pastel** (`clay_pastel`)
```
A 3D icon of a {userInput}, {ANGLE},
soft clay material, pastel color palette, matte finish,
rounded puffy edges, subtle ambient occlusion,
smooth clay texture, gentle studio lighting,
pure white background, centered composition,
no text, no watermark, no shadow
```

**📸 Studio Float** (`studio_float`)
```
A photorealistic {userInput}, {ANGLE},
product photography style, soft studio lighting with
subtle key light from upper left, pure white background,
high detail surface texture, sharp focus, commercial
product shot aesthetic, 8K render quality,
square 1:1 composition, centered subject,
no text, no watermark, no humans
```

**🧊 Frosted Glass** (`frosted_glass`)
```
A 3D icon of a {userInput}, {ANGLE},
frosted matte translucent glass material,
monochromatic cool blue tones, soft embossed surface detail,
sandblasted texture, subtle inner glow,
soft ambient lighting, no harsh shadows,
pure white background, centered composition,
no text, no watermark
```

**⚫ Obsidian** (`obsidian`)
```
A 3D icon of a {userInput}, {ANGLE},
glossy jet black material, chrome silver edge highlights,
deep reflective surfaces, luxury dark tech aesthetic,
dramatic rim lighting, high contrast,
pure white background, centered composition,
no text, no watermark
```

**🌈 Holographic** (`holographic`)
```
A 3D icon of a {userInput}, {ANGLE},
iridescent holographic crystal material,
rainbow chromatic light dispersion, prismatic refraction,
translucent with multicolor light play, futuristic ethereal look,
soft dark vignette lighting, glowing edges,
pure white background, centered composition,
no text, no watermark
```

**🎯 Soft Render** (`soft_render`) — Airbnb-style
```
A 3D icon of a {userInput}, {ANGLE},
soft semi-realistic 3D render, muted natural colors,
slightly toy-like proportions, smooth clean surfaces,
diffused HDRI studio lighting, no harsh shadows,
subtle soft ground shadow, pure white background,
Blender render aesthetic, centered composition,
no text, no watermark
```

---

### Flow
```
User ketik nama objek       → userInput
User pilih style (1 dari 6) → style
User pilih angle (1 dari 5) → angle
User upload referensi?      → hasStyleRef (opsional)
          ↓
generatePrompt(userInput, style, angle, hasStyleRef)
          ↓
Final prompt → Gemini API
```

-----

## ✏️ MODE 2 — FREE PROMPT

User tulis prompt bebas apapun. **Tidak ada pilihan style atau angle.**
Sistem force output menjadi 3D icon.

### Template
```
{userCustomPrompt},
rendered as a clean 3D icon,
pure white background, centered square 1:1 composition,
no text, no watermark, no humans
```

### Fungsi
```js
generateFreePrompt(userCustomPrompt, hasStyleRef)
```

### Flow
```
User tulis prompt bebas     → userCustomPrompt
User upload referensi?      → hasStyleRef (opsional)
          ↓
generateFreePrompt(userCustomPrompt, hasStyleRef)
          ↓
Final prompt → Gemini API
```

---

## 🖼️ STYLE REFERENCE UPLOAD
Berlaku di **kedua mode**. Append di akhir prompt jika ada upload:
```
, closely matching the visual style of the uploaded reference image
```

---

## 🔁 VARIATION ×3
Berlaku di **kedua mode**.
- Prompt tidak diubah
- Fungsi dipanggil **3x dengan prompt yang sama**
- Credit: `jumlah icon × resolusi × 3`

---

## 💳 CREDIT SYSTEM

| Resolusi | Credit |
|----------|--------|
| 1K (1024×1024) | 1 cr |
| 2K (2048×2048) | 2 cr |
| 4K (4096×4096) | 3 cr |