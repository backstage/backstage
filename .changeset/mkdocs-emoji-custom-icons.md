---
'@backstage/plugin-techdocs-node': patch
---

Fixed TechDocs allowing `custom_icons` paths in `mkdocs.yml` that resolve outside the documentation input directory. A `custom_icons` option with such a path is now removed from the configuration with a warning.
