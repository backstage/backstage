---
'@backstage/cli': patch
---

Modify the `backstage.json` also for custom patterns if it extends the default pattern.

Examples:

- `@backstage/*` (default pattern)
- `@{backstage,backstage-community}/*`
- `@{extra1,backstage,extra2}/*`
