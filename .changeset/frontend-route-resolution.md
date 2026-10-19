---
'@backstage/frontend-app-api': patch
---

Added support for route references that target extension IDs, making routing more resilient to package duplication while retaining compatibility with existing route references and legacy conversion utilities.

Frontend modules can now add named routes and override absolute or external routes. Existing references, including aliases and subroutes, follow the selected absolute route overrides. Named subroutes cannot be overridden.
