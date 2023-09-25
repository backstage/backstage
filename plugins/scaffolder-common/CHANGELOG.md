# @backstage/plugin-scaffolder-common

## 1.4.1

### Patch Changes

- 406b786a2a2c: Mark package as being free of side effects, allowing more optimized Webpack builds.
- Updated dependencies
  - @backstage/catalog-model@1.4.2
  - @backstage/plugin-permission-common@0.7.8
  - @backstage/types@1.1.1

## 1.4.1-next.2

### Patch Changes

- 406b786a2a2c: Mark package as being free of side effects, allowing more optimized Webpack builds.
- Updated dependencies
  - @backstage/catalog-model@1.4.2-next.2
  - @backstage/plugin-permission-common@0.7.8-next.2
  - @backstage/types@1.1.1-next.0

## 1.4.1-next.1

### Patch Changes

- Updated dependencies
  - @backstage/catalog-model@1.4.2-next.1
  - @backstage/plugin-permission-common@0.7.8-next.1
  - @backstage/types@1.1.0

## 1.4.1-next.0

### Patch Changes

- Updated dependencies
  - @backstage/catalog-model@1.4.2-next.0
  - @backstage/plugin-permission-common@0.7.8-next.0
  - @backstage/types@1.1.0

## 1.4.0

### Minor Changes

- e514aac3eac0: Introduce `each` property on action steps, allowing them to be ran repeatedly.

### Patch Changes

- Updated dependencies
  - @backstage/catalog-model@1.4.1
  - @backstage/types@1.1.0
  - @backstage/plugin-permission-common@0.7.7

## 1.3.2

### Patch Changes

- Updated dependencies
  - @backstage/catalog-model@1.4.1
  - @backstage/types@1.1.0
  - @backstage/plugin-permission-common@0.7.7

## 1.3.2-next.0

### Patch Changes

- Updated dependencies
  - @backstage/catalog-model@1.4.1-next.0
  - @backstage/types@1.1.0
  - @backstage/plugin-permission-common@0.7.7-next.0

## 1.3.1

### Patch Changes

- Updated dependencies
  - @backstage/types@1.1.0
  - @backstage/catalog-model@1.4.0
  - @backstage/plugin-permission-common@0.7.6

## 1.3.1-next.1

### Patch Changes

- Updated dependencies
  - @backstage/catalog-model@1.4.0-next.1
  - @backstage/types@1.0.2
  - @backstage/plugin-permission-common@0.7.6-next.0

## 1.3.1-next.0

### Patch Changes

- Updated dependencies
  - @backstage/catalog-model@1.4.0-next.0
  - @backstage/plugin-permission-common@0.7.6-next.0
  - @backstage/types@1.0.2

## 1.3.0

### Minor Changes

- 82e10a6939c: Add support for Markdown text blob outputs from templates
- 67115f532b8: Expose scaffolder permissions in new sub-aggregations.

  In addition to exporting a list of all scaffolder permissions in `scaffolderPermissions`, scaffolder-common now exports `scaffolderTemplatePermissions` and `scaffolderActionPermissions`, which contain subsets of the scaffolder permissions separated by resource type.

### Patch Changes

- Updated dependencies
  - @backstage/catalog-model@1.3.0
  - @backstage/types@1.0.2
  - @backstage/plugin-permission-common@0.7.5

## 1.3.0-next.0

### Minor Changes

- 82e10a6939c: Add support for Markdown text blob outputs from templates

## 1.2.7

### Patch Changes

- 65e989f4018: Added permissions for authorizing parameters and steps
- 48da4c46e45: Export `typeguard` for `isTemplateEntityV1beta3`
- bcae5aaf25c: Added permissions for authorizing actions
- 65e989f4018: Define optional `backstage:permissions` property to parameters and steps used to authorize part of the template using the permission framework
- Updated dependencies
  - @backstage/plugin-permission-common@0.7.5
  - @backstage/catalog-model@1.3.0
  - @backstage/types@1.0.2

## 1.2.7-next.2

### Patch Changes

- Updated dependencies
  - @backstage/catalog-model@1.3.0-next.0
  - @backstage/types@1.0.2
  - @backstage/plugin-permission-common@0.7.5-next.0

## 1.2.7-next.1

### Patch Changes

- 65e989f4018: Added permissions for authorizing parameters and steps
- 65e989f4018: Define optional `backstage:permissions` property to parameters and steps used to authorize part of the template using the permission framework
- Updated dependencies
  - @backstage/plugin-permission-common@0.7.5-next.0
  - @backstage/catalog-model@1.2.1
  - @backstage/types@1.0.2

## 1.2.7-next.0

### Patch Changes

- 48da4c46e45: Export `typeguard` for `isTemplateEntityV1beta3`
- Updated dependencies
  - @backstage/catalog-model@1.2.1
  - @backstage/types@1.0.2

