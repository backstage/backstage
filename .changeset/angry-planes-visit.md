---
'@backstage/backend-common': minor
---

The `ZipArchiveResponse` class now accepts an optional `stripFirstDirectory` parameter. Note that its default value is `false`, which leads to a breaking change in behaviour to previous versions of the class. If you use this class explicitly and want to retain the old behaviour, add a `true` parameter value to its constructor.
