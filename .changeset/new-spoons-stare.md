---
'@backstage/backend-app-api': patch
---

Adds an initial rate-limiting implementation so that any incoming requests that have a `'none'` principal are rate-limited automatically.
