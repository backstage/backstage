---
'@backstage/plugin-scaffolder-backend': patch
---

Fixes bug in scaffolder dry run template editor which errors out with `PayloadTooLargeError: request entity too large` even when the payload is smaller than the express router default 100kb by using the bodyparser package which is recommended for express versions >= 4.0.
