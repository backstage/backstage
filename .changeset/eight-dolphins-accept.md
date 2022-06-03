---
'@backstage/plugin-kubernetes': patch
'@backstage/plugin-kubernetes-backend': minor
'@backstage/plugin-kubernetes-common': minor
---

Add new backend endpoints, service/:serviceId endpoint is deprecated.

Breaking: Backend now requires discovery api config

e.g:

```yaml
backend:
  baseUrl: http://localhost:7007
```
