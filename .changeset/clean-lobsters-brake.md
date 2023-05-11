---
'@backstage/plugin-kubernetes-backend': minor
---

Allow fetching pod metrics limited by a `labelSelector`.

This is used by the Kubernetes tab on a components' page and leads to much smaller responses being received from Kubernetes, especially with larger Kubernetes clusters.
