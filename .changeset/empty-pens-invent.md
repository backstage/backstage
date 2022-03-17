---
'@backstage/plugin-search-backend': minor
---

**BREAKING**: The `authorization` property is no longer returned on search results when queried. Note: this will only result in a breaking change if you have custom code in your frontend that relies on the `authorization.resourceRef` property on documents.
