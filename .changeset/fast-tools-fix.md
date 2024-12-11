---
'@backstage/backend-defaults': minor
---

**BREAKING CHANGE**: The `LifecycleMiddlewareOptions.startupRequestPauseTimeout` has been removed. Use the `backend.lifecycle.startupRequestPauseTimeout` setting in your `app-config.yaml` file to customize how the `createLifecycleMiddleware` function should behave. Also the root config service is required as an options when calling the `createLifecycleMiddleware` function:

```diff
- createLifecycleMiddleware({ lifecycle, startupRequestPauseTimeout })
+ createLifecycleMiddleware({ config,  lifecycle })
```
