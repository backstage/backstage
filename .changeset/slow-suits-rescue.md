---
'@backstage/plugin-catalog-backend-module-gcp': patch
---

Fix GKE endpoint parsing

Endpoint is an IP, not url. It is always https on default (443) port
ref: https://cloud.google.com/kubernetes-engine/docs/reference/rest/v1/projects.locations.clusters#Cluster
