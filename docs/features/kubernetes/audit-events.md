---
id: audit-events
title: Audit Events
description: Tracking access to your Kubernetes clusters and resources.
---

The Kubernetes backend emits audit events for various operations. Events are grouped logically by `eventId`, with `queryType` providing further distinction within an operation group.

## Cluster Events

- **`cluster-fetch`**: Retrieves cluster information.

  Filter on `queryType`.

  - **`list`**: Fetching configured clusters. (GET `/api/kubernetes/clusters`) — default (`low`) severity.
  - **`proxy`**: Proxying requests to the Kubernetes API. (`/api/kubernetes/proxy/*`)
    - Logged at `medium` severity.
    - Additional metadata includes `clusterName`, `method`, and `path`.

- **Note:** By default, "low" severity audit events like `cluster-fetch` with `queryType: list` and `resource-fetch` aren't logged because they map to the "debug" level, while Backstage defaults to "info" level logging. To see these events, update your `app-config.yaml` by setting `backend.auditor.severityLogLevelMappings.low: info`. See the [Auditor Service documentation](https://backstage.io/docs/backend-system/core-services/auditor/#severity-levels-and-default-mappings) for details on severity mappings.

## Resource Events

- **`resource-fetch`**: Retrieves Kubernetes resources for catalog entities. Default (`low`) severity.

  Filter on `queryType`.

  - **`workloads`**: Fetching workload objects for an entity. (POST `/api/kubernetes/resources/workloads/query`)
  - **`custom`**: Fetching custom resources for an entity. (POST `/api/kubernetes/resources/custom/query`)
  - **`services`**: Fetching Kubernetes objects by service. (POST `/api/kubernetes/services/:serviceId`) @deprecated

  Filter on `entityRef` to identify the catalog entity being queried.
