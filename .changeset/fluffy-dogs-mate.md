---
'@backstage/backend-dynamic-feature-service': patch
---

Enhance and simplify the activation of the dynamic plugins feature:

- The dynamic plugins service (which implements the `DynamicPluginsProvider`) is restored, since it is required for plugins to depend on it in order to get the details of loaded dynamic plugins (possibly with loading errors to be surfaced in some UI).
- A new all-in-one feature loader (`dynamicPluginsFeatureLoader`) is provided that allows a 1-liner activation of both the dynamic features and additional services or plugins required to have the dynamic plugins work correctly with dynamic plugins config schemas. Previous service factories or feature loaders are deprecated.
