---
'@backstage/frontend-app-api': patch
---

Added support for route references that target extension IDs, making routing more resilient to package duplication while retaining compatibility with existing route references and legacy conversion utilities.

Targeted references resolve the complete path through their ancestor extensions. They must declare all required path parameters, whose values are supplied by the caller rather than inherited from the current location.

Frontend modules can now add named routes and override absolute or external routes. Existing references, including aliases and subroutes, follow the selected absolute route overrides. Named subroutes cannot be overridden.

Routing validation now reports structured app errors for invalid overrides, parameters, targets, and ambiguous fallback mounts. These errors are fatal by default and can be treated as warnings using `maybeCreateErrorPage`'s `warningCodes` option; affected routes remain unavailable without disrupting valid routes.
