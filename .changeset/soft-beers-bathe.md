---
'@backstage/cli-module-build': patch
---

When building dist-workspaces with --always-pack, batch `yarn pack` operations to avoid packing packages and their dependencies simultaneously.
