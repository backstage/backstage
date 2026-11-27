---
'@backstage/plugin-app': patch
'@backstage/plugin-scaffolder': patch
---

Declared runtime dependencies that were only available through hoisting, so these packages work with package managers that don't hoist dependencies, such as pnpm: `@remix-run/router` in `@backstage/plugin-app`, and `@babel/runtime`, `@codemirror/state` and `@codemirror/theme-one-dark` in `@backstage/plugin-scaffolder`, which `@uiw/react-codemirror` needs.
