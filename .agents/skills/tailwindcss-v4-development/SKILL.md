---
name: tailwindcss-v4-development
description: "Activates when writing HTML markup or stylesheets using Tailwind CSS. Triggered by utility classes, modifying theme configurations, layouts (flex, grid), component styling, or dark mode variants."
license: MIT
metadata:
  author: goxstream
---

# Tailwind CSS v4 Development

Guidelines for writing clean, optimized styles using Tailwind CSS v4.

## consistency First
- Check existing layouts or UI components inside `src/components/ui/` or `src/app/` to match responsive breakpoints and dark mode behavior.

## CSS-First Configuration
Tailwind CSS v4 replaces `tailwind.config.js` with a CSS-first configuration model. All theme overrides and custom configurations must be defined in the CSS file:

- Target file: `src/styles/globals.css` (or the project's main stylesheet)
- Use the `@theme` directive to override or add variables:
  ```css
  @import "tailwindcss";

  @theme {
    --color-brand-primary: oklch(0.65 0.24 350);
    --color-brand-secondary: oklch(0.45 0.19 270);
  }
  ```

## Modern Import Syntax
- Replace the legacy v3 directives with the CSS-standard `@import` syntax:
  ```css
  /* Correct v4 syntax */
  @import "tailwindcss";
  ```

## Spacing & Layout Conventions
- **Flexbox & Grid**: Prefer using `gap-*` utilities instead of margins to manage space between adjacent components:
  ```html
  <div class="flex items-center gap-4">
    <div>Left Content</div>
    <div>Right Content</div>
  </div>
  ```
- **Dark Mode**: New components must support dark mode using the `dark:` utility modifier:
  ```html
  <div class="bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-50">
    Adapts to color scheme
  </div>
  ```

## Replaced & Deprecated Utilities
Tailwind v4 deprecates several helper classes. Use the modern replacements:

| Deprecated | Replacement |
|------------|-------------|
| bg-opacity-* | bg-*/* |
| text-opacity-* | text-*/* |
| border-opacity-* | border-*/* |
| flex-shrink-* | shrink-* |
| flex-grow-* | grow-* |
| overflow-ellipsis | text-ellipsis |

## Common Pitfalls
- Creating or looking for a `tailwind.config.js` file (Tailwind v4 reads theme configs directly from the stylesheet).
- Hardcoding theme colors directly in components instead of mapping them via variables under `@theme`.
