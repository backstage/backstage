---
id: kubernetes-in-backstage
title: Kubernetes in Backstage
description: Monitoring Kubernetes based services with the service catalog
---

# Kubernetes in Backstage

Kubernetes in Backstage is a way to monitor your service's current status when
it is deployed on Kubernetes.

## Configuration

Example:

```yaml
kubernetes:
  serviceLocatorMethod: 'multiTenant'
  clusterLocatorMethods:
    - 'config'
  clusters:
    - url: http://127.0.0.1:9999
      name: minikube
      serviceAccountToken: TOKEN
      authProvider: 'serviceAccount'
    - url: http://127.0.0.2:9999
      name: gke-cluster-1
      authProvider: 'google'
```

### serviceLocatorMethod

This configures how to determine which clusters a component is running in.

Currently, the only valid serviceLocatorMethod is:

#### multiTenant

This configuration assumes that all components run on all the provided clusters.

### clusterLocatorMethods

This is used to determine where to retrieve cluster configuration from.

Currently, the only valid cluster locator method is:

#### config

This cluster locator method will read cluster information from your app-config
(see below).

##### clusters

Used by the `config` cluster locator method to construct Kubernetes clients.

###### url

The base URL to the Kubernetes control plane. Can be found by using the
`Kubernetes master` result from running the `kubectl cluster-info` command.

###### name

A name to represent this cluster, this must be unique within the `clusters`
array. Users will see this value in the Service Catalog Kubernetes plugin.

###### authProvider

This determines how the Kubernetes client authenticates with the Kubernetes
cluster. Valid values are:

| Value            | Description                                                                                                                                                                                                                       |
| ---------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `serviceAccount` | This will use a Kubernetes [service account](https://kubernetes.io/docs/reference/access-authn-authz/service-accounts-admin/) to access the Kubernetes API. When this is used the `serviceAccountToken` field should also be set. |
| `google`         | This will use a user's Google auth token from the [Google auth plugin](https://backstage.io/docs/auth/) to access the Kubernetes API.                                                                                             |

###### serviceAccount (optional)

The service account token to be used when using the `serviceAccount` auth
provider.

## RBAC

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

There are two ways to surface your kubernetes components as part of an entity.
The label selector takes precedence over the annotation/service id.

### Common `backstage.io/kubernetes-id` label

#### Adding the entity annotation

In order for Backstage to detect that an entity has Kubernetes components, the
following annotation should be added to the entity.

```yaml
annotations:
  'backstage.io/kubernetes-id': dice-roller
```

#### Labeling Kubernetes components

In order for Kubernetes components to show up in the service catalog as a part
of an entity, Kubernetes components must be labeled with the following label:

```yaml
'backstage.io/kubernetes-id': <ENTITY_NAME>
```

### label selector query annotation

#### Adding a label selector query annotation

You can write your own custom label selector query that backstage will use to
lookup the objects (similar to `kubectl --selector="your query here"`). Review
the documentation
[here](https://kubernetes.io/docs/concepts/overview/working-with-objects/labels/)
for more info

```yaml
'backstage.io/kubernetes-label-selector': 'app=my-app,component=front-end'
```
