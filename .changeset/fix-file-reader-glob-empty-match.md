---
'@backstage/plugin-catalog-backend': patch
---

Fixed `FileReaderProcessor` to not emit a `notFoundError` when a glob pattern in a location target matches zero files. Previously, a glob like `./components/*.yaml` with no matching files would trigger a `notFoundError`, causing the entire Location entity to fail processing and silently drop all other deferred entities discovered from the same location. Empty glob matches are now treated as "nothing found yet" rather than an error.
