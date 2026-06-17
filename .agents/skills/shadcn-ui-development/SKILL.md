---
name: shadcn-ui-development
description: "Activates when using shadcn CLI or working with UI components inside components/ui/. Triggered by installing components, managing themes, or customizing base component implementations."
license: MIT
metadata:
  author: goxstream
---

# Shadcn UI Development

Guidelines for incorporating, reusing, and customizing shadcn UI components in the GoxStream codebase.

## Reuse Existing Primitives First
Before adding any new component wrappers, importing from external sources, or running shadcn CLI additions, **you must check for and reuse the existing primitive components** inside `src/components/ui/`. Writing duplicate wrappers or manual HTML overrides when a primitive is already present is strictly prohibited.

### Audited List of 55 Available UI Primitives:
The following primitives have been pre-installed with the `--all` flag:
1. `accordion` (`accordion.tsx`)
2. `alert-dialog` (`alert-dialog.tsx`)
3. `alert` (`alert.tsx`)
4. `aspect-ratio` (`aspect-ratio.tsx`)
5. `avatar` (`avatar.tsx`)
6. `badge` (`badge.tsx`)
7. `breadcrumb` (`breadcrumb.tsx`)
8. `button-group` (`button-group.tsx`)
9. `button` (`button.tsx`)
10. `calendar` (`calendar.tsx`)
11. `card` (`card.tsx`)
12. `carousel` (`carousel.tsx`)
13. `chart` (`chart.tsx`)
14. `checkbox` (`checkbox.tsx`)
15. `collapsible` (`collapsible.tsx`)
16. `combobox` (`combobox.tsx`)
17. `command` (`command.tsx`)
18. `context-menu` (`context-menu.tsx`)
19. `dialog` (`dialog.tsx`)
20. `direction` (`direction.tsx`)
21. `drawer` (`drawer.tsx`)
22. `dropdown-menu` (`dropdown-menu.tsx`)
23. `empty` (`empty.tsx`)
24. `field` (`field.tsx`)
25. `hover-card` (`hover-card.tsx`)
26. `input-group` (`input-group.tsx`)
27. `input-otp` (`input-otp.tsx`)
28. `input` (`input.tsx`)
29. `item` (`item.tsx`)
30. `kbd` (`kbd.tsx`)
31. `label` (`label.tsx`)
32. `menubar` (`menubar.tsx`)
33. `native-select` (`native-select.tsx`)
34. `navigation-menu` (`navigation-menu.tsx`)
35. `pagination` (`pagination.tsx`)
36. `popover` (`popover.tsx`)
37. `progress` (`progress.tsx`)
38. `radio-group` (`radio-group.tsx`)
39. `resizable` (`resizable.tsx`)
40. `scroll-area` (`scroll-area.tsx`)
41. `select` (`select.tsx`)
42. `separator` (`separator.tsx`)
43. `sheet` (`sheet.tsx`)
44. `sidebar` (`sidebar.tsx`)
45. `skeleton` (`skeleton.tsx`)
46. `slider` (`slider.tsx`)
47. `sonner` (`sonner.tsx`)
48. `spinner` (`spinner.tsx`)
49. `switch` (`switch.tsx`)
50. `table` (`table.tsx`)
51. `tabs` (`tabs.tsx`)
52. `textarea` (`textarea.tsx`)
53. `toggle-group` (`toggle-group.tsx`)
54. `toggle` (`toggle.tsx`)
55. `tooltip` (`tooltip.tsx`)

## Tooltip Integration
When using the `tooltip` component, ensure the application layout (or the specific context where the tooltips are rendered) is wrapped in the official `<TooltipProvider>` element to ensure correct hydration and rendering:

```tsx
// src/app/layout.tsx
import { TooltipProvider } from "@/components/ui/tooltip";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <TooltipProvider>{children}</TooltipProvider>
      </body>
    </html>
  );
}
```

## Component CLI Operations
- Use `npx shadcn add` to fetch any custom blocks or layout definitions if explicitly required.
- Always customize imported components to match GoxStream design guidelines (adaptive light/dark mode tokens, theme variables, and transitions).

## Layout & Themes
- Shadcn components must integrate with Tailwind CSS v4 variables configured under `@theme` in `src/app/globals.css`.
- Ensure components import the `cn` utility from `@/lib/utils` to allow class merges:
  ```typescript
  import { cn } from "@/lib/utils";

  export function CustomButton({ className, ...props }) {
    return (
      <button className={cn("px-4 py-2 bg-primary text-primary-foreground", className)} {...props} />
    );
  }
  ```

## Common Pitfalls
- Adding styling manually to components using raw css properties instead of Tailwind CSS utility classes.
- Trying to rewrite UI primitives or wrapping them in custom divs when an audited component is already present in `src/components/ui/`.
