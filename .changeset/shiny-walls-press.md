---
'@backstage/backend-defaults': minor
---

Ensure that an error handler middleware exists at the end of each plugin `httpRouter` handler chain. This makes it so that exceptions thrown by plugin routes are caught and encoded in the standard error format.

If you were using the standard `MiddlewareFactory` just to put an `error` middleware in you router, you can now remove that at your earliest convenience since it's redundant. If you have custom error handlers in your plugin router, those will continue to function as previously. If you were relying on thrown errors propagating all the way down to the root HTTP router, you will find that they no longer do that, and may want to hoist your error handling up to the plugin level instead.
