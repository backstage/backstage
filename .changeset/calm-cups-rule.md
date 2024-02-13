---
'@backstage/backend-dynamic-feature-service': patch
---

Fix wrong `alpha` support in dynamic plugins support: the `alpha` sub-package should not be required for the dynamic plugins to be loaded under the new backend system.
