---
'@backstage/ui': minor
---

**Breaking change** The `Cell` component has been refactored to be a generic wrapper component that accepts `children` for custom cell content. The text-specific functionality (previously part of `Cell`) has been moved to a new `CellText` component.

### Migration Guide

If you were using `Cell` with text-specific props (`title`, `description`, `leadingIcon`, `href`), you need to update your code to use `CellText` instead:

**Before:**

```tsx
<Cell
  title="My Title"
  description="My description"
  leadingIcon={<Icon />}
  href="/path"
/>
```

**After:**

```tsx
<CellText
  title="My Title"
  description="My description"
  leadingIcon={<Icon />}
  href="/path"
/>
```

For custom cell content, use the new generic `Cell` component:

```tsx
<Cell>{/* Your custom content */}</Cell>
```
