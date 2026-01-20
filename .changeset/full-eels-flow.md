---
'@backstage/backend-defaults': minor
---

**BREAKING**: The constructor for `FetchUrlReader` is now private. If you have to construct an instance of it, please use `FetchUrlReader.fromConfig` instead.
