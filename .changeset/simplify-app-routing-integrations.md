---
'@backstage/plugin-app': patch
---

Page tabs now resolve relative links through the app's routing integration, preserving external URLs, query strings, fragments, and deployment basenames. Simplified router integration while retaining React Router v6 compatibility for shared UI.
