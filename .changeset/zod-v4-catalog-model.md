---
'@backstage/catalog-model': patch
---

Switched to version 4 of `zod` for internal validation. Error messages for invalid catalog model layer operations now use the updated `zod` wording.

This package no longer pulls in version 3 of `zod`. If your own packages use `zod` without declaring it as a dependency, they may now get version 4 instead, so make sure to add it to their `package.json` explicitly.
