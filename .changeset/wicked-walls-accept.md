---
'@backstage/ui': minor
---

**BREAKING**: Removed link and tint color tokens, added new status foreground tokens, and improved Link component styling

The following color tokens have been removed:

- `--bui-fg-link` (and all related tokens: `-hover`, `-pressed`, `-disabled`)
- `--bui-fg-tint` (and all related tokens: `-hover`, `-pressed`, `-disabled`)
- `--bui-bg-tint` (and all related tokens: `-hover`, `-pressed`, `-disabled`)
- `--bui-border-tint` (and all related tokens)

**New Status Tokens:**

Added dedicated tokens for status colors that distinguish between usage on status backgrounds vs. standalone usage:

- `--bui-fg-danger-on-bg` / `--bui-fg-danger`
- `--bui-fg-warning-on-bg` / `--bui-fg-warning`
- `--bui-fg-success-on-bg` / `--bui-fg-success`
- `--bui-fg-info-on-bg` / `--bui-fg-info`

The `-on-bg` variants are designed for text on colored backgrounds, while the base variants are for standalone status indicators with improved visibility and contrast.

**Migration:**

For link colors, migrate to one of the following alternatives:

```diff
.custom-link {
- color: var(--bui-fg-link);
+ color: var(--bui-fg-info);  /* For informational links */
+ /* or */
+ color: var(--bui-fg-primary);  /* For standard text links */
}
```

For tint colors (backgrounds, foregrounds, borders), migrate to appropriate status or neutral colors:

```diff
.info-section {
- background: var(--bui-bg-tint);
+ background: var(--bui-bg-info);  /* For informational sections */
+ /* or */
+ background: var(--bui-bg-neutral-1);  /* For neutral emphasis */
}
```

If you're using status foreground colors on colored backgrounds, update to the new `-on-bg` tokens:

```diff
.error-badge {
- color: var(--bui-fg-danger);
+ color: var(--bui-fg-danger-on-bg);
  background: var(--bui-bg-danger);
}
```

**Affected components:** Link
