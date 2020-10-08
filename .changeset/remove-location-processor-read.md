---
'@backstage/plugin-catalog-backend': minor
---

Remove the `read` argument of `LocationProcessor.processEntity`.
Instead, pass the `UrlReader` into the constructor of your `LocationProcessor`.
