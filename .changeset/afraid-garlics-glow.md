---
'@backstage/cli': patch
---

The `create-plugin` and `create` commands have both been deprecated in favor of a new `new` command. The `new` command is functionally identical to `create`, but the new naming makes it possible to use as yarn script, since `yarn create` is reserved.
