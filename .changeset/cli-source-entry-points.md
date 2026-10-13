---
'@backstage/cli': patch
'@backstage/create-app': patch
'@backstage/repo-tools': patch
'@techdocs/cli': patch
---

Fixed building the CLI from source with package entry-point resolution. Published packages and CLI launchers continue to use the compiled entry point.
