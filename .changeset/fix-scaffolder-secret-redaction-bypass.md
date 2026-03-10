---
'@backstage/plugin-scaffolder-backend': patch
---

Fixed a security vulnerability where secrets could bypass log redaction when transformed through Nunjucks filters in scaffolder templates.
