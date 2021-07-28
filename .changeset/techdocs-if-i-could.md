---
'@backstage/plugin-techdocs-backend': patch
'@backstage/plugin-scaffolder-backend': patch
'@backstage/create-app': patch
---

The recommended value for a `backstage.io/techdocs-ref` annotation is now
`dir:.`, indicating "documentation source files are located in the same
directory relative to the catalog entity." Note that `url:<location>` values
are still supported.
