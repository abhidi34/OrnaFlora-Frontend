# Responsive Design Guide

## Overview
The OrnaFlora application is now fully responsive with a mobile-first approach, optimized for all device sizes from 320px to 4K displays.

## Breakpoints

```
Mobile:      320px - 480px  (Phones)
Tablet:      480px - 768px  (Tablets)
Desktop:     768px+         (Desktops)
Large:       1200px+        (Large screens)
```

## Key Responsive Features

### 1. Header Navigation
- **Desktop (768px+)**: Full navigation visible with search bar, links, and profile
- **Tablet (480px - 768px)**: Compact navigation with hamburger menu
- **Mobile (< 480px)**: 
  - Hamburger menu for all navigation
  - Logo display adjusted for small screens
  - Full-width search bar
  - Touch-friendly menu items (min 44px tall)

### 2. Navigation Labels
- **Desktop/Tablet**: Full labels visible (Home, Plants)
- **Mobile**: Icons only, labels hidden to save space
- **Touch targets**: Minimum 40px height and width for accessibility

### 3. Search Bar
- **Desktop**: Normal width (max 400px)
- **Tablet**: Flexible width
- **Mobile**: Full-width, positioned below logo and brand

### 4. Main Content Area
- **Desktop**: Max width 1200px with centered padding
- **Tablet**: Responsive padding (12px - 16px)
- **Mobile**: Minimal padding (8px - 10px)

### 5. Forms and Inputs
- **Desktop/Tablet**: Standard padding and styling
- **Mobile**: 
  - Min height 44px for touch targets
  - Font size 16px to prevent iOS zoom
  - Responsive input styling

### 6. Mobile Menu
- **Trigger**: Hamburger menu button appears at 768px
- **Height**: Max 100vh - 70px to prevent page overflow
- **Touch items**: 44px minimum height
- **Z-index**: 999 to appear above other content

## CSS Utilities Available

From `styles/global.css`:

### Flexbox
```css
.flex               /* display: flex */
.flex-center        /* flex + centered items and content */
.flex-between       /* flex + space-between */
.flex-column        /* flex-direction: column */
```

### Spacing
```css
.gap-sm, .gap-md, .gap-lg    /* Gap between flex items */
.mt-sm, .mt-md, .mt-lg       /* Margin top */
.mb-sm, .mb-md, .mb-lg       /* Margin bottom */
```

### Colors & Text
```css
.text-primary       /* Primary green color */
.text-success       /* Success green */
.text-error         /* Error red */
.text-muted         /* Gray text */
.bg-primary         /* Primary background */
.bg-light           /* Light background */
.bg-error           /* Error background */
```

### Buttons
```css
.btn                /* Primary button */
.btn.ghost          /* Outlined button */
```

## Implementation Best Practices

### 1. Mobile First Approach
```css
/* Base/Mobile styles first */
.element { 
  font-size: 14px; 
  padding: 8px; 
}

/* Then add tablet breakpoint */
@media (min-width: 768px) {
  .element { 
    font-size: 16px; 
    padding: 12px; 
  }
}
```

### 2. Responsive Functions
Use `clamp()` for fluid typography:
```css
.hero-title {
  font-size: clamp(16px, 3vw, 42px);
}
```

### 3. Touch Targets
Always ensure minimum 44px height/width for touch interactive elements:
```css
.button {
  min-height: 44px;
  min-width: 44px;
}
```

### 4. Viewport Meta Tag
Already in public/index.html:
```html
<meta name="viewport" content="width=device-width, initial-scale=1" />
```

## Testing Checklist

- [ ] Mobile (320px, 375px, 428px)
- [ ] Tablet (768px, 1024px)
- [ ] Desktop (1200px, 1920px)
- [ ] Landscape orientation on mobile
- [ ] Touch interactions on mobile devices
- [ ] Safari on iOS
- [ ] Chrome on Android
- [ ] Zoom to 200% on all devices
- [ ] Keyboard navigation
- [ ] Screen reader compatibility

## Known Optimizations

1. **Search Form**: Now has flexible width instead of fixed 360px
2. **Mobile Menu**: Collapsible navigation with icons only
3. **Hub Navigation**: Icons with labels that hide on small screens
4. **Form Fields**: Font size 16px on mobile to prevent iOS zoom
5. **Container**: Max width 1200px for optimal readability
6. **Touch Targets**: Minimum 40-44px for all interactive elements

## Future Enhancements

- [ ] Add PWA support for offline access
- [ ] Implement dark mode
- [ ] Add swipe gestures for mobile navigation
- [ ] Optimize images for different screen sizes
- [ ] Add CSS-in-JS for dynamic theming
