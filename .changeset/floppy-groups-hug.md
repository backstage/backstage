---
'@backstage/frontend-plugin-api': minor
---

**BREAKING**: Removed the ability to define a default extension `name` in blueprints. This option had no practical purpose as blueprints already use the `kind` to identity the source of the extension.
