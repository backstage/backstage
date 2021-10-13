---
'@backstage/plugin-scaffolder-backend': patch
---

Use `resolveSafeChildPath` in the `fetchContents` function to forbid reading files outside the base directory when a template is registered from a `file:` location.
