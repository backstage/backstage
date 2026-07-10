---
'@backstage/plugin-app-react': patch
---

Deprecates `RouterBlueprint` as the history authority. Prefer page-level router adapters (`PageRouterBlueprint` / `pageRouterApiRef`); the navigation controller owns browser history.
