---
'@backstage/cli': patch
---

Only use the caching Jest module loader for frontend packages in order to avoid breaking real ESM module imports.
