# @backstage/plugin-scaffolder-react

## 1.3.1-next.0

### Patch Changes

- ad1a1429de4: Improvements to the `scaffolder/next` buttons UX:

  - Added padding around the "Create" button in the `Stepper` component
  - Added a button bar that includes the "Cancel" and "Start Over" buttons to the `OngoingTask` component. The state of these buttons match their existing counter parts in the Context Menu
  - Added a "Show Button Bar"/"Hide Button Bar" item to the `ContextMenu` component

- Updated dependencies
  - @backstage/plugin-catalog-react@1.6.0-next.0
  - @backstage/core-components@0.13.0
  - @backstage/core-plugin-api@1.5.1
  - @backstage/catalog-client@1.4.1
  - @backstage/catalog-model@1.3.0
  - @backstage/errors@1.1.5
  - @backstage/theme@0.2.19
  - @backstage/types@1.0.2
  - @backstage/version-bridge@1.0.4
  - @backstage/plugin-scaffolder-common@1.2.7

## 1.3.0

### Minor Changes

- 259d3407b9b: Move `CategoryPicker` from `scaffolder` into `scaffolder-react`
  Move `ContextMenu` into `scaffolder-react` and rename it to `ScaffolderPageContextMenu`
- 2cfd03d7376: To offer better customization options, `ScaffolderPageContextMenu` takes callbacks as props instead of booleans
- 48da4c46e45: `scaffolder/next`: Export the `TemplateGroupFilter` and `TemplateGroups` and make an extensible component

### Patch Changes

- 7e1d900413a: `scaffolder/next`: Bump `@rjsf/*` dependencies to 5.5.2
- e27ddc36dad: Added a possibility to cancel the running task (executing of a scaffolder template)
- 0435174b06f: Accessibility issues identified using lighthouse fixed.
- 7a6b16cc506: `scaffolder/next`: Bump `@rjsf/*` deps to 5.3.1
- 90dda42cfd2: bug: Invert `templateFilter` predicate to align with `Array.filter`
- d2488f5e54c: Add an indication that the validators are running when clicking `next` on each step of the form.
- 1e4f5e91b8e: Bump `zod` and `zod-to-json-schema` dependencies.
- 8c40997df44: Updated dependency `@rjsf/core-v5` to `npm:@rjsf/core@5.5.2`.
- f84fc7fd040: Updated dependency `@rjsf/validator-ajv8` to `5.3.0`.
- 8e00acb28db: Small tweaks to remove warnings in the console during development (mainly focusing on techdocs)
- 34dab7ee7f8: `scaffolder/next`: bump `rjsf` dependencies to `5.5.0`
- 2898b6c8d52: Minor type tweaks for TypeScript 5.0
- e0c6e8b9c3c: Update peer dependencies
- cf71c3744a5: scaffolder/next: Bump `@rjsf/*` dependencies to 5.6.0
- Updated dependencies
  - @backstage/core-components@0.13.0
  - @backstage/plugin-scaffolder-common@1.2.7
  - @backstage/catalog-client@1.4.1
  - @backstage/plugin-catalog-react@1.5.0
  - @backstage/theme@0.2.19
  - @backstage/core-plugin-api@1.5.1
  - @backstage/catalog-model@1.3.0
  - @backstage/version-bridge@1.0.4
  - @backstage/errors@1.1.5
  - @backstage/types@1.0.2

## 1.3.0-next.3

### Patch Changes

- d2488f5e54c: Add indication that the validators are running
- 8c40997df44: Updated dependency `@rjsf/core-v5` to `npm:@rjsf/core@5.5.2`.
- Updated dependencies
  - @backstage/plugin-catalog-react@1.5.0-next.3
  - @backstage/catalog-model@1.3.0-next.0
  - @backstage/core-components@0.13.0-next.3
  - @backstage/catalog-client@1.4.1-next.1
  - @backstage/core-plugin-api@1.5.1-next.1
  - @backstage/errors@1.1.5
  - @backstage/theme@0.2.19-next.0
  - @backstage/types@1.0.2
  - @backstage/version-bridge@1.0.4-next.0
  - @backstage/plugin-scaffolder-common@1.2.7-next.2

## 1.3.0-next.2

### Patch Changes

- 90dda42cfd2: bug: Invert `templateFilter` predicate to align with `Array.filter`
- 34dab7ee7f8: `scaffolder/next`: bump `rjsf` dependencies to `5.5.0`
- 2898b6c8d52: Minor type tweaks for TypeScript 5.0
- Updated dependencies
  - @backstage/catalog-client@1.4.1-next.0
  - @backstage/core-components@0.12.6-next.2
  - @backstage/plugin-catalog-react@1.4.1-next.2
  - @backstage/core-plugin-api@1.5.1-next.1
  - @backstage/catalog-model@1.2.1
  - @backstage/errors@1.1.5
  - @backstage/theme@0.2.19-next.0
  - @backstage/types@1.0.2
  - @backstage/version-bridge@1.0.4-next.0
  - @backstage/plugin-scaffolder-common@1.2.7-next.1

## 1.3.0-next.1

### Patch Changes

