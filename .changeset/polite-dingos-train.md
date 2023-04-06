---
'@backstage/plugin-kubernetes': minor
---

Added Pod logs components for Kubernetes plugin

**BREAKING**: `kubernetesProxyApi` must be defined as an apis in the plugin to use k8s proxy features

```
...
export const kubernetesPlugin = createPlugin({
  id: 'kubernetes',
  apis: [
...
    createApiFactory({
        api: kubernetesProxyApiRef,
        deps: {
        kubernetesApi: kubernetesApiRef,
        },
        factory: ({ kubernetesApi }) =>
        new KubernetesProxyClient({
            kubernetesApi,
        }),
    }),
```
