---
'@backstage/backend-plugin-api': patch
---

**DEPRECATION**: You should no longer do a function call on backend features when adding them to backends. The support for doing that is deprecated, and you should remove all trailing `()` parentheses after plugins and modules where you add them to your backend or test backends (e.g. when using `startTestBackend`).

The background for this is that `createBackendPlugin` and `createBackendModule` function now effectively return a `BackendFeature` rather than a `() => BackendFeature`. This is part of the cleanup efforts for New Backend System 1.0. In the short run this is non-breaking because the feature type has been given a callback signature that returns itself. But we strongly recommend that you remove all now-redundant calls made to feature objects, because that callback signature will be removed in a future release.

Service factories are still callbacks at this point.

Example change:

```diff
 await startTestBackend({
   features: [
     eventsServiceFactory(), // service - stays unchanged
-    catalogModuleBitbucketCloudEntityProvider(), // module - remove parentheses
+    catalogModuleBitbucketCloudEntityProvider,
```
