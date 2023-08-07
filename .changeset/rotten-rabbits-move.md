---
'@backstage/plugin-proxy-backend': minor
---

Defining proxy endpoints directly under the root `proxy` configuration key is deprecated. Endpoints should now be declared under `proxy.endpoints` instead. The `skipInvalidProxies` and `reviveConsumedRequestBodies` can now also be configured through static configuration.
