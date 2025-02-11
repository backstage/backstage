---
'@backstage/plugin-catalog-backend': minor
---

The `UrlReaderProccessor` accepts a new config flag `catalog.useUrlReadersSearch` to always call the `search` method of `UrlReaders`.

This flag currently defaults to `false`, but adopters are encouraged to enable it as this behavior will be the default in a future release.

Previous behavior was to call the `search` method only if the parsed Git URL's filename contained a wildcard and use `readUrl` otherwise. `UrlReaderService` must implement this logic in the `search` method instead.

This allows each `UrlReaderService` implementation to check whether it's a search URL (that contains a wildcard pattern) or not using logic that is specific to each provider.
