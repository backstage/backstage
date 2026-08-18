---
'@backstage/plugin-kubernetes-backend': patch
---

The Kubernetes API proxy now refreshes cached middleware when cluster details change, after a configurable TTL, or when the cache reaches its size limit. At startup, the backend logs a warning for each cluster configured with `skipTLSVerify: true`. Invalid cache configuration values fall back to defaults. Optional configuration is available under `kubernetes.proxy.middlewareCache`.
