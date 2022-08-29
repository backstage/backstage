---
id: kubernetes-auth
title: Kubernetes Authentication
description: Authentication in kubernetes plugin
---

The authentication process in kubernetes is basically separate from backstage auth, the
providers are configured so your kubernetes plugin can locate and access the clusters you
have access to, the providers currently available are categorized in server side auth and
client side auth, here's the list:

## Server Side Providers

These providers authenticate your application with the clusters, meaning anyone that is
logged in into your backstage app will be able to access the same clusters, the providers
available as server side are `serviceAccount`, `googleServiceAccount`, `aws`, `azure`
and `localKubectlProxy`.

## Client Side Providers

These providers authenticate your user with the cluster, each user will be requested for
credentials and will have access to the clusters as long as the user has been authorized
to access said cluster, if the cluster is listed in the `clusterLocatorMethods` in the
config, but the user hasn't been authorized to access, the user will see the cluster
listed but will not see any resources in the plugin page for that cluster, and the error
will show as `401` or similar, current providers available are `google` and `oidc`.