- 1e4f5e91b8e: Bump `zod` and `zod-to-json-schema` dependencies.
- e0c6e8b9c3c: Update peer dependencies
- Updated dependencies
  - @backstage/core-components@0.12.6-next.1
  - @backstage/plugin-scaffolder-common@1.2.7-next.1
  - @backstage/core-plugin-api@1.5.1-next.0
  - @backstage/version-bridge@1.0.4-next.0
  - @backstage/plugin-catalog-react@1.4.1-next.1
  - @backstage/theme@0.2.19-next.0
  - @backstage/catalog-client@1.4.0
  - @backstage/catalog-model@1.2.1
  - @backstage/errors@1.1.5
  - @backstage/types@1.0.2

## 1.3.0-next.0

### Minor Changes

- 259d3407b9b: Move `CategoryPicker` from `scaffolder` into `scaffolder-react`
  Move `ContextMenu` into `scaffolder-react` and rename it to `ScaffolderPageContextMenu`
- 2cfd03d7376: To offer better customization options, `ScaffolderPageContextMenu` takes callbacks as props instead of booleans
- 48da4c46e45: `scaffolder/next`: Export the `TemplateGroupFilter` and `TemplateGroups` and make an extensible component

### Patch Changes

- e27ddc36dad: Added a possibility to cancel the running task (executing of a scaffolder template)
- 7a6b16cc506: `scaffolder/next`: Bump `@rjsf/*` deps to 5.3.1
- f84fc7fd040: Updated dependency `@rjsf/validator-ajv8` to `5.3.0`.
- 8e00acb28db: Small tweaks to remove warnings in the console during development (mainly focusing on techdocs)
- Updated dependencies
  - @backstage/plugin-scaffolder-common@1.2.7-next.0
  - @backstage/core-components@0.12.6-next.0
  - @backstage/plugin-catalog-react@1.4.1-next.0
  - @backstage/core-plugin-api@1.5.0
  - @backstage/catalog-client@1.4.0
  - @backstage/catalog-model@1.2.1
  - @backstage/errors@1.1.5
  - @backstage/theme@0.2.18
  - @backstage/types@1.0.2
  - @backstage/version-bridge@1.0.3

## 1.2.0

### Minor Changes

- 8f4d13f21cf: Move `useTaskStream`, `TaskBorder`, `TaskLogStream` and `TaskSteps` into `scaffolder-react`.

### Patch Changes

- 65454876fb2: Minor API report tweaks
- 3c96e77b513: Make scaffolder adhere to page themes by using page `fontColor` consistently. If your theme overwrites template list or card headers, review those styles.
- c8d78b9ae9d: fix bug with `hasErrors` returning false when dealing with empty objects
- 9b8c374ace5: Remove timer for skipped steps in Scaffolder Next's TaskSteps
- 44941fc97eb: scaffolder/next: Move the `uiSchema` to its own property in the validation `context` to align with component development and access of `ui:options`
- d9893263ba9: scaffolder/next: Fix for steps without properties
- 928a12a9b3e: Internal refactor of `/alpha` exports.
- cc418d652a7: scaffolder/next: Added the ability to get the fields definition in the schema in the validation function
- d4100d0ec42: Fix alignment bug for owners on `TemplateCard`
- Updated dependencies
  - @backstage/catalog-client@1.4.0
  - @backstage/core-components@0.12.5
  - @backstage/plugin-catalog-react@1.4.0
  - @backstage/errors@1.1.5
  - @backstage/core-plugin-api@1.5.0
  - @backstage/catalog-model@1.2.1
  - @backstage/theme@0.2.18
  - @backstage/types@1.0.2
  - @backstage/version-bridge@1.0.3
  - @backstage/plugin-scaffolder-common@1.2.6

## 1.2.0-next.2

### Patch Changes

- 65454876fb2: Minor API report tweaks
- 3c96e77b513: Make scaffolder adhere to page themes by using page `fontColor` consistently. If your theme overwrites template list or card headers, review those styles.
- d9893263ba9: scaffolder/next: Fix for steps without properties
- Updated dependencies
  - @backstage/core-components@0.12.5-next.2
  - @backstage/plugin-catalog-react@1.4.0-next.2
  - @backstage/core-plugin-api@1.5.0-next.2

## 1.2.0-next.1

### Minor Changes

- 8f4d13f21cf: Move `useTaskStream`, `TaskBorder`, `TaskLogStream` and `TaskSteps` into `scaffolder-react`.

### Patch Changes

- 44941fc97eb: scaffolder/next: Move the `uiSchema` to its own property in the validation `context` to align with component development and access of `ui:options`
- Updated dependencies
  - @backstage/core-components@0.12.5-next.1
  - @backstage/errors@1.1.5-next.0
  - @backstage/catalog-client@1.4.0-next.1
  - @backstage/core-plugin-api@1.4.1-next.1
  - @backstage/theme@0.2.18-next.0
  - @backstage/plugin-catalog-react@1.4.0-next.1
  - @backstage/catalog-model@1.2.1-next.1
  - @backstage/types@1.0.2
  - @backstage/version-bridge@1.0.3
  - @backstage/plugin-scaffolder-common@1.2.6-next.1

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
