---
'@backstage/plugin-catalog-react': patch
---

Fixed the catalog entity list re-writing the URL on every render, which spammed `history.replaceState` and crashed Safari with a `SecurityError`. The URL is now only updated when it actually changes.
