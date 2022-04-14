---
'@backstage/plugin-techdocs-backend': minor
---

Removed an undocumented, broken behavior where `README.md` files would be copied to `index.md` if it did not exist, leading to broken links in the TechDocs UI.

**WARNING**: If you notice 404s in TechDocs after updating, check to make sure that all markdown files referenced in your `mkdocs.yml`s' `nav` sections exist. The following configuration may be used to temporarily revert to the broken behavior.

```yaml
techdocs:
  generator:
    mkdocs:
      legacyCopyReadmeMdToIndexMd: true
```
