---
'@backstage/plugin-scaffolder-common': patch
---

**DEPRECATED** - The `TaskSpec.metadata` and `TaskSpec.baseUrl` has been deprecated in favour of the new `TaskSpec.templateInfo`.
The `baseUrl` is now found on the `templateInfo` object, and the name can be inferred from the `templateInfo.entityRef` property.

Usages of `TaskSpec.metadata.name` or `ctx.metadata.name` in Actions should migrate to using `parseEntityRef(taskSpec.templateInfo.entityRef)` to get the parsed entity triplet.

Usages of `ctx.baseUrl` in Actions should migrate to using `ctx.templateInfo.baseUrl` instead.
