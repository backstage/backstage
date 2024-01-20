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
  serviceLocatorMethod:
    type: 'multiTenant'
  clusterLocatorMethods:
    - type: 'config'
      clusters:
        - url: http://127.0.0.1:9999
          name: minikube
          authProvider: 'serviceAccount'
          skipTLSVerify: false
          skipMetricsLookup: true
          serviceAccountToken: ${K8S_MINIKUBE_TOKEN}
          dashboardUrl: http://127.0.0.1:64713 # url copied from running the command: minikube service kubernetes-dashboard -n kubernetes-dashboard
          dashboardApp: standard
          caData: ${K8S_CONFIG_CA_DATA}
          caFile: '' # local path to CA file
          customResources:
            - group: 'argoproj.io'
              apiVersion: 'v1alpha1'
              plural: 'rollouts'
        - url: http://127.0.0.2:9999
          name: aws-cluster-1
          authProvider: 'aws'
    - type: 'gke'
      projectId: 'gke-clusters'
      region: 'europe-west1'
      skipTLSVerify: true
      skipMetricsLookup: true
      exposeDashboard: true
```

### `serviceLocatorMethod`

This configures how to determine which clusters a component is running in.

Valid values are:

- `multiTenant` - This configuration assumes that all components run on all the
  provided clusters.

- `singleTenant` - This configuration assumes that current component run on one cluster in provided clusters.

### `clusterLocatorMethods`

This is an array used to determine where to retrieve cluster configuration from.

Valid cluster locator methods are:

- [`catalog`](#catalog)
- [`config`](#config)
- [`gke`](#gke)
- [`localKubectlProxy`](#localkubectlproxy)
- [custom `KubernetesClustersSupplier`](#custom-kubernetesclusterssupplier)

#### `catalog`

This cluster locator method will gather
[Resources](https://backstage.io/docs/features/software-catalog/system-model#resource)
of
[type](https://backstage.io/docs/features/software-catalog/descriptor-format#spectype-required-4)
`kubernetes-cluster` from the catalog and treat them as clusters for the
purposes of the Kubernetes plugin. In order for a resource to be detected by
this method, it must also have the following
[annotations](https://backstage.io/docs/features/software-catalog/descriptor-format#annotations-optional)
(as seen
[here](https://github.com/backstage/backstage/blob/86baccb2d7d378baed74eaebf017c60b410986e5/plugins/kubernetes-backend/src/cluster-locator/CatalogClusterLocator.ts#L51-L61)
in the code):

- [`kubernetes.io/api-server`](https://backstage.io/docs/reference/plugin-kubernetes-common.annotation_kubernetes_api_server/),
  denoting the base URL of the Kubernetes control plane
- [`kubernetes.io/api-server-certificate-authority`](https://backstage.io/docs/reference/plugin-kubernetes-common.annotation_kubernetes_api_server_ca/),
  containing a base64-encoded certificate authority bundle in PEM format;
  Backstage will check that the control plane presents a certificate signed by
  this authority.
- [`kubernetes.io/auth-provider`](https://backstage.io/docs/reference/plugin-kubernetes-common.annotation_kubernetes_auth_provider/),
  denoting the strategy to use to authenticate with the control plane.

There are many other annotations that can be applied to a cluster resource to
configure the way Backstage communicates, documented
[here](https://backstage.io/docs/reference/plugin-kubernetes-common#variables)
in the API reference. Here is a YAML snippet illustrating an example of a
cluster in the catalog:

```yaml
apiVersion: backstage.io/v1alpha1
kind: Resource
metadata:
  name: my-cluster
  annotations:
    kubernetes.io/api-server: 'https://127.0.0.1:53725'
    kubernetes.io/api-server-certificate-authority: # base64-encoded CA
    kubernetes.io/auth-provider: 'oidc'
    kubernetes.io/oidc-token-provider: 'microsoft'
    kubernetes.io/skip-metrics-lookup: 'true'
spec:
  type: kubernetes-cluster
  owner: user:guest
