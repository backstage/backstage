---
'@techdocs/cli': minor
'@backstage/plugin-techdocs-backend': minor
'@backstage/plugin-techdocs-node': minor
---

BREAKING: The default Techdocs behavior will no longer attempt to copy `docs/README.md` or `README.md` to `docs/index.md` (if not found). To retain this behavior in your instance, you can set the following config in your `app-config.yaml`:

```yaml
techdocs:
  generator:
    mkdocs:
      legacyCopyReadmeMdToIndexMd: true
```
