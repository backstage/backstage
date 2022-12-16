---
'@backstage/plugin-kubernetes-backend': minor
'@backstage/plugin-kubernetes-common': minor
'@backstage/plugin-kubernetes': patch
---

Kubernetes plugin now gracefully surfaces transport-level errors (like DNS or timeout, or other socket errors) occurring while fetching data. This will be merged into any data that is fetched successfully, fixing a bug where the whole page would be empty if any fetch operation encountered such an error.
