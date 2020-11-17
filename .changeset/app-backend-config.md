---
'@backstage/plugin-app-backend': minor
---

Use new config schema support to automatically inject config with frontend visibility, in addition to the existing env schema injection.

This removes the confusing behavior where configuration was only injected into the app at build time. Any runtime configuration (except for environment config) in the backend used to only apply to the backend itself, and not be injected into the frontend.
