---
'@backstage/frontend-adapter-react-router-v6': patch
'@backstage/frontend-adapter-react-router-v7': patch
'@backstage/frontend-adapter-tanstack-router': patch
'@backstage/frontend-app-api': patch
'@backstage/frontend-plugin-api': patch
'@backstage/frontend-test-utils': patch
'@backstage/ui': patch
'@backstage/plugin-app': patch
'@backstage/plugin-catalog': patch
---

Removed an unused `use-sync-external-store` dependency, which is no longer needed now that React 18 is the minimum supported version.
