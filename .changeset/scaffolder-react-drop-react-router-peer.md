---
'@backstage/plugin-scaffolder-react': patch
---

Removed the `react-router` peer dependency. The package now uses `react-router-dom` like the other Backstage plugins, so apps no longer need to provide `react-router` separately.
