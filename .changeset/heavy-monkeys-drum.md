---
'@backstage/plugin-scaffolder-backend': minor
---

Add partial templating to `fetch:template` action.

If an `extension` input is given, only files with that extension get their content processed. If `extension` is `true`, the `.njk` extension is used. The `extension` input is incompatible with both `cookiecutterCompat` and `copyWithoutRender`.

All other files get copied.

All output paths are subject to applying templating logic.
