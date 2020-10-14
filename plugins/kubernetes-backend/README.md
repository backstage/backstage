# Kubernetes Backend

WORK IN PROGRESS

This is the backend part of the Kubernetes plugin.

It responds to Kubernetes requests from the frontend.

## Configuration

### serviceLocatorMethod

This configures how to determine which clusters a component is running in.

Currently, the only valid serviceLocatorMethod is:

#### multiTenant

This configuration assumes that all components run on all the provided clusters.

### clusterLocatorMethods

This is used to determine where to retrieve cluster configuration from.

Currently, the only valid serviceLocatorMethod is:

#### config

This clusterLocatorMethod will read cluster information in from config

Example:

```yaml
kubernetes:
  serviceLocatorMethod: 'multiTenant'
  clusterLocatorMethods:
    - 'config'
  clusters:
    - url: http://127.0.0.1:9999
      name: minikube
      serviceAccountToken: <TOKEN FROM STEP 4>
      authProvider: 'serviceAccount'
    - url: http://127.0.0.2:9999
      name: gke-cluster-1
      authProvider: 'google'
```

##### clusters

Used by the `config` `clusterLocatorMethods` to construct Kubernetes clients.

###### url

The base url to the Kubernetes control plane. Can be found by using the `Kubernetes master` result from running the `kubectl cluster-info` command.

###### name

A name to represent this cluster, this must be unique within the `clusters` array. Users will see this value in the Service Catalog Kubernetes plugin.

###### authProvider

This determines how the Kubernetes client authenticate with the Kubernetes cluster. Valid values are:

| Value            | Description                                                                                                                                                                                                                       |
| ---------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `serviceAccount` | This will use a Kubernetes [service account](https://kubernetes.io/docs/reference/access-authn-authz/service-accounts-admin/) to access the Kubernetes API. When this is used the `serviceAccountToken` field should also be set. |
| `google`         | This will use a user's google auth token from the [google auth plugin](https://backstage.io/docs/auth/) to access the Kubernetes API.                                                                                             |

###### serviceAccount (optional)

The service account token to be used when using the `authProvider`, `serviceAccount`.

## RBAC

The current RBAC permissions required are read-only cluster wide, for the following objects:

- pods
- services
- configmaps
- deployments
- replicasets
- horizontalpodautoscalers
- ingresses
