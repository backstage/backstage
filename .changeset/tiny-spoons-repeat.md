---
'@backstage/backend-defaults': patch
---

In the different `UrlReadersService`, the `search` method have been updated to use the `readUrl` if the given URL doesn't contain a pattern.
For `UrlReaders` that didn't implement the `search` method, `readUrl` is now called internally and throws if the given URL doesn't contain a pattern.
