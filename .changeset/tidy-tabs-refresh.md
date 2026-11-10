---
'@backstage/core-app-api': patch
---

Fix unexpected sign-in prompts when multiple tabs refresh a session at the same time with an auth provider that rotates refresh tokens. Refresh requests are coordinated across tabs in browsers that support the Web Locks API.
