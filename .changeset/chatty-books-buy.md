---
'@backstage/core-api': patch
---

Updated the `Observable` type to provide interoperability with `Symbol.observable`, making it compatible with at least `zen-observable` and `RxJS 7`.

In cases where this change breaks tests that mocked the `Observable` type, the following addition to the mock should fix the breakage:

```ts
  [Symbol.observable]() {
    return this;
  },
```
