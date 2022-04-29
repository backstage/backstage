---
'@backstage/backend-common': patch
---

Implemented the `UrlReader.search()` method for Google Cloud Storage. Due to limitations in the underlying storage API, only prefix-based searches are supported right now (for example, `https://storage.cloud.google.com/your-bucket/some-path/*`).
