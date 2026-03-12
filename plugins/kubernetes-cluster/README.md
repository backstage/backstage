# @backstage/plugin-kubernetes-cluster

A Backstage frontend plugin that shows details of Kubernetes clusters on entity pages. It displays cluster overview information, node status, and API resources for entities annotated with `kubernetes.io/api-server`.

## Features

- **Cluster Overview** — Shows a summary of the Kubernetes cluster associated with an entity.
- **Node Status** — Displays information about the nodes in the cluster.
- **API Resources** — Lists the available API resources on the cluster.

## Installation

```bash
# From your Backstage root directory
yarn --cwd packages/app add @backstage/plugin-kubernetes-cluster
```

## Usage

The plugin provides `EntityKubernetesClusterContent`, which can be added as a tab on entity pages. It requires the `kubernetes.io/api-server` annotation on the entity.

Add the following annotation to your entity's `catalog-info.yaml`:

```yaml
metadata:
  annotations:
    kubernetes.io/api-server: https://my-cluster-api-server
```

Then add the content component to your entity page:

```tsx
import { EntityKubernetesClusterContent } from '@backstage/plugin-kubernetes-cluster';

// In your EntityPage definition
<EntityLayout.Route path="/kubernetes-cluster" title="Kubernetes Cluster">
  <EntityKubernetesClusterContent />
</EntityLayout.Route>;
```

You can also conditionally show the tab using the `isKubernetesClusterAvailable` helper:

```tsx
import {
  EntityKubernetesClusterContent,
  isKubernetesClusterAvailable,
} from '@backstage/plugin-kubernetes-cluster';

<EntityLayout.Route
  path="/kubernetes-cluster"
  title="Kubernetes Cluster"
  if={isKubernetesClusterAvailable}
>
  <EntityKubernetesClusterContent />
</EntityLayout.Route>;
```

## Dependencies

This plugin requires the following Backstage packages to be installed:

- `@backstage/plugin-kubernetes-common`
- `@backstage/plugin-kubernetes-react`

For the plugin to retrieve data, you also need the Kubernetes backend plugin set up. See the [Kubernetes feature documentation](https://backstage.io/docs/features/kubernetes/) for setup instructions.

## Links

- [Kubernetes feature documentation](https://backstage.io/docs/features/kubernetes/)
- [The Backstage homepage](https://backstage.io)
