---
'@backstage/plugin-scaffolder-backend': patch
---

Add partial templating to `fetch:template` action.

If an `templateFileExtension` input is given, only files with that extension get their content processed. If `templateFileExtension` is `true`, the `.njk` extension is used. The `templateFileExtension` input is incompatible with both `cookiecutterCompat` and `copyWithoutRender`.

All other files get copied.

All output paths are subject to applying templating logic.
