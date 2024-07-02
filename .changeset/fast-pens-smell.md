---
'@backstage/plugin-org': patch
---

The `useGetEntities` hook could result in requests to `/api/catalog/entities` where the headers exceed the default maximum Node.js header size of 16KB. The hook logic has been adjusted to batch the requests.
