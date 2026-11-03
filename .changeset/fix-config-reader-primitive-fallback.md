---
'@backstage/config': patch
---

Allow optional config lookups to safely return `undefined` or fall back when encountering intermediate primitive values, instead of throwing a type error.
