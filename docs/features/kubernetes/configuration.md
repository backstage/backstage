---
id: configuration
title: Configuring Kubernetes integration
sidebar_label: Configuration
# prettier-ignore
description: Configuring the Kubernetes integration for Backstage expose your entity's objects
---

Configuring the Backstage Kubernetes integration involves two steps:

1. Enabling the backend to collect objects from your Kubernetes cluster(s).
2. Surfacing your Kubernetes objects in catalog entities

## Configuring Kubernetes Clusters

The following is a full example entry in `app-config.yaml`:

```yaml
kubernetes:
  serviceLocatorMethod: 'multiTenant'
  clusterLocatorMethods:
    - 'config'
  clusters:
    - url: http://127.0.0.1:9999
      name: minikube
      authProvider: 'serviceAccount'
      serviceAccountToken:
        $env: K8S_MINIKUBE_TOKEN
    - url: http://127.0.0.2:9999
      name: gke-cluster-1
      authProvider: 'google'
```

### `serviceLocatorMethod`

This configures how to determine which clusters a component is running in.

Currently, the only valid value is:

- `multiTenant` - This configuration assumes that all components run on all the
  provided clusters.

### `clusterLocatorMethods`

This is an array used to determine where to retrieve cluster configuration from.

Currently, the only valid cluster locator method is:

- `config` - This cluster locator method will read cluster information from your
  app-config (see below).

### `clusters`

Used by the `config` cluster locator method to construct Kubernetes clients.

### `clusters.\*.url`

The base URL to the Kubernetes control plane. Can be found by using the
"Kubernetes master" result from running the `kubectl cluster-info` command.

### `clusters.\*.name`

A name to represent this cluster, this must be unique within the `clusters`
array. Users will see this value in the Service Catalog Kubernetes plugin.

### `clusters.\*.authProvider`

This determines how the Kubernetes client authenticates with the Kubernetes
cluster. Valid values are:

| Value            | Description                                                                                                                                                                                                                       |
| ---------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `serviceAccount` | This will use a Kubernetes [service account](https://kubernetes.io/docs/reference/access-authn-authz/service-accounts-admin/) to access the Kubernetes API. When this is used the `serviceAccountToken` field should also be set. |
| `google`         | This will use a user's Google auth token from the [Google auth plugin](https://backstage.io/docs/auth/) to access the Kubernetes API.                                                                                             |

### `clusters.\*.serviceAccount` (optional)

The service account token to be used when using the `serviceAccount` auth
provider.

### Role Based Access Control

The current RBAC permissions required are read-only cluster wide, for the
following objects:

- pods
- services
- configmaps
- deployments
- replicasets
- horizontalpodautoscalers
- ingresses

## Surfacing your Kubernetes components as part of an entity

There are two ways to surface your Kubernetes components as part of an entity.
The label selector takes precedence over the annotation/service id.

### Common `backstage.io/kubernetes-id` label

#### Adding the entity annotation

In order for Backstage to detect that an entity has Kubernetes components, the
following annotation should be added to the entity's `catalog-info.yaml`:

```yaml
annotations:
  'backstage.io/kubernetes-id': dice-roller
```

#### Labeling Kubernetes components

In order for Kubernetes components to show up in the service catalog as a part
of an entity, Kubernetes components themselves can have the following label:

```yaml
'backstage.io/kubernetes-id': <BACKSTAGE_ENTITY_NAME>
```

### Label selector query annotation

You can write your own custom label selector query that Backstage will use to
lookup the objects (similar to `kubectl --selector="your query here"`). Review
the
[labels and selectors Kubernetes documentation](https://kubernetes.io/docs/concepts/overview/working-with-objects/labels/)
for more info.

```yaml
'backstage.io/kubernetes-label-selector': 'app=my-app,component=front-end'
```
