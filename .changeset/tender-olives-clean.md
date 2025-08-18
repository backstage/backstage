---
'@backstage/frontend-defaults': patch
---

**BREAKING**: The `loadingComponent` option has been renamed to `loadingElement`, which is now found under `advanced.loadingElement`. The default loading element has also been switched to `<Progress />` from `@backstage/core-components`. This is of course an improvement over the previous `"Loading..."` text, but also helps prevent flicker when the app loading is fast.
