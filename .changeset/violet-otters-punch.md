---
'@backstage/plugin-catalog-backend': patch
---

`UrlReaderProcessor` detects wildcards by parsing the URL's path and query string instead of using `git-url-parse`.

This allows to support wildcards for URLs which are not correctly parsed by `git-url-parse` (such as Gerrit Gitiles URLs).
