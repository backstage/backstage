---
'@backstage/backend-defaults': patch
'@backstage/plugin-catalog-backend': minor
---

**BREAKING:** The `UrlReaderProccessor` now always calls the `search` method of the `UrlReaders`. Previous behavior was to call the `search` method only if the parsed Git URL's filename contained a wildcard and use `readUrl` otherwise. `UrlReaderService` must implement this logic in the `search` method instead.

This allows each `UrlReaderService` implementation to check whether it's a search URL (that contains a wildcard pattern) or not using logic that is specific to each provider.

In the different `UrlReadersService`, the `search` method have been updated to use the `readUrl` if the given URL doesn't contain a pattern.
For `UrlReaders` that didn't implement the `search` method, `readUrl` is called internally.
