---
'@backstage/plugin-lighthouse-backend': minor
---

Lighthouse backend plugin can now use an authenticated catalog backend API.

- Breaking \* You must now pass the `tokenManager` to the lighthouse `createScheduler`.
