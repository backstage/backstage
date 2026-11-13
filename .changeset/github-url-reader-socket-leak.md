---
'@backstage/backend-defaults': patch
---

Resume and drain response body on non-OK responses in `GithubUrlReader` to prevent socket leaks on large error bodies.
