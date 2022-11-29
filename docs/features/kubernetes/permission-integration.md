---
id: permission-integration
title: Example Integration with Permission Framework
description: An example of Kubernetes plugin endpoint responses when integrated with the permission framework
---

## Prerequisites

This permission framework integration with the kubernetes plugin assumes you have already done the following:

- Ensure that your backstage app has enabled the permission framework. See the "[getting started](./getting-started.md)" permission documentation for Backstage integrators.
- Ensure that you have a kubernetes resource in the cluster you are using. Our current implementation recognizes the types of resources shown below:

```
export type KubernetesObjectTypes =
   | 'pods'
   | 'services'
   | 'configmaps'
   | 'deployments'
   | 'limitranges'
   | 'replicasets'
   | 'horizontalpodautoscalers'
   | 'jobs'
   | 'cronjobs'
   | 'ingresses'
   | 'customresources'
```

- Ensure that the kubernetes resources in your cluster have a label that an entity in your catalog can use via label selector annotation. Workloads and custom endpoints make use of an entity reference field in the request, that entity reference should have an annotation like:

```
metadata:
    annotations:
        'backstage.io/kubernetes-label-selector': 'app=backstage'
```

that should correspond to the label you provide your kubernetes resource when creating it. In this case your pod should have the label 'app=backstage'

- Ensure that you provide a backstage bearer token when calling the /workloads and /custom endpoints. The /clusters endpoint currently doesn't require this. Because a token is required for 2 out of the 3 endpoints it is required for you to login using one of the backstage auth providers. You can add a console.log line in packages/backend/src/plugins/auth.ts for an issued token under the provider that you are using to access that token.

## How do the endpoints work prior to the permission framework integration?

By default, Backstage endpoints are not protected, and all actions are available to anyone. The same is true for the Kubernetes plugin endpoints provided you have properly configured the cluster locator stanza in your [app-config](../../app-config.yaml). By default if a user attempts to make a call to any of the following endpoints:

- api/kubernetes/resources/workloads/query
- api/kubernetes/resources/custom/query
- api/kubernetes/clusters

then you are returned a response like:

### api/kubernetes/resources/workloads/query

```
{
    items: [
        {
        cluster: {
            name: 'clusterOne',
        },
        podMetrics: [],
        resources: [
            {
            type: 'pods',
            resources: [
                {
                metadata: {
                    name: 'pod1',
                },
                },
            ],
            },
            { type: 'services', resources: [] },
            { type: 'configmaps', resources: [] },
            { type: 'limitranges', resources: [] },
            {
            type: 'deployments',
            resources: [
                {
                name: 'deployment1',
                },
            ],
            },
            { type: 'replicasets', resources: [] },
            { type: 'horizontalpodautoscalers', resources: [] },
            { type: 'jobs', resources: [] },
            { type: 'cronjobs', resources: [] },
            { type: 'ingresses', resources: [] },
            { type: 'statefulsets', resources: [] },
            { type: 'daemonsets', resources: [] },
        ],
        errors: [],
        },
    ],
}
```

\*Note that here we are querying a cluster that has two resources, a pod and a deployment running

### api/kubernetes/clusters

```
{
    "items": [
        {
            "name": "kind",
            "authProvider": "serviceAccount"
        }
    ]
}
```

\*Note that in our app-config we use the service account method to authenticate using a service account token and we are using a local kind cluster for this example

## How do the endpoints work after the permission framework integration?

If we leverage the permission framework in the Kubernetes plugin this allows for finer-grained control over access to kubernetes resources via definitive and conditional policy decisions returned by a permission policy. We are allowing plugin authors the ability to restrict kubernetes endpoints so that it is safer to configure kubernetes clusters.

A sample policy like

```
class DenyAllKubernetesClusterRead implements PermissionPolicy {
  async handle(request: PolicyQuery): Promise<PolicyDecision> {
    if (isPermission(request.permission, kubernetesClusterReadPermission)) {
      return { result: AuthorizeResult.DENY };
    }
    return { result: AuthorizeResult.ALLOW };
  }
}
```

would now leverage the permission framework to give us the following response:
api/kubernetes/clusters

```
{
    "error": {
        "name": "NotAllowedError"
    }
}
```

A Sample policy like

```
class K8sPermissionOnlyPodsPolicy implements PermissionPolicy {
  async handle(
    request: PolicyQuery,
    user?: BackstageIdentityResponse,
  ): Promise<PolicyDecision> {
    if (
      isPermission(
        request.permission,
        kubernetesWorkloadResourcesReadPermission,
      )
    ) {
      return createKubernetesConditionalDecision(
        request.permission,
        kubernetesConditions.isOfKind({ kind: 'pods' } ?? { kind: '' }),
      );
    }

    return { result: AuthorizeResult.ALLOW };
  }
}
```

would now leverage the permission framework to give us the following response:

```
{
    items: [
        {
            cluster: {
                name: 'clusterOne',
        },
            podMetrics: [],
            resources: [
                {
                    type: 'pods',
                    resources: [
                        {
                            metadata: {
                                name: 'pod1',
                            },
                        },
                    ],
                },
            ],
            errors: [],
        },
    ],
}
```

## How do I try out the integration?

First we make a file in the root of this directory and then add the location of the new file to our config file.

new kubernetes.yaml

```
apiVersion: backstage.io/v1alpha1
kind: Component
metadata:
  name: backstage-k8s
  title: Backstage Server on k8s
  annotations:
    'backstage.io/kubernetes-label-selector': 'app=backstage'
spec:
  type: service
  lifecycle: stable
  owner: user:guest
```

We then append the file location to our config file

app-config.yaml

```
catalog:
    locations:
        - type: file
            target: ../../kubernetes.yaml
```

We assume you have already created some resource in the cluster you have configured with the label app=backstage. If you have not you can create a pod using a yaml like the one listed below and you can apply it in your terminal using kubectl apply -f pod.yaml:

pod.yaml

```
apiVersion: v1
kind: Pod
metadata:
    name: new-pod
    labels:
        app: backstage
spec:
    containers:
       - name: test-cont
         image: nginx
```

Now that you have these entities set up you can make a sample policy under packages/backend/src/plugins/permission.ts

After creating the policy class like in the examples above make sure to set the policy at the bottom of the file. Change the value of policy in that method call to the name of the policy you just created.

Before:

```
policy: new ExamplePermissionPolicy(),
```

After:

```
policy: new K8sPermissionOnlyPodsPolicy(),
```

You can curl responses in your terminal or use a third party tool like postman to see api responses. If you are testing on a local kind cluster you can make a request to http://localhost:7007/api/kubernetes/clusters and compare responses there with different policies.

if you are testing the conditional policy decisions on a local kind cluster to the workload endpoint you would make the call to http://localhost:7007/api/kubernetes/resources/workloads/query and provide a backstage bearer token in the authorization header in order to use this endpoint.
\*Note that if you are testing the conditional policy like in the example above we assume you have already created both a pod and a deployment with the appropriate labels.
