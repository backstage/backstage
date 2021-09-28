---
'@backstage/core-plugin-api': patch
---

Improve compatibility between different versions by defining the route reference type using a string key rather than a unique symbol. This change only applies to type checking and has no effect on the runtime value, where we still use the symbol.