```

Note that it is insecure to store a Kubernetes service account token in an
annotation on a catalog entity (where it could easily be accidentally revealed
by the catalog API) -- therefore there is no annotation corresponding to the
[`serviceAccountToken` field](#clustersserviceaccounttoken-optional) used by
the [`config`](#config) cluster locator. Accordingly, the catalog cluster
locator does not support the [`serviceAccount`](#clustersauthprovider) auth
strategy.

This method can be quite helpful when used in combination with an ingestion
procedure like the
[`GkeEntityProvider`](https://backstage.io/docs/reference/plugin-catalog-backend-module-gcp.gkeentityprovider/)
(installation documented
[here](https://github.com/backstage/backstage/tree/master/plugins/catalog-backend-module-gcp#installation))
or the
[`AwsEKSClusterProcessor`](https://backstage.io/docs/reference/plugin-catalog-backend-module-aws.awseksclusterprocessor/)
to automatically update the set of clusters tracked by Backstage.

#### `config`

This cluster locator method will read cluster information from your app-config
(see below).

##### `clusters`

Used by the `config` cluster locator method to construct Kubernetes clients.

##### `clusters.\*.url`

The base URL to the Kubernetes control plane. Can be found by using the
"Kubernetes master" result from running the `kubectl cluster-info` command.

##### `clusters.\*.name`

A name to represent this cluster, this must be unique within the `clusters`
array. Users will see this value in the Software Catalog Kubernetes plugin.

##### `clusters.\*.authProvider`

This determines how the Kubernetes client authenticates with the Kubernetes
cluster. Valid values are:

| Value                  | Description                                                                                                                                                                                                                                                                                                                               |
| ---------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `aks`                  | This will use a user's AKS access token from the [Microsoft auth provider](https://backstage.io/docs/auth/microsoft/provider) to access the Kubernetes API on AKS clusters.                                                                                                                                                               |
| `aws`                  | This will use AWS credentials to access resources in EKS clusters                                                                                                                                                                                                                                                                         |
| `azure`                | This will use [Azure Identity](https://docs.microsoft.com/en-us/azure/active-directory/managed-identities-azure-resources/overview) to access resources in clusters                                                                                                                                                                       |
| `google`               | This will use a user's Google access token from the [Google auth provider](https://backstage.io/docs/auth/google/provider) to access the Kubernetes API on GKE clusters.                                                                                                                                                                  |
| `googleServiceAccount` | This will use the Google Cloud service account credentials to access resources in clusters                                                                                                                                                                                                                                                |
| `oidc`                 | This will use [Oidc Tokens](https://kubernetes.io/docs/reference/access-authn-authz/authentication/#openid-connect-tokens) to authenticate to the Kubernetes API. When this is used the `oidcTokenProvider` field should also be set. Please note the cluster must support OIDC, at the time of writing AKS clusters do not support OIDC. |
| `serviceAccount`       | This will use a Kubernetes [service account](https://kubernetes.io/docs/reference/access-authn-authz/service-accounts-admin/) to access the Kubernetes API. When this is used the `serviceAccountToken` field should also be set, or else Backstage should be running in-cluster.                                                         |

Check the [Kubernetes Authentication][4] section for additional explanation.

##### `clusters.\*.skipTLSVerify`

This determines whether the Kubernetes client verifies the TLS certificate
presented by the API server. Defaults to `false`.

##### `clusters.\*.skipMetricsLookup`

This determines whether the Kubernetes client looks up resource metrics
CPU/Memory for pods returned by the API server. Defaults to `false`.

##### `clusters.\*.serviceAccountToken` (optional)

The service account token to be used when using the `serviceAccount` auth
provider. Note that, unless you have an effective credential rotation procedure
in place or have a single Kubernetes cluster running both Backstage and all your
services, this auth provider is probably not ideal for production.

Assuming you have already created a service account named `SERVICE_ACCOUNT_NAME`
in namespace `NAMESPACE` and it has adequate
[permissions](#role-based-access-control), here are some sample procedures to
procure a long-lived service account token for use with this provider:

- On versions of Kubernetes [prior to
  1.24](https://github.com/kubernetes/kubernetes/blob/master/CHANGELOG/CHANGELOG-1.24.md#no-really-you-must-read-this-before-you-upgrade-1),
  you could get an (automatically-generated) token for a service account with:

  ```sh
  kubectl -n <NAMESPACE> get secret $(kubectl -n <NAMESPACE> get sa <SERVICE_ACCOUNT_NAME> -o=json \
  | jq -r '.secrets[0].name') -o=json \
  | jq -r '.data["token"]' \
  | base64 --decode
  ```

- For Kubernetes 1.24+, as described in [this
  guide](https://kubernetes.io/docs/concepts/configuration/secret/#service-account-token-secrets),
  you can obtain a long-lived token by creating a secret:

  ```sh
  kubectl apply -f - <<EOF
  apiVersion: v1
  kind: Secret
  metadata:
    name: <SECRET_NAME>
    namespace: <NAMESPACE>
    annotations:
      kubernetes.io/service-account.name: <SERVICE_ACCOUNT_NAME>
  type: kubernetes.io/service-account-token
  EOF
  ```

  waiting for the token controller to populate a token, and retrieving it with:

  ```sh
  kubectl -n <NAMESPACE> get secret <SECRET_NAME> -o go-template='{{.data.token | base64decode}}'
  ```

If a cluster has `authProvider: serviceAccount` and the `serviceAccountToken`
field is omitted, Backstage will ignore the configured URL and certificate data,
instead attempting to access the Kubernetes API via an in-cluster client as in
[this
example](https://github.com/kubernetes-client/javascript/blob/master/examples/in-cluster.js).

##### `clusters.\*.oidcTokenProvider` (optional)

This field is to be used when using the `oidc` auth provider. It will use the id tokens
from a configured [backstage auth provider](https://backstage.io/docs/auth/) to
authenticate to the cluster. The selected `oidcTokenProvider` needs to be properly
configured under `auth` for this to work.

```yaml
kubernetes:
  clusterLocatorMethods:
    - type: 'config'
      clusters:
        - name: test-cluster
          url: http://localhost:8080
          authProvider: oidc
          oidcTokenProvider: okta # This value needs to match a config under auth.providers
