---
'@backstage/backend-common': patch
---

Implement `UrlReader.search` for the other providers (Azure, Bitbucket, GitLab) as well.

The `UrlReader` subclasses now are implemented in terms of the respective `Integration` class.
