---
'@backstage/plugin-scaffolder-backend': minor
---

Add `fetch:partial` templating action.

- For all files with extension `.njk`, apply templating logic and strip extension. The extension is configurable.
- All other files get copied.
- All output paths are subject to applying templating logic.