auth:
  providers:
    okta:
      development:
        clientId: ${AUTH_OKTA_CLIENT_ID}
        clientSecret: ${AUTH_OKTA_CLIENT_SECRET}
        audience: ${AUTH_OKTA_AUDIENCE}
```

The following values are supported out-of-the-box by the frontend: `gitlab` (the
application whose `clientId` is used by the auth provider should be granted the
`openid` scope), `google`, `microsoft`, `okta`, `onelogin`.

Take note that `oidcTokenProvider` is just the issuer for the token, you can use any
of these with an OIDC enabled cluster, like using `microsoft` as the issuer for a EKS
cluster.

##### `clusters.\*.dashboardUrl` (optional)

Specifies the link to the Kubernetes dashboard managing this cluster.

Note that you should specify the app used for the dashboard using the
`dashboardApp` property, in order to properly format links to kubernetes
resources, otherwise it will assume that you're running the standard one.

Note also that this attribute is optional for some kinds of dashboards, such as
GKE, which requires additional parameters specified in the `dashboardParameters`
option.

##### `clusters.\*.dashboardApp` (optional)

Specifies the app that provides the Kubernetes dashboard.

This will be used for formatting links to kubernetes objects inside the
dashboard.

The supported dashboards are: `standard`, `rancher`, `openshift`, `gke`, `aks`,
`eks`. However, not all of them are implemented yet, so please contribute!

Note that it will default to the regular dashboard provided by the Kubernetes
project (`standard`), that can run in any Kubernetes cluster.

Note that for the `gke` app, you must provide additional information in the
`dashboardParameters` option.

Note that you can add your own formatter by registering it to the
`clusterLinksFormatters` dictionary, in the app project.

Example:

```ts
import { clusterLinksFormatters } from '@backstage/plugin-kubernetes';
clusterLinksFormatters.myDashboard = (options) => ...;
```

See also
https://github.com/backstage/backstage/tree/master/plugins/kubernetes/src/utils/clusterLinks/formatters
for real examples.

##### `clusters.\*.dashboardParameters` (optional)

Specifies additional information for the selected `dashboardApp` formatter.

Note that, even though `dashboardParameters` is optional, it might be mandatory
for some dashboards, such as GKE.

###### required parameters for GKE

| Name          | Description                                                              |
| ------------- | ------------------------------------------------------------------------ |
| `projectId`   | the ID of the GCP project containing your Kubernetes clusters            |
| `region`      | the region of GCP containing your Kubernetes clusters                    |
| `clusterName` | the name of your kubernetes cluster, within your `projectId` GCP project |

Note that the GKE cluster locator can automatically provide the values for the
`dashboardApp` and `dashboardParameters` options if you set the
`exposeDashboard` property to `true`.

Example:

```yaml
kubernetes:
  serviceLocatorMethod:
    type: 'multiTenant'
  clusterLocatorMethods:
    - type: 'config'
      clusters:
        - url: http://127.0.0.1:9999
          name: my-cluster
          dashboardApp: gke
          dashboardParameters:
            projectId: my-project
            region: us-east1
            clusterName: my-cluster
