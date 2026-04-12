# GitHub Copilot Instructions — Cubicon

> Full project rules are in `CLAUDE.md` at the root.
> In Copilot Chat, always reference it with: `#file:CLAUDE.md`

## Quick Reference

**Project:** 3D Isometric Icon Generator (React + Vite + Tailwind + Supabase)
**Theme:** Neo-Brutalism — thick black borders, offset shadow, no custom CSS
**Docs:** `docs/prd.md` · `docs/task1.md` · `docs/task2.md` ...

## Non-Negotiables
- Mobile first — always start with mobile classes
- Horizontal margin on every section: `mx-4 md:mx-8 lg:mx-16`
- No custom CSS — Tailwind classnames only
- Use `clsx` for conditional classes
- All Supabase calls go in `src/api/` — never inside components
- Sensitive API keys only in `api/` (Vercel Edge Functions)
- Every async op needs loading + error state
- Max ~200 lines per component

## Design Tokens
```
Primary:    #3B5BDB   bg-[#3B5BDB]
BG:         #F5F7FF   bg-[#F5F7FF]
Text:       #1A1A1A   text-[#1A1A1A]
Secondary:  #E8EDFF   bg-[#E8EDFF]
Border:     border-2 border-black
Shadow:     shadow-[4px_4px_0px_#000]
Font H:     font-display (Syne)
Font Body:  font-body (Epilogue)
```
