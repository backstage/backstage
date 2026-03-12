# @backstage/plugin-kubernetes-react

React components, hooks, and API clients for the Backstage Kubernetes plugin. This package provides the frontend building blocks for displaying Kubernetes resources, pod logs, metrics, error diagnostics, and cluster links within Backstage entity pages.

## Installation

```bash
# From your Backstage root directory
yarn --cwd packages/app add @backstage/plugin-kubernetes-react
```

## API References

The package provides several API refs for interacting with Kubernetes data:

| API Ref                                | Description                                            |
| -------------------------------------- | ------------------------------------------------------ |
| `kubernetesApiRef`                     | Fetch Kubernetes objects, clusters, and proxy requests |
| `kubernetesProxyApiRef`                | Fetch pod logs, delete pods, and get events            |
| `kubernetesClusterLinkFormatterApiRef` | Format links to external Kubernetes dashboards         |
| `kubernetesAuthProvidersApiRef`        | Manage authentication for Kubernetes requests          |

## Hooks

| Hook                                                | Description                                            |
| --------------------------------------------------- | ------------------------------------------------------ |
| `useKubernetesObjects(entity, intervalMs?)`         | Fetch all Kubernetes objects associated with an entity |
| `useCustomResources(entity, matchers, intervalMs?)` | Fetch custom resources for an entity                   |
| `usePodMetrics(clusterName, matcher)`               | Get pod metric data for a specific pod                 |
| `usePodLogs(input)`                                 | Fetch logs for a pod container                         |
| `useEvents(input)`                                  | Fetch events for a Kubernetes resource                 |
| `useMatchingErrors(matcher)`                        | Get detected errors matching a resource                |

## Components

### Resource Display

- `PodsTable` — Table display of pods with optional extra columns (`READY`, `RESOURCE`)
- `ContainerCard` — Shows container details including status and resource metrics
- `ResourceUtilization` — Displays CPU/memory utilization bars
- `ManifestYaml` — Renders raw YAML for any Kubernetes object

### Resource Accordions

- `CronJobsAccordions` — Expandable list of CronJobs
- `JobsAccordions` — Expandable list of Jobs
- `IngressesAccordions` — Expandable list of Ingresses
- `ServicesAccordions` — Expandable list of Services
- `CustomResources` — Expandable list of custom resources

### Drawers and Dialogs

- `KubernetesDrawer` — Slide-out drawer for any Kubernetes object
- `KubernetesStructuredMetadataTableDrawer` — Drawer with a structured metadata table
- `PodDrawer` — Drawer showing pod details and errors
- `HorizontalPodAutoscalerDrawer` — Drawer for HPA details
- `PodLogsDialog` — Dialog for viewing pod container logs
- `PodExecTerminal` — Embedded terminal for exec into a pod container
- `PodExecTerminalDialog` — Dialog wrapping the pod exec terminal
- `FixDialog` — Dialog suggesting fixes for detected errors

### Error Handling

- `ErrorPanel` — Shows an error message for the Kubernetes plugin
- `LinkErrorPanel` — Error panel with cluster link
- `ErrorReporting` — Summarizes detected errors across clusters
- `ErrorList` — Lists pods with their associated errors

### Events

- `Events` — Fetches and displays events for a given resource
- `EventsContent` — Renders a list of events (with optional warning-only filter)

### Cluster

- `Cluster` — Component for displaying cluster overview and resources

## Contexts

The package provides React contexts for passing Kubernetes data through component trees:

- `ClusterContext` — Current cluster attributes
- `GroupedResponsesContext` — Grouped Kubernetes responses (pods, deployments, services, etc.)
- `DetectedErrorsContext` — Detected errors for the current scope
- `PodMetricsContext` — Pod metrics data by cluster
- `PodNamesWithErrorsContext` — Set of pod names with detected errors

## Cluster Link Formatting

Built-in classes for generating dashboard links:

`StandardClusterLinksFormatter`, `GkeClusterLinksFormatter`, `AksClusterLinksFormatter`, `EksClusterLinksFormatter`, `OpenshiftClusterLinksFormatter`, `RancherClusterLinksFormatter`, `HeadlampClusterLinksFormatter`

## Auth Providers

Built-in authentication providers:

- `GoogleKubernetesAuthProvider` — Google/GKE authentication
- `AksKubernetesAuthProvider` — Azure AKS authentication
- `OidcKubernetesAuthProvider` — OIDC-based authentication
- `ServerSideKubernetesAuthProvider` — Server-side (service account) authentication

## Links

- [Kubernetes feature documentation](https://backstage.io/docs/features/kubernetes/)
- [Backstage homepage](https://backstage.io)
