---
'@backstage/frontend-plugin-api': minor
'@backstage/plugin-app': minor
---

Added `SubPageBlueprint` for creating sub-page tabs, `HeaderActionBlueprint` and `HeaderActionsApi` for plugin-scoped header actions, and `PageLayout` as a swappable component. The `PageBlueprint` now supports sub-pages with tabbed navigation, page title, icon, and header actions. Plugins can now specify a `title` and `icon` in `createFrontendPlugin`.
