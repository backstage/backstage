---
'@backstage/core-components': patch
---

The published type declarations no longer import `@material-ui/styles`, which isn't a dependency, so they resolve with package managers that don't hoist dependencies, such as pnpm.
