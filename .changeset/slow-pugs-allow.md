---
'@backstage/plugin-scaffolder-backend-module-yeoman': patch
---

Fixed compatibility with yeoman-environment v4+, which is ESM-only. The previous require() call throws ERR_REQUIRE_ESM; replaced with dynamic import() and updated registration to match the v4+ API.
