---
'@backstage/frontend-test-utils': patch
---

Fixed `renderInTestApp` and `renderTestApp` losing test content and mounted routes when `features` includes a plugin with ID `test`.