## 1.2.6

### Patch Changes

- Updated dependencies
  - @backstage/catalog-model@1.2.1
  - @backstage/types@1.0.2

## 1.2.6-next.1

### Patch Changes

- Updated dependencies
  - @backstage/catalog-model@1.2.1-next.1
  - @backstage/types@1.0.2

## 1.2.6-next.0

### Patch Changes

- Updated dependencies
  - @backstage/catalog-model@1.2.1-next.0
  - @backstage/types@1.0.2

## 1.2.5

### Patch Changes

- Updated dependencies
  - @backstage/catalog-model@1.2.0
  - @backstage/types@1.0.2

## 1.2.5-next.1

### Patch Changes

- Updated dependencies
  - @backstage/catalog-model@1.2.0-next.1
  - @backstage/types@1.0.2

## 1.2.5-next.0

### Patch Changes

- Updated dependencies
  - @backstage/catalog-model@1.1.6-next.0

## 1.2.4

### Patch Changes

- 011bd518b7: Fixed spelling mistakes in documentation.
- Updated dependencies
  - @backstage/catalog-model@1.1.5
  - @backstage/types@1.0.2

## 1.2.4-next.1

### Patch Changes

- Updated dependencies
  - @backstage/catalog-model@1.1.5-next.1
  - @backstage/types@1.0.2

## 1.2.4-next.0

### Patch Changes

- 011bd518b7: Fixed spelling mistakes in documentation.
- Updated dependencies
  - @backstage/catalog-model@1.1.5-next.0
  - @backstage/types@1.0.2

## 1.2.3

### Patch Changes

- Updated dependencies
  - @backstage/types@1.0.2
  - @backstage/catalog-model@1.1.4

## 1.2.3-next.1

### Patch Changes

- Updated dependencies
  - @backstage/types@1.0.2-next.1
  - @backstage/catalog-model@1.1.4-next.1

## 1.2.3-next.0

### Patch Changes

- Updated dependencies
  - @backstage/types@1.0.2-next.0
  - @backstage/catalog-model@1.1.4-next.0

## 1.2.2

### Patch Changes

- Updated dependencies
  - @backstage/catalog-model@1.1.3
  - @backstage/types@1.0.1

## 1.2.2-next.0

### Patch Changes

- Updated dependencies
  - @backstage/catalog-model@1.1.3-next.0
  - @backstage/types@1.0.1-next.0

## 1.2.1

### Patch Changes

- Updated dependencies
  - @backstage/catalog-model@1.1.2
  - @backstage/types@1.0.0

## 1.2.1-next.2

### Patch Changes

- Updated dependencies
  - @backstage/catalog-model@1.1.2-next.2
  - @backstage/types@1.0.0

## 1.2.1-next.1

### Patch Changes

- Updated dependencies
  - @backstage/catalog-model@1.1.2-next.1
  - @backstage/types@1.0.0

## 1.2.1-next.0

### Patch Changes

- Updated dependencies
  - @backstage/catalog-model@1.1.2-next.0
  - @backstage/types@1.0.0

## 1.2.0

### Minor Changes

- 1ff817b3f0: add entity metadata to the template info type

### Patch Changes

- Updated dependencies
  - @backstage/catalog-model@1.1.1

## 1.2.0-next.1

### Patch Changes

- Updated dependencies
  - @backstage/catalog-model@1.1.1-next.0

## 1.2.0-next.0

### Minor Changes

- 1ff817b3f0: add entity metadata to the template info type

## 1.1.2

### Patch Changes

- Updated dependencies
  - @backstage/catalog-model@1.1.0

## 1.1.2-next.0

### Patch Changes

- Updated dependencies
  - @backstage/catalog-model@1.1.0-next.0

## 1.1.1

### Patch Changes

- Updated dependencies
  - @backstage/catalog-model@1.0.3

## 1.1.1-next.0

### Patch Changes

- Updated dependencies
  - @backstage/catalog-model@1.0.3-next.0

## 1.1.0

### Minor Changes

- f8baf7df44: Added the ability to reference the user in the `template.yaml` manifest

### Patch Changes

- Updated dependencies
  - @backstage/catalog-model@1.0.2

## 1.1.0-next.0

### Minor Changes

- f8baf7df44: Added the ability to reference the user in the `template.yaml` manifest

### Patch Changes

- Updated dependencies
  - @backstage/catalog-model@1.0.2-next.0

## 1.0.1

### Patch Changes

- Updated dependencies
  - @backstage/catalog-model@1.0.1

## 1.0.1-next.0

### Patch Changes

- Updated dependencies
  - @backstage/catalog-model@1.0.1-next.0

## 1.0.0

### Major Changes

