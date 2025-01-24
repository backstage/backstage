---
'@backstage/plugin-techdocs': patch
---

Changed the base URL in addLinkClickListener from window.location.origin to app.baseUrl for improved path handling. This fixes an issue where Backstage, when running on a subpath, was unable to handle non-Backstage URLs of the same origin correctly.
