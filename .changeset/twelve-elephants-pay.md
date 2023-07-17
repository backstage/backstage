---
'@backstage/plugin-techdocs-backend': minor
'@backstage/plugin-techdocs-node': minor
---

Add support for default mkdocs plugins.

So far only `techdocs-core` was added as default to the list of mkdocs plugins. In case you use a
custom image for techdocs, you also might want to add custom default plugins for mkdocs.
With this change one can do that - example:

```yaml
techdocs:
  generator:
    mkdocs:
      defaultPlugins:
        - section-index
```
