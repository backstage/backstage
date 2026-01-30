---
'@backstage/ui': minor
---

Added new status foreground tokens and improved Link component styling

**New Status Tokens:**

Added dedicated tokens for status colors that distinguish between usage on status backgrounds vs. standalone usage:

- `--bui-fg-danger-on-bg` / `--bui-fg-danger`
- `--bui-fg-warning-on-bg` / `--bui-fg-warning`
- `--bui-fg-success-on-bg` / `--bui-fg-success`
- `--bui-fg-info-on-bg` / `--bui-fg-info`

The `-on-bg` variants are designed for text on colored backgrounds, while the base variants are for standalone status indicators with improved visibility and contrast.

**Migration:**

If you're using status foreground colors on colored backgrounds, update to the new `-on-bg` tokens:

```diff
.error-badge {
- color: var(--bui-fg-danger);
+ color: var(--bui-fg-danger-on-bg);
  background: var(--bui-bg-danger);
}
```

For standalone status indicators (icons, badges, text), continue using the base tokens which now have updated values for better visibility.

**Link Component Updates:**

1. **New `standalone` prop**: Links now have a `standalone` variant that removes the default underline (shows only on hover)
2. **New `info` color**: Added support for `color="info"`
3. **Improved default underline styling**: Links now show underlines by default with refined styling using `color-mix` for better visual hierarchy

```tsx
// Default link - shows underline by default
<Link href="/">Sign up</Link>

// Standalone link - underline only on hover
<Link href="/" standalone>Sign up</Link>

// Info color link
<Link href="/" color="info">Learn more</Link>
```

**Affected components:** Link
