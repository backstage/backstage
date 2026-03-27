---
id: component-design-guidelines
title: Component Design Guidelines
description: Documentation on Design
---

Be it a new component contribution, or plugin specific components, you'll want
to follow these guidelines. We'll cover the three main subjects that define the
general look and feel of your components, all of which build on top of the
shadcn/ui component system styled with Tailwind CSS:

- Layout
- Color palette
- Typography

## 🏗️ Layout

Layout refers to how you organize or stack content. Whenever possible, we want
to use Backstage's components (check the [Storybook][1] for a list and demo)
first, and otherwise fall back to shadcn/ui primitives (check the [shadcn/ui docs][2]).

If none of these fit your layout needs, then you can build your own components.
Rather than writing raw HTML+CSS, use Tailwind CSS utility classes combined with
CSS custom property tokens. Tailwind classes automatically respond to theme
changes through CSS custom properties, so if someone switches themes, your
layout adapts without requiring code updates. Use the `cn()` helper from
`@backstage/core-components` for conditional class composition.

For spacing, use Tailwind's built-in spacing scale (e.g., `p-2`, `m-4`,
`gap-3`) which provides consistent margins, paddings, and positions. The key
layout building blocks are:

- Native `div` with Tailwind [`container`][3] and `max-w-*` classes — mostly at page level
- Native `div` with Tailwind [utility classes][4] — a flexible building block
- CSS Grid via Tailwind ([`grid`][5], `grid-cols-*`, `gap-*`) — for flexible grid layouts
- shadcn [Card][6] — the base surface with background and padding
- shadcn [Card][7] with CardHeader, CardTitle, CardContent, CardFooter composition

## Color palette

If you're using an existing component and want to tweak the colors it uses
across the whole application, you can override CSS custom property tokens in
your [Custom Theme][10]. This allows you to customize colors, spacing, and
other visual properties without modifying component source code.

When building a component from scratch, reference the CSS custom property tokens
as much as possible. Most Backstage components and all shadcn/ui components use
CSS custom property tokens for colors by default, so unless you need explicit
control on the color of a component (say when the component was designed to use
the primary color but you want to use the secondary color instead), then the
easiest way to customize colors is to override the relevant CSS custom
properties in your theme configuration.

It's not a very common use case to override a token color in a shadcn/ui
component, but let's say you have a custom Sidebar component with a Card
component that highlights its content with a different color for a side menu or
something (usually you use elevation or shadow, but maybe the designer wanted a
colorful app). You can use CSS custom property tokens with Tailwind classes like
this:

```tsx
import { cn } from '../../lib/utils';
import { Card } from '../components/ui/card';

export function Sidebar({ children }: { children: React.ReactNode }) {
  return (
    <Card className={cn('bg-primary text-primary-foreground')}>{children}</Card>
  );
}
```

Here is a link to the [CSS custom property token definitions][8] you can use.
The token names stay the same (e.g., `--background`, `--foreground`,
`--primary`, `--secondary`, `--destructive`, `--muted`, `--accent`, `--border`,
`--ring`), while the actual color values depend on your app theme configuration.

## Typography

shadcn/ui uses native HTML elements (`h1`–`h6`, `p`, `span`) styled with
Tailwind typography classes (e.g., `text-lg`, `font-semibold`,
`tracking-tight`). The CSS custom property tokens `--font-sans` and
`--font-mono` control font families — `--font-sans` for prose and navigation,
`--font-mono` for code and identifiers. This applies for example to buttons
that use the shadcn/ui Button component variants, which automatically adapt
font color for proper contrast (buttons in dark theme adapt properly by using
appropriate foreground colors).

For cases where the parent component of the content doesn't handle text styling,
such as when the parent is a layout container, use native HTML elements with
Tailwind typography utility classes. For consistent text rendering, reference
the typography CSS custom property tokens defined in the theme, such as
`--font-sans` and `--font-mono`.

Check the [Tailwind CSS typography docs][9] for information on how to use
font families, sizes, weights, and line heights, as well as recommendations
about accessibility.

## Component Authoring Patterns

The shadcn/ui components in `packages/core-components/src/components/ui/`
follow two important patterns that all new component contributions should
adopt for consistency and composability.

### `React.forwardRef` Pattern

All shadcn/ui primitive components use `React.forwardRef` to enable ref
forwarding. This is critical for composability — parent components and
libraries (such as Radix UI primitives, form libraries, and animation
libraries) often need to attach refs to underlying DOM elements. Without
`forwardRef`, composition breaks silently.

When creating a new component, always wrap it with `forwardRef` and spread
the ref onto the outermost DOM element:

```tsx
import { forwardRef, type HTMLAttributes } from 'react';
import { cn } from '../../lib/utils';

const MyComponent = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      data-slot="my-component"
      className={cn('rounded-lg border bg-card p-4', className)}
      {...props}
    />
  ),
);
MyComponent.displayName = 'MyComponent';

export { MyComponent };
```

Key points:

- The first generic parameter (`HTMLDivElement`) is the ref type matching
  the root DOM element.
- The second generic parameter is the props type (extend `HTMLAttributes`
  for standard div-based components, or `ButtonHTMLAttributes` for buttons).
- Always set `displayName` to improve React DevTools readability.
- Always spread `...props` onto the root element so consumers can pass
  standard HTML attributes (e.g., `aria-label`, `id`, `data-testid`).

### `data-slot` Attribute Pattern

Every shadcn/ui component in the Backstage codebase includes a `data-slot`
attribute on its root DOM element. This is the standard shadcn/ui convention
for identifying styled sub-elements within compound components.

The `data-slot` attribute serves two purposes:

1. **Styling hooks:** Theme authors can target specific component slots
   via CSS attribute selectors (e.g., `[data-slot="card-header"]`) for
   advanced customization beyond CSS custom property tokens.
2. **Debugging and testing:** The attribute provides a stable, semantic
   identifier for each component part, useful for test selectors and
   browser DevTools inspection.

For compound components (components with multiple sub-parts), each part
gets its own `data-slot` value:

```tsx
// Card compound component — each part has a unique data-slot value
<div data-slot="card" className={cn('rounded-lg border bg-card', className)}>
  <div data-slot="card-header" className="flex flex-col gap-1.5 p-6">
    <h3 data-slot="card-title" className="font-semibold leading-none">
      {title}
    </h3>
  </div>
  <div data-slot="card-content" className="p-6 pt-0">
    {children}
  </div>
  <div data-slot="card-footer" className="flex items-center p-6 pt-0">
    {footer}
  </div>
</div>
```

When creating new components, use kebab-case for `data-slot` values and
ensure they are unique within the component (e.g., `"my-component"`,
`"my-component-header"`, `"my-component-content"`).

[1]: http://backstage.io/storybook
[2]: https://ui.shadcn.com/docs/components
[3]: https://tailwindcss.com/docs/container
[4]: https://tailwindcss.com/docs/display
[5]: https://tailwindcss.com/docs/grid-template-columns
[6]: https://ui.shadcn.com/docs/components/card
[7]: https://ui.shadcn.com/docs/components/card
[8]: https://ui.shadcn.com/docs/theming
[9]: https://tailwindcss.com/docs/font-family
[10]: https://backstage.io/docs/conf/user-interface
