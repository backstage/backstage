---
'@backstage/app-defaults': patch
'@backstage/core-app-api': patch
'@backstage/core-plugin-api': patch
---

Add `FetchApi` and related `fetchApiRef` which implement fetch, with an added Backstage token header when available.
