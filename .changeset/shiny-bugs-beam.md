---
'@backstage/plugin-permission-backend': minor
'@backstage/plugin-permission-node': minor
---

Optimizations to the integration between the permission backend and plugin-backends using createPermissionIntegrationRouter:

- The permission backend already supported batched requests to authorize, but would make calls to plugin backend to apply conditions serially. Now, after applying the policy for each authorization request, the permission backend makes a single batched /apply-conditions request to each plugin backend referenced in policy decisions.
- The `getResource` method accepted by `createPermissionIntegrationRouter` has been replaced with `getResources`, to allow consumers to make batch requests to upstream data stores. When /apply-conditions is called with a batch of requests, all required resources are requested in a single invocation of `getResources`.

Plugin owners consuming `createPermissionIntegrationRouter` should replace the `getResource` method in the options with a `getResources` method, accepting an array of resourceRefs, and returning an array of the corresponding resources.
