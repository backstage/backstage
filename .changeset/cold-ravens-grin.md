---
'@backstage/plugin-catalog-backend': minor
---

The `CodeOwnersProcessor` no longer supports the deprecated SCM-specific location types like `'github/api'`. This is a breaking change but it is unlikely to have an impact, as these location types haven't been supported by the rest of the catalog for a long time.
