---
'@backstage/plugin-techdocs-backend': patch
'@backstage/plugin-techdocs-node': patch
---

Added `techdocs.generator.mkdocs.dangerouslyAllowAdditionalKeys` configuration option to explicitly bypass MkDocs configuration key restrictions. This enables support for additional MkDocs configuration keys beyond the default safe allow list, such as the `hooks` key which some MkDocs plugins require.
