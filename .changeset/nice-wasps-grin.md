---
'@backstage/core-components': patch
'@backstage/plugin-app-visualizer': patch
'@backstage/plugin-catalog': patch
---

Fixed tab navigation URL duplication in `RoutedTabs`, `EntityTabs`, and `AppVisualizerPage` caused by the `v7_relativeSplatPath` future flag. Replaced `useRoutes` with `matchRoutes` for direct rendering and added `../` prefix for relative tab links when inside a splat child route.
