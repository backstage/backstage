---
'@backstage/cli': patch
---

Added `DOM.AsyncIterable` to the default `lib` in the shared TypeScript configuration, enabling standard async iteration support for DOM APIs such as `FileSystemDirectoryHandle`. This aligns behavior with [TypeScript 6.0](https://devblogs.microsoft.com/typescript/announcing-typescript-6-0/#the-dom-lib-now-contains-domiterable-and-domasynciterable), where this lib is included in `DOM` by default.
