# @backstage/plugin-scaffolder-common

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
