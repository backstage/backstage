---
'@backstage/cli': patch
---

Changed the logic for how modules are marked as external in the Rollup build of packages. Rather than only marking dependencies and build-in Node.js modules as external, all non-relative imports are now considered external.
