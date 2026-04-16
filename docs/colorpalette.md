# Cubicon — Color Palette Option A3
## 🌊 Yellow x Deep Navy

> Sophisticated & energetic — profesional tapi tetap bold

---

## 🎨 Color Tokens

| Role | Name | Hex | Usage |
|------|------|-----|-------|
| Background | Cream White | `#FFFCF2` | Page background |
| Primary Accent | Golden Yellow | `#FFC300` | CTA button, highlight, active state |
| Secondary Accent | Deep Navy | `#0A1628` | Border, button, card shadow |
| Text Primary | Deep Navy | `#0A1628` | Heading, body text |
| Text Secondary | Navy Muted | `#3D4F6B` | Subheading, caption, label |
| Highlight | Pale Yellow | `#FFF5CC` | Card background, badge, hover state |
| Surface | White | `#FFFFFF` | Card, modal, input background |
| Error | Crimson | `#E63946` | Error state, shake animation |
| Success | Forest Green | `#2D6A4F` | Success toast, checkmark |

---

## 🖊️ Border & Shadow

| Element | Value |
|---------|-------|
| Border color | `#0A1628` |
| Border width | `2px` solid |
| Shadow offset (Neo-Brutalism) | `4px 4px 0px #0A1628` |
| Shadow hover | `6px 6px 0px #0A1628` |

---

## 🔤 Typography Pairing

| Role | Font | Weight | Color |
|------|------|--------|-------|
| Logo | Syne | ExtraBold 800 | `#0A1628` |
| H1 / Display | Syne | Bold 700 | `#0A1628` |
| H2 / H3 | Syne | SemiBold 600 | `#0A1628` |
| Body | Epilogue | Regular 400 | `#0A1628` |
| Caption / Label | Epilogue | Medium 500 | `#3D4F6B` |

---

## 🧩 Component Usage

### Button Primary
- Background: `#FFC300`
- Text: `#0A1628`
- Border: `2px solid #0A1628`
- Shadow: `4px 4px 0px #0A1628`
- Hover: shadow bergeser `6px 6px 0px #0A1628`

### Button Secondary
- Background: `#FFFFFF`
- Text: `#0A1628`
- Border: `2px solid #0A1628`
- Shadow: `4px 4px 0px #0A1628`

### Card
- Background: `#FFFFFF`
- Border: `2px solid #0A1628`
- Shadow: `4px 4px 0px #0A1628`

### Input Field
- Background: `#FFFFFF`
- Border: `2px solid #0A1628`
- Focus border: `2px solid #FFC300`
- Placeholder text: `#3D4F6B`

### Badge / Pill
- Background: `#FFF5CC`
- Text: `#0A1628`
- Border: `2px solid #0A1628`

### Navbar
- Background: `#FFFCF2`
- Border bottom: `2px solid #0A1628`

---

## 🌐 CSS Variables

```css
:root {
  /* Colors */
  --color-bg: #FFFCF2;
  --color-surface: #FFFFFF;
  --color-primary: #FFC300;
  --color-secondary: #0A1628;
  --color-highlight: #FFF5CC;
  --color-text-primary: #0A1628;
  --color-text-secondary: #3D4F6B;
  --color-border: #0A1628;
  --color-error: #E63946;
  --color-success: #2D6A4F;

  /* Border */
  --border-default: 2px solid #0A1628;

  /* Shadow (Neo-Brutalism) */
  --shadow-default: 4px 4px 0px #0A1628;
  --shadow-hover: 6px 6px 0px #0A1628;

  /* Typography */
  --font-display: 'Syne', sans-serif;
  --font-body: 'Epilogue', sans-serif;
}
```

---

## ✅ Accessibility

| Pair | Contrast Ratio | WCAG |
|------|---------------|------|
| Navy text on Cream bg | ~16:1 | ✅ AAA |
| Navy text on Yellow | ~8:1 | ✅ AAA |
| Navy text on White | ~18:1 | ✅ AAA |
| Yellow bg on Cream bg | ~1.3:1 | ⚠️ Dekoratif only |
