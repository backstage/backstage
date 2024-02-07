---
'@backstage/plugin-kubernetes-backend': patch
---

adds a x-goog-api-client header to existing API requests in this plugin to clearly identify API requests from this GKE plugin. headers are formatted as follows where `libVersion` represents the current dotted version number of the Backstage GKE plugin and `libName` represent the current Google API used at backstage.
