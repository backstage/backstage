---
'@backstage/frontend-plugin-api': patch
---

Pages that declare a `loader` now display sub-pages attached to their `pages` input instead of silently ignoring them. The loader's content is shown at the page's index route and as the first tab, ahead of the attached sub-pages, and the index route no longer redirects to the first sub-page.
