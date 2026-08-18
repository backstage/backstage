---
'@backstage/catalog-model': minor
---

Added `marketplace` spec type to the `@alpha` AiResource kind, representing a curated registry of plugins for discovery and distribution. Marketplaces reference their contained plugins via `spec.plugins` entity references, generating `hasPart` catalog relations.
