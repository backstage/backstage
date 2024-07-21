---
'@backstage/backend-defaults': patch
---

Fixed the routing of the new health check service, the health endpoints should now properly be available at `/.backstage/health/v1/readiness` and `/.backstage/health/v1/liveness`.
