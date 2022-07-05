---
'@backstage/plugin-kubernetes-backend': minor
---

Add new endpoints to Kubernetes backend plugin

BREAKING: Kubernetes backend plugin now depends on CatalogApi

```typescript
// Create new CatalogClient
const catalogApi = new CatalogClient({ discoveryApi: env.discovery });
const { router } = await KubernetesBuilder.createBuilder({
  logger: env.logger,
  config: env.config,
  // Inject it into createBuilder params
  catalogApi,
}).build();
```
