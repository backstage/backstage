---
'@backstage/backend-defaults': patch
---

The `RootHttpRouterFactoryOptions` have been deprecated alongside the deprecation of service factory options. A new `startRootHttpServer` function is now exported to instead help simplify re-implementation of the root HTTP service. For more information on how to customize the root HTTP router service, see the [Root HTTP Router Service docs](https://backstage.io/docs/backend-system/core-services/root-http-router#configuring-the-service).
