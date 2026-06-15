---
name: shadcn-ui-development
description: "Activates when using shadcn CLI or working with UI components inside components/ui/. Triggered by installing components, managing themes, or customizing base component implementations."
license: MIT
metadata:
  author: goxstream
---

# Shadcn UI Development

Guidelines for incorporating and customizing shadcn UI components in the GoxStream codebase.

## consistency First
- Before adding new component variants, review existing wrapper designs inside `src/components/ui/` to maintain uniform styling classes, states, and animation imports.

## Component CLI Operations
- Use `npx shadcn add` to fetch base component implementations:
  ```bash
  npx shadcn add button
  ```
- Always customize the imported component to match GoxStream design guidelines (dark mode tokens, animations, micro-interactions). Do not leave components unstyled or generic.

## Layout & Themes
- Shadcn components must integrate with Tailwind CSS v4 variables configured under `@theme` in `src/styles/globals.css`.
- Ensure components import `cn` utility from `@/lib/utils` (or the correct path configured in `components.json`) to allow class merges cleanly:
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
- Forgetting to extend the shadcn custom configurations within the theme section of the stylesheet.
