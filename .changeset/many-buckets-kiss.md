---
'@backstage/plugin-catalog-backend': patch
---

Allow resolving placeholders from the same directory

This change allows to resolve YAML placeholders that are located in the same
directory as the source is. This enables to split entity files, especially
very long templates, to multiple parts inside the same directory.
