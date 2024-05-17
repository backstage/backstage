---
'@backstage/backend-app-api': patch
---

Deprecated core service factories and implementations and moved them over to
subpath exports on `@backstage/backend-defaults` instead. E.g.
`@backstage/backend-defaults/scheduler` is where the service factory and default
implementation of `coreServices.scheduler` now lives.
