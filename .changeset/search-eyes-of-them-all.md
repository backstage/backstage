---
'@backstage/plugin-search-backend-node': patch
---

Introducing a `NewlineDelimitedJsonCollatorFactory`, which can be used to create search indices from newline delimited JSON files stored in external storage readable via a configured `UrlReader` instance.

This is useful if you have an independent process periodically generating `*.ndjson` files consisting of `IndexableDocument` objects and want to be able to generate a fresh index based on the latest version of such a file.
