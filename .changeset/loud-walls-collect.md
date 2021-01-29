---
'@backstage/cli': patch
---

Fixed module resolution of external libraries during backend development. Modules used to be resolved relative to the backend entrypoint, but are now resolved relative to each individual module.
