---
'@backstage/plugin-kubernetes': patch
'@backstage/plugin-kubernetes-common': patch
---

Loosened the type of the `auth` field in the body of requests to the `retrieveObjectsByServiceId` endpoint. Now any JSON object is allowed, which should make it easier for integrators to write their own custom auth strategies for Kubernetes.
