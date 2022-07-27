---
'@backstage/plugin-techdocs-mkdocs-addons': patch
'@backstage/plugin-techdocs-mkdocs-react': patch
---

All code specific to `mkdocs` implementation previously maintained by the `@backstage/plugin-techdocs` has been extracted to these 2 new packages:

- `@backstage/plugin-techdocs-mkdocs-react`: A `web-library` that exports components for composing a TechDocs reader page with mkdocs;
- `@backstage/plugin-techdocs-mkdocs-addons`: A `frontend-plugin-module` that exports addons for composing a TechDocs reader page with mkdocs (@backstage/plugin-techdocs-module-addons-contrib were deprecated in favor of this new package).
