---
'@backstage/plugin-app': patch
---

The default page layout now sets the document title based on the page title, for example `Catalog | Backstage`. Titles rendered deeper in the page with `react-helmet` still take precedence and are composed into the page title, for example `Catalog | Overview | Backstage`.
