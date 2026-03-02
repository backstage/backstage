---
'@backstage/cli': patch
---

Fixed `prepack` and `postpack` commands failing when the dynamic `import()` goes through a CommonJS compatibility layer that doesn't wrap module exports.
