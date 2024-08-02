---
'@backstage/plugin-techdocs': patch
---

TechDocs now supports the `mkdocs-redirects` plugin. Redirects defined using the `mkdocs-redirect` plugin will be handled automatically in TechDocs. Redirecting to external urls is not supported. In the case that an external redirect url is provided, TechDocs will redirect to the current documentation site home.
