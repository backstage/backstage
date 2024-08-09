---
'@backstage/frontend-plugin-api': patch
---

Add support for accessing extensions definitions provided by a plugin via `plugin.getExtension(...)`. For this to work the extensions must be defined using the v2 format, typically using an extension blueprint.
