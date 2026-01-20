---
'@backstage/ui': patch
---

Fixed `Link` component causing hard page refreshes for internal routes. The component now properly uses React Router's navigation instead of full page reloads.
