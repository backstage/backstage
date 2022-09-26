---
id: authentication
title: Kubernetes Authentication
description: Authentication in Kubernetes plugin
---

The authentication process in Kubernetes relies on `KubernetesAuthProviders`, which are
not the same as the application's auth providers, the default providers are defined in
`plugins/kubernetes/src/kubernetes-auth-provider/KubernetesAuthProviders.ts`, you can
add custom providers there if needed.

These providers are configured so your Kubernetes plugin can locate and access the
clusters you have access to, some of them have special requirements in the third party in
question, like Azure's Managed AAD subscription or Azure RBAC support active on the cluster.

The providers currently available are divided into server side and client side.

## Server Side Providers

These providers authenticate your _application_ with the cluster, meaning anyone that is
logged in into your backstage app will be granted the same access to Kubernetes objects, including guest users.

The providers available as server side are:

- `aws`
- `azure`
- `googleServiceAccount`
- `localKubectlProxy`
- `serviceAccount`

### Azure

The Azure server side authentication provider works by authenticating on the server with
the Azure CLI, please note that [Azure AD Authentication][1] is a requirement and has to
be enabled in your AKS cluster, then follow these steps:

- [Install the Azure CLI][2] in the environment where the backstage application will run.
- Login with your Azure/Microsoft account with `az login` in the server's terminal.
- Go to your AKS cluster's resource page in Azure Console and follow the steps in the
  `Connect` tab to set the subscription and get your credentials for `kubectl` integration.
- Configure your cluster to use the `azure` auth provider like this:

```yaml
kubernetes:
  clusterLocatorMethods:
    - type: 'config'
      clusters:
        - name: My AKS cluster
          url: ${AZURE_CLUSTER_API_SERVER_ADDRESS}
          authProvider: azure
          skipTLSVerify: true
```

To get the API server address for your Azure cluster, go to the Azure console page for the
cluster resource, go to `Overview` > `Properties` tab > `Networking` section and copy paste
the API server address directly in that `url` field.

## Client Side Providers

These providers authenticate your _user_ with the cluster. Each Backstage user will be
prompted for credentials and will have access to the clusters as long as the user has been
authorized to access said cluster. If the cluster is listed in the `clusterLocatorMethods`,
but the user hasn't been authorized to access, the user will see the cluster listed but
will not see any resources in the plugin page for that cluster, and the error will show
as `401` or similar.

The providers available as client side are:

- `google`
- `oidc`

[1]: https://docs.microsoft.com/en-us/azure/aks/managed-aad
[2]: https://docs.microsoft.com/en-us/cli/azure/install-azure-cli?view=azure-cli-latest
