---
'@backstage/plugin-catalog-backend': patch
---

`FileReaderProcessor` no longer emits a not-found error when a glob target matches no files but the directory it points into does exist. A target such as `./components/*.yaml` in a directory that has no matching files yet is no longer treated as a failure, which previously caused the whole `Location` entity to fail processing and dropped the entities discovered from its other targets. Concrete paths, and glob targets whose directory is missing altogether, still emit a not-found error as before.
