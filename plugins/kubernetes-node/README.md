# @backstage/plugin-kubernetes-node

Node.js library for the Backstage Kubernetes plugin. This package provides backend interfaces and extension points for cluster management, authentication, resource fetching, and service location — allowing backend modules to extend or customize Kubernetes plugin behavior.

## Installation

```bash
# From your Backstage root directory
yarn --cwd packages/backend add @backstage/plugin-kubernetes-node
```

> **Note:** This package is primarily used by backend modules that extend the Kubernetes plugin. Most adopters won't need to install it directly.

## Extension Points

The package exposes several extension points that backend modules can use to customize the Kubernetes plugin:

| Extension Point                           | Description                                                          |
| ----------------------------------------- | -------------------------------------------------------------------- |
| `kubernetesObjectsProviderExtensionPoint` | Register a custom objects provider for fetching Kubernetes resources |
| `kubernetesClusterSupplierExtensionPoint` | Register a custom cluster supplier for cluster discovery             |
| `kubernetesAuthStrategyExtensionPoint`    | Register a custom authentication strategy                            |
| `kubernetesFetcherExtensionPoint`         | Register a custom resource fetcher                                   |
| `kubernetesServiceLocatorExtensionPoint`  | Register a custom service locator                                    |
| `kubernetesRouterExtensionPoint`          | Register a custom Express router                                     |

### Example: Custom Auth Strategy

```ts
import { createBackendModule } from '@backstage/backend-plugin-api';
import {
  kubernetesAuthStrategyExtensionPoint,
  AuthenticationStrategy,
} from '@backstage/plugin-kubernetes-node';

const myAuthStrategy: AuthenticationStrategy = {
  async getCredential(clusterDetails, authConfig) {
    return { type: 'bearer token', token: 'my-token' };
  },
  validateCluster(authMetadata) {
    return [];
  },
  presentAuthMetadata(authMetadata) {
    return authMetadata;
  },
};

export default createBackendModule({
  pluginId: 'kubernetes',
  moduleId: 'my-auth-strategy',
  register(reg) {
    reg.registerInit({
      deps: {
        authStrategy: kubernetesAuthStrategyExtensionPoint,
      },
      async init({ authStrategy }) {
        authStrategy.addAuthStrategy('my-provider', myAuthStrategy);
      },
    });
  },
});
```

## Key Interfaces

### Cluster Management

- `ClusterDetails` — Full cluster configuration including URL, auth metadata, TLS settings, dashboard config, and custom resources
- `KubernetesClustersSupplier` — Provides the list of available clusters via `getClusters()`

### Authentication

- `KubernetesCredential` — Represents a credential (bearer token, x509 certificate, or anonymous)
- `AuthenticationStrategy` — Defines how to obtain credentials for a given cluster
- `PinnipedHelper` — Helper class for Pinniped-based authentication flows

### Resource Fetching

- `KubernetesFetcher` — Fetches Kubernetes objects and pod metrics from clusters
- `KubernetesObjectsProvider` — Higher-level provider that fetches objects by entity
- `ObjectFetchParams` — Parameters for fetch operations including cluster details, credentials, and label selectors

### Service Location

- `KubernetesServiceLocator` — Resolves which clusters serve a given Backstage entity

## Links

- [Kubernetes feature documentation](https://backstage.io/docs/features/kubernetes/)
- [Backstage homepage](https://backstage.io)
