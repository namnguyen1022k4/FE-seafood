# UI Redesign — Ocean Fresh

## Overview

Redesign toàn bộ shop-facing pages của seafood e-commerce app theo phong cách Ocean Fresh: navy/teal/white, hiện đại, sang trọng.

## Color System

| Token | Hex | Usage |
|-------|-----|-------|
| Navy | `#0c4a6e` | Navbar bg, headings, primary dark |
| Blue | `#0369a1` | Hover states, secondary buttons |
| Primary | `#0ea5e9` | CTAs, links, badges |
| Cyan | `#67e8f9` | Brand accent, highlights |
| Light | `#bae6fd` | Borders, backgrounds |
| BG | `#f0f9ff` | Page background |
| Accent | `#f97316` | Cart badge, "hot" labels |
| Text | `#0f172a` | Body text |

## Scope

All shop-facing files only — admin pages untouched.

## Components & Pages

### Navbar (`src/components/shop/Navbar.jsx`)
- Background: navy `#0c4a6e`, sticky top, shadow
- Logo: `🦞 SeaFresh` in cyan `#67e8f9`, bold
- Nav links: `#bae6fd`, hover → white
- Cart: button với bg `#0ea5e9`, cart badge orange `#f97316`
- Auth: Login link + Register button `#0369a1`

### ShopLayout (`src/layouts/ShopLayout.jsx`)
- Page background: `#f0f9ff`

### HomePage (`src/pages/shop/HomePage.jsx`)
- **Hero section** (mới): gradient banner navy→teal, badge "Fresh from the Ocean", headline, 2 CTA buttons, floating emoji
- **Search bar**: border `#bae6fd`, focus border `#0ea5e9`, rounded-xl
- **Category pills**: replace sidebar filter thành pills ngang (All + categories từ API)
- **Section header**: title với left border accent `#0ea5e9`
- **Pagination**: styled với Ocean Fresh colors

### ProductCard (`src/components/shop/ProductCard.jsx`)
- Border radius: `rounded-2xl`
- Shadow: `shadow-md hover:shadow-xl`
- Hover: `translateY(-4px)` transition
- Image bg: gradient teal/blue
- Stock badge: absolute top-left, green/red
- Price: navy bold `#0c4a6e`
- Add to Cart button: `#0ea5e9`, rounded-lg

### ProductFilter (`src/components/shop/ProductFilter.jsx`)
- Convert từ sidebar thành horizontal pills ngang
- Active pill: navy bg + cyan text
- Inactive pill: `#e0f2fe` bg + `#0369a1` text

### LoginPage & RegisterPage
- Full-page gradient background `#f0f9ff → #e0f2fe`
- Centered white card, `rounded-2xl`, shadow-xl
- Form inputs: border `#e2e8f0`, focus `#0ea5e9`
- Submit button: navy `#0c4a6e` full-width

### CartPage, OrdersPage
- Card containers: white, `rounded-2xl`, shadow-sm
- Headers: navy text, accent border
- Buttons: Ocean Fresh primary colors

## Implementation Approach

Direct Tailwind class replacement — không tạo abstraction mới. Đi từng file, thay classes trực tiếp.

## Out of Scope

- Admin pages (DashboardPage, AdminLayout, admin components)
- Backend changes
- New features
