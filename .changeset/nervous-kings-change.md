---
'@backstage/backend-plugin-api': patch
---

Deprecated all of the `UrlReader` related type names and replaced them with prefixed versions. Please update your imports.

- `ReadTreeOptions` was renamed to `UrlReaderReadTreeOptions`
- `ReadTreeResponse` was renamed to `UrlReaderReadTreeResponse`
- `ReadTreeResponseDirOptions` was renamed to `UrlReaderReadTreeResponseDirOptions`
- `ReadTreeResponseFile` was renamed to `UrlReaderReadTreeResponseFile`
- `ReadUrlResponse` was renamed to `UrlReaderReadUrlResponse`
- `ReadUrlOptions` was renamed to `UrlReaderReadUrlOptions`
- `SearchOptions` was renamed to `UrlReaderSearchOptions`
- `SearchResponse` was renamed to `UrlReaderSearchResponse`
- `SearchResponseFile` was renamed to `UrlReaderSearchResponseFile`
