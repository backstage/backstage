---
'@backstage/catalog-client': patch
---

Update `AddLocationResponse` to optionally return `exists` to signal that the location already exists, this is only returned when calling `addLocation` in dryRun.
