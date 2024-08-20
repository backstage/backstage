---
'@backstage/frontend-plugin-api': minor
---

**BREAKING**: Removed support for "v1" extensions. This means that it is no longer possible to declare inputs and outputs as objects when using `createExtension`. In addition, all extension creators except for `createComponentExtension` have been removed, use the equivalent blueprint instead. See the [1.30 migration documentation](https://backstage.io/docs/frontend-system/architecture/migrations/#130) for more information on this change.
