---
'@backstage/plugin-app': patch
'@backstage/plugin-app-react-router-v6': patch
'@backstage/plugin-app-react-router-v7': patch
'@backstage/plugin-app-tanstack-router': patch
'@backstage/core-components': patch
---

Scoped routing now derives page ancestry from the app node and shared route resolution API, without requiring a separate page-mount context. Page-relative navigation and mixed-router nesting retain their existing behavior.
