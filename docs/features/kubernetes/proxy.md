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

Here is a snippet fetching namespaces using the `KubernetesBackendClient` library

```typescript
import { useApi } from '@backstage/core-plugin-api';
import { kubernetesApiRef } from '@backstage/plugin-kubernetes';

const CLUSTER_NAME = ''; // use a known cluster name

const kubernetesApi = useApi(kubernetesApiRef);
await kubernetesApi.proxy(CLUSTER_NAME, '/api/v1/namespaces');
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

## How to disable the proxy endpoint via PermissionPolicy

The kubernetes plugin can disable the use of the `proxy` endpoint by leveraging the permission framework. This integration allows admins to use well defined PermissionPolicies to restrict the use of the endpoint all together. The `proxy` endpoint can return 403 errors even if it has a valid ID token attached that a cluster would authorize thus allowing integrators the confidence that Backstage is not accessing kubernetes clusters on behalf of undesired parties.

This feature assumes your backstage instance has enabled the [permissions framework](https://backstage.io/docs/permissions/getting-started)

A sample policy like:

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

would leverage the permission framework to return the following response:

```json
{
  "error": {
    "name": "NotAllowedError"
  }
}
```

even if a valid ID token was attached that a cluster would authorize.

## Other known limitations

The proxy as it was released in [Backstage 1.9](../../releases/v1.9.0-changelog.md#patch-changes-15)
has a known bug:

- [#15901](https://github.com/backstage/backstage/issues/15901) - it cannot
  reliably target clusters who share the same name with another located cluster.
