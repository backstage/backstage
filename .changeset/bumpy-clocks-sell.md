---
'@backstage/core-compat-api': patch
'@backstage/frontend-dynamic-feature-loader': patch
'@backstage/frontend-plugin-api': patch
'@backstage/frontend-test-utils': patch
'@backstage/frontend-defaults': patch
'@backstage/frontend-app-api': patch
'@backstage/plugin-app': patch
---

Decouple the frontend system from `react-router-dom` by introducing a router-agnostic `RoutingContext` in `@backstage/frontend-plugin-api` and a `ReactRouter6Provider` adapter in `@backstage/frontend-app-api`. This allows for plug and play router implementations, which can now be injected via `createApp` options.
