---
'@backstage/plugin-app': patch
---

Added the `api:app/document-title` extension, which sets the browser's document title from the titles of the current page and sub-page, followed by the `app.title` configuration value. The format can be changed through the `template`, `separator`, and `order` extension configuration, or by overriding the extension.