- b58c70c223: This package has been promoted to v1.0! To understand how this change affects the package, please check out our [versioning policy](https://backstage.io/docs/overview/versioning-policy).

### Patch Changes

- c8475ab3bb: Adding some documentation for exported things
- Updated dependencies
  - @backstage/catalog-model@1.0.0
  - @backstage/types@1.0.0

## 0.3.0

### Minor Changes

- 310e905998: The following deprecations are now breaking and have been removed:

  - **BREAKING**: Support for `backstage.io/v1beta2` Software Templates has been removed. Please migrate your legacy templates to the new `scaffolder.backstage.io/v1beta3` `apiVersion` by following the [migration guide](https://backstage.io/docs/features/software-templates/migrating-from-v1beta2-to-v1beta3)

  - **BREAKING**: Removed the deprecated `TemplateMetadata`. Please use `TemplateInfo` instead.

  - **BREAKING**: Removed the deprecated `context.baseUrl`. It's now available on `context.templateInfo.baseUrl`.

  - **BREAKING**: Removed the deprecated `DispatchResult`, use `TaskBrokerDispatchResult` instead.

  - **BREAKING**: Removed the deprecated `runCommand`, use `executeShellCommond` instead.

  - **BREAKING**: Removed the deprecated `Status` in favour of `TaskStatus` instead.

  - **BREAKING**: Removed the deprecated `TaskState` in favour of `CurrentClaimedTask` instead.

### Patch Changes

- Updated dependencies
  - @backstage/catalog-model@0.13.0

## 0.3.0-next.0

### Minor Changes

- 310e905998: The following deprecations are now breaking and have been removed:

  - **BREAKING**: Support for `backstage.io/v1beta2` Software Templates has been removed. Please migrate your legacy templates to the new `scaffolder.backstage.io/v1beta3` `apiVersion` by following the [migration guide](https://backstage.io/docs/features/software-templates/migrating-from-v1beta2-to-v1beta3)

  - **BREAKING**: Removed the deprecated `TemplateMetadata`. Please use `TemplateInfo` instead.

  - **BREAKING**: Removed the deprecated `context.baseUrl`. It's now available on `context.templateInfo.baseUrl`.

  - **BREAKING**: Removed the deprecated `DispatchResult`, use `TaskBrokerDispatchResult` instead.

  - **BREAKING**: Removed the deprecated `runCommand`, use `executeShellCommond` instead.

  - **BREAKING**: Removed the deprecated `Status` in favour of `TaskStatus` instead.

  - **BREAKING**: Removed the deprecated `TaskState` in favour of `CurrentClaimedTask` instead.

### Patch Changes

- Updated dependencies
  - @backstage/catalog-model@0.13.0-next.0

## 0.2.3

### Patch Changes

- Updated dependencies
  - @backstage/catalog-model@0.12.0

## 0.2.2

### Patch Changes

- a4d53fe18e: **DEPRECATED** - The `TaskSpec.metadata` and `TaskSpec.baseUrl` has been deprecated in favour of the new `TaskSpec.templateInfo`.
  The `baseUrl` is now found on the `templateInfo` object, and the name can be inferred from the `templateInfo.entityRef` property.

  Usages of `TaskSpec.metadata.name` or `ctx.metadata.name` in Actions should migrate to using `parseEntityRef(taskSpec.templateInfo.entityRef)` to get the parsed entity triplet.

  Usages of `ctx.baseUrl` in Actions should migrate to using `ctx.templateInfo.baseUrl` instead.

- Updated dependencies
  - @backstage/catalog-model@0.11.0

## 0.2.1

### Patch Changes

- Fix for the previous release with missing type declarations.
- Updated dependencies
  - @backstage/catalog-model@0.10.1
  - @backstage/types@0.1.3

## 0.2.0

### Minor Changes

- 5e585bbc7f: **BREAKING**: Removed the `templateEntityV1beta3Schema` export

### Patch Changes

- e72d371296: Added `TemplateEntityV1beta2` which was moved here from
  `@backstage/plugin-scaffolder-common`. It has also been marked as deprecated in
  the process - please consider [migrating to `v1beta3`
  templates](https://backstage.io/docs/features/software-templates/migrating-from-v1beta2-to-v1beta3).
- c77c5c7eb6: Added `backstage.role` to `package.json`
- Updated dependencies
  - @backstage/catalog-model@0.10.0
  - @backstage/types@0.1.2

## 0.1.3

### Patch Changes

- Updated dependencies
  - @backstage/catalog-model@0.9.10

## 0.1.3-next.0

### Patch Changes

- Updated dependencies
  - @backstage/catalog-model@0.9.10-next.0

## 0.1.2

### Patch Changes

- d078377f67: Support navigating back to pre-filled templates to update inputs of scaffolder tasks for resubmission

## 0.1.1

### Patch Changes

- 10615525f3: Switch to use the json and observable types from `@backstage/types`
- Updated dependencies
  - @backstage/catalog-model@0.9.6
