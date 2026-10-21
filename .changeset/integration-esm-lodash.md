---
'@backstage/integration': patch
---

Fixed importing this package from ECMAScript module (ESM) projects, which failed since 2.1.0 with an error saying that `lodash` does not provide an export named `trimEnd`.
