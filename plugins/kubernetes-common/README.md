# @backstage/plugin-kubernetes-common

Shared types, constants, and utilities for the Backstage Kubernetes plugin ecosystem. This package is used by both the frontend (`@backstage/plugin-kubernetes-react`) and backend (`@backstage/plugin-kubernetes-backend`) packages, providing a consistent set of interfaces for Kubernetes resource fetching, error detection, and cluster management.

## Installation

```bash
# From your Backstage root directory
yarn --cwd packages/app add @backstage/plugin-kubernetes-common
```

> **Note:** You typically don't install this package directly — it is pulled in as a dependency of `@backstage/plugin-kubernetes-react` or `@backstage/plugin-kubernetes-backend`.

## What's Included

### Entity Annotations

Constants for entity annotations used to configure Kubernetes integration:

| Annotation                                       | Description                                        |
| ------------------------------------------------ | -------------------------------------------------- |
| `backstage.io/kubernetes-id`                     | Associates an entity with Kubernetes resources     |
| `backstage.io/kubernetes-label-selector`         | Uses a label selector to find Kubernetes resources |
| `kubernetes.io/api-server`                       | Specifies the Kubernetes API server URL            |
| `kubernetes.io/api-server-certificate-authority` | CA data for the API server                         |
| `kubernetes.io/auth-provider`                    | Authentication provider to use                     |
| `kubernetes.io/oidc-token-provider`              | OIDC token provider name                           |
| `kubernetes.io/skip-metrics-lookup`              | Skips pod metrics lookup                           |
| `kubernetes.io/skip-tls-verify`                  | Skips TLS verification                             |
| `kubernetes.io/dashboard-url`                    | URL to the Kubernetes dashboard                    |
| `kubernetes.io/dashboard-app`                    | Dashboard application type                         |
| `kubernetes.io/dashboard-parameters`             | Additional dashboard parameters                    |

### Permissions

Permission resources for Backstage's permission framework:

- `kubernetesProxyPermission` — Controls access to the Kubernetes proxy endpoint
- `kubernetesResourcesReadPermission` — Controls access to `/resources` and `/services/:serviceId` endpoints
- `kubernetesClustersReadPermission` — Controls access to the `/clusters` endpoint

### Types and Interfaces

Key types used across the Kubernetes plugin ecosystem:

- **Request/Response** — `KubernetesRequestBody`, `ObjectsByEntityResponse`, `ClusterObjects`, `FetchResponse`
- **Cluster** — `ClusterAttributes`, including dashboard configuration
- **Resources** — Typed fetch responses for pods, deployments, services, configmaps, secrets, jobs, cronjobs, ingresses, statefulsets, daemonsets, persistent volumes, and custom resources
- **Metrics** — `ClientPodStatus`, `ClientContainerStatus`, `ClientCurrentResourceUsage`
- **Errors** — `KubernetesFetchError`, `DetectedError`, `ProposedFix` (with `LogSolution`, `DocsSolution`, and `EventsSolution` variants)

### Utility Functions

- `groupResponses(fetchResponse)` — Groups raw fetch responses by resource type into a `GroupedResponses` object
- `detectErrors(objects)` — Analyzes Kubernetes objects and returns detected errors grouped by cluster

## Links

- [Kubernetes feature documentation](https://backstage.io/docs/features/kubernetes/)
- [Backstage homepage](https://backstage.io)
