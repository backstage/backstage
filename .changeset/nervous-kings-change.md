---
'@backstage/backend-plugin-api': patch
---

Deprecated all of the `UrlReader` related type names and replaced them with prefixed versions. Please update your imports.

- `ReadTreeOptions` was renamed to `UrlReaderServiceReadTreeOptions`
- `ReadTreeResponse` was renamed to `UrlReaderServiceReadTreeResponse`
- `ReadTreeResponseDirOptions` was renamed to `UrlReaderServiceReadTreeResponseDirOptions`
- `ReadTreeResponseFile` was renamed to `UrlReaderServiceReadTreeResponseFile`
- `ReadUrlResponse` was renamed to `UrlReaderServiceReadUrlResponse`
- `ReadUrlOptions` was renamed to `UrlReaderServiceReadUrlOptions`
- `SearchOptions` was renamed to `UrlReaderServiceSearchOptions`
- `SearchResponse` was renamed to `UrlReaderServiceSearchResponse`
- `SearchResponseFile` was renamed to `UrlReaderServiceSearchResponseFile`
