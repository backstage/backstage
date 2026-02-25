---
'@backstage/plugin-app': patch
---

Switched translation API imports (`translationApiRef`, `appLanguageApiRef`) from the alpha `@backstage/core-plugin-api/alpha` path to the stable `@backstage/frontend-plugin-api` export. This has no effect on runtime behavior.
