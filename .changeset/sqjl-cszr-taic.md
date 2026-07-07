---
'@backstage/create-app': patch
---

Pinned `@types/node` to `22.20.0` in the seed lockfile to prevent yarn from resolving the `*` wildcard (from `@jest/environment-jsdom-abstract`) to `@types/node@26.0.0`, which breaks `tsc:full` due to incompatible `EventEmitter` types in `tarn`.
