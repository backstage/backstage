---
'@backstage/plugin-scaffolder': minor
'@backstage/plugin-scaffolder-backend': minor
'@backstage/plugin-scaffolder-common': minor
---

The following deprecations are now breaking and have been removed:

- **BREAKING**: Support for `backstage.io/v1beta2` Software Templates has been removed. Please migrate your legacy templates to the new `scaffolder.backstage.io/v1beta3` `apiVersion` by following the [migration guide](https://backstage.io/docs/features/software-templates/migrating-from-v1beta2-to-v1beta3)

- **BREAKING**: Removed the deprecated `TemplateMetadata`. Please use `TemplateInfo` instead.

- **BREAKING**: Removed the deprecated `context.baseUrl`. It's now available on `context.templateInfo.baseUrl`.

- **BREAKING**: Removed the deprecated `DispatchResult`, use `TaskBrokerDispatchResult` instead.

- **BREAKING**: Removed the deprecated `runCommand`, use `executeShellCommond` instead.

- **BREAKING**: Removed the deprecated `Status` in favour of `TaskStatus` instead.

- **BREAKING**: Removed the deprecated `TaskState` in favour of `CurrentClaimedTask` instead.
