---
'@backstage/dev-utils': patch
'@backstage/plugin-techdocs': patch
---

Added support for React 18. The new `createRoot` API from `react-dom/client` will now be used if present.
