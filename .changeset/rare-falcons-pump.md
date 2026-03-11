---
'@backstage/plugin-catalog-backend': patch
---

Deprecated two processors as they have been moved to the Community Plugins repo with their own backend modules:

- `AnnotateScmSlugEntityProcessor`: Use `@backstage-community/plugin-catalog-backend-module-annotate-scm-slug` instead
- `CodeOwnersProcessor`: Use `@backstage-community/plugin-catalog-backend-module-codeowners` instead
