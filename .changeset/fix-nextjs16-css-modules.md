---
'@backstage/ui': patch
---

Fixed CSS Module purity errors for Next.js 16 compatibility

After upgrading to Next.js 16.1.6, the build failed with CSS Module purity errors. Next.js 16 with Turbopack enforces stricter validation requiring global selectors like `[data-theme='dark']` to be combined with local classes.

Changed nested selector structure from `[data-theme='dark'] { .class { } }` to flattened `[data-theme='dark'] .class { }`.

**Affected components:** popover, tooltip
