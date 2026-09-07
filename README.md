# Bajaj Associates Furniture Website

This project is the rebranded and rethemed version of the original furniture website.

## Changes included
- Replaced the original hero section with a responsive **Bajaj Associates** hero.
- Added separate text-free desktop and mobile hero images under `frontend/public/`.
- Hero headings, copy, and buttons are real React/HTML content in `frontend/src/components/Hero.jsx`.
- Updated branding to **Bajaj Associates** across navigation, footer, preloader, about page, legacy album view, admin sidebar, and page metadata.
- Updated the shared site palette to cream, brown, orange, and gold.

## Main palette
- Cream: `#F4E7D3`
- Brown: `#2F1A10` / `#5B3A27`
- Orange: `#C95F1E`
- Gold: `#D4A64A`

## Run
```bash
npm install
npm run dev
```

## Build
```bash
npm run build
```

Contact details can still be overridden through the existing `VITE_*` environment variables.
