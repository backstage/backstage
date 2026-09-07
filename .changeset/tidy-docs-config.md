---
'@backstage/plugin-techdocs-node': patch
---

**BREAKING**: TechDocs generation now removes MkDocs plugins outside the built-in list of permitted plugins and logs a warning before continuing the build. To retain additional plugins, review and add them to `techdocs.generator.mkdocs.dangerouslyAllowAdditionalPlugins`, or supply them through `dangerouslyAllowAdditionalPlugins` when creating the generator directly. Plugins configured through `defaultPlugins` are also permitted. Generation stops if the MkDocs configuration cannot be read, parsed, or updated.
