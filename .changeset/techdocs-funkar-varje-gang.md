---
'@backstage/plugin-techdocs': patch
---

Fixed a bug where links to files within a TechDocs site that use the `download` attribute would result in a 404 in cases where the TechDocs backend and Backstage frontend application are on the same host.
