---
'@backstage/plugin-catalog-backend': patch
---

Parse the URL using a different method rather than `git-url-parse` to support wildcards for URLs which are not VCS providers
