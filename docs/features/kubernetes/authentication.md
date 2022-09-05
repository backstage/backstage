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
logged in into your backstage app will be granted the same access to Kubernetes objects.

The providers available as server side are:

- `aws`
- `azure`
- `googleServiceAccount`
- `localKubectlProxy`
- `serviceAccount`

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
