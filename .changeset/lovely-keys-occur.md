---
'@backstage/plugin-catalog-backend': patch
---

Update `createLocation` to optionally return `exists` to signal that the location already exists, this is only returned for dry runs.