```

##### `clusters.\*.caData` (optional)

Base64-encoded certificate authority bundle in PEM format. The Kubernetes client
will verify that the TLS certificate presented by the API server is signed by
this CA.

This value could be obtained via inspecting the kubeconfig file (usually
at `~/.kube/config`) under `clusters[*].cluster.certificate-authority-data`. For
GKE, execute the following command to obtain the value

```
gcloud container clusters describe <YOUR_CLUSTER_NAME> \
    --zone=<YOUR_COMPUTE_ZONE> \
    --format="value(masterAuth.clusterCaCertificate)"
```

See also
https://cloud.google.com/kubernetes-engine/docs/how-to/api-server-authentication#environments-without-gcloud
for complete docs about GKE without `gcloud`.

##### `clusters.\*.caFile` (optional)

Filesystem path (on the host where the Backstage process is running) to a
certificate authority bundle in PEM format. The Kubernetes client will verify
that the TLS certificate presented by the API server is signed by this CA. Note
that only clusters defined in the app-config via the [`config`](#config)
cluster locator method can be configured in this way.

##### `clusters.\*.customResources` (optional)

Configures which [custom resources][3] to look for when returning an entity's
Kubernetes resources belonging to the cluster. Same specification as [`customResources`](#customresources-optional)

#### `gke`

This cluster locator is designed to work with Kubernetes clusters running in
[GKE][1]. It will configure the Kubernetes backend plugin to make requests to
clusters running within a Google Cloud project.

This cluster locator method will use the `google` authentication mechanism.

The Google Cloud service account to use can be configured through the
`GOOGLE_APPLICATION_CREDENTIALS` environment variable. Consult the [Google Cloud
docs][2] for more information.

For example:

```yaml
- type: 'gke'
  projectId: 'gke-clusters'
  region: 'europe-west1' # optional
  authProvider: 'google' # optional
  skipTLSVerify: false # optional
  skipMetricsLookup: false # optional
  exposeDashboard: false # optional
  matchingResourceLabels: # optional
    - key: 'environment'
      value: 'production'
```

Will configure the Kubernetes plugin to connect to all GKE clusters in the
project `gke-clusters` in the region `europe-west1`.

Note that the GKE cluster locator can automatically provide the values for the
`dashboardApp` and `dashboardParameters` options if you enable the
`exposeDashboard` option.

##### `projectId`

The Google Cloud project to look for Kubernetes clusters in.

##### `region` (optional)

The Google Cloud region to look for Kubernetes clusters in. Defaults to all
regions.

##### `authProvider` (optional)

Set the authentication method for discovering clusters and gathering information
about resources.

Defaults to `google` which leverages the logged in user's Google OAuth credentials.

Set to `googleServiceAccount` to leverage
Application Default Credentials (https://cloud.google.com/docs/authentication/application-default-credentials).
To use a service account JSON key (not recommended), set the `GOOGLE_APPLICATION_CREDENTIALS` environment variable
on the Backstage backend to the path of the service account key file.

##### `skipTLSVerify` (optional)

This determines whether the Kubernetes client verifies the TLS certificate
presented by the API server. Defaults to `false`.

##### `skipMetricsLookup` (optional)

This determines whether the Kubernetes client looks up resource metrics
CPU/Memory for pods returned by the API server. Defaults to `false`.

##### `exposeDashboard` (optional)

This determines whether the `dashboardApp` and `dashboardParameters` should be
automatically configured in order to expose the GKE dashboard from the
Kubernetes plugin.

Defaults to `false`.

##### `matchingResourceLabels` (optional)

Array of key value labels used to filter out clusters which don't have the matching
[resource labels](https://cloud.google.com/resource-manager/docs/creating-managing-labels).

#### `localKubectlProxy`

This cluster locator method will assume a locally running [`kubectl proxy`](https://kubernetes.io/docs/tasks/extend-kubernetes/http-proxy-access-api/#using-kubectl-to-start-a-proxy-server) process using the default port (8001).

NOTE: This cluster locator method is for local development only and should not be used in production.

#### Custom `KubernetesClustersSupplier`

If the configuration-based cluster locators do not work for your use-case,
it is also possible to implement a
[custom `KubernetesClustersSupplier`](installation.md#custom-cluster-discovery).

### `customResources` (optional)

Configures which [custom resources][3] to look for by default when returning an entity's
Kubernetes resources.

**Notes:**

- The optional `kubernetes.customResources` property is overrode by `customResources` at the [clusters level](#clusterscustomresources-optional).

Defaults to empty array. Example:

```yaml
---
kubernetes:
  customResources:
    - group: 'argoproj.io'
      apiVersion: 'v1alpha1'
      plural: 'rollouts'
