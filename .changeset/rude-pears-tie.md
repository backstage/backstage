---
'@backstage/backend-defaults': patch
---

Remove use of the `stoppable` library as Node's native http server [close](https://nodejs.org/api/http.html#serverclosecallback) method already drains requests.
