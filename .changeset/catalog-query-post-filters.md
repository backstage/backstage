---
'@backstage/plugin-scaffolder': patch
---

Improves scaffolder entity pickers by using the catalog POST endpoint so large template filters are sent in the request body instead of the URL, helping avoid 431 errors and empty option lists.
