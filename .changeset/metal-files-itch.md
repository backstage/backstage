---
'@backstage/cli': minor
---

Added a new optimization to the `repo test` command that will filter out unused packages in watch mode if all provide filters are paths that point from the repo root. This significantly speeds up running individual tests from the repo root in a large workspace, for example:

```sh
yarn test packages/app/src/App.test.tsx
```
