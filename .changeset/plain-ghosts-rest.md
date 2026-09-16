---
'@backstage/plugin-techdocs': minor
---

TechDocs now uses the default `NotFoundErrorPage` when documentation is missing, instead of its own TechDocs-specific page.

This means if you have provided an override to the `NotFoundErrorPage` component it will now be used within TechDocs when documentation is missing as well.

One thing to note is that the default not found page shows "PAGE NOT FOUND" rather than "Documentation not found".
