---
'@backstage/plugin-catalog-backend-module-openapi': patch
---

Fixed bug in `jsonSchemaRefPlaceholderResolver` where relative $ref files were resolved through file system instead of base URL of file
