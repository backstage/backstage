# @backstage/plugin-scaffolder-react

## 1.1.1-next.0

### Patch Changes

- c8d78b9ae9: fix bug with `hasErrors` returning false when dealing with empty objects
- 928a12a9b3: Internal refactor of `/alpha` exports.
- cc418d652a: scaffolder/next: Added the ability to get the fields definition in the schema in the validation function
- d4100d0ec4: Fix alignment bug for owners on `TemplateCard`
- Updated dependencies
  - @backstage/catalog-client@1.4.0-next.0
  - @backstage/plugin-catalog-react@1.4.0-next.0
  - @backstage/core-plugin-api@1.4.1-next.0
  - @backstage/catalog-model@1.2.1-next.0
  - @backstage/core-components@0.12.5-next.0
  - @backstage/errors@1.1.4
  - @backstage/theme@0.2.17
  - @backstage/types@1.0.2
  - @backstage/version-bridge@1.0.3
  - @backstage/plugin-scaffolder-common@1.2.6-next.0

## 1.1.0

### Minor Changes

- a07750745b: Added `DescriptionField` field override to the `next/scaffolder`
- a521379688: Migrating the `TemplateEditorPage` to work with the new components from `@backstage/plugin-scaffolder-react`
- 8c2966536b: Embed scaffolder workflow in other components
- 5555e17313: refactor `createAsyncValidators` to be recursive to ensure validators are called in nested schemas.

### Patch Changes

- 04f717a8e1: `scaffolder/next`: bump `react-jsonschema-form` libraries to `v5-stable`
- b46f385eff: scaffolder/next: Implementing a simple `OngoingTask` page
- cbab8ac107: lock versions of `@rjsf/*-beta` packages
- 346d6b6630: Upgrade `@rjsf` version 5 dependencies to `beta.18`
- ccbf91051b: bump `@rjsf` `v5` dependencies to 5.1.0
- d2ddde2108: Add `ScaffolderLayouts` to `NextScaffolderPage`
- Updated dependencies
  - @backstage/core-components@0.12.4
  - @backstage/catalog-model@1.2.0
  - @backstage/theme@0.2.17
  - @backstage/core-plugin-api@1.4.0
  - @backstage/plugin-catalog-react@1.3.0
  - @backstage/catalog-client@1.3.1
  - @backstage/errors@1.1.4
  - @backstage/types@1.0.2
  - @backstage/version-bridge@1.0.3
  - @backstage/plugin-scaffolder-common@1.2.5

## 1.1.0-next.2

### Minor Changes

- 5555e17313: refactor `createAsyncValidators` to be recursive to ensure validators are called in nested schemas.

### Patch Changes

- b46f385eff: scaffolder/next: Implementing a simple `OngoingTask` page
- ccbf91051b: bump `@rjsf` `v5` dependencies to 5.1.0
- Updated dependencies
  - @backstage/catalog-model@1.2.0-next.1
  - @backstage/core-components@0.12.4-next.1
  - @backstage/catalog-client@1.3.1-next.1
  - @backstage/core-plugin-api@1.3.0
  - @backstage/errors@1.1.4
  - @backstage/theme@0.2.16
  - @backstage/types@1.0.2
  - @backstage/version-bridge@1.0.3
  - @backstage/plugin-catalog-react@1.3.0-next.2
  - @backstage/plugin-scaffolder-common@1.2.5-next.1

## 1.1.0-next.1

### Patch Changes

- 04f717a8e1: `scaffolder/next`: bump `react-jsonschema-form` libraries to `v5-stable`
- 346d6b6630: Upgrade `@rjsf` version 5 dependencies to `beta.18`
- Updated dependencies
  - @backstage/core-components@0.12.4-next.0
  - @backstage/plugin-catalog-react@1.3.0-next.1
  - @backstage/catalog-client@1.3.1-next.0
  - @backstage/catalog-model@1.1.6-next.0
  - @backstage/core-plugin-api@1.3.0
  - @backstage/errors@1.1.4
  - @backstage/theme@0.2.16
  - @backstage/types@1.0.2
  - @backstage/version-bridge@1.0.3
  - @backstage/plugin-scaffolder-common@1.2.5-next.0

## 1.1.0-next.0

### Minor Changes

- 8c2966536b: Embed scaffolder workflow in other components

### Patch Changes

- cbab8ac107: lock versions of `@rjsf/*-beta` packages
- d2ddde2108: Add `ScaffolderLayouts` to `NextScaffolderPage`
- Updated dependencies
  - @backstage/plugin-catalog-react@1.3.0-next.0
  - @backstage/catalog-model@1.1.6-next.0
  - @backstage/catalog-client@1.3.1-next.0
  - @backstage/plugin-scaffolder-common@1.2.5-next.0

## 1.0.0

### Major Changes

- b4955ed7b9: Re-home some of the common types, components, hooks and `scaffolderApiRef` for the `@backstage/plugin-scaffolder` to this package for easy re-use across things that want to interact with the `scaffolder`.

### Patch Changes

- Updated dependencies
  - @backstage/catalog-model@1.1.5
  - @backstage/plugin-scaffolder-common@1.2.4
  - @backstage/catalog-client@1.3.0
  - @backstage/plugin-catalog-react@1.2.4
  - @backstage/core-components@0.12.3
  - @backstage/core-plugin-api@1.3.0
  - @backstage/errors@1.1.4
  - @backstage/theme@0.2.16
  - @backstage/types@1.0.2
  - @backstage/version-bridge@1.0.3

## 1.0.0-next.0

### Major Changes

- b4955ed7b9: Re-home some of the common types, components, hooks and `scaffolderApiRef` for the `@backstage/plugin-scaffolder` to this package for easy re-use across things that want to interact with the `scaffolder`.

### Patch Changes

- Updated dependencies
  - @backstage/core-plugin-api@1.3.0-next.1
  - @backstage/catalog-client@1.3.0-next.2
  - @backstage/plugin-catalog-react@1.2.4-next.2
  - @backstage/catalog-model@1.1.5-next.1
  - @backstage/core-components@0.12.3-next.2
  - @backstage/errors@1.1.4
  - @backstage/theme@0.2.16
  - @backstage/types@1.0.2
  - @backstage/version-bridge@1.0.3
  - @backstage/plugin-scaffolder-common@1.2.4-next.1
