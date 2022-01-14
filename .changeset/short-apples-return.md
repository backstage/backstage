---
'@backstage/core-app-api': patch
---

Added validation during the application startup that detects if there are any plugins present that have not had their required external routes bound. Failing the validation will cause a hard crash as it is a programmer error. It lets you detect early on that there are dangling routes, rather than having them cause an error later on.
