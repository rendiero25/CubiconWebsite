# CLAUDE.md — Cubicon Project Rules

This file is automatically read by Claude Code.
For GitHub Copilot: reference this file with `#file:CLAUDE.md` in Copilot Chat.

---

## 🧠 Project Context

**Cubicon** — AI-powered 3D isometric icon generator.
User types a prompt → AI generates icon → user downloads PNG.
Monetized via credit system (pay-per-use). Target market: Indonesia.

**Live docs:**
- `docs/prd.md` — full product requirements
- `docs/task1.md` — setup & preparation
- `docs/task2.md`, `task3.md`, ... — feature tasks

---

## 🛠️ Tech Stack

| Layer | Tech |
|-------|------|
| Frontend | React + Vite |
| Styling | Tailwind CSS |
| Animation | GSAP |
| Auth + DB | Supabase |
| AI Image | Gemini `gemini-3.1-flash-image-preview` via Vercel Edge Function |
| Storage | Cloudinary |
| Remove BG | `@imgly/background-removal` (client-side) |
| Payment | Mayar.id |
| Deploy | Vercel |

---

## 🎨 Design System — NEVER Deviate

### Theme: Neo-Brutalism
- Thick black border: `border-2 border-black`
- Shadow offset: `shadow-[4px_4px_0px_#000]`
- Hover: element shifts + shadow shrinks → `hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none transition-all`
- Corners: minimal rounding, max `rounded-md`
- No glassmorphism, no gradients in UI chrome

### Color Palette
```
bg-[#F5F7FF]   → page background (off-white)
bg-[#3B5BDB]   → primary / CTA (electric blue)
text-[#1A1A1A] → body text (near black)
border-black   → all borders
bg-[#E8EDFF]   → secondary surface (light blue)
```

### Typography
```
font-display → Syne (headings, logo, CTA buttons)
font-body    → Epilogue (body, labels, captions)

H1:      font-display font-bold text-4xl md:text-5xl
H2:      font-display font-semibold text-2xl md:text-3xl
Body:    font-body text-base
Label:   font-body text-sm font-medium
```

---

## 📐 Layout Rules

### Mobile First — ALWAYS
Start with mobile styles, add breakpoint prefixes for larger screens:
```jsx
// ✅ Correct
<div className="text-base md:text-lg lg:text-xl">

// ❌ Wrong — desktop first
<div className="text-xl lg:text-base">
```

### Horizontal Margin — Consistent at Every Breakpoint
Always use container margin on full-width sections:
```jsx
<section className="mx-4 md:mx-8 lg:mx-16 xl:mx-24">
// or use a wrapper component:
<div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-16">
```
**Never use a full-width element without horizontal padding/margin.**

---

## 🧩 Component Rules

### File Size
- Max ~200 lines per component file
- If it's getting long → split into smaller sub-components

### Naming Convention
```
Components:     PascalCase       → GeneratePanel.jsx
Files:          kebab-case       → generate-panel.jsx
Functions:      camelCase        → handleGenerate()
Constants:      UPPER_SNAKE      → MAX_BATCH_SIZE
Hooks:          use prefix       → useCredits()
```

### Conditional Classnames
Always use `clsx`, never string concatenation:
```jsx
// ✅ Correct
import clsx from 'clsx'
<button className={clsx(
  'px-6 py-3 border-2 border-black font-display',
  isLoading && 'opacity-50 cursor-not-allowed',
  isPrimary ? 'bg-[#3B5BDB] text-off-white' : 'bg-off-white text-black'
)}>

// ❌ Wrong
<button className={`px-6 py-3 ${isLoading ? 'opacity-50' : ''}`}>
```

### No Custom CSS in index.css
All styling via Tailwind classnames only.
`index.css` is reserved for: `@tailwind` directives and Google Fonts `@import` only.

---

## 🏗️ Folder Structure

```
src/
├── api/           # All Supabase calls & fetch wrappers (NOT in components)
├── components/
│   ├── ui/        # Reusable: Button, Input, Modal, Badge, Card, Toast
│   └── layout/    # Navbar, Footer, PageWrapper
├── hooks/         # Custom hooks: useCredits, useAuth, useGenerate
├── pages/         # Route-level components: Home, GenerateApp, Pricing...
├── stores/        # Global state (Context or Zustand)
├── utils/         # Pure helper functions, constants
└── styles/        # index.css only (no other CSS files)

api/               # Vercel Edge Functions (server-side only)
├── generate.js    # Proxy to Gemini API
└── upload.js      # Upload to Cloudinary
```

---

## 🔐 Security Rules

- **Gemini API key** → only in Vercel Edge Function (`api/generate.js`). NEVER in frontend.
- **Cloudinary API secret** → only in Vercel Edge Function. Frontend uses unsigned upload preset only.
- **Mayar.id API key** → only in Vercel Edge Function / Supabase Edge Function.
- **Supabase anon key** → safe to expose (protected by RLS). Use `VITE_` prefix.
- **Never log sensitive data** (API keys, user tokens) to console.

---

## ⚡ Async & State Rules

### Every async operation needs 3 states:
```jsx
const [isLoading, setIsLoading] = useState(false)
const [error, setError] = useState(null)
const [data, setData] = useState(null)
```

### Error handling — always use try/catch:
```jsx
try {
  setIsLoading(true)
  setError(null)
  const result = await someApiCall()
  setData(result)
} catch (err) {
  setError(err.message || 'Something went wrong')
} finally {
  setIsLoading(false)
}
```

### Supabase calls → only in `src/api/`:
```jsx
// ✅ src/api/credits.js
export async function deductCredits(userId, amount) { ... }

// ❌ Don't call supabase directly inside a component
```

---

## 🚫 Don'ts

- ❌ No inline `style={{}}` — use Tailwind classes
- ❌ No hardcoded repeated strings — use constants in `src/utils/constants.js`
- ❌ No `console.log` in production code — remove before commit
- ❌ No direct DOM manipulation — use React state/refs
- ❌ No `any` type if using TypeScript in future
- ❌ No installing new packages without checking if it's already in package.json
- ❌ No skipping loading + error states on async operations

---

## ✅ Do's

- ✅ Mobile first on every component, every time
- ✅ Consistent `mx-4 md:mx-8 lg:mx-16` horizontal margins
- ✅ Use `clsx` for all conditional classnames
- ✅ Keep components under ~200 lines — split if bigger
- ✅ Put all Supabase logic in `src/api/`
- ✅ GSAP only for animations — don't use CSS `@keyframes`
- ✅ Use `lucide-react` for icons — consistent icon set
- ✅ Always show credit cost before any generate action

---

## 💳 Credit System Logic (Reference)

```
1K = 1 credit
2K = 2 credits
4K = 3 credits

Variation ×3 = cost × 3
Batch = cost × number of icons

Free tier: 2 icons, 1K only, no batch, no variation
```

Always deduct credits **server-side** (Supabase RLS / Edge Function), never trust client-side credit calculation alone.

---

## 🗃️ Supabase Tables (Reference)

```
users          → id, email, name, created_at
credits        → user_id, balance, updated_at
icons          → id, user_id, prompt, style, resolution, url, is_public, created_at
transactions   → id, user_id, amount, credits_added, payment_ref, created_at
```
