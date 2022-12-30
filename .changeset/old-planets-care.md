---
'@backstage/plugin-code-coverage-backend': patch
---

`RouterOptions` now accepts an optional `catalogApi` argument, allowing custom catalog clients to be used. This is leveraged in the local standalone development runner to pass in a catalog client that returns fake data.
