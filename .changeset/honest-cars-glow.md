---
'@backstage/backend-common': patch
---

Adds `readUrl` method to the `UrlReader` interface that allows for complex response objects. This new method is currently optional to implement which allows for a soft migration to `readUrl` instead of `read` in the future.

The main use case for `readUrl` returning an object instead of solely a read buffer is to allow for additional metadata such as etag which will is a requirement for cacheable processing.

Implements `readUrl` in `GithubUrlReader`.
