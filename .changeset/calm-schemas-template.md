---
'@backstage/plugin-scaffolder-common': patch
---

The Template entity validator is now created on first use, so importing this package no longer validates any schemas, and it works under a Content Security Policy without `'unsafe-eval'`. Validation error messages are worded differently than before. The Template JSON Schema is now available as `templateEntityV1beta3Schema` from the `/alpha` entry point.
