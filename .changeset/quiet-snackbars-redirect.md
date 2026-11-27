---
'@backstage/plugin-techdocs': patch
---

Fixed the "no longer maintained" redirect notification crashing with `No implementation available for apiRef{core.error}` on TechDocs pages that contain a `<meta http-equiv="refresh">` redirect.
