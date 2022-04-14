---
'@techdocs/cli': minor
---

Removed an undocumented, broken behavior where `README.md` files would be copied to `index.md` if it did not exist, leading to broken links in the TechDocs UI.

**WARNING**: If you notice 404s in TechDocs after updating, check to make sure that all markdown files referenced in your `mkdocs.yml`s' `nav` sections exist. The following flag may be passed to the `generate` command to temporarily revert to the broken behavior.

```sh
techdocs-cli generate --legacyCopyReadmeMdToIndexMd
```
