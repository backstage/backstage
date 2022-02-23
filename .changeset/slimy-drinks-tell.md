---
'@backstage/plugin-scaffolder': minor
---

- **BREAKING** - `scaffolderApi.scaffold()` now takes one `options` argument instead of 3, the existing arguments should just be wrapped up in one object instead.
- **BREAKING** - `scaffolderApi.scaffold()` now returns an object instead of a single string for the job ID. It's now `{ taskId: string }`
- **BREAKING** - `scaffolderApi.getIntegrationsList` now returns an object `{ integrations: { type: string, title: string, host: string }[] }` instead of just an array.
