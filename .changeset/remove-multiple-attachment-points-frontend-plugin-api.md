---
'@backstage/frontend-plugin-api': patch
---

**DEPRECATED**: Multiple attachment points for extensions have been deprecated. The functionality continues to work for backward compatibility, but will log a deprecation warning and be removed in a future release.

Extensions using array attachment points should migrate to using Utility APIs instead. See the [Sharing Extensions Across Multiple Locations](https://backstage.io/docs/frontend-system/architecture/27-sharing-extensions) guide for the recommended pattern.
