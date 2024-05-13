---
'@backstage/backend-common': patch
---

Preparing for a stable new backend system release, we are deprecating utilities in the `backend-common` that are not used by the core framework, such as the isomorphic `Git` class. As we will no longer support the isomorphic `Git` utility in the framework packages, we recommend plugins that start maintaining their own implementation of this class.
