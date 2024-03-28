---
'@backstage/plugin-adr-backend': patch
'@backstage/plugin-adr': patch
---

Fixed bug where images from private repositories weren't accessible by the ADR plugin. Added `/image` API endpoint to adr-backend plugin which allows frontend to fetch images via backend with auth.