```

#### `customResources.\*.group`

The custom resource's group.

#### `customResources.\*.apiVersion`

The custom resource's apiVersion.

#### `customResources.\*.plural`

The plural representing the custom resource.

### `apiVersionOverrides` (optional)

Overrides for the API versions used to make requests for the corresponding
objects. If using a legacy Kubernetes version, you may use this config to
override the default API versions to ones that are supported by your cluster.

Example:

```yaml
---
kubernetes:
  apiVersionOverrides:
    cronjobs: 'v1beta1'
```

For more information on which API versions are supported by your cluster, please
view the Kubernetes API docs for your Kubernetes version (e.g.
[API Groups for v1.22](https://kubernetes.io/docs/reference/generated/kubernetes-api/v1.22/#-strong-api-groups-strong-)
)

### `objectTypes` (optional)

Overrides for the Kubernetes object types fetched from the cluster. The default object types are:

- pods
- services
- configmaps
- limitranges
- resourcequotas
- deployments
- replicasets
- horizontalpodautoscalers
- jobs
- cronjobs
- ingresses
- statefulsets
- daemonsets

You may use this config to override the default object types if you only want a subset of
the default ones. However, it's currently not supported to fetch object types other
than the ones specified in the default types.

Example:

```yaml
---
kubernetes:
  objectTypes:
    - configmaps
    - deployments
    - limitranges
    - pods
    - services
    - statefulsets
```

### Role Based Access Control

The current RBAC permissions required are read-only cluster wide, the below
Kubernetes manifest describes which objects are required and will ensure
the plugin functions correctly:

```yaml
---
apiVersion: rbac.authorization.k8s.io/v1
kind: ClusterRole
metadata:
  name: backstage-read-only
rules:
  - apiGroups:
      - '*'
    resources:
      - pods
      - configmaps
      - services
      - deployments
      - replicasets
      - horizontalpodautoscalers
      - ingresses
      - statefulsets
      - limitranges
      - resourcequotas
      - daemonsets
    verbs:
      - get
      - list
      - watch
  - apiGroups:
      - batch
    resources:
      - jobs
      - cronjobs
    verbs:
      - get
      - list
      - watch
  - apiGroups:
      - metrics.k8s.io
    resources:
      - pods
    verbs:
      - get
      - list
```

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

#### Adding the namespace annotation

Entities can have the `backstage.io/kubernetes-namespace` annotation, this will cause the entity's Kubernetes resources
to by looked up via that namespace.

```yaml
annotations:
  'backstage.io/kubernetes-namespace': dice-space
```

#### Labeling Kubernetes components

In order for Kubernetes components to show up in the software catalog as a part
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

### Cluster Selection annotation

This is applicable only for `singleTenant` serviceLocatorMethod.

You can now select `single` kubernetes cluster that the entity is part-of from all your defined kubernetes clusters. To apply this use the following annotation.

SingleTenant Cluster:

```yaml
'backstage.io/kubernetes-cluster': dice-cluster
```

In the example above, we configured the "backstage.io/kubernetes-cluster" annotation on the entity `catalog-info.yaml` file to specify that the current component is running in a single cluster called "dice-cluster", so this cluster must have been specified in the `app-config.yaml`, under the Kubernetes clusters configuration (for more details, see [`Configuring Kubernetes clusters`](#configuring-kubernetes-clusters)).

If you do not specify the annotation, by default Backstage fetches from all defined Kubernetes clusters.

[1]: https://cloud.google.com/kubernetes-engine
[2]: https://cloud.google.com/docs/authentication/production#linux-or-macos
[3]: https://kubernetes.io/docs/concepts/extend-kubernetes/api-extension/custom-resources/
[4]: https://backstage.io/docs/features/kubernetes/authentication
