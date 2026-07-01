---
'@backstage/cli-module-build': patch
---

Package preparation now converts TypeScript configuration schemas to separate JSON files. Backend builds compile schemas together before assembling the distribution workspace, while package publishing compiles each schema independently.
