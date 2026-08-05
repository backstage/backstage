---
id: proxy
title: Kubernetes Backend Proxy Endpoint
sidebar_label: Proxy
description: Interacting with the Kubernetes API in Backstage plugins
---

[Contributors](https://backstage.io/docs/overview/glossary#backstage-user-profiles) wanting to
create developer portal experiences based on data from Kubernetes (e.g. for
interacting with [Custom Resources](https://kubernetes.io/docs/concepts/extend-kubernetes/api-extension/custom-resources/)
beyond the default behaviors of the existing Kubernetes plugin) can leverage the
Kubernetes backend plugin's proxy endpoint to allow them to make arbitrary
requests to the [REST API](https://kubernetes.io/docs/reference/using-api/api-concepts/).

Here is a snippet fetching namespaces using the `kubernetesApiRef`:

```typescript
import { useApi } from '@backstage/core-plugin-api';
import { kubernetesApiRef } from '@backstage/plugin-kubernetes-react';

const CLUSTER_NAME = 'minikube'; // use a known cluster name

const kubernetesApi = useApi(kubernetesApiRef);
await kubernetesApi.proxy({
  clusterName: CLUSTER_NAME,
  path: '/api/v1/namespaces',
});
```

## How it works

The proxy will interpret the
[`Backstage-Kubernetes-Cluster`](https://backstage.io/docs/reference/plugin-kubernetes-backend.header_kubernetes_cluster)
header as the name of the cluster to target. This name will be compared to each cluster
returned by all the configured [cluster locators](https://backstage.io/docs/features/kubernetes/configuration#clusterlocatormethods)
-- the first cluster whose [`name` field](https://backstage.io/docs/features/kubernetes/configuration#clustersname) matches
the value in the header will be targeted.

Then the request will be forwarded to the cluster.

Overall, the only changes to each request are:

- the endpoint's base URL prefix is stripped.
- the `Backstage-Kubernetes-Authorization` header becomes the `Authorization` header that is used when forwarding the request.

The proxy expects a `KubernetesAuthTranslator` to be provided that is used to decorate all requests with `Auth` by default. It does this by supplying a `serviceAccountToken` field into `clusterDetails` using the defined `authProvider` in `clusterDetails`.

## Authentication

The proxy has no provisions for mTLS, so it cannot be used to connect to
clusters using the [x509 Client Certs](https://kubernetes.io/docs/reference/access-authn-authz/authentication/#x509-client-certs)
authentication strategy.\
The current `/proxy` Implementation expects a
[Bearer token](https://kubernetes.io/docs/reference/access-authn-authz/authentication/#putting-a-bearer-token-in-a-request)
to be provided as a `Backstage-Kubernetes-Authorization` header for a target cluster. This token will be used as the `Authorization` header when forwarding a request to a target cluster.

## Permissions

The `/proxy` route is protected by the Backstage permission framework using the
`kubernetes.proxy` permission. This check runs on **every** proxy request, before
the call is forwarded to a cluster. A user can be denied by Backstage even when
their cluster credentials would have allowed the same request on the API server.

This assumes your Backstage instance has the [permissions framework](../../permissions/getting-started.md) enabled.
See [Permissions](permissions.md) for the full list of Kubernetes plugin permissions.

The Kubernetes tab in the UI checks `kubernetes.clusters.read` and
`kubernetes.resources.read` only. Features that use the proxy (pod logs, exec,
delete, and custom integrations) can still receive **403** responses when
`kubernetes.proxy` is denied or when conditional policy rules do not match the
request.

### Deny all proxy access

To block the proxy entirely, return `DENY` for `kubernetes.proxy`:

```typescript
import {
  AuthorizeResult,
  PolicyDecision,
} from '@backstage/plugin-permission-common';
import {
  PermissionPolicy,
  PolicyQuery,
  PolicyQueryUser,
} from '@backstage/plugin-permission-node';

class KubernetesDenyAllProxyEndpointPolicy implements PermissionPolicy {
  async handle(
    request: PolicyQuery,
    user?: PolicyQueryUser,
  ): Promise<PolicyDecision> {
    if (request.permission.name === 'kubernetes.proxy') {
      return {
        result: AuthorizeResult.DENY,
      };
    }
    return { result: AuthorizeResult.ALLOW };
  }
}
```

Denied requests return a response similar to:

```json
{
  "error": {
    "name": "NotAllowedError"
  }
}
```

### Attribute-based access control

`kubernetes.proxy` is a _resource permission_ with resource type
`kubernetes-proxy-request`. The backend parses each proxy request (HTTP method,
path, and query string) into attributes such as cluster, namespace, resource
type, Kubernetes API verb, and a high-level action category (`read`, `write`,
`delete`, or `exec`).

Use a conditional policy decision to restrict proxy access—for example, read-only
operations in production clusters:

```typescript
import { RESOURCE_TYPE_KUBERNETES_PROXY } from '@backstage/plugin-kubernetes-common';
import {
  kubernetesConditions,
  createKubernetesProxyConditionalDecision,
} from '@backstage/plugin-kubernetes-backend';
import {
  AuthorizeResult,
  isResourcePermission,
  PolicyDecision,
} from '@backstage/plugin-permission-common';
import {
  PermissionPolicy,
  PolicyQuery,
  PolicyQueryUser,
} from '@backstage/plugin-permission-node';

class KubernetesReadOnlyProxyPolicy implements PermissionPolicy {
  async handle(
    request: PolicyQuery,
    user?: PolicyQueryUser,
  ): Promise<PolicyDecision> {
    if (
      isResourcePermission(request.permission, RESOURCE_TYPE_KUBERNETES_PROXY)
    ) {
      return createKubernetesProxyConditionalDecision(request.permission, {
        allOf: [
          kubernetesConditions.isAction({ actions: ['read'] }),
          kubernetesConditions.isCluster({ clusters: ['production'] }),
        ],
      });
    }
    return { result: AuthorizeResult.ALLOW };
  }
}
```

The `@backstage/plugin-kubernetes-backend` package exports condition helpers
(`kubernetesConditions`) and `createKubernetesProxyConditionalDecision` for use
in your permission policy module. The following rules are evaluated against each
request:

| Rule name          | Matches on                                                                                |
| ------------------ | ----------------------------------------------------------------------------------------- |
| `IS_CLUSTER`       | Resolved target cluster name (from configured clusters, not only the request header)      |
| `IS_NAMESPACE`     | Namespace segment of the API path, when present                                           |
| `IS_RESOURCE_TYPE` | Plural resource name (for example `pods`, `deployments`)                                  |
| `IS_ACTION`        | Action category: `read`, `write`, `delete`, or `exec`                                     |
| `IS_VERB`          | Kubernetes API verb derived from the method and path (for example `get`, `list`, `patch`) |

Policies that return a definitive `ALLOW` for `kubernetes.proxy` grant full proxy access without evaluating these attributes. Use **conditional** decisions (as in the examples above) to enforce least-privilege restrictions on read, write, delete, exec, secrets, namespaces, and clusters.

For more background on conditional policies, see [Writing a policy](../../permissions/writing-a-policy.md).

## Other known limitations

The proxy as it was released in [Backstage 1.9](../../releases/v1.9.0-changelog.md)
has a known bug:

- [#15901](https://github.com/backstage/backstage/issues/15901) - it cannot
  reliably target clusters who share the same name with another located cluster.
