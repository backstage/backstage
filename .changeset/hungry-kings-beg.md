---
'@backstage/plugin-kubernetes-node': patch
---

The `PinnipedHelper` class now accepts a standard `LoggerService`, instead of the old `Logger` from the `winston` package. These are mostly interchangeable, so for most users this should not lead to errors.
