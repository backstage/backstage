---
'@backstage/cli-common': patch
---

The monorepo root check in `findPaths` will now accept a shorthand `workspaces` config in `package.json`, no longer requiring `workspaces.packages`.
