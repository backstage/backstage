---
'@backstage/integration': minor
'@backstage/backend-common': patch
---

Fix rate limit detection by looking for HTTP status code 429 and updating the header `x-ratelimit-remaining` to look for in case of a 403 code is returned
