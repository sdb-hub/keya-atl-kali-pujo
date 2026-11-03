# Keya ATL Kali Pujo 2026

Public-facing, mobile-first festival website for Keya ATL Kali Pujo 2026.

## Stack
- React + Vite
- Cloudflare Pages + Pages Functions
- GitHub source control

## Local development
```bash
npm install
npm run dev
```

## Build
```bash
npm run build
```

## Cloudflare Pages
Connect this repository to Cloudflare Pages with:
- Framework preset: Vite
- Build command: `npm run build`
- Build output directory: `dist`

The public donation endpoint is `/api/donations`. It is currently a safe placeholder and must be connected to a read-only Google Sheets integration using Cloudflare secrets before publishing real donor information.

## Assets
Place the desktop and mobile backgrounds in `public/images/`:
- `kali-pujo-background.png`
- `kali-pujo-mobile.png`

Do not commit credentials, private management links, payment screenshots, or private expense data.
