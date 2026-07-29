---
'@backstage/plugin-catalog-backend-module-backstage-openapi': patch
---

The internal OpenAPI documentation provider now automatically discovers installed plugins via the system metadata service. The `catalog.providers.backstageOpenapi.plugins` configuration option is now optional and deprecated; when omitted, all installed plugins are discovered dynamically.
