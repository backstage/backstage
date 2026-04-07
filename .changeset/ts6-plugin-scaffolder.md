---
'@backstage/plugin-scaffolder': patch
---

Removed custom `IterableDirectoryHandle` and `WritableFileHandle` types in favor of the standard DOM `FileSystemDirectoryHandle` and `FileSystemFileHandle` types, which are now available through the `DOM.AsyncIterable` lib added to the shared TypeScript configuration.
