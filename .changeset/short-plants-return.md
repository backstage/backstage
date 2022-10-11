---
'@backstage/create-app': patch
---

Leverage cache mounts in Dockerfile during `yarn install ...` and `apt-get ...` commands to speed up repeated builds.
