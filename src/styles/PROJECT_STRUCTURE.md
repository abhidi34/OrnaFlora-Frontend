/* Project Structure Guide

src/
├── components/          (Reusable UI components)
│   ├── Header.js       (Navigation header with search)
│   ├── Header.css
│   ├── Auth.js         (Login/Signup form)
│   ├── Auth.css
│   ├── Cart.js         (Shopping cart)
│   ├── Cart.css
│   ├── Shop.js         (Plant shop page)
│   ├── Shop.css
│   ├── Order.js        (Order display)
│   ├── Order.css
│   ├── Account.js      (User account)
│   ├── Account.css
│   ├── AdminDashboard.js
│   └── ...other components
│
├── pages/              (Full page components)
│   └── Views are currently in components, can be migrated here
│
├── styles/             (Global and shared styles)
│   └── global.css      (Base styles, utilities, responsive defaults)
│
├── context/            (React Context for state management)
│   └── CartContext.js
│
├── services/           (API and external service calls)
│   └── api.js
│
├── data/               (Static data)
│   └── products.js
│
├── App.js              (Main app component)
├── App.css             (App-specific styles)
├── index.js            (React entry point)
├── index.css           (Global index styles)
└── ...config files

RESPONSIVE DESIGN:
================
- Mobile First: 320px - 480px
- Tablet:       480px - 768px
- Desktop:      768px+

CSS BREAKPOINTS:
- @media (max-width: 480px)   - Mobile
- @media (max-width: 768px)   - Tablet
- @media (min-width: 768px)   - Desktop

GLOBAL CSS UTILITIES:
====================
Available in styles/global.css:
- .btn, .btn.ghost     (Button styles)
- .container           (Centered container)
- .flex, .flex-center, .flex-between, .flex-column  (Flexbox utilities)
- .gap-sm, .gap-md, .gap-lg                         (Spacing)
- .mt-*, .mb-*         (Margin utilities)
- .text-primary, .text-error, .text-muted          (Text colors)
- .bg-primary, .bg-light, .bg-error               (Background colors)
*/
