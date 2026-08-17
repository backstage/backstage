---
'@backstage/catalog-model': minor
---

Added `plugin` spec type to the `@alpha` AiResource kind, representing a packaged collection of skills distributed as a unit. Plugins reference their contained skills via `spec.skills` entity references, generating `hasPart` catalog relations.
