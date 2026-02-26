---
'@backstage/frontend-test-utils': patch
---

Added `snapshot()` method to `ExtensionTester`, which returns a tree-shaped representation of the resolved extension hierarchy. Convenient to use with `toMatchInlineSnapshot()`.
