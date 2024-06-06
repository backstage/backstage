---
'@backstage/backend-defaults': patch
---

Added core service factories and implementations from
`@backstage/backend-app-api`. They are now available as subpath exports, e.g.
`@backstage/backend-defaults/scheduler` is where the service factory and default
implementation of `coreServices.scheduler` now lives. They have been marked as
deprecated in their old locations.
