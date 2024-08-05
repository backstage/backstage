---
'@backstage/plugin-techdocs': patch
---

TechDocs now supports the `mkdocs-redirects` plugin. Redirects defined using the `mkdocs-redirects` plugin will be handled automatically after a brief notification to the user informing them of the redirect. Redirecting to external urls is not supported. In the case that an external redirect url is provided, TechDocs will redirect to the current documentation site home.
