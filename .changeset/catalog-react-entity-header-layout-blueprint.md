---
'@backstage/plugin-catalog-react': minor
---

Added an alpha BUI-ready entity header layout extension point. Its loaded component receives Catalog-composed tabs and the active tab ID, allowing custom entity headers to preserve or customize entity-page navigation.

**DEPRECATED ALPHA**: The existing opaque entity header extension point is deprecated. It continues to work through a temporary Catalog legacy-layout fallback so adopters can migrate custom entity headers incrementally.
