---
'@backstage/core-plugin-api': patch
---

Route reference hooks read locations and parameters from Backstage routing in the new frontend system, including pages without a router adapter. They continue to use React Router context in legacy apps.
