---
'@backstage/plugin-kubernetes-backend': patch
---

Resource types that return a 404 from the Kubernetes API (for example, custom resource definitions not installed on a cluster) are now silently skipped instead of surfacing as errors in the UI. Other error codes (401, 403, 5xx) continue to be reported normally.
