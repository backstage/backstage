---
'@backstage/plugin-techdocs-react': patch
---

Fixed the TechDocs reader requesting the documentation metadata in a tight loop when the request fails permanently (for example when the metadata returns a 404). The reader now stops after a failed request, which previously flooded the backend with requests and caused the page to flicker.
