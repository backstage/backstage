---
'@backstage/plugin-adr-backend': minor
'@backstage/plugin-adr': minor
---

Fixed bug where images from private repositories weren't accessible by the ADR plugin. Added `/image` API endpoint to adr-backend plugin which allows frontent to fetch images via backend with auth.
