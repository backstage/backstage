---
'@backstage/backend-plugin-api': patch
---

Added optional `secrets` schema support to `ActionsRegistryActionOptions` and `ActionsRegistryActionContext`. Actions can now declare a Zod secrets schema separate from the input schema, enabling surfaces to collect sensitive credentials independently from tool arguments. Added optional `secrets` field to `ActionsServiceAction` metadata and `ActionsService.invoke()` parameters.
