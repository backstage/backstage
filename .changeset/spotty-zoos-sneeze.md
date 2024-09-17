---
'@backstage/core-app-api': minor
'@backstage/frontend-app-api': patch
---

Added the ability to explicitly disable routes through the `bindRoutes` option by passing `false` as the route target. This also fixes a bug where route bindings in config were incorrectly prioritized above the ones in code in certain situations.
