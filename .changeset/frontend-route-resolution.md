---
'@backstage/frontend-app-api': patch
---

Added support for route references that target extension IDs, making routing more resilient to package duplication while retaining compatibility with existing route references and legacy conversion utilities.

Frontend modules can now override a plugin's named routes and external routes. Existing references follow the selected overrides, including aliases registered under multiple names.
