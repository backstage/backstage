---
'@backstage/frontend-test-utils': patch
---

Fixed type inference of `TestApiPair` when using tuple syntax by wrapping `MockWithApiFactory` in `NoInfer`.
