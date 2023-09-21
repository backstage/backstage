# @backstage/plugin-scaffolder

## 1.15.0

### Minor Changes

- 0119c326394a: adding a .zip download to dry run results page, including zip.js as dependency

### Patch Changes

- 406b786a2a2c: Mark package as being free of side effects, allowing more optimized Webpack builds.
- 6e69c11a3535: Restored functionality to `OwnedEntityPicker` by converting deprecated `ui:options` input to `catalogFilter`.
- 8cec7664e146: Removed `@types/node` dependency
- b16c341ced45: Updated dependency `@rjsf/utils` to `5.13.0`.
  Updated dependency `@rjsf/core-v5` to `npm:@rjsf/core@5.13.0`.
  Updated dependency `@rjsf/material-ui-v5` to `npm:@rjsf/material-ui@5.13.0`.
  Updated dependency `@rjsf/validator-ajv8` to `5.13.0`.
- Updated dependencies
  - @backstage/integration-react@1.1.19
  - @backstage/plugin-catalog-react@1.8.4
  - @backstage/core-components@0.13.5
  - @backstage/config@1.1.0
  - @backstage/catalog-client@1.4.4
  - @backstage/catalog-model@1.4.2
  - @backstage/core-plugin-api@1.6.0
  - @backstage/errors@1.2.2
  - @backstage/integration@1.7.0
  - @backstage/plugin-catalog-common@1.0.16
  - @backstage/plugin-permission-react@0.4.15
  - @backstage/plugin-scaffolder-common@1.4.1
  - @backstage/plugin-scaffolder-react@1.5.5
  - @backstage/theme@0.4.2
  - @backstage/types@1.1.1

## 1.15.0-next.3

### Minor Changes

- 0119c326394a: adding a .zip download to dry run results page, including zip.js as dependency

### Patch Changes

- 406b786a2a2c: Mark package as being free of side effects, allowing more optimized Webpack builds.
- 6e69c11a3535: Restored functionality to `OwnedEntityPicker` by converting deprecated `ui:options` input to `catalogFilter`.
- b16c341ced45: Updated dependency `@rjsf/utils` to `5.13.0`.
  Updated dependency `@rjsf/core-v5` to `npm:@rjsf/core@5.13.0`.
  Updated dependency `@rjsf/material-ui-v5` to `npm:@rjsf/material-ui@5.13.0`.
  Updated dependency `@rjsf/validator-ajv8` to `5.13.0`.
- Updated dependencies
  - @backstage/catalog-client@1.4.4-next.2
  - @backstage/catalog-model@1.4.2-next.2
  - @backstage/config@1.1.0-next.2
  - @backstage/core-components@0.13.5-next.3
  - @backstage/core-plugin-api@1.6.0-next.3
  - @backstage/errors@1.2.2-next.0
  - @backstage/integration@1.7.0-next.3
  - @backstage/integration-react@1.1.19-next.3
  - @backstage/plugin-catalog-common@1.0.16-next.2
  - @backstage/plugin-catalog-react@1.8.4-next.3
  - @backstage/plugin-permission-react@0.4.15-next.3
  - @backstage/plugin-scaffolder-common@1.4.1-next.2
  - @backstage/plugin-scaffolder-react@1.5.5-next.3
  - @backstage/theme@0.4.2-next.0
  - @backstage/types@1.1.1-next.0

## 1.14.5-next.2

### Patch Changes

- 8cec7664e146: Removed `@types/node` dependency
- Updated dependencies
  - @backstage/integration-react@1.1.19-next.2
  - @backstage/core-components@0.13.5-next.2
  - @backstage/core-plugin-api@1.6.0-next.2
  - @backstage/config@1.1.0-next.1
  - @backstage/plugin-scaffolder-react@1.5.5-next.2
  - @backstage/plugin-catalog-react@1.8.4-next.2
  - @backstage/plugin-permission-react@0.4.15-next.2
  - @backstage/integration@1.7.0-next.2
  - @backstage/catalog-model@1.4.2-next.1
  - @backstage/catalog-client@1.4.4-next.1
  - @backstage/errors@1.2.1
  - @backstage/theme@0.4.1
  - @backstage/types@1.1.0
  - @backstage/plugin-catalog-common@1.0.16-next.1
  - @backstage/plugin-scaffolder-common@1.4.1-next.1

## 1.14.5-next.1

### Patch Changes

- Updated dependencies
  - @backstage/plugin-catalog-react@1.8.4-next.1
  - @backstage/core-components@0.13.5-next.1
  - @backstage/config@1.1.0-next.0
  - @backstage/integration@1.7.0-next.1
  - @backstage/plugin-scaffolder-react@1.5.5-next.1
  - @backstage/integration-react@1.1.19-next.1
  - @backstage/catalog-model@1.4.2-next.0
  - @backstage/core-plugin-api@1.6.0-next.1
  - @backstage/plugin-permission-react@0.4.15-next.1
  - @backstage/catalog-client@1.4.4-next.0
  - @backstage/plugin-catalog-common@1.0.16-next.0
  - @backstage/plugin-scaffolder-common@1.4.1-next.0
  - @backstage/errors@1.2.1
  - @backstage/theme@0.4.1
  - @backstage/types@1.1.0

## 1.14.4-next.0

### Patch Changes

- Updated dependencies
  - @backstage/integration-react@1.1.18-next.0
  - @backstage/integration@1.7.0-next.0
  - @backstage/core-plugin-api@1.6.0-next.0
  - @backstage/core-components@0.13.5-next.0
  - @backstage/plugin-scaffolder-react@1.5.4-next.0
  - @backstage/catalog-client@1.4.3
  - @backstage/catalog-model@1.4.1
  - @backstage/config@1.0.8
  - @backstage/errors@1.2.1
  - @backstage/theme@0.4.1
  - @backstage/types@1.1.0
  - @backstage/plugin-catalog-common@1.0.15
  - @backstage/plugin-catalog-react@1.8.3-next.0
  - @backstage/plugin-permission-react@0.4.15-next.0
  - @backstage/plugin-scaffolder-common@1.4.0

## 1.14.2

### Patch Changes

- 8a0490fb669e: Fix the get entities query in the `MyGroupsPicker` to query the `kind=Group` entities.
- Updated dependencies
  - @backstage/integration-react@1.1.16
  - @backstage/integration@1.6.0
  - @backstage/core-components@0.13.4
  - @backstage/plugin-catalog-react@1.8.1
  - @backstage/plugin-scaffolder-common@1.4.0
  - @backstage/plugin-scaffolder-react@1.5.2
  - @backstage/core-plugin-api@1.5.3
  - @backstage/catalog-client@1.4.3
  - @backstage/catalog-model@1.4.1
  - @backstage/config@1.0.8
  - @backstage/errors@1.2.1
  - @backstage/theme@0.4.1
  - @backstage/types@1.1.0
  - @backstage/plugin-catalog-common@1.0.15
  - @backstage/plugin-permission-react@0.4.14

## 1.14.2-next.2

### Patch Changes

- Updated dependencies
  - @backstage/plugin-catalog-react@1.8.1-next.1
  - @backstage/plugin-scaffolder-react@1.5.2-next.1
  - @backstage/integration-react@1.1.16-next.1

## 1.14.2-next.1

### Patch Changes

- 8a0490fb669e: Fix the get entities query in the `MyGroupsPicker` to query the `kind=Group` entities.
- Updated dependencies
  - @backstage/integration-react@1.1.16-next.1
  - @backstage/integration@1.5.1
  - @backstage/catalog-client@1.4.3
  - @backstage/catalog-model@1.4.1
  - @backstage/config@1.0.8
  - @backstage/core-components@0.13.4-next.0
  - @backstage/core-plugin-api@1.5.3
  - @backstage/errors@1.2.1
  - @backstage/theme@0.4.1
  - @backstage/types@1.1.0
  - @backstage/plugin-catalog-common@1.0.15
  - @backstage/plugin-catalog-react@1.8.1-next.0
  - @backstage/plugin-permission-react@0.4.14
  - @backstage/plugin-scaffolder-common@1.3.2
  - @backstage/plugin-scaffolder-react@1.5.2-next.0

## 1.14.2-next.0

### Patch Changes

- Updated dependencies
  - @backstage/core-components@0.13.4-next.0
  - @backstage/plugin-scaffolder-react@1.5.2-next.0
  - @backstage/core-plugin-api@1.5.3
  - @backstage/plugin-catalog-react@1.8.1-next.0
  - @backstage/catalog-client@1.4.3
  - @backstage/catalog-model@1.4.1
  - @backstage/config@1.0.8
  - @backstage/errors@1.2.1
  - @backstage/integration@1.5.1
  - @backstage/integration-react@1.1.16-next.0
  - @backstage/theme@0.4.1
  - @backstage/types@1.1.0
  - @backstage/plugin-catalog-common@1.0.15
  - @backstage/plugin-permission-react@0.4.14
  - @backstage/plugin-scaffolder-common@1.3.2

## 1.14.1

### Patch Changes

- Updated dependencies
  - @backstage/theme@0.4.1
  - @backstage/errors@1.2.1
  - @backstage/plugin-scaffolder-react@1.5.1
  - @backstage/plugin-catalog-react@1.8.0
  - @backstage/core-components@0.13.3
  - @backstage/core-plugin-api@1.5.3
  - @backstage/catalog-client@1.4.3
  - @backstage/catalog-model@1.4.1
  - @backstage/config@1.0.8
  - @backstage/integration@1.5.1
  - @backstage/integration-react@1.1.15
  - @backstage/types@1.1.0
  - @backstage/plugin-catalog-common@1.0.15
  - @backstage/plugin-permission-react@0.4.14
  - @backstage/plugin-scaffolder-common@1.3.2

## 1.14.1-next.2

### Patch Changes

- Updated dependencies
  - @backstage/plugin-catalog-react@1.8.0-next.2
  - @backstage/theme@0.4.1-next.1
  - @backstage/core-plugin-api@1.5.3-next.1
  - @backstage/core-components@0.13.3-next.2
  - @backstage/catalog-client@1.4.3-next.0
  - @backstage/catalog-model@1.4.1-next.0
  - @backstage/config@1.0.8
  - @backstage/errors@1.2.1-next.0
  - @backstage/integration@1.5.1-next.0
  - @backstage/integration-react@1.1.15-next.2
  - @backstage/types@1.1.0
  - @backstage/plugin-catalog-common@1.0.15-next.0
  - @backstage/plugin-permission-react@0.4.14-next.2
  - @backstage/plugin-scaffolder-common@1.3.2-next.0
  - @backstage/plugin-scaffolder-react@1.5.1-next.2

## 1.14.1-next.1

### Patch Changes

- Updated dependencies
  - @backstage/theme@0.4.1-next.0
  - @backstage/plugin-scaffolder-react@1.5.1-next.1
  - @backstage/core-components@0.13.3-next.1
  - @backstage/core-plugin-api@1.5.3-next.0
  - @backstage/integration-react@1.1.15-next.1
  - @backstage/plugin-catalog-react@1.7.1-next.1
  - @backstage/plugin-permission-react@0.4.14-next.1
  - @backstage/config@1.0.8

## 1.14.1-next.0

### Patch Changes

- Updated dependencies
  - @backstage/errors@1.2.1-next.0
  - @backstage/core-components@0.13.3-next.0
  - @backstage/catalog-client@1.4.3-next.0
  - @backstage/catalog-model@1.4.1-next.0
  - @backstage/config@1.0.8
  - @backstage/core-plugin-api@1.5.2
  - @backstage/integration@1.5.1-next.0
  - @backstage/integration-react@1.1.15-next.0
  - @backstage/theme@0.4.0
  - @backstage/types@1.1.0
  - @backstage/plugin-catalog-common@1.0.15-next.0
  - @backstage/plugin-catalog-react@1.7.1-next.0
  - @backstage/plugin-permission-react@0.4.14-next.0
  - @backstage/plugin-scaffolder-common@1.3.2-next.0
  - @backstage/plugin-scaffolder-react@1.5.1-next.0

## 1.14.0

### Minor Changes

- 464125e9b1ba: Added `MyGroupsPicker` field extension that will display a dropdown of groups a user is part of.

### Patch Changes

- cda753a797b5: Forward `Authorization` header for `EventSource` when credentials are available.
- 2ff94da135a4: bump `rjsf` dependencies to 5.7.3
- 74b216ee4e50: Add `PropsWithChildren` to usages of `ComponentType`, in preparation for React 18 where the children are no longer implicit.
- Updated dependencies
  - @backstage/core-plugin-api@1.5.2
  - @backstage/catalog-client@1.4.2
  - @backstage/plugin-scaffolder-react@1.5.0
  - @backstage/core-components@0.13.2
  - @backstage/types@1.1.0
  - @backstage/theme@0.4.0
  - @backstage/integration@1.5.0
  - @backstage/plugin-catalog-react@1.7.0
  - @backstage/catalog-model@1.4.0
  - @backstage/errors@1.2.0
  - @backstage/integration-react@1.1.14
  - @backstage/plugin-permission-react@0.4.13
  - @backstage/config@1.0.8
  - @backstage/plugin-catalog-common@1.0.14
  - @backstage/plugin-scaffolder-common@1.3.1

## 1.14.0-next.3

### Minor Changes

- 464125e9b1ba: Added `MyGroupsPicker` field extension that will display a dropdown of groups a user is part of.

### Patch Changes

- Updated dependencies
  - @backstage/core-components@0.13.2-next.3
  - @backstage/catalog-model@1.4.0-next.1
  - @backstage/plugin-scaffolder-react@1.5.0-next.3
  - @backstage/catalog-client@1.4.2-next.2
  - @backstage/config@1.0.7
  - @backstage/core-plugin-api@1.5.2-next.0
  - @backstage/errors@1.2.0-next.0
  - @backstage/integration@1.5.0-next.0
  - @backstage/integration-react@1.1.14-next.3
  - @backstage/theme@0.4.0-next.1
  - @backstage/types@1.0.2
  - @backstage/plugin-catalog-common@1.0.14-next.1
  - @backstage/plugin-catalog-react@1.7.0-next.3
  - @backstage/plugin-permission-react@0.4.13-next.0
  - @backstage/plugin-scaffolder-common@1.3.1-next.1

## 1.13.2-next.2

### Patch Changes

- 2ff94da135a4: bump `rjsf` dependencies to 5.7.3
- Updated dependencies
  - @backstage/theme@0.4.0-next.1
  - @backstage/plugin-catalog-react@1.7.0-next.2
  - @backstage/core-components@0.13.2-next.2
  - @backstage/plugin-scaffolder-react@1.5.0-next.2
  - @backstage/integration-react@1.1.14-next.2
  - @backstage/config@1.0.7
  - @backstage/core-plugin-api@1.5.2-next.0
  - @backstage/plugin-permission-react@0.4.13-next.0

## 1.13.2-next.1

### Patch Changes

- 74b216ee4e50: Add `PropsWithChildren` to usages of `ComponentType`, in preparation for React 18 where the children are no longer implicit.
- Updated dependencies
  - @backstage/plugin-scaffolder-react@1.5.0-next.1
  - @backstage/integration@1.5.0-next.0
  - @backstage/errors@1.2.0-next.0
  - @backstage/core-components@0.13.2-next.1
  - @backstage/plugin-catalog-react@1.7.0-next.1
  - @backstage/catalog-model@1.4.0-next.0
  - @backstage/core-plugin-api@1.5.2-next.0
  - @backstage/integration-react@1.1.14-next.1
  - @backstage/catalog-client@1.4.2-next.1
  - @backstage/plugin-catalog-common@1.0.14-next.0
  - @backstage/plugin-scaffolder-common@1.3.1-next.0
  - @backstage/config@1.0.7
  - @backstage/theme@0.4.0-next.0
  - @backstage/types@1.0.2
  - @backstage/plugin-permission-react@0.4.13-next.0

## 1.13.2-next.0

### Patch Changes

- cda753a797b5: Forward `Authorization` header for `EventSource` when credentials are available.
- Updated dependencies
  - @backstage/catalog-client@1.4.2-next.0
  - @backstage/plugin-scaffolder-react@1.4.1-next.0
  - @backstage/plugin-catalog-react@1.7.0-next.0
  - @backstage/theme@0.4.0-next.0
  - @backstage/integration@1.4.5
  - @backstage/config@1.0.7
  - @backstage/core-components@0.13.2-next.0
  - @backstage/core-plugin-api@1.5.1
  - @backstage/integration-react@1.1.14-next.0
  - @backstage/plugin-permission-react@0.4.12
  - @backstage/catalog-model@1.3.0
  - @backstage/errors@1.1.5
  - @backstage/types@1.0.2
  - @backstage/plugin-catalog-common@1.0.13
  - @backstage/plugin-scaffolder-common@1.3.0

## 1.13.1

### Patch Changes

- d560d457c98: Fix case GitLab workspace is a nested subgroup
- ad1a1429de4: Improvements to the `scaffolder/next` buttons UX:

  - Added padding around the "Create" button in the `Stepper` component
  - Added a button bar that includes the "Cancel" and "Start Over" buttons to the `OngoingTask` component. The state of these buttons match their existing counter parts in the Context Menu
  - Added a "Show Button Bar"/"Hide Button Bar" item to the `ContextMenu` component

- Updated dependencies
  - @backstage/theme@0.3.0
  - @backstage/plugin-catalog-react@1.6.0
  - @backstage/integration@1.4.5
  - @backstage/plugin-scaffolder-common@1.3.0
  - @backstage/plugin-scaffolder-react@1.4.0
  - @backstage/core-components@0.13.1
  - @backstage/integration-react@1.1.13
  - @backstage/catalog-client@1.4.1
  - @backstage/catalog-model@1.3.0
  - @backstage/config@1.0.7
  - @backstage/core-plugin-api@1.5.1
  - @backstage/errors@1.1.5
  - @backstage/types@1.0.2
  - @backstage/plugin-catalog-common@1.0.13
  - @backstage/plugin-permission-react@0.4.12

## 1.13.1-next.2

### Patch Changes

- Updated dependencies
  - @backstage/theme@0.3.0-next.0
  - @backstage/plugin-scaffolder-common@1.3.0-next.0
  - @backstage/plugin-scaffolder-react@1.4.0-next.2
  - @backstage/core-components@0.13.1-next.1
  - @backstage/integration-react@1.1.13-next.2
  - @backstage/plugin-catalog-react@1.6.0-next.2
  - @backstage/config@1.0.7
  - @backstage/core-plugin-api@1.5.1
  - @backstage/plugin-permission-react@0.4.12

## 1.13.1-next.1

### Patch Changes

- d560d457c98: Fix case GitLab workspace is a nested subgroup
- Updated dependencies
  - @backstage/core-components@0.13.1-next.0
  - @backstage/core-plugin-api@1.5.1
  - @backstage/plugin-catalog-react@1.6.0-next.1
  - @backstage/plugin-scaffolder-react@1.3.1-next.1
  - @backstage/integration-react@1.1.13-next.1
  - @backstage/config@1.0.7
  - @backstage/plugin-permission-react@0.4.12

## 1.13.1-next.0

### Patch Changes

- ad1a1429de4: Improvements to the `scaffolder/next` buttons UX:

  - Added padding around the "Create" button in the `Stepper` component
  - Added a button bar that includes the "Cancel" and "Start Over" buttons to the `OngoingTask` component. The state of these buttons match their existing counter parts in the Context Menu
  - Added a "Show Button Bar"/"Hide Button Bar" item to the `ContextMenu` component

- Updated dependencies
  - @backstage/plugin-catalog-react@1.6.0-next.0
  - @backstage/integration@1.4.5-next.0
  - @backstage/plugin-scaffolder-react@1.3.1-next.0
  - @backstage/integration-react@1.1.13-next.0
  - @backstage/core-components@0.13.0
  - @backstage/core-plugin-api@1.5.1
  - @backstage/catalog-client@1.4.1
  - @backstage/catalog-model@1.3.0
  - @backstage/config@1.0.7
  - @backstage/errors@1.1.5
  - @backstage/theme@0.2.19
  - @backstage/types@1.0.2
  - @backstage/plugin-catalog-common@1.0.13
  - @backstage/plugin-permission-react@0.4.12
  - @backstage/plugin-scaffolder-common@1.2.7

## 1.13.0

### Minor Changes

- b71f58d7d8f: Fixed bug in EntityPicker component that allowed for empty values when field is required. This bug occurs only after a user fills the EntityPicker field, clears it, and then continues to the next form step.
- cdab34fd9a2: scaffolder/next: removing the `routeRefs` and exporting the originals on `scaffolderPlugin.routes.x` instead
- e5ad1bd61ec: Allow `TemplateListPage` and `TemplateWizardPage` to be passed in as props
- 92cf86a4b5d: Added a `templateFilter` prop to the `<Router/>` component to allow for filtering of templates through a function.
- cf18c32934a: The Installed Actions page now shows details for nested objects and arrays
- 259d3407b9b: Move `CategoryPicker` from `scaffolder` into `scaffolder-react`
  Move `ContextMenu` into `scaffolder-react` and rename it to `ScaffolderPageContextMenu`

### Patch Changes

- 7e1d900413a: `scaffolder/next`: Bump `@rjsf/*` dependencies to 5.5.2
- e27ddc36dad: Added a possibility to cancel the running task (executing of a scaffolder template)
- 57c1b4752fa: Allow use of `{ exists: true }` value inside filters to filter entities that has that key.

  this example will filter all entities that has the annotation `someAnnotation` set to any value.

  ```yaml
  ui:options:
    catalogFilter:
      kind: Group
      metadata.annotations.someAnnotation: { exists: true }
  ```

- 7917cfccfc7: Fix some hard-coded white font colors in scaffolder
- 0435174b06f: Accessibility issues identified using lighthouse fixed.
- 7a6b16cc506: `scaffolder/next`: Bump `@rjsf/*` deps to 5.3.1
- 90dda42cfd2: bug: Invert `templateFilter` predicate to align with `Array.filter`
- 1e4f5e91b8e: Bump `zod` and `zod-to-json-schema` dependencies.
- f84fc7fd040: Updated dependency `@rjsf/validator-ajv8` to `5.3.0`.
- 8e00acb28db: Small tweaks to remove warnings in the console during development (mainly focusing on techdocs)
- 34dab7ee7f8: `scaffolder/next`: bump `rjsf` dependencies to `5.5.0`
- e0c6e8b9c3c: Update peer dependencies
- cf71c3744a5: scaffolder/next: Bump `@rjsf/*` dependencies to 5.6.0
- Updated dependencies
  - @backstage/core-components@0.13.0
  - @backstage/plugin-scaffolder-common@1.2.7
  - @backstage/plugin-scaffolder-react@1.3.0
  - @backstage/catalog-client@1.4.1
  - @backstage/plugin-catalog-react@1.5.0
  - @backstage/integration-react@1.1.12
  - @backstage/theme@0.2.19
  - @backstage/core-plugin-api@1.5.1
  - @backstage/catalog-model@1.3.0
  - @backstage/plugin-permission-react@0.4.12
  - @backstage/integration@1.4.4
  - @backstage/config@1.0.7
  - @backstage/errors@1.1.5
  - @backstage/types@1.0.2
  - @backstage/plugin-catalog-common@1.0.13

## 1.13.0-next.3

### Patch Changes

- 7917cfccfc7: Fix some hard-coded white font colors in scaffolder
- Updated dependencies
  - @backstage/plugin-catalog-react@1.5.0-next.3
  - @backstage/plugin-scaffolder-react@1.3.0-next.3
  - @backstage/catalog-model@1.3.0-next.0
  - @backstage/core-components@0.13.0-next.3
  - @backstage/catalog-client@1.4.1-next.1
  - @backstage/config@1.0.7
  - @backstage/core-plugin-api@1.5.1-next.1
  - @backstage/errors@1.1.5
  - @backstage/integration@1.4.4-next.0
  - @backstage/integration-react@1.1.12-next.3
  - @backstage/theme@0.2.19-next.0
  - @backstage/types@1.0.2
  - @backstage/plugin-catalog-common@1.0.13-next.1
  - @backstage/plugin-permission-react@0.4.12-next.1
  - @backstage/plugin-scaffolder-common@1.2.7-next.2

## 1.13.0-next.2

### Minor Changes

- cf18c32934a: The Installed Actions page now shows details for nested objects and arrays

### Patch Changes

- 90dda42cfd2: bug: Invert `templateFilter` predicate to align with `Array.filter`
- 34dab7ee7f8: `scaffolder/next`: bump `rjsf` dependencies to `5.5.0`
- Updated dependencies
  - @backstage/catalog-client@1.4.1-next.0
  - @backstage/core-components@0.12.6-next.2
  - @backstage/plugin-catalog-react@1.4.1-next.2
  - @backstage/plugin-scaffolder-react@1.3.0-next.2
  - @backstage/core-plugin-api@1.5.1-next.1
  - @backstage/catalog-model@1.2.1
  - @backstage/config@1.0.7
  - @backstage/errors@1.1.5
  - @backstage/integration@1.4.4-next.0
  - @backstage/integration-react@1.1.12-next.2
  - @backstage/theme@0.2.19-next.0
  - @backstage/types@1.0.2
  - @backstage/plugin-catalog-common@1.0.13-next.0
  - @backstage/plugin-permission-react@0.4.12-next.1
  - @backstage/plugin-scaffolder-common@1.2.7-next.1

## 1.13.0-next.1

### Patch Changes

- 1e4f5e91b8e: Bump `zod` and `zod-to-json-schema` dependencies.
- e0c6e8b9c3c: Update peer dependencies
- Updated dependencies
  - @backstage/core-components@0.12.6-next.1
  - @backstage/plugin-scaffolder-common@1.2.7-next.1
  - @backstage/plugin-scaffolder-react@1.3.0-next.1
  - @backstage/integration-react@1.1.12-next.1
  - @backstage/core-plugin-api@1.5.1-next.0
  - @backstage/plugin-permission-react@0.4.12-next.0
  - @backstage/plugin-catalog-react@1.4.1-next.1
  - @backstage/integration@1.4.4-next.0
  - @backstage/theme@0.2.19-next.0
  - @backstage/catalog-client@1.4.0
  - @backstage/catalog-model@1.2.1
  - @backstage/config@1.0.7
  - @backstage/errors@1.1.5
  - @backstage/types@1.0.2
  - @backstage/plugin-catalog-common@1.0.13-next.0

## 1.13.0-next.0

### Minor Changes

- cdab34fd9a2: scaffolder/next: removing the `routeRefs` and exporting the originals on `scaffolderPlugin.routes.x` instead
- e5ad1bd61ec: Allow `TemplateListPage` and `TemplateWizardPage` to be passed in as props
- 92cf86a4b5d: Added a `templateFilter` prop to the `<Router/>` component to allow for filtering of templates through a function.
- 259d3407b9b: Move `CategoryPicker` from `scaffolder` into `scaffolder-react`
  Move `ContextMenu` into `scaffolder-react` and rename it to `ScaffolderPageContextMenu`

### Patch Changes

- e27ddc36dad: Added a possibility to cancel the running task (executing of a scaffolder template)
- 57c1b4752fa: Allow use of `{ exists: true }` value inside filters to filter entities that has that key.

  this example will filter all entities that has the annotation `someAnnotation` set to any value.

  ```yaml
  ui:options:
    catalogFilter:
      kind: Group
      metadata.annotations.someAnnotation: { exists: true }
  ```

- 7a6b16cc506: `scaffolder/next`: Bump `@rjsf/*` deps to 5.3.1
- f84fc7fd040: Updated dependency `@rjsf/validator-ajv8` to `5.3.0`.
- 8e00acb28db: Small tweaks to remove warnings in the console during development (mainly focusing on techdocs)
- Updated dependencies
  - @backstage/plugin-scaffolder-react@1.3.0-next.0
  - @backstage/plugin-scaffolder-common@1.2.7-next.0
  - @backstage/core-components@0.12.6-next.0
  - @backstage/plugin-catalog-react@1.4.1-next.0
  - @backstage/integration-react@1.1.12-next.0
  - @backstage/core-plugin-api@1.5.0
  - @backstage/config@1.0.7
  - @backstage/integration@1.4.3
  - @backstage/plugin-permission-react@0.4.11
  - @backstage/catalog-client@1.4.0
  - @backstage/catalog-model@1.2.1
  - @backstage/errors@1.1.5
  - @backstage/theme@0.2.18
  - @backstage/types@1.0.2
  - @backstage/plugin-catalog-common@1.0.12

## 1.12.0

### Minor Changes

- 0d61fcca9c3: Update `EntityPicker` to use the fully qualified entity ref instead of the humanized version.
- 8f4d13f21cf: Move `useTaskStream`, `TaskBorder`, `TaskLogStream` and `TaskSteps` into `scaffolder-react`.

### Patch Changes

- 65454876fb2: Minor API report tweaks
- 3c96e77b513: Make scaffolder adhere to page themes by using page `fontColor` consistently. If your theme overwrites template list or card headers, review those styles.
- be3cddaab5f: Getting credentials in the RepoUrlPicker now also works for targets without owner (e.g. Bitbucket Server).
- cb8ec97cdeb: Change black & white colors to be theme aware
- eb877bad736: Create an "Other Templates" group when groups are given to scaffolder/next.
- c10384a9235: Switch to using `LinkButton` instead of the deprecated `Button`
- 928a12a9b3e: Internal refactor of `/alpha` exports.
- 52b0022dab7: Updated dependency `msw` to `^1.0.0`.
- 0aae4596296: Fix the scaffolder validator for arrays when the item is a field in the object
- Updated dependencies
  - @backstage/catalog-client@1.4.0
  - @backstage/core-components@0.12.5
  - @backstage/plugin-scaffolder-react@1.2.0
  - @backstage/plugin-catalog-react@1.4.0
  - @backstage/errors@1.1.5
  - @backstage/core-plugin-api@1.5.0
  - @backstage/catalog-model@1.2.1
  - @backstage/plugin-catalog-common@1.0.12
  - @backstage/integration-react@1.1.11
  - @backstage/integration@1.4.3
  - @backstage/config@1.0.7
  - @backstage/theme@0.2.18
  - @backstage/types@1.0.2
  - @backstage/plugin-permission-react@0.4.11
  - @backstage/plugin-scaffolder-common@1.2.6

## 1.12.0-next.2

### Minor Changes

- 0d61fcca9c3: Update `EntityPicker` to use the fully qualified entity ref instead of the humanized version.

### Patch Changes

- 65454876fb2: Minor API report tweaks
- 3c96e77b513: Make scaffolder adhere to page themes by using page `fontColor` consistently. If your theme overwrites template list or card headers, review those styles.
- 0aae4596296: Fix the scaffolder validator for arrays when the item is a field in the object
- Updated dependencies
  - @backstage/core-components@0.12.5-next.2
  - @backstage/plugin-scaffolder-react@1.2.0-next.2
  - @backstage/plugin-catalog-react@1.4.0-next.2
  - @backstage/core-plugin-api@1.5.0-next.2
  - @backstage/integration-react@1.1.11-next.2
  - @backstage/plugin-permission-react@0.4.11-next.2
  - @backstage/config@1.0.7-next.0
  - @backstage/integration@1.4.3-next.0

## 1.12.0-next.1

### Minor Changes

- 8f4d13f21cf: Move `useTaskStream`, `TaskBorder`, `TaskLogStream` and `TaskSteps` into `scaffolder-react`.

### Patch Changes

- be3cddaab5f: Getting credentials in the RepoUrlPicker now also works for targets without owner (e.g. Bitbucket Server).
- cb8ec97cdeb: Change black & white colors to be theme aware
- eb877bad736: Create an "Other Templates" group when groups are given to scaffolder/next.
- c10384a9235: Switch to using `LinkButton` instead of the deprecated `Button`
- 52b0022dab7: Updated dependency `msw` to `^1.0.0`.
- Updated dependencies
  - @backstage/plugin-scaffolder-react@1.2.0-next.1
  - @backstage/core-components@0.12.5-next.1
  - @backstage/errors@1.1.5-next.0
  - @backstage/catalog-client@1.4.0-next.1
  - @backstage/core-plugin-api@1.4.1-next.1
  - @backstage/integration-react@1.1.11-next.1
  - @backstage/integration@1.4.3-next.0
  - @backstage/config@1.0.7-next.0
  - @backstage/theme@0.2.18-next.0
  - @backstage/plugin-catalog-react@1.4.0-next.1
  - @backstage/catalog-model@1.2.1-next.1
  - @backstage/types@1.0.2
  - @backstage/plugin-catalog-common@1.0.12-next.1
  - @backstage/plugin-permission-react@0.4.11-next.1
  - @backstage/plugin-scaffolder-common@1.2.6-next.1

## 1.11.1-next.0

### Patch Changes

- 928a12a9b3: Internal refactor of `/alpha` exports.
- Updated dependencies
  - @backstage/catalog-client@1.4.0-next.0
  - @backstage/plugin-scaffolder-react@1.1.1-next.0
  - @backstage/plugin-catalog-react@1.4.0-next.0
  - @backstage/core-plugin-api@1.4.1-next.0
  - @backstage/catalog-model@1.2.1-next.0
  - @backstage/plugin-catalog-common@1.0.12-next.0
  - @backstage/config@1.0.6
  - @backstage/core-components@0.12.5-next.0
  - @backstage/errors@1.1.4
  - @backstage/integration@1.4.2
  - @backstage/integration-react@1.1.11-next.0
  - @backstage/theme@0.2.17
  - @backstage/types@1.0.2
  - @backstage/plugin-permission-react@0.4.11-next.0
  - @backstage/plugin-scaffolder-common@1.2.6-next.0

## 1.11.0

### Minor Changes

- d6bb12a2e7: - **Deprecation** - Deprecated the following exports, please import them directly from `@backstage/plugin-scaffolder-react` instead

  ```
  createScaffolderLayout
  ScaffolderLayouts
  LayoutOptions
  LayoutTemplate
  ```

- a521379688: Migrating the `TemplateEditorPage` to work with the new components from `@backstage/plugin-scaffolder-react`
- 074f7e81b5: Added a missing validator check for items in an array
- 8c2966536b: Embed scaffolder workflow in other components

### Patch Changes

- 04f717a8e1: `scaffolder/next`: bump `react-jsonschema-form` libraries to `v5-stable`
- b46f385eff: scaffolder/next: Implementing a simple `OngoingTask` page
- cbab8ac107: lock versions of `@rjsf/*-beta` packages
- 346d6b6630: Upgrade `@rjsf` version 5 dependencies to `beta.18`
- ccbf91051b: bump `@rjsf` `v5` dependencies to 5.1.0
- d2ddde2108: Add `ScaffolderLayouts` to `NextScaffolderPage`
- 0f0da2f256: Prefer schema ordering of template properties during review content generation.
- 38992bdbaf: Fixed bug in review step refactor that caused schema-based display settings for individual property values to be discarded.
- Updated dependencies
  - @backstage/plugin-scaffolder-react@1.1.0
  - @backstage/core-components@0.12.4
  - @backstage/catalog-model@1.2.0
  - @backstage/theme@0.2.17
  - @backstage/core-plugin-api@1.4.0
  - @backstage/plugin-catalog-react@1.3.0
  - @backstage/catalog-client@1.3.1
  - @backstage/config@1.0.6
  - @backstage/errors@1.1.4
  - @backstage/integration@1.4.2
  - @backstage/integration-react@1.1.10
  - @backstage/types@1.0.2
  - @backstage/plugin-catalog-common@1.0.11
  - @backstage/plugin-permission-react@0.4.10
  - @backstage/plugin-scaffolder-common@1.2.5

## 1.11.0-next.2

### Patch Changes

- b46f385eff: scaffolder/next: Implementing a simple `OngoingTask` page
- ccbf91051b: bump `@rjsf` `v5` dependencies to 5.1.0
- Updated dependencies
  - @backstage/plugin-scaffolder-react@1.1.0-next.2
  - @backstage/catalog-model@1.2.0-next.1
  - @backstage/core-components@0.12.4-next.1
  - @backstage/catalog-client@1.3.1-next.1
  - @backstage/config@1.0.6
  - @backstage/core-plugin-api@1.3.0
  - @backstage/errors@1.1.4
  - @backstage/integration@1.4.2
  - @backstage/integration-react@1.1.10-next.1
  - @backstage/theme@0.2.16
  - @backstage/types@1.0.2
  - @backstage/plugin-catalog-common@1.0.11-next.1
  - @backstage/plugin-catalog-react@1.3.0-next.2
  - @backstage/plugin-permission-react@0.4.9
  - @backstage/plugin-scaffolder-common@1.2.5-next.1

## 1.11.0-next.1

### Patch Changes

- 04f717a8e1: `scaffolder/next`: bump `react-jsonschema-form` libraries to `v5-stable`
- 346d6b6630: Upgrade `@rjsf` version 5 dependencies to `beta.18`
- 0f0da2f256: Prefer schema ordering of template properties during review content generation.
- 38992bdbaf: Fixed bug in review step refactor that caused schema-based display settings for individual property values to be discarded.
- Updated dependencies
  - @backstage/plugin-scaffolder-react@1.1.0-next.1
  - @backstage/core-components@0.12.4-next.0
  - @backstage/plugin-catalog-react@1.3.0-next.1
  - @backstage/catalog-client@1.3.1-next.0
  - @backstage/catalog-model@1.1.6-next.0
  - @backstage/config@1.0.6
  - @backstage/core-plugin-api@1.3.0
  - @backstage/errors@1.1.4
  - @backstage/integration@1.4.2
  - @backstage/integration-react@1.1.10-next.0
  - @backstage/theme@0.2.16
  - @backstage/types@1.0.2
  - @backstage/plugin-catalog-common@1.0.11-next.0
  - @backstage/plugin-permission-react@0.4.9
  - @backstage/plugin-scaffolder-common@1.2.5-next.0

## 1.11.0-next.0

### Minor Changes

- d6bb12a2e7: - **Deprecation** - Deprecated the following exports, please import them directly from `@backstage/plugin-scaffolder-react` instead

  ```
  createScaffolderLayout
  ScaffolderLayouts
  LayoutOptions
  LayoutTemplate
  ```

- 8c2966536b: Embed scaffolder workflow in other components

### Patch Changes

- cbab8ac107: lock versions of `@rjsf/*-beta` packages
- d2ddde2108: Add `ScaffolderLayouts` to `NextScaffolderPage`
- Updated dependencies
  - @backstage/plugin-scaffolder-react@1.1.0-next.0
  - @backstage/plugin-catalog-react@1.3.0-next.0
  - @backstage/catalog-model@1.1.6-next.0
  - @backstage/catalog-client@1.3.1-next.0
  - @backstage/plugin-catalog-common@1.0.11-next.0
  - @backstage/plugin-scaffolder-common@1.2.5-next.0
  - @backstage/integration-react@1.1.9

## 1.10.0

### Minor Changes

- e4c0240445: Added `catalogFilter` field to OwnerPicker and EntityPicker components to support filtering options by any field(s) of an entity.

  The `allowedKinds` field has been deprecated. Use `catalogFilter` instead. This field allows users to specify a filter on the shape of [EntityFilterQuery](https://github.com/backstage/backstage/blob/774c42003782121d3d6b2aa5f2865d53370c160e/packages/catalog-client/src/types/api.ts#L74), which can be passed into the CatalogClient. See examples below:

  - Get all entities of kind `Group`

    ```yaml
    owner:
      title: Owner
      type: string
      description: Owner of the component
      ui:field: OwnerPicker
      ui:options:
        catalogFilter:
          - kind: Group
    ```

  - Get entities of kind `Group` and spec.type `team`
    ```yaml
    owner:
      title: Owner
      type: string
      description: Owner of the component
      ui:field: OwnerPicker
      ui:options:
        catalogFilter:
          - kind: Group
            spec.type: team
    ```

- b4955ed7b9: - **Deprecation** - Deprecated the following exports, please import them directly from `@backstage/plugin-scaffolder-react` instead

  ```
  createScaffolderFieldExtension
  ScaffolderFieldExtensions
  useTemplateSecrets
  scaffolderApiRef
  ScaffolderApi
  ScaffolderUseTemplateSecrets
  TemplateParameterSchema
  CustomFieldExtensionSchema
  CustomFieldValidator
  FieldExtensionOptions
  FieldExtensionComponentProps
  FieldExtensionComponent
  ListActionsResponse
  LogEvent
  ScaffolderDryRunOptions
  ScaffolderDryRunResponse
  ScaffolderGetIntegrationsListOptions
  ScaffolderGetIntegrationsListResponse
  ScaffolderOutputlink
  ScaffolderScaffoldOptions
  ScaffolderScaffoldResponse
  ScaffolderStreamLogsOptions
  ScaffolderTask
  ScaffolderTaskOutput
  ScaffolderTaskStatus
  ```

  - **Deprecation** - Deprecated the `rootRouteRef` export, this should now be used from `scaffolderPlugin.routes.root`

  - The following `/alpha` types have removed from this package and moved to the `@backstage/plugin-scaffolder-react/alpha` package

    ```
    createNextScaffolderFieldExtension
    FormProps
    NextCustomFieldValidator
    NextFieldExtensionComponentProps
    NextFieldExtensionOptions
    ```

### Patch Changes

- 3c112f6967: rollback `@rjsf/validator-ajv8` to `@rjsf/validator-v6`
- 2fadff2a25: Render the scaffolder action description using the `MarkdownContent` component. This will allow the page to show richer content to describe scaffolder actions.
- 27a5e90e97: Small updates to some paragraph components to ensure theme typography properties are inherited correctly.
- 223e2c5f03: add `onChange` handler to`Stepper` component
- 659c92a1dc: Updated dependency `use-immer` to `^0.8.0`.
- 489935d625: Show action example yaml on the scaffolder actions documentation page.
- b8269de9f1: Explicitly declaring children as optional props to facilitate react 18 changes
- Updated dependencies
  - @backstage/catalog-model@1.1.5
  - @backstage/plugin-scaffolder-common@1.2.4
  - @backstage/catalog-client@1.3.0
  - @backstage/plugin-catalog-react@1.2.4
  - @backstage/core-components@0.12.3
  - @backstage/plugin-scaffolder-react@1.0.0
  - @backstage/core-plugin-api@1.3.0
  - @backstage/plugin-permission-react@0.4.9
  - @backstage/config@1.0.6
  - @backstage/errors@1.1.4
  - @backstage/integration@1.4.2
  - @backstage/integration-react@1.1.9
  - @backstage/theme@0.2.16
  - @backstage/types@1.0.2
  - @backstage/plugin-catalog-common@1.0.10

## 1.10.0-next.2

### Minor Changes

- b4955ed7b9: - **Deprecation** - Deprecated the following exports, please import them directly from `@backstage/plugin-scaffolder-react` instead

  ```
  createScaffolderFieldExtension
  ScaffolderFieldExtensions
  useTemplateSecrets
  scaffolderApiRef
  ScaffolderApi
  ScaffolderUseTemplateSecrets
  TemplateParameterSchema
  CustomFieldExtensionSchema
  CustomFieldValidator
  FieldExtensionOptions
  FieldExtensionComponentProps
  FieldExtensionComponent
  ListActionsResponse
  LogEvent
  ScaffolderDryRunOptions
  ScaffolderDryRunResponse
  ScaffolderGetIntegrationsListOptions
  ScaffolderGetIntegrationsListResponse
  ScaffolderOutputlink
  ScaffolderScaffoldOptions
  ScaffolderScaffoldResponse
  ScaffolderStreamLogsOptions
  ScaffolderTask
  ScaffolderTaskOutput
  ScaffolderTaskStatus
  ```

  - **Deprecation** - Deprecated the `rootRouteRef` export, this should now be used from `scaffolderPlugin.routes.root`

  - The following `/alpha` types have removed from this package and moved to the `@backstage/plugin-scaffolder-react/alpha` package

    ```
    createNextScaffolderFieldExtension
    FormProps
    NextCustomFieldValidator
    NextFieldExtensionComponentProps
    NextFieldExtensionOptions
    ```

### Patch Changes

- 2fadff2a25: Render the scaffolder action description using the `MarkdownContent` component. This will allow the page to show richer content to describe scaffolder actions.
- 659c92a1dc: Updated dependency `use-immer` to `^0.8.0`.
- 489935d625: Show action example yaml on the scaffolder actions documentation page.
- b8269de9f1: Explicitly declaring children as optional props to facilitate react 18 changes
- Updated dependencies
  - @backstage/plugin-scaffolder-react@1.0.0-next.0
  - @backstage/core-plugin-api@1.3.0-next.1
  - @backstage/catalog-client@1.3.0-next.2
  - @backstage/plugin-catalog-react@1.2.4-next.2
  - @backstage/plugin-permission-react@0.4.9-next.1
  - @backstage/catalog-model@1.1.5-next.1
  - @backstage/config@1.0.6-next.0
  - @backstage/core-components@0.12.3-next.2
  - @backstage/errors@1.1.4
  - @backstage/integration@1.4.2-next.0
  - @backstage/integration-react@1.1.9-next.2
  - @backstage/theme@0.2.16
  - @backstage/types@1.0.2
  - @backstage/plugin-catalog-common@1.0.10-next.1
  - @backstage/plugin-scaffolder-common@1.2.4-next.1

## 1.10.0-next.1

### Patch Changes

- Updated dependencies
  - @backstage/config@1.0.6-next.0
  - @backstage/catalog-client@1.3.0-next.1
  - @backstage/catalog-model@1.1.5-next.1
  - @backstage/core-components@0.12.3-next.1
  - @backstage/core-plugin-api@1.2.1-next.0
  - @backstage/errors@1.1.4
  - @backstage/integration@1.4.2-next.0
  - @backstage/integration-react@1.1.9-next.1
  - @backstage/theme@0.2.16
  - @backstage/types@1.0.2
  - @backstage/plugin-catalog-common@1.0.10-next.1
  - @backstage/plugin-catalog-react@1.2.4-next.1
  - @backstage/plugin-permission-react@0.4.9-next.0
  - @backstage/plugin-scaffolder-common@1.2.4-next.1

## 1.10.0-next.0

### Minor Changes

- e4c0240445: Added `catalogFilter` field to OwnerPicker and EntityPicker components to support filtering options by any field(s) of an entity.

  The `allowedKinds` field has been deprecated. Use `catalogFilter` instead. This field allows users to specify a filter on the shape of [EntityFilterQuery](https://github.com/backstage/backstage/blob/774c42003782121d3d6b2aa5f2865d53370c160e/packages/catalog-client/src/types/api.ts#L74), which can be passed into the CatalogClient. See examples below:

  - Get all entities of kind `Group`

    ```yaml
    owner:
      title: Owner
      type: string
      description: Owner of the component
      ui:field: OwnerPicker
      ui:options:
        catalogFilter:
          - kind: Group
    ```

  - Get entities of kind `Group` and spec.type `team`
    ```yaml
    owner:
      title: Owner
      type: string
      description: Owner of the component
      ui:field: OwnerPicker
      ui:options:
        catalogFilter:
          - kind: Group
            spec.type: team
    ```

### Patch Changes

- 3c112f6967: rollback `@rjsf/validator-ajv8` to `@rjsf/validator-v6`
- 223e2c5f03: add `onChange` handler to`Stepper` component
- Updated dependencies
  - @backstage/catalog-model@1.1.5-next.0
  - @backstage/plugin-scaffolder-common@1.2.4-next.0
  - @backstage/catalog-client@1.3.0-next.0
  - @backstage/plugin-catalog-react@1.2.4-next.0
  - @backstage/core-components@0.12.3-next.0
  - @backstage/config@1.0.5
  - @backstage/core-plugin-api@1.2.0
  - @backstage/errors@1.1.4
  - @backstage/integration@1.4.1
  - @backstage/integration-react@1.1.9-next.0
  - @backstage/theme@0.2.16
  - @backstage/types@1.0.2
  - @backstage/plugin-catalog-common@1.0.10-next.0
  - @backstage/plugin-permission-react@0.4.8

## 1.9.1

### Patch Changes

- Updated dependencies
  - @backstage/core-components@0.12.2
  - @backstage/integration-react@1.1.8
  - @backstage/plugin-catalog-react@1.2.3

## 1.9.0

### Minor Changes

- ddd1c3308d: Implement Custom Field Explorer to view and play around with available installed custom field extensions
- adb1b01e32: Adds the ability to supply a `transformErrors` function to the `Stepper` for `/next`
- 34a48cdc4f: The `RepoUrlPicker` field extension now has an `allowedProjects` option for narrowing the selection of Bitbucket URLs.

### Patch Changes

- d4d07cf55e: Enabling the customization of the last step in the scaffolder template.

  To override the content you have to do the next:

  ```typescript jsx
  <TemplatePage ReviewStepComponent={YourCustomComponent} />
  ```

- ef803022f1: Initialize all `formData` in the `Stepper` in `/next`
- 9b1fadf6d8: Added `noHtml5Validate` prop to `FormProps` on `NextScaffolderPage`
- b05dcd5530: Move the `zod` dependency to a version that does not collide with other libraries
- 2e701b3796: Internal refactor to use `react-router-dom` rather than `react-router`.
- 9000952e87: Form data is now passed to validator functions in 'next' scaffolder, so it's now possible to perform validation for fields that depend on other field values. This is something that we discourage due to the coupling that it creates, but is sometimes still the most sensible solution.

  ```typescript jsx
  export const myCustomValidation = (
    value: string,
    validation: FieldValidation,
    { apiHolder, formData }: { apiHolder: ApiHolder; formData: JsonObject },
  ) => {
    // validate
  };
  ```

- 5b10b2485a: Parse `formData` from `window.location.query` for `scaffolder/next`
- 57ad6553d0: Pass through `transformErrors` to `TemplateWizardPage`
- 3280711113: Updated dependency `msw` to `^0.49.0`.
- 19356df560: Updated dependency `zen-observable` to `^0.9.0`.
- c3fa90e184: Updated dependency `zen-observable` to `^0.10.0`.
- 5fb6d5e92e: Updated dependency `@react-hookz/web` to `^19.0.0`.
- 146378c146: Updated dependency `@react-hookz/web` to `^20.0.0`.
- 380f549b75: bump `@rjsf/*-v5` dependencies
- a63e2df559: fixed `headerOptions` not passed to `TemplatePage` component
- 9b606366bf: Bump `json-schema-library` to version `^7.3.9` which does not pull in the `gson-pointer` library
- db6310b6a0: Show input type array correctly on installed actions page.
- Updated dependencies
  - @backstage/core-plugin-api@1.2.0
  - @backstage/catalog-client@1.2.0
  - @backstage/core-components@0.12.1
  - @backstage/errors@1.1.4
  - @backstage/plugin-catalog-react@1.2.2
  - @backstage/plugin-permission-react@0.4.8
  - @backstage/integration-react@1.1.7
  - @backstage/integration@1.4.1
  - @backstage/types@1.0.2
  - @backstage/catalog-model@1.1.4
  - @backstage/config@1.0.5
  - @backstage/theme@0.2.16
  - @backstage/plugin-catalog-common@1.0.9
  - @backstage/plugin-scaffolder-common@1.2.3

## 1.9.0-next.4

### Minor Changes

- 34a48cdc4f: The `RepoUrlPicker` field extension now has an `allowedProjects` option for narrowing the selection of Bitbucket URLs.

### Patch Changes

- b05dcd5530: Move the `zod` dependency to a version that does not collide with other libraries
- 2e701b3796: Internal refactor to use `react-router-dom` rather than `react-router`.
- db6310b6a0: Show input type array correctly on installed actions page.
- Updated dependencies
  - @backstage/core-components@0.12.1-next.4
  - @backstage/plugin-catalog-react@1.2.2-next.4
  - @backstage/plugin-permission-react@0.4.8-next.3
  - @backstage/catalog-client@1.2.0-next.1
  - @backstage/catalog-model@1.1.4-next.1
  - @backstage/config@1.0.5-next.1
  - @backstage/core-plugin-api@1.2.0-next.2
  - @backstage/errors@1.1.4-next.1
  - @backstage/integration@1.4.1-next.1
  - @backstage/integration-react@1.1.7-next.4
  - @backstage/theme@0.2.16
  - @backstage/types@1.0.2-next.1
  - @backstage/plugin-catalog-common@1.0.9-next.3
  - @backstage/plugin-scaffolder-common@1.2.3-next.1

## 1.9.0-next.3

### Patch Changes

- Updated dependencies
  - @backstage/core-components@0.12.1-next.3
  - @backstage/catalog-client@1.2.0-next.1
  - @backstage/catalog-model@1.1.4-next.1
  - @backstage/config@1.0.5-next.1
  - @backstage/core-plugin-api@1.2.0-next.2
  - @backstage/errors@1.1.4-next.1
  - @backstage/integration@1.4.1-next.1
  - @backstage/integration-react@1.1.7-next.3
  - @backstage/theme@0.2.16
  - @backstage/types@1.0.2-next.1
  - @backstage/plugin-catalog-common@1.0.9-next.2
  - @backstage/plugin-catalog-react@1.2.2-next.3
  - @backstage/plugin-permission-react@0.4.8-next.2
  - @backstage/plugin-scaffolder-common@1.2.3-next.1

## 1.9.0-next.2

### Patch Changes

- 5fb6d5e92e: Updated dependency `@react-hookz/web` to `^19.0.0`.
- 146378c146: Updated dependency `@react-hookz/web` to `^20.0.0`.
- 9b606366bf: Bump `json-schema-library` to version `^7.3.9` which does not pull in the `gson-pointer` library
- Updated dependencies
  - @backstage/core-plugin-api@1.2.0-next.2
  - @backstage/core-components@0.12.1-next.2
  - @backstage/plugin-catalog-react@1.2.2-next.2
  - @backstage/integration-react@1.1.7-next.2
  - @backstage/plugin-permission-react@0.4.8-next.2
  - @backstage/catalog-client@1.2.0-next.1
  - @backstage/catalog-model@1.1.4-next.1
  - @backstage/config@1.0.5-next.1
  - @backstage/errors@1.1.4-next.1
  - @backstage/integration@1.4.1-next.1
  - @backstage/theme@0.2.16
  - @backstage/types@1.0.2-next.1
  - @backstage/plugin-catalog-common@1.0.9-next.2
  - @backstage/plugin-scaffolder-common@1.2.3-next.1

## 1.9.0-next.1

### Patch Changes

- c3fa90e184: Updated dependency `zen-observable` to `^0.10.0`.
- Updated dependencies
  - @backstage/core-components@0.12.1-next.1
  - @backstage/core-plugin-api@1.1.1-next.1
  - @backstage/types@1.0.2-next.1
  - @backstage/plugin-catalog-react@1.2.2-next.1
  - @backstage/integration-react@1.1.7-next.1
  - @backstage/config@1.0.5-next.1
  - @backstage/integration@1.4.1-next.1
  - @backstage/plugin-permission-react@0.4.8-next.1
  - @backstage/catalog-client@1.2.0-next.1
  - @backstage/catalog-model@1.1.4-next.1
  - @backstage/errors@1.1.4-next.1
  - @backstage/theme@0.2.16
  - @backstage/plugin-catalog-common@1.0.9-next.1
  - @backstage/plugin-scaffolder-common@1.2.3-next.1

## 1.9.0-next.0

### Minor Changes

- ddd1c3308d: Implement Custom Field Explorer to view and play around with available installed custom field extensions
- adb1b01e32: Adds the ability to supply a `transformErrors` function to the `Stepper` for `/next`

### Patch Changes

- d4d07cf55e: Enabling the customization of the last step in the scaffolder template.

  To override the content you have to do the next:

  ```typescript jsx
  <TemplatePage ReviewStepComponent={YourCustomComponent} />
  ```

- ef803022f1: Initialize all `formData` in the `Stepper` in `/next`
- 3280711113: Updated dependency `msw` to `^0.49.0`.
- 19356df560: Updated dependency `zen-observable` to `^0.9.0`.
- a63e2df559: fixed `headerOptions` not passed to `TemplatePage` component
- Updated dependencies
  - @backstage/catalog-client@1.2.0-next.0
  - @backstage/core-components@0.12.1-next.0
  - @backstage/core-plugin-api@1.1.1-next.0
  - @backstage/integration-react@1.1.7-next.0
  - @backstage/integration@1.4.1-next.0
  - @backstage/types@1.0.2-next.0
  - @backstage/plugin-catalog-react@1.2.2-next.0
  - @backstage/catalog-model@1.1.4-next.0
  - @backstage/config@1.0.5-next.0
  - @backstage/errors@1.1.4-next.0
  - @backstage/theme@0.2.16
  - @backstage/plugin-catalog-common@1.0.9-next.0
  - @backstage/plugin-permission-react@0.4.8-next.0
  - @backstage/plugin-scaffolder-common@1.2.3-next.0

## 1.8.0

### Minor Changes

- edae17309e: Added props to override default Scaffolder page title, subtitle and pageTitleOverride.
  Routes like `rootRouteRef`, `selectedTemplateRouteRef`, `nextRouteRef`, `nextSelectedTemplateRouteRef` were made public and can be used in your app (e.g. in custom TemplateCard component).

### Patch Changes

- 580285787d: The `create` and `click` analytics events are now also captured on the "next" version of the component creation page.
- 4830a3569f: Basic analytics instrumentation is now in place:

  - As users make their way through template steps, a `click` event is fired, including the step number.
  - After a user clicks "Create" a `create` event is fired, including the name of the software that was just created. The template used at creation is set on the `entityRef` context key.

- 94b7ca9c6d: Updated to use `@rjsf` packages of version `^5.0.0-beta.12`
- 87840c8c6c: Fixed tiny grammar error in EntityNamePicker. The first letter of the description is now capitalized.
- 3b3fc3cc3c: Fix `formData` not being present in the `next` version
- b2bb48a6f4: Fix the return type for the `createNextScaffodlerFieldExtension` type as before it wasn't a component type for the extension
- f905853ad6: Prefer using `Link` from `@backstage/core-components` rather than material-UI.
- Updated dependencies
  - @backstage/plugin-catalog-react@1.2.1
  - @backstage/core-components@0.12.0
  - @backstage/core-plugin-api@1.1.0
  - @backstage/integration@1.4.0
  - @backstage/catalog-model@1.1.3
  - @backstage/types@1.0.1
  - @backstage/integration-react@1.1.6
  - @backstage/catalog-client@1.1.2
  - @backstage/config@1.0.4
  - @backstage/errors@1.1.3
  - @backstage/theme@0.2.16
  - @backstage/plugin-catalog-common@1.0.8
  - @backstage/plugin-permission-react@0.4.7
  - @backstage/plugin-scaffolder-common@1.2.2

## 1.8.0-next.1

### Patch Changes

- 580285787d: The `create` and `click` analytics events are now also captured on the "next" version of the component creation page.
- 3b3fc3cc3c: Fix `formData` not being present in the `next` version
- Updated dependencies
  - @backstage/core-components@0.12.0-next.1
  - @backstage/catalog-client@1.1.2-next.0
  - @backstage/catalog-model@1.1.3-next.0
  - @backstage/config@1.0.4-next.0
  - @backstage/core-plugin-api@1.1.0-next.0
  - @backstage/errors@1.1.3-next.0
  - @backstage/integration@1.4.0-next.0
  - @backstage/integration-react@1.1.6-next.1
  - @backstage/theme@0.2.16
  - @backstage/types@1.0.1-next.0
  - @backstage/plugin-catalog-common@1.0.8-next.0
  - @backstage/plugin-catalog-react@1.2.1-next.1
  - @backstage/plugin-permission-react@0.4.7-next.0
  - @backstage/plugin-scaffolder-common@1.2.2-next.0

## 1.8.0-next.0

### Minor Changes

- edae17309e: Added props to override default Scaffolder page title, subtitle and pageTitleOverride.
  Routes like `rootRouteRef`, `selectedTemplateRouteRef`, `nextRouteRef`, `nextSelectedTemplateRouteRef` were made public and can be used in your app (e.g. in custom TemplateCard component).

### Patch Changes

- 4830a3569f: Basic analytics instrumentation is now in place:

  - As users make their way through template steps, a `click` event is fired, including the step number.
  - After a user clicks "Create" a `create` event is fired, including the name of the software that was just created. The template used at creation is set on the `entityRef` context key.

- f905853ad6: Prefer using `Link` from `@backstage/core-components` rather than material-UI.
- Updated dependencies
  - @backstage/plugin-catalog-react@1.2.1-next.0
  - @backstage/core-components@0.12.0-next.0
  - @backstage/core-plugin-api@1.1.0-next.0
  - @backstage/integration@1.4.0-next.0
  - @backstage/catalog-model@1.1.3-next.0
  - @backstage/types@1.0.1-next.0
  - @backstage/integration-react@1.1.6-next.0
  - @backstage/plugin-permission-react@0.4.7-next.0
  - @backstage/catalog-client@1.1.2-next.0
  - @backstage/config@1.0.4-next.0
  - @backstage/errors@1.1.3-next.0
  - @backstage/theme@0.2.16
  - @backstage/plugin-catalog-common@1.0.8-next.0
  - @backstage/plugin-scaffolder-common@1.2.2-next.0

## 1.7.0

### Minor Changes

- f13d5f3f06: Add support for link to TechDocs and other links defined in template entity specification metadata on TemplateCard
- 05f22193c5: EntityPickers now support flags to control when to include default namespace
  in result

### Patch Changes

- e4f0a96424: Making the description of the GitLab repoUrl owner field more clearer by focusing it refers to the GitLab namespace.
- 92e490d6b4: Make the `/next` scaffolder work end to end with the old `TaskPage` view
- 8220f2fd83: Support custom layouts in dry run editor
- 1047baa926: Bump to `react-jsonschema-form@v5-beta` for the `NextRouter` under `@alpha` exports
- 98ae18b68f: Fixed a bug where the `allowed*` values for the `RepoUrlPicker` would be reset on render.
- 8960d83013: Add support for `allowedOrganizations` and `allowedOwners` to the `AzureRepoPicker`.
- b681275e69: Ignore .git directories in Template Editor, increase upload limit for dry-runs to 10MB.
- Updated dependencies
  - @backstage/catalog-model@1.1.2
  - @backstage/plugin-catalog-react@1.2.0
  - @backstage/core-components@0.11.2
  - @backstage/plugin-catalog-common@1.0.7
  - @backstage/catalog-client@1.1.1
  - @backstage/plugin-scaffolder-common@1.2.1
  - @backstage/integration-react@1.1.5
  - @backstage/core-plugin-api@1.0.7
  - @backstage/config@1.0.3
  - @backstage/errors@1.1.2
  - @backstage/integration@1.3.2
  - @backstage/theme@0.2.16
  - @backstage/types@1.0.0
  - @backstage/plugin-permission-react@0.4.6

## 1.7.0-next.2

### Patch Changes

- 92e490d6b4: Make the `/next` scaffolder work end to end with the old `TaskPage` view
- 1047baa926: Bump to `react-jsonschema-form@v5-beta` for the `NextRouter` under `@alpha` exports
- 98ae18b68f: Fixed a bug where the `allowed*` values for the `RepoUrlPicker` would be reset on render.
- Updated dependencies
  - @backstage/plugin-catalog-common@1.0.7-next.2
  - @backstage/plugin-catalog-react@1.2.0-next.2
  - @backstage/plugin-permission-react@0.4.6-next.2
  - @backstage/catalog-client@1.1.1-next.2
  - @backstage/catalog-model@1.1.2-next.2
  - @backstage/config@1.0.3-next.2
  - @backstage/core-components@0.11.2-next.2
  - @backstage/core-plugin-api@1.0.7-next.2
  - @backstage/errors@1.1.2-next.2
  - @backstage/integration@1.3.2-next.2
  - @backstage/integration-react@1.1.5-next.2
  - @backstage/theme@0.2.16
  - @backstage/types@1.0.0
  - @backstage/plugin-scaffolder-common@1.2.1-next.2

## 1.7.0-next.1

### Patch Changes

- e4f0a96424: Making the description of the GitLab repoUrl owner field more clearer by focusing it refers to the GitLab namespace.
- 8220f2fd83: Support custom layouts in dry run editor
- Updated dependencies
  - @backstage/plugin-catalog-react@1.2.0-next.1
  - @backstage/catalog-client@1.1.1-next.1
  - @backstage/core-components@0.11.2-next.1
  - @backstage/core-plugin-api@1.0.7-next.1
  - @backstage/catalog-model@1.1.2-next.1
  - @backstage/config@1.0.3-next.1
  - @backstage/errors@1.1.2-next.1
  - @backstage/integration@1.3.2-next.1
  - @backstage/integration-react@1.1.5-next.1
  - @backstage/theme@0.2.16
  - @backstage/types@1.0.0
  - @backstage/plugin-catalog-common@1.0.7-next.1
  - @backstage/plugin-permission-react@0.4.6-next.1
  - @backstage/plugin-scaffolder-common@1.2.1-next.1

## 1.7.0-next.0

### Minor Changes

- f13d5f3f06: Add support for link to TechDocs and other links defined in template entity specification metadata on TemplateCard
- 05f22193c5: EntityPickers now support flags to control when to include default namespace
  in result

### Patch Changes

- 8960d83013: Add support for `allowedOrganizations` and `allowedOwners` to the `AzureRepoPicker`.
- b681275e69: Ignore .git directories in Template Editor, increase upload limit for dry-runs to 10MB.
- Updated dependencies
  - @backstage/catalog-model@1.1.2-next.0
  - @backstage/core-components@0.11.2-next.0
  - @backstage/catalog-client@1.1.1-next.0
  - @backstage/plugin-catalog-react@1.1.5-next.0
  - @backstage/plugin-scaffolder-common@1.2.1-next.0
  - @backstage/integration-react@1.1.5-next.0
  - @backstage/config@1.0.3-next.0
  - @backstage/core-plugin-api@1.0.7-next.0
  - @backstage/errors@1.1.2-next.0
  - @backstage/integration@1.3.2-next.0
  - @backstage/theme@0.2.16
  - @backstage/types@1.0.0
  - @backstage/plugin-catalog-common@1.0.7-next.0
  - @backstage/plugin-permission-react@0.4.6-next.0

## 1.6.0

### Minor Changes

- 3424a8075d: Added support for `async` validation for the `next` version of the plugin
- ad036784e9: Ability to modify the layout of the step form
- 192d856495: Implementing review step for the scaffolder under `create/next`

### Patch Changes

- 817f3196f6: Updated React Router dependencies to be peer dependencies.
- eadf56bbbf: Bump `git-url-parse` version to `^13.0.0`
- 9ffb75616d: Fix bug with empty strings in `EntityPicker`
- 3f739be9d9: Minor API signatures cleanup
- 763fb81e82: Internal refactor to use more type safe code when dealing with route parameters.
- a66d44b72b: Fixing bug when the workspace would not be automatically saved when using `allowedOwners`
- 7d47def9c4: Removed dependency on `@types/jest`.
- 6522e459aa: Support displaying and ordering by counts in `EntityTagPicker` field. Add the `showCounts` option to enable this. Also support configuring `helperText`.
- f0510a20b5: Addition of a dismissible Error Banner in Scaffolder page
- 667d917488: Updated dependency `msw` to `^0.47.0`.
- 87ec2ba4d6: Updated dependency `msw` to `^0.46.0`.
- 9097278df2: Updated dependency `json-schema-library` to `^7.0.0`.
- bf5e9030eb: Updated dependency `msw` to `^0.45.0`.
- de336de9cd: fix uiSchema generation when using complex dependencies
- Updated dependencies
  - @backstage/core-components@0.11.1
  - @backstage/core-plugin-api@1.0.6
  - @backstage/plugin-catalog-react@1.1.4
  - @backstage/plugin-permission-react@0.4.5
  - @backstage/integration@1.3.1
  - @backstage/catalog-client@1.1.0
  - @backstage/catalog-model@1.1.1
  - @backstage/config@1.0.2
  - @backstage/errors@1.1.1
  - @backstage/integration-react@1.1.4
  - @backstage/plugin-scaffolder-common@1.2.0
  - @backstage/plugin-catalog-common@1.0.6

## 1.6.0-next.3

### Patch Changes

- 7d47def9c4: Removed dependency on `@types/jest`.
- 6522e459aa: Support displaying and ordering by counts in `EntityTagPicker` field. Add the `showCounts` option to enable this. Also support configuring `helperText`.
- f0510a20b5: Addition of a dismissible Error Banner in Scaffolder page
- Updated dependencies
  - @backstage/plugin-catalog-react@1.1.4-next.2
  - @backstage/catalog-client@1.1.0-next.2
  - @backstage/catalog-model@1.1.1-next.0
  - @backstage/config@1.0.2-next.0
  - @backstage/core-components@0.11.1-next.3
  - @backstage/core-plugin-api@1.0.6-next.3
  - @backstage/errors@1.1.1-next.0
  - @backstage/integration@1.3.1-next.2
  - @backstage/integration-react@1.1.4-next.2
  - @backstage/plugin-permission-react@0.4.5-next.2
  - @backstage/plugin-scaffolder-common@1.2.0-next.1

## 1.6.0-next.2

### Patch Changes

- eadf56bbbf: Bump `git-url-parse` version to `^13.0.0`
- 667d917488: Updated dependency `msw` to `^0.47.0`.
- 87ec2ba4d6: Updated dependency `msw` to `^0.46.0`.
- de336de9cd: fix uiSchema generation when using complex dependencies
- Updated dependencies
  - @backstage/integration@1.3.1-next.1
  - @backstage/catalog-client@1.0.5-next.1
  - @backstage/core-components@0.11.1-next.2
  - @backstage/core-plugin-api@1.0.6-next.2
  - @backstage/integration-react@1.1.4-next.1

## 1.6.0-next.1

### Patch Changes

- 817f3196f6: Updated React Router dependencies to be peer dependencies.
- 763fb81e82: Internal refactor to use more type safe code when dealing with route parameters.
- a66d44b72b: Fixing bug when the workspace would not be automatically saved when using `allowedOwners`
- Updated dependencies
  - @backstage/core-components@0.11.1-next.1
  - @backstage/core-plugin-api@1.0.6-next.1
  - @backstage/plugin-catalog-react@1.1.4-next.1
  - @backstage/plugin-permission-react@0.4.5-next.1

## 1.6.0-next.0

### Minor Changes

- 3424a8075d: Added support for `async` validation for the `next` version of the plugin
- 192d856495: Implementing review step for the scaffolder under `create/next`

### Patch Changes

- 9ffb75616d: Fix bug with empty strings in `EntityPicker`
- 3f739be9d9: Minor API signatures cleanup
- 9097278df2: Updated dependency `json-schema-library` to `^7.0.0`.
- bf5e9030eb: Updated dependency `msw` to `^0.45.0`.
- Updated dependencies
  - @backstage/core-plugin-api@1.0.6-next.0
  - @backstage/core-components@0.11.1-next.0
  - @backstage/catalog-client@1.0.5-next.0
  - @backstage/integration-react@1.1.4-next.0
  - @backstage/integration@1.3.1-next.0
  - @backstage/plugin-scaffolder-common@1.2.0-next.0
  - @backstage/plugin-catalog-react@1.1.4-next.0
  - @backstage/plugin-permission-react@0.4.5-next.0
  - @backstage/plugin-catalog-common@1.0.6-next.0

## 1.5.0

### Minor Changes

- c4b452e16a: Starting the implementation of the Wizard page for the `next` scaffolder plugin

### Patch Changes

- Updated dependencies
  - @backstage/integration@1.3.0
  - @backstage/core-components@0.11.0
  - @backstage/core-plugin-api@1.0.5
  - @backstage/plugin-catalog-react@1.1.3
  - @backstage/plugin-catalog-common@1.0.5
  - @backstage/integration-react@1.1.3
  - @backstage/plugin-permission-react@0.4.4

## 1.5.0-next.2

### Patch Changes

- Updated dependencies
  - @backstage/plugin-catalog-react@1.1.3-next.2
  - @backstage/core-components@0.11.0-next.2
  - @backstage/integration-react@1.1.3-next.1

## 1.5.0-next.1

### Minor Changes

- c4b452e16a: Starting the implementation of the Wizard page for the `next` scaffolder plugin

### Patch Changes

- Updated dependencies
  - @backstage/core-components@0.10.1-next.1
  - @backstage/plugin-catalog-common@1.0.5-next.0
  - @backstage/integration@1.3.0-next.1
  - @backstage/plugin-catalog-react@1.1.3-next.1

## 1.4.1-next.0

### Patch Changes

- Updated dependencies
  - @backstage/integration@1.3.0-next.0
  - @backstage/core-plugin-api@1.0.5-next.0
  - @backstage/integration-react@1.1.3-next.0
  - @backstage/plugin-catalog-react@1.1.3-next.0
  - @backstage/core-components@0.10.1-next.0
  - @backstage/plugin-permission-react@0.4.4-next.0

## 1.4.0

### Minor Changes

- d8eb82f447: Add `allowedRepos` `ui:option` to `RepoUrlPicker` component, and move `repoName` field to own component
- 9a96199f86: Add support for `allowedOwners` to the `BitbucketRepoPicker` used for the workspace value.

### Patch Changes

- 37539e29d8: The template editor now shows the cause of request errors that happen during a dry-run.
- b557e6c58d: Fixed that adding more than one `allowedOwner` or `allowedRepo` in the template config will now still set the first value as default in the initial form state of `RepoUrlPicker`.
- 842282ecf9: Bumped `codemirror` dependencies to `v6.0.0`.
- 11a5ca35f3: Add allowArbitraryValues for <OwnerPicker /> to provide input validation. This makes it a better experience of users, as they can now expect the values they enter to correspond to a valid owner. This is set to the default behavior by default.
- d600cb2ab6: contextMenu prop passed through to <ScaffolderPageContents /> from the <ScaffolderPage /> component
- a70869e775: Updated dependency `msw` to `^0.43.0`.
- 4e9a90e307: Updated dependency `luxon` to `^3.0.0`.
- 72622d9143: Updated dependency `yaml` to `^2.0.0`.
- 693990d4fe: Updated dependency `@react-hookz/web` to `^15.0.0`.
- 8006d0f9bf: Updated dependency `msw` to `^0.44.0`.
- e2d7b76f43: Upgrade git-url-parse to 12.0.0.

  Motivation for upgrade is transitively upgrading parse-url which is vulnerable
  to several CVEs detected by Snyk.

  - SNYK-JS-PARSEURL-2935944
  - SNYK-JS-PARSEURL-2935947
  - SNYK-JS-PARSEURL-2936249

- 464bb0e6c8: The max content size for dry-run files has been reduced from 256k to 64k.
- 14146703e5: Add `allowArbitraryValues` to `ui:options` in `OwnedEntityPicker`, similar to `allowArbitraryValues` in `EntityPicker`
- a7c0b34d70: Swap usage of `MaterialTable` with `Table` from `core-components`
- 1764296a68: Allow to create Gerrit project using default owner
- Updated dependencies
  - @backstage/core-components@0.10.0
  - @backstage/catalog-model@1.1.0
  - @backstage/core-plugin-api@1.0.4
  - @backstage/integration@1.2.2
  - @backstage/catalog-client@1.0.4
  - @backstage/integration-react@1.1.2
  - @backstage/plugin-catalog-react@1.1.2
  - @backstage/theme@0.2.16
  - @backstage/errors@1.1.0
  - @backstage/plugin-catalog-common@1.0.4
  - @backstage/plugin-permission-react@0.4.3
  - @backstage/plugin-scaffolder-common@1.1.2

## 1.4.0-next.3

### Patch Changes

- b557e6c58d: Fixed that adding more than one `allowedOwner` or `allowedRepo` in the template config will now still set the first value as default in the initial form state of `RepoUrlPicker`.
- d600cb2ab6: contextMenu prop passed through to <ScaffolderPageContents /> from the <ScaffolderPage /> component
- a70869e775: Updated dependency `msw` to `^0.43.0`.
- 4e9a90e307: Updated dependency `luxon` to `^3.0.0`.
- 72622d9143: Updated dependency `yaml` to `^2.0.0`.
- 693990d4fe: Updated dependency `@react-hookz/web` to `^15.0.0`.
- Updated dependencies
  - @backstage/core-plugin-api@1.0.4-next.0
  - @backstage/core-components@0.10.0-next.3
  - @backstage/catalog-client@1.0.4-next.2
  - @backstage/integration-react@1.1.2-next.3
  - @backstage/integration@1.2.2-next.3
  - @backstage/catalog-model@1.1.0-next.3
  - @backstage/plugin-catalog-react@1.1.2-next.3
  - @backstage/plugin-permission-react@0.4.3-next.1

## 1.4.0-next.2

### Minor Changes

- d8eb82f447: Add `allowedRepos` `ui:option` to `RepoUrlPicker` component, and move `repoName` field to own component

### Patch Changes

- e2d7b76f43: Upgrade git-url-parse to 12.0.0.

  Motivation for upgrade is transitively upgrading parse-url which is vulnerable
  to several CVEs detected by Snyk.

  - SNYK-JS-PARSEURL-2935944
  - SNYK-JS-PARSEURL-2935947
  - SNYK-JS-PARSEURL-2936249

- 14146703e5: Add `allowArbitraryValues` to `ui:options` in `OwnedEntityPicker`, similar to `allowArbitraryValues` in `EntityPicker`
- Updated dependencies
  - @backstage/core-components@0.10.0-next.2
  - @backstage/catalog-model@1.1.0-next.2
  - @backstage/theme@0.2.16-next.1
  - @backstage/integration@1.2.2-next.2
  - @backstage/plugin-catalog-react@1.1.2-next.2
  - @backstage/integration-react@1.1.2-next.2

## 1.4.0-next.1

### Patch Changes

- Updated dependencies
  - @backstage/core-components@0.9.6-next.1
  - @backstage/catalog-model@1.1.0-next.1
  - @backstage/errors@1.1.0-next.0
  - @backstage/theme@0.2.16-next.0
  - @backstage/catalog-client@1.0.4-next.1
  - @backstage/integration@1.2.2-next.1
  - @backstage/integration-react@1.1.2-next.1
  - @backstage/plugin-catalog-common@1.0.4-next.0
  - @backstage/plugin-catalog-react@1.1.2-next.1
  - @backstage/plugin-permission-react@0.4.3-next.0

## 1.4.0-next.0

### Patch Changes

- 37539e29d8: The template editor now shows the cause of request errors that happen during a dry-run.
- 842282ecf9: Bumped `codemirror` dependencies to `v6.0.0`.
- 464bb0e6c8: The max content size for dry-run files has been reduced from 256k to 64k.
- a7c0b34d70: Swap usage of `MaterialTable` with `Table` from `core-components`
- Updated dependencies
  - @backstage/catalog-model@1.1.0-next.0
  - @backstage/core-components@0.9.6-next.0
  - @backstage/integration@1.2.2-next.0
  - @backstage/catalog-client@1.0.4-next.0
  - @backstage/plugin-catalog-react@1.1.2-next.0
  - @backstage/plugin-scaffolder-common@1.1.2-next.0
  - @backstage/integration-react@1.1.2-next.0

## 1.3.0

### Minor Changes

- dc39366bdb: - Added a new page under `/create/tasks` to show tasks that have been run by the Scaffolder.
  - Ability to filter these tasks by the signed in user, and all tasks.
  - Added optional method to the `ScaffolderApi` interface called `listTasks` to get tasks with an required `filterByOwnership` parameter.
- 86a4a0f72d: Get data of other fields in Form from a custom field in template Scaffolder.
  following:

  ```tsx
  const CustomFieldExtensionComponent = (props: FieldExtensionComponentProps<string[]>) => {
    const { formData } = props.formContext;
    ...
  };

  const CustomFieldExtension = scaffolderPlugin.provide(
    createScaffolderFieldExtension({
      name: ...,
      component: CustomFieldExtensionComponent,
      validation: ...
    })
  );
  ```

- 72dfcbc8bf: Gerrit Integration: Implemented a `RepoUrlPicker` for Gerrit.
- f93af969cd: Added the ability to support running of templates that are not in the `default` namespace
- 3500c13a33: A new template editor has been added which is accessible via the context menu on the top right hand corner of the Create page. It allows you to load a template from a local directory, edit it with a preview, execute it in dry-run mode, and view the results. Note that the [File System Access API](https://developer.mozilla.org/en-US/docs/Web/API/File_System_Access_API) must be supported by your browser for this to be available.

  To support the new template editor the `ScaffolderApi` now has an optional `dryRun` method, which is implemented by the default `ScaffolderClient`.

### Patch Changes

- ac0c7e45ee: Fixes review mask in `MultistepJsonForm` to work as documented. `show: true` no longer needed when mask is set.
- 8f7b1835df: Updated dependency `msw` to `^0.41.0`.
- fd505f40c0: Handle binary files and files that are too large during dry-run content upload.
- Updated dependencies
  - @backstage/plugin-catalog-react@1.1.1
  - @backstage/plugin-catalog-common@1.0.3
  - @backstage/core-components@0.9.5
  - @backstage/integration@1.2.1
  - @backstage/catalog-client@1.0.3
  - @backstage/core-plugin-api@1.0.3
  - @backstage/integration-react@1.1.1
  - @backstage/catalog-model@1.0.3
  - @backstage/plugin-permission-react@0.4.2
  - @backstage/plugin-scaffolder-common@1.1.1

## 1.3.0-next.2

### Minor Changes

- dc39366bdb: - Added a new page under `/create/tasks` to show tasks that have been run by the Scaffolder.
  - Ability to filter these tasks by the signed in user, and all tasks.
  - Added optional method to the `ScaffolderApi` interface called `listTasks` to get tasks with an required `filterByOwnership` parameter.

### Patch Changes

- ac0c7e45ee: Fixes review mask in `MultistepJsonForm` to work as documented. `show: true` no longer needed when mask is set.
- fd505f40c0: Handle binary files and files that are too large during dry-run content upload.
- Updated dependencies
  - @backstage/plugin-catalog-common@1.0.3-next.1
  - @backstage/core-components@0.9.5-next.2
  - @backstage/integration@1.2.1-next.2

## 1.3.0-next.1

### Patch Changes

- 8f7b1835df: Updated dependency `msw` to `^0.41.0`.
- Updated dependencies
  - @backstage/core-components@0.9.5-next.1
  - @backstage/catalog-client@1.0.3-next.0
  - @backstage/core-plugin-api@1.0.3-next.0
  - @backstage/integration-react@1.1.1-next.1
  - @backstage/integration@1.2.1-next.1
  - @backstage/catalog-model@1.0.3-next.0
  - @backstage/plugin-catalog-react@1.1.1-next.1
  - @backstage/plugin-permission-react@0.4.2-next.0
  - @backstage/plugin-catalog-common@1.0.3-next.0
  - @backstage/plugin-scaffolder-common@1.1.1-next.0

## 1.3.0-next.0

### Minor Changes

- 86a4a0f72d: Get data of other fields in Form from a custom field in template Scaffolder.
  following:

  ```tsx
  const CustomFieldExtensionComponent = (props: FieldExtensionComponentProps<string[]>) => {
    const { formData } = props.formContext;
    ...
  };

  const CustomFieldExtension = scaffolderPlugin.provide(
    createScaffolderFieldExtension({
      name: ...,
      component: CustomFieldExtensionComponent,
      validation: ...
    })
  );
  ```

- 72dfcbc8bf: Gerrit Integration: Implemented a `RepoUrlPicker` for Gerrit.

### Patch Changes

- Updated dependencies
  - @backstage/plugin-catalog-react@1.1.1-next.0
  - @backstage/core-components@0.9.5-next.0
  - @backstage/integration@1.2.1-next.0
  - @backstage/integration-react@1.1.1-next.0

## 1.2.0

### Minor Changes

- 06ab5218f9: Add new bitbucket(Cloud/Server) integrations to ScaffolderClient.

### Patch Changes

- 8dce7d5244: Allow validation for custom field extension with type object
- 70817dafc0: Updated dependency `use-immer` to `^0.7.0`.
- ace230b599: Updated dependency `@codemirror/legacy-modes` to `^0.20.0`.
- Updated dependencies
  - @backstage/core-components@0.9.4
  - @backstage/integration@1.2.0
  - @backstage/core-plugin-api@1.0.2
  - @backstage/plugin-scaffolder-common@1.1.0
  - @backstage/plugin-catalog-react@1.1.0
  - @backstage/integration-react@1.1.0
  - @backstage/config@1.0.1
  - @backstage/catalog-client@1.0.2
  - @backstage/catalog-model@1.0.2
  - @backstage/plugin-catalog-common@1.0.2
  - @backstage/plugin-permission-react@0.4.1

## 1.2.0-next.3

### Patch Changes

- cc8ddd0979: revert dependency `event-source-polyfill` to `1.0.25`
- Updated dependencies
  - @backstage/core-components@0.9.4-next.2

## 1.2.0-next.2

### Patch Changes

- 70817dafc0: Updated dependency `use-immer` to `^0.7.0`.
- 1af133f779: Updated dependency `event-source-polyfill` to `1.0.26`.
- Updated dependencies
  - @backstage/core-components@0.9.4-next.1
  - @backstage/plugin-scaffolder-common@1.1.0-next.0
  - @backstage/config@1.0.1-next.0
  - @backstage/plugin-catalog-react@1.1.0-next.2
  - @backstage/catalog-model@1.0.2-next.0
  - @backstage/core-plugin-api@1.0.2-next.1
  - @backstage/integration@1.2.0-next.1
  - @backstage/integration-react@1.1.0-next.2
  - @backstage/plugin-permission-react@0.4.1-next.1
  - @backstage/catalog-client@1.0.2-next.0
  - @backstage/plugin-catalog-common@1.0.2-next.0

## 1.2.0-next.1

### Patch Changes

- 8dce7d5244: Allow validation for custom field extension with type object
- ace230b599: Updated dependency `@codemirror/legacy-modes` to `^0.20.0`.
- Updated dependencies
  - @backstage/core-components@0.9.4-next.0
  - @backstage/core-plugin-api@1.0.2-next.0
  - @backstage/plugin-catalog-react@1.1.0-next.1
  - @backstage/integration-react@1.1.0-next.1
  - @backstage/plugin-permission-react@0.4.1-next.0

## 1.2.0-next.0

### Minor Changes

- 06ab5218f9: Add new bitbucket(Cloud/Server) integrations to ScaffolderClient.

### Patch Changes

- Updated dependencies
  - @backstage/integration@1.2.0-next.0
  - @backstage/plugin-catalog-react@1.1.0-next.0
  - @backstage/integration-react@1.1.0-next.0

## 1.1.0

### Minor Changes

- 6331ec1ebc: Added a context menu to the scaffolder page that provides links to the template editor and actions reference. These links and the presence of the context menu can be toggled through the `contextMenu` prop of the scaffolder page.
- 8fad3b6ef5: The Template Preview page has been renamed to Template Editor, and is not available at the `/edit` path instead. There is a redirect in place from `/preview`.

### Patch Changes

- 7c7919777e: build(deps-dev): bump `@testing-library/react-hooks` from 7.0.2 to 8.0.0
- 24254fd433: build(deps): bump `@testing-library/user-event` from 13.5.0 to 14.0.0
- 946af407db: Changed input label for owner field in GitlabRepoPicker
- 230ad0826f: Bump to using `@types/node` v16
- d34900af81: Added a new `NextScaffolderRouter` which will eventually replace the exiting router
- 9975ff9852: Applied the fix from version 1.0.1 of this package, which is part of the v1.0.2 release of Backstage.
- 4431873583: Update `usePermission` usage.
- Updated dependencies
  - @backstage/integration@1.1.0
  - @backstage/plugin-permission-react@0.4.0
  - @backstage/plugin-catalog-react@1.0.1
  - @backstage/catalog-model@1.0.1
  - @backstage/core-components@0.9.3
  - @backstage/core-plugin-api@1.0.1
  - @backstage/integration-react@1.0.1
  - @backstage/plugin-catalog-common@1.0.1
  - @backstage/catalog-client@1.0.1
  - @backstage/plugin-scaffolder-common@1.0.1

## 1.1.0-next.3

### Minor Changes

- 6331ec1ebc: Added a context menu to the scaffolder page that provides links to the template editor and actions reference. These links and the presence of the context menu can be toggled through the `contextMenu` prop of the scaffolder page.
- 8fad3b6ef5: The Template Preview page has been renamed to Template Editor, and is not available at the `/edit` path instead. There is a redirect in place from `/preview`.

### Patch Changes

- 24254fd433: build(deps): bump `@testing-library/user-event` from 13.5.0 to 14.0.0
- 946af407db: Changed input label for owner field in GitlabRepoPicker
- 230ad0826f: Bump to using `@types/node` v16
- Updated dependencies
  - @backstage/core-components@0.9.3-next.2
  - @backstage/core-plugin-api@1.0.1-next.0
  - @backstage/integration-react@1.0.1-next.2
  - @backstage/plugin-catalog-react@1.0.1-next.3
  - @backstage/plugin-permission-react@0.4.0-next.1
  - @backstage/integration@1.1.0-next.2

## 1.0.1-next.2

### Patch Changes

- 9975ff9852: Applied the fix from version 1.0.1 of this package, which is part of the v1.0.2 release of Backstage.
- Updated dependencies
  - @backstage/core-components@0.9.3-next.1
  - @backstage/plugin-catalog-react@1.0.1-next.2
  - @backstage/catalog-model@1.0.1-next.1

## 1.0.1

### Patch Changes

- Pin the `event-source-polyfill` dependency to version 1.0.25

## 1.0.1-next.1

### Patch Changes

- 4431873583: Update `usePermission` usage.
- Updated dependencies
  - @backstage/integration@1.1.0-next.1
  - @backstage/plugin-permission-react@0.4.0-next.0
  - @backstage/plugin-catalog-react@1.0.1-next.1
  - @backstage/plugin-catalog-common@1.0.1-next.1
  - @backstage/integration-react@1.0.1-next.1

## 1.0.1-next.0

### Patch Changes

- d34900af81: Added a new `NextScaffolderRouter` which will eventually replace the exiting router
- Updated dependencies
  - @backstage/catalog-model@1.0.1-next.0
  - @backstage/integration@1.0.1-next.0
  - @backstage/plugin-catalog-react@1.0.1-next.0
  - @backstage/core-components@0.9.3-next.0
  - @backstage/catalog-client@1.0.1-next.0
  - @backstage/plugin-scaffolder-common@1.0.1-next.0
  - @backstage/integration-react@1.0.1-next.0
  - @backstage/plugin-catalog-common@1.0.1-next.0

## 1.0.0

### Major Changes

- b58c70c223: This package has been promoted to v1.0! To understand how this change affects the package, please check out our [versioning policy](https://backstage.io/docs/overview/versioning-policy).

### Minor Changes

- 9a408928a1: **BREAKING**: Removed the unused `titleComponent` property of `groups` passed to the `ScaffolderPage`. The property was already ignored, but existing usage should migrated to use the `title` property instead, which now accepts any `ReactNode`.

### Patch Changes

- 9b7e361783: Remove beta labels
- a422d7ce5e: chore(deps): bump `@testing-library/react` from 11.2.6 to 12.1.3
- 20a262c214: The `ScaffolderPage` now uses the `CatalogFilterLayout`, which means the filters are put in a drawer on smaller screens.
- f24ef7864e: Minor typo fixes
- d8716924d6: Implement a template preview page (`/create/preview`) to test creating form UIs
- Updated dependencies
  - @backstage/core-components@0.9.2
  - @backstage/core-plugin-api@1.0.0
  - @backstage/integration-react@1.0.0
  - @backstage/plugin-catalog-react@1.0.0
  - @backstage/plugin-permission-react@0.3.4
  - @backstage/catalog-model@1.0.0
  - @backstage/plugin-scaffolder-common@1.0.0
  - @backstage/integration@1.0.0
  - @backstage/catalog-client@1.0.0
  - @backstage/config@1.0.0
  - @backstage/errors@1.0.0
  - @backstage/types@1.0.0
  - @backstage/plugin-catalog-common@1.0.0

## 0.15.0

### Minor Changes

- 310e905998: The following deprecations are now breaking and have been removed:

  - **BREAKING**: Support for `backstage.io/v1beta2` Software Templates has been removed. Please migrate your legacy templates to the new `scaffolder.backstage.io/v1beta3` `apiVersion` by following the [migration guide](https://backstage.io/docs/features/software-templates/migrating-from-v1beta2-to-v1beta3)

  - **BREAKING**: Removed the deprecated `TemplateMetadata`. Please use `TemplateInfo` instead.

  - **BREAKING**: Removed the deprecated `context.baseUrl`. It's now available on `context.templateInfo.baseUrl`.

  - **BREAKING**: Removed the deprecated `DispatchResult`, use `TaskBrokerDispatchResult` instead.

  - **BREAKING**: Removed the deprecated `runCommand`, use `executeShellCommond` instead.

  - **BREAKING**: Removed the deprecated `Status` in favour of `TaskStatus` instead.

  - **BREAKING**: Removed the deprecated `TaskState` in favour of `CurrentClaimedTask` instead.

- 1360f7d73a: **BREAKING**: Removed `ScaffolderTaskOutput.entityRef` and `ScaffolderTaskOutput.remoteUrl`, which both have been deprecated for over a year. Please use the `links` output instead.
- e63e5a9452: Removed the following previously deprecated exports:

  - **BREAKING**: Removed the deprecated `TemplateList` component and the `TemplateListProps` type. Please use the `TemplateCard` to create your own list component instead to render these lists.

  - **BREAKING**: Removed the deprecated `setSecret` method, please use `setSecrets` instead.

  - **BREAKING**: Removed the deprecated `TemplateCardComponent` and `TaskPageComponent` props from the `ScaffolderPage` component. These are now provided using the `components` prop with the shape `{{ TemplateCardComponent: () => JSX.Element, TaskPageComponent: () => JSX.Element }}`

  - **BREAKING**: Removed `JobStatus` as this type was actually a legacy type used in `v1alpha` templates and the workflow engine and should no longer be used or depended on.

### Patch Changes

- d741c97b98: Render markdown for description in software templates
- 33e58456b5: Fixing the border color for the `FavoriteEntity` star button on the `TemplateCard`
- Updated dependencies
  - @backstage/plugin-catalog-react@0.9.0
  - @backstage/core-components@0.9.1
  - @backstage/plugin-scaffolder-common@0.3.0
  - @backstage/catalog-model@0.13.0
  - @backstage/plugin-catalog-common@0.2.2
  - @backstage/catalog-client@0.9.0
  - @backstage/integration-react@0.1.25

## 0.15.0-next.0

### Minor Changes

- 310e905998: The following deprecations are now breaking and have been removed:

  - **BREAKING**: Support for `backstage.io/v1beta2` Software Templates has been removed. Please migrate your legacy templates to the new `scaffolder.backstage.io/v1beta3` `apiVersion` by following the [migration guide](https://backstage.io/docs/features/software-templates/migrating-from-v1beta2-to-v1beta3)

  - **BREAKING**: Removed the deprecated `TemplateMetadata`. Please use `TemplateInfo` instead.

  - **BREAKING**: Removed the deprecated `context.baseUrl`. It's now available on `context.templateInfo.baseUrl`.

  - **BREAKING**: Removed the deprecated `DispatchResult`, use `TaskBrokerDispatchResult` instead.

  - **BREAKING**: Removed the deprecated `runCommand`, use `executeShellCommond` instead.

  - **BREAKING**: Removed the deprecated `Status` in favour of `TaskStatus` instead.

  - **BREAKING**: Removed the deprecated `TaskState` in favour of `CurrentClaimedTask` instead.

- 1360f7d73a: **BREAKING**: Removed `ScaffolderTaskOutput.entityRef` and `ScaffolderTaskOutput.remoteUrl`, which both have been deprecated for over a year. Please use the `links` output instead.
- e63e5a9452: Removed the following previously deprecated exports:

  - **BREAKING**: Removed the deprecated `TemplateList` component and the `TemplateListProps` type. Please use the `TemplateCard` to create your own list component instead to render these lists.

  - **BREAKING**: Removed the deprecated `setSecret` method, please use `setSecrets` instead.

  - **BREAKING**: Removed the deprecated `TemplateCardComponent` and `TaskPageComponent` props from the `ScaffolderPage` component. These are now provided using the `components` prop with the shape `{{ TemplateCardComponent: () => JSX.Element, TaskPageComponent: () => JSX.Element }}`

  - **BREAKING**: Removed `JobStatus` as this type was actually a legacy type used in `v1alpha` templates and the workflow engine and should no longer be used or depended on.

### Patch Changes

- d741c97b98: Render markdown for description in software templates
- Updated dependencies
  - @backstage/plugin-catalog-react@0.9.0-next.0
  - @backstage/core-components@0.9.1-next.0
  - @backstage/plugin-scaffolder-common@0.3.0-next.0
  - @backstage/catalog-model@0.13.0-next.0
  - @backstage/plugin-catalog-common@0.2.2-next.0
  - @backstage/catalog-client@0.9.0-next.0
  - @backstage/integration-react@0.1.25-next.0

## 0.14.0

### Minor Changes

- 1c2755991d: - **BREAKING**: Removed the `FavouriteTemplate` export in favor of the `FavoriteEntity` from `@backstage/plugin-catalog-react`. Please migrate any usages to that component instead if you are creating your own `TemplateCard` page.
- 86da51cec5: **BREAKING**: Removing the exports of the raw components that back the `CustomFieldExtensions`.

### Patch Changes

- f41a293231: - **DEPRECATION**: Deprecated `formatEntityRefTitle` in favor of the new `humanizeEntityRef` method instead. Please migrate to using the new method instead.
- 55361f3f7b: Added some deprecations as follows:

  - **DEPRECATED**: `TemplateCardComponent` and `TaskPageComponent` props have been deprecated, and moved to a `components` prop instead. You can pass them in through there instead.
  - **DEPRECATED**: `TemplateList` and `TemplateListProps` has been deprecated. Please use the `TemplateCard` to create your own list component instead.
  - **DEPRECATED**: `setSecret` has been deprecated in favour of `setSecrets` when calling `useTemplateSecrets`

  Other notable changes:

  - `scaffolderApi.scaffold()` `values` type has been narrowed from `Record<string, any>` to `Record<string, JsonValue>` instead.
  - Moved all navigation internally over to using `routeRefs` and `subRouteRefs`

- Updated dependencies
  - @backstage/catalog-model@0.12.0
  - @backstage/catalog-client@0.8.0
  - @backstage/core-components@0.9.0
  - @backstage/plugin-catalog-react@0.8.0
  - @backstage/plugin-catalog-common@0.2.0
  - @backstage/integration@0.8.0
  - @backstage/core-plugin-api@0.8.0
  - @backstage/plugin-scaffolder-common@0.2.3
  - @backstage/integration-react@0.1.24
  - @backstage/plugin-permission-react@0.3.3

## 0.13.0

### Minor Changes

- 50e0242ac2: - **BREAKING** - `scaffolderApi.scaffold()` now takes one `options` argument instead of 3, the existing arguments should just be wrapped up in one object instead.
  - **BREAKING** - `scaffolderApi.scaffold()` now returns an object instead of a single string for the job ID. It's now `{ taskId: string }`
  - **BREAKING** - `scaffolderApi.scaffold()` now takes a `templateRef` instead of `templateName` as an argument in the options. This should be a valid stringified `entityRef`.
  - **BREAKING** - `scaffolderApi.getIntegrationsList` now returns an object `{ integrations: { type: string, title: string, host: string }[] }` instead of just an array.
- a2589000ee: - **BREAKING** - Removed the `plugin` export, use `scaffolderPlugin` instead.
  - **BREAKING** - Removed the `TextValuePicker` component export, you can inline this component instead as it's a simple wrapper around a `TextField` from `@material-ui/core`.

### Patch Changes

- 67a7c02d26: Remove usages of `EntityRef` and `parseEntityName` from `@backstage/catalog-model`
- 6e1cbc12a6: Updated according to the new `getEntityFacets` catalog API method
- b776ce5aab: Replaced use of deprecated `useEntityListProvider` hook with `useEntityList`.
- 0f37cdef19: Migrated over from the deprecated `spec.metadata` to `spec.templateInfo` for the `name` and the `baseUrl` of the template.
- 50e0242ac2: - Moved the `JSONSchema` type from `@backstage/catalog-model` to `JSONSchema7`.
  - Renamed and prefixed some types ready for exporting.
- a2589000ee: - Reworking the `FieldExtensionComponentType` so we can export the `ui:schema:options` props in the `api-report.md`.
  - Exporting all of the `UiOptions` types for the `FieldExtensions` so we can see them in the `api-report.md`.
  - Removing the redundant type in the `CustomFieldValidator` union.
- 2f2543592c: You can now hide sections or fields in your templates based on a feature flag. For example, take this template:

  ```json
  {
    title: 'my-schema',
    steps: [
      {
        title: 'Fill in some steps',
        schema: {
          title: 'Fill in some steps',
          'backstage:featureFlag': 'experimental-feature',
          properties: {
            name: {
              title: 'Name',
              type: 'string',
              'backstage:featureFlag': 'should-show-some-stuff-first-option',
            },
            description: {
              title: 'Description',
              type: 'string',
              description: 'A description for the component',
            },
            owner: {
              title: 'Owner',
              type: 'string',
              description: 'Owner of the component',
            },
          },
          type: 'object',
        },
    },
  }

  ```

  If you have a feature flag that is called `experimental-feature` then your first step would be shown if you that feature flag was not active then it wouldn't be shown. The same goes for the properties in the schema. Make sure to use the key `backstage:featureFlag` in your templates if you want to use this functionality.

- Updated dependencies
  - @backstage/core-components@0.8.10
  - @backstage/plugin-scaffolder-common@0.2.2
  - @backstage/plugin-catalog-react@0.7.0
  - @backstage/catalog-model@0.11.0
  - @backstage/catalog-client@0.7.2
  - @backstage/core-plugin-api@0.7.0
  - @backstage/integration@0.7.5
  - @backstage/integration-react@0.1.23
  - @backstage/plugin-permission-react@0.3.2

## 0.12.3

### Patch Changes

- 1ed305728b: Bump `node-fetch` to version 2.6.7 and `cross-fetch` to version 3.1.5
- c77c5c7eb6: Added `backstage.role` to `package.json`
- 538ca90790: Use updated type names from `@backstage/catalog-client`
- deaf6065db: Adapt to the new `CatalogApi.getLocationByRef`
- e72d371296: Use `TemplateEntityV1beta2` from `@backstage/plugin-scaffolder-common` instead
  of `@backstage/catalog-model`.
- Updated dependencies
  - @backstage/plugin-scaffolder-common@0.2.0
  - @backstage/catalog-client@0.7.0
  - @backstage/core-components@0.8.9
  - @backstage/core-plugin-api@0.6.1
  - @backstage/errors@0.2.1
  - @backstage/integration@0.7.3
  - @backstage/integration-react@0.1.22
  - @backstage/plugin-catalog-react@0.6.15
  - @backstage/plugin-permission-react@0.3.1
  - @backstage/catalog-model@0.10.0
  - @backstage/config@0.1.14
  - @backstage/theme@0.2.15
  - @backstage/types@0.1.2
  - @backstage/plugin-catalog-common@0.1.3

## 0.12.2

### Patch Changes

- 33e139e652: Adds a loading bar to the scaffolder task page if the task is still loading. This can happen if it takes a while for a task worker to pick up a task.
- 6458be3307: Encode the `formData` in the `queryString` using `JSON.stringify` to keep the types in the decoded value
- 319f4b79a2: The ScaffolderPage can be passed an optional `TaskPageComponent` with a `loadingText` string. It will replace the Loading text in the scaffolder task page.
- Updated dependencies
  - @backstage/catalog-client@0.6.0
  - @backstage/core-components@0.8.8
  - @backstage/plugin-catalog-react@0.6.14
  - @backstage/integration-react@0.1.21

## 0.12.2-next.0

### Patch Changes

- 33e139e652: Adds a loading bar to the scaffolder task page if the task is still loading. This can happen if it takes a while for a task worker to pick up a task.
- 6458be3307: Encode the `formData` in the `queryString` using `JSON.stringify` to keep the types in the decoded value
- 319f4b79a2: The ScaffolderPage can be passed an optional `TaskPageComponent` with a `loadingText` string. It will replace the Loading text in the scaffolder task page.
- Updated dependencies
  - @backstage/core-components@0.8.8-next.0
  - @backstage/plugin-catalog-react@0.6.14-next.0
  - @backstage/integration-react@0.1.21-next.0

## 0.12.1

### Patch Changes

- ba59832aed: Permission the Register Existing Component button
- cee44ad289: Added the ability to collect users `oauth` token from the `RepoUrlPicker` for use in the template manifest
- a681cb9c2f: Make linkTarget configurable for MarkdownContent component
- Updated dependencies
  - @backstage/core-components@0.8.7
  - @backstage/plugin-catalog-react@0.6.13
  - @backstage/plugin-catalog-common@0.1.2
  - @backstage/integration-react@0.1.20

## 0.12.1-next.1

### Patch Changes

- ba59832aed: Permission the Register Existing Component button
- Updated dependencies
  - @backstage/core-components@0.8.7-next.1
  - @backstage/plugin-catalog-react@0.6.13-next.1
  - @backstage/plugin-catalog-common@0.1.2-next.0

## 0.12.1-next.0

### Patch Changes

- a681cb9c2f: Make linkTarget configurable for MarkdownContent component
- Updated dependencies
  - @backstage/core-components@0.8.7-next.0
  - @backstage/integration-react@0.1.20-next.0
  - @backstage/plugin-catalog-react@0.6.13-next.0

## 0.12.0

### Minor Changes

- aecfe4f403: Make `ScaffolderClient` use the `FetchApi`. You now need to pass in an instance
  of that API when constructing the client, if you create a custom instance in
  your app.

  If you are replacing the factory:

  ```diff
  +import { fetchApiRef } from '@backstage/core-plugin-api';

   createApiFactory({
     api: scaffolderApiRef,
     deps: {
       discoveryApi: discoveryApiRef,
       scmIntegrationsApi: scmIntegrationsApiRef,
  -    identityApi: identityApiRef,
  +    fetchApi: fetchApiRef,
     },
     factory: ({
       discoveryApi,
       scmIntegrationsApi,
  -    identityApi,
  +    fetchApi,
     }) =>
       new ScaffolderClient({
         discoveryApi,
         scmIntegrationsApi,
  -      identityApi,
  +      fetchApi,
       }),
   }),
  ```

  If instantiating directly:

  ```diff
  +import { fetchApiRef } from '@backstage/core-plugin-api';

  +const fetchApi = useApi(fetchApiRef);
   const client = new ScaffolderClient({
     discoveryApi,
     scmIntegrationsApi,
  -  identityApi,
  +  fetchApi,
   }),
  ```

### Patch Changes

- 51fbedc445: Migrated usage of deprecated `IdentityApi` methods.
- b05d303226: Added the ability to support supplying secrets when creating tasks in the `scaffolder-backend`.

  **deprecation**: Deprecated `ctx.token` from actions in the `scaffolder-backend`. Please move to using `ctx.secrets.backstageToken` instead.

  **deprecation**: Deprecated `task.token` in `TaskSpec` in the `scaffolder-backend`. Please move to using `task.secrets.backstageToken` instead.

- cd05442ed2: Refactoring the `RepoUrlPicker` into separate provider components to encapsulate provider nonsense
- Updated dependencies
  - @backstage/core-components@0.8.5
  - @backstage/integration@0.7.2
  - @backstage/core-plugin-api@0.6.0
  - @backstage/plugin-catalog-react@0.6.12
  - @backstage/config@0.1.13
  - @backstage/catalog-model@0.9.10
  - @backstage/catalog-client@0.5.5
  - @backstage/integration-react@0.1.19
  - @backstage/plugin-scaffolder-common@0.1.3

## 0.11.19-next.0

### Patch Changes

- 51fbedc445: Migrated usage of deprecated `IdentityApi` methods.
- cd05442ed2: Refactoring the `RepoUrlPicker` into separate provider components to encapsulate provider nonsense
- Updated dependencies
  - @backstage/core-components@0.8.5-next.0
  - @backstage/core-plugin-api@0.6.0-next.0
  - @backstage/config@0.1.13-next.0
  - @backstage/plugin-catalog-react@0.6.12-next.0
  - @backstage/catalog-model@0.9.10-next.0
  - @backstage/integration-react@0.1.19-next.0
  - @backstage/catalog-client@0.5.5-next.0
  - @backstage/integration@0.7.2-next.0
  - @backstage/plugin-scaffolder-common@0.1.3-next.0

## 0.11.18

### Patch Changes

- 5333451def: Cleaned up API exports
- Updated dependencies
  - @backstage/config@0.1.12
  - @backstage/integration@0.7.1
  - @backstage/core-components@0.8.4
  - @backstage/core-plugin-api@0.5.0
  - @backstage/plugin-catalog-react@0.6.11
  - @backstage/errors@0.2.0
  - @backstage/catalog-client@0.5.4
  - @backstage/catalog-model@0.9.9
  - @backstage/integration-react@0.1.18

## 0.11.17

### Patch Changes

- 4ce51ab0f1: Internal refactor of the `react-use` imports to use `react-use/lib/*` instead.
- Updated dependencies
  - @backstage/core-plugin-api@0.4.1
  - @backstage/plugin-catalog-react@0.6.10
  - @backstage/core-components@0.8.3

## 0.11.16

### Patch Changes

- 9c25894892: Implement a `EntityTagsPicker` field extension
- 7d4b4e937c: Uptake changes to the GitHub Credentials Provider interface.
- d078377f67: Support navigating back to pre-filled templates to update inputs of scaffolder tasks for resubmission
- Updated dependencies
  - @backstage/plugin-catalog-react@0.6.9
  - @backstage/plugin-scaffolder-common@0.1.2
  - @backstage/integration@0.7.0
  - @backstage/integration-react@0.1.17

## 0.11.15

### Patch Changes

- c5eb756760: Fix a small browser console warning
- ff5ff57883: EntityPicker can require an existing entity be selected by disallowing arbitrary values
- 0f645a7947: Added OwnedEntityPicker field which displays Owned Entities in options
- b646a73fe0: In @backstage/plugin-scaffolder - When user will have one option available in hostUrl or owner - autoselect and select component should be readonly.

  in @backstage/core-components - Select component has extended API with few more props: native : boolean, disabled: boolean. native - if set to true - Select component will use native browser select picker (not rendered by Material UI lib ).
  disabled - if set to true - action on component will not be possible.

- 7a4bd2ceac: Prefer using `Link` from `@backstage/core-components` rather than material-UI.
- 4c269c7c23: Add DescriptionField override to support Markdown
- Updated dependencies
  - @backstage/core-plugin-api@0.4.0
  - @backstage/plugin-catalog-react@0.6.8
  - @backstage/core-components@0.8.2
  - @backstage/catalog-client@0.5.3
  - @backstage/integration-react@0.1.16

## 0.11.14

### Patch Changes

- 6845cce533: Can specify allowedOwners to the RepoUrlPicker picker in a template definition
- cd450844f6: Moved React dependencies to `peerDependencies` and allow both React v16 and v17 to be used.
- 2edcf7738f: Fix bug with setting owner in RepoUrlPicker causing validation failure
- b291c3176e: Switch to using `LogViewer` component from `@backstage/core-components` to display scaffolder logs.
- Updated dependencies
  - @backstage/core-components@0.8.0
  - @backstage/core-plugin-api@0.3.0
  - @backstage/integration-react@0.1.15
  - @backstage/plugin-catalog-react@0.6.5

## 0.11.13

### Patch Changes

- ed5bef529e: Add group filtering to the scaffolder page so that individuals can surface specific templates to end users ahead of others, or group templates together. This can be accomplished by passing in a `groups` prop to the `ScaffolderPage`

  ```
  <ScaffolderPage
    groups={[
      {
        title: "Recommended",
        filter: entity =>
          entity?.metadata?.tags?.includes('recommended') ?? false,
      },
    ]}
  />
  ```

- Updated dependencies
  - @backstage/integration@0.6.10
  - @backstage/core-components@0.7.6
  - @backstage/theme@0.2.14
  - @backstage/core-plugin-api@0.2.2

## 0.11.12

### Patch Changes

- 2d7d165737: Bump `react-jsonschema-form`
- 9f21236a29: Fixed a missing `await` when throwing server side errors
- Updated dependencies
  - @backstage/errors@0.1.5
  - @backstage/core-plugin-api@0.2.1
  - @backstage/core-components@0.7.5

## 0.11.11

### Patch Changes

- 8809b6c0dd: Update the json-schema dependency version.
- a125278b81: Refactor out the deprecated path and icon from RouteRefs
- Updated dependencies
  - @backstage/catalog-client@0.5.2
  - @backstage/catalog-model@0.9.7
  - @backstage/plugin-catalog-react@0.6.4
  - @backstage/core-components@0.7.4
  - @backstage/core-plugin-api@0.2.0
  - @backstage/integration-react@0.1.14

## 0.11.10

### Patch Changes

- fe5738fe1c: Lazy load `LazyLog` as it is rarely used.
- b45a34fb15: Adds a new endpoint for consuming logs from the Scaffolder that uses long polling instead of Server Sent Events.

  This is useful if Backstage is accessed from an environment that doesn't support SSE correctly, which happens in combination with certain enterprise HTTP Proxy servers.

  It is intended to switch the endpoint globally for the whole instance.
  If you want to use it, you can provide a reconfigured API to the `scaffolderApiRef`:

  ```tsx
  // packages/app/src/apis.ts

  // ...
  import {
    scaffolderApiRef,
    ScaffolderClient,
  } from '@backstage/plugin-scaffolder';

  export const apis: AnyApiFactory[] = [
    // ...

    createApiFactory({
      api: scaffolderApiRef,
      deps: {
        discoveryApi: discoveryApiRef,
        identityApi: identityApiRef,
        scmIntegrationsApi: scmIntegrationsApiRef,
      },
      factory: ({ discoveryApi, identityApi, scmIntegrationsApi }) =>
        new ScaffolderClient({
          discoveryApi,
          identityApi,
          scmIntegrationsApi,
          // use long polling instead of an eventsource
          useLongPollingLogs: true,
        }),
    }),
  ];
  ```

- Updated dependencies
  - @backstage/core-components@0.7.3
  - @backstage/theme@0.2.13
  - @backstage/catalog-client@0.5.1
  - @backstage/core-plugin-api@0.1.13
  - @backstage/plugin-catalog-react@0.6.3

## 0.11.9

### Patch Changes

- 5e10974af6: Surfacing all components of the ScaffolderPage outside of the plugin so you can customize the page
- 5df2435892: Scaffolder: Enable back Template action buttons if template fails to execute
- 10615525f3: Switch to use the json and observable types from `@backstage/types`
- Updated dependencies
  - @backstage/config@0.1.11
  - @backstage/theme@0.2.12
  - @backstage/errors@0.1.4
  - @backstage/integration@0.6.9
  - @backstage/core-components@0.7.2
  - @backstage/integration-react@0.1.13
  - @backstage/plugin-catalog-react@0.6.2
  - @backstage/catalog-model@0.9.6
  - @backstage/core-plugin-api@0.1.12

## 0.11.8

### Patch Changes

- 0366c9b667: Introduce a `useStarredEntity` hook to check if a single entity is starred.
  It provides a more efficient implementation compared to the `useStarredEntities` hook, because the rendering is only triggered if the selected entity is starred, not if _any_ entity is starred.
- Updated dependencies
  - @backstage/plugin-catalog-react@0.6.0
  - @backstage/integration@0.6.8
  - @backstage/core-components@0.7.0
  - @backstage/theme@0.2.11
  - @backstage/integration-react@0.1.12

## 0.11.7

### Patch Changes

- 81a41ec249: Added a `name` key to all extensions in order to improve Analytics API metadata.
- Updated dependencies
  - @backstage/core-components@0.6.1
  - @backstage/core-plugin-api@0.1.10
  - @backstage/plugin-catalog-react@0.5.2
  - @backstage/catalog-model@0.9.4
  - @backstage/catalog-client@0.5.0
  - @backstage/integration@0.6.7

## 0.11.6

### Patch Changes

- Updated dependencies
  - @backstage/integration@0.6.6
  - @backstage/core-plugin-api@0.1.9
  - @backstage/core-components@0.6.0
  - @backstage/integration-react@0.1.11
  - @backstage/plugin-catalog-react@0.5.1

## 0.11.5

### Patch Changes

- Updated dependencies
  - @backstage/core-components@0.5.0
  - @backstage/integration@0.6.5
  - @backstage/catalog-client@0.4.0
  - @backstage/plugin-catalog-react@0.5.0
  - @backstage/catalog-model@0.9.3
  - @backstage/config@0.1.10
  - @backstage/integration-react@0.1.10

## 0.11.4

### Patch Changes

- 9f1362dcc1: Upgrade `@material-ui/lab` to `4.0.0-alpha.57`.
- 70fdfbf36a: Change the Categories filter to a dropdown component
- 96fef17a18: Upgrade git-parse-url to v11.6.0
- Updated dependencies
  - @backstage/core-components@0.4.2
  - @backstage/integration@0.6.4
  - @backstage/integration-react@0.1.9
  - @backstage/plugin-catalog-react@0.4.6
  - @backstage/core-plugin-api@0.1.8

## 0.11.3

### Patch Changes

- c299e90a2: Disable all buttons in the final step when 'Create' button is clicked in template.
- 3acf5988f: Fix display error when it fails to load a template (/create) page
- Updated dependencies
  - @backstage/core-components@0.4.1
  - @backstage/catalog-client@0.3.19
  - @backstage/catalog-model@0.9.2
  - @backstage/errors@0.1.2
  - @backstage/config@0.1.9
  - @backstage/core-plugin-api@0.1.7

## 0.11.2

### Patch Changes

- 34e14fdf7: Allow to pass custom TemplateCard to ScaffolderPage
- 957ae8059: Use themeId in TemplateCard from theme object
- Updated dependencies
  - @backstage/plugin-catalog-react@0.4.5
  - @backstage/integration@0.6.3
  - @backstage/core-components@0.4.0
  - @backstage/catalog-model@0.9.1
  - @backstage/integration-react@0.1.8

## 0.11.1

### Patch Changes

- 5bab4fe2a: Previously when supplying custom scaffolder field extensions, it was necessary to also include the default ones if they were needed. Since the field extensions are keyed by name, there's no harm in leaving the default ones in place when adding custom ones - if templates don't refer to them they will be ignored, and if custom ones are introduced with the same name, the custom ones will take priority over the default ones.

  Users configuring custom field extensions can remove the default ones from the scaffolder route after this change, and they'll still be available:

  ```diff
      <Route path="/create" element={<ScaffolderPage />}>
        <ScaffolderFieldExtensions>
  -        <EntityPickerFieldExtension />
  -        <EntityNamePickerFieldExtension />
  -        <RepoUrlPickerFieldExtension />
  -        <OwnerPickerFieldExtension />
          <LowerCaseValuePickerFieldExtension />
        </ScaffolderFieldExtensions>
      </Route>
  ```

- 24d0e1ea1: Set `id` in `<TextValuePicker>`.
- Updated dependencies
  - @backstage/plugin-catalog-react@0.4.3
  - @backstage/config@0.1.7
  - @backstage/core-components@0.3.2
  - @backstage/integration@0.6.1
  - @backstage/theme@0.2.10

## 0.11.0

### Minor Changes

- e30646aeb: Add Bitbucket workspace and project fields to RepoUrlPicker to support Bitbucket cloud and server

### Patch Changes

- 8bedb75ae: Update Luxon dependency to 2.x
- 7894421f1: Added UI Schema support for array items for example, support EntityPicker within an array field
- fa84fe44e: - Adds a new field `EntityNamePicker` that can be used in scaffolder templates to accept and validate an entity name. This field is registered by default, and can be used in templates by setting the `ui:field` property to `EntityNamePicker`. If you've customized your scaffolder field extensions, you can include this one by adding it when registering the scaffolder route:

  ```diff
  import {
    ScaffolderFieldExtensions,
  +   EntityNamePickerFieldExtension,
  } from '@backstage/plugin-scaffolder';

    <Route path="/create" element={<ScaffolderPage />}>
      <ScaffolderFieldExtensions>
        {/* ...custom field extensions... */}

  +       <EntityNamePickerFieldExtension />
      </ScaffolderFieldExtensions>
    </Route>;
  ```

  - Adds a new generic field `TextValuePicker` to be used when writing custom field extensions that use a standard UI with custom validation. An example of doing this can be found in `packages/app/src/components/scaffolder/customScaffolderExtensions.tsx`.

- 56c773909: Switched `@types/react` dependency to request `*` rather than a specific version.
- Updated dependencies
  - @backstage/integration@0.6.0
  - @backstage/core-components@0.3.1
  - @backstage/core-plugin-api@0.1.6
  - @backstage/plugin-catalog-react@0.4.2
  - @backstage/integration-react@0.1.7

## 0.10.3

### Patch Changes

- 7b8aa8d0d: Move the `CreateComponentButton` from the catalog plugin to the `core-components` & rename it to `CreateButton` to be reused inside the api-docs plugin & scaffolder plugin, but also future plugins. Additionally, improve responsiveness of `CreateButton` & `SupportButton` by shrinking them to `IconButtons` on smaller screens.
- Updated dependencies
  - @backstage/core-components@0.3.0
  - @backstage/config@0.1.6
  - @backstage/core-plugin-api@0.1.5
  - @backstage/integration@0.5.9
  - @backstage/integration-react@0.1.6
  - @backstage/plugin-catalog-react@0.4.1

## 0.10.2

### Patch Changes

- 0d5d0e2e6: chore: set the lifecycle as beta logo
- 9d40fcb1e: - Bumping `material-ui/core` version to at least `4.12.2` as they made some breaking changes in later versions which broke `Pagination` of the `Table`.
  - Switching out `material-table` to `@material-table/core` for support for the later versions of `material-ui/core`
  - This causes a minor API change to `@backstage/core-components` as the interface for `Table` re-exports the `prop` from the underlying `Table` components.
  - `onChangeRowsPerPage` has been renamed to `onRowsPerPageChange`
  - `onChangePage` has been renamed to `onPageChange`
  - Migration guide is here: https://material-table-core.com/docs/breaking-changes
- Updated dependencies
  - @backstage/core-components@0.2.0
  - @backstage/plugin-catalog-react@0.4.0
  - @backstage/core-plugin-api@0.1.4
  - @backstage/integration-react@0.1.5
  - @backstage/theme@0.2.9
  - @backstage/catalog-client@0.3.18

## 0.10.1

### Patch Changes

- 73951fc44: Add options to mask or hide values on review state
- 976b61080: Updated the software templates list page (`ScaffolderPage`) to use the `useEntityListProvider` hook from #5643. This reduces the code footprint, making it easier to customize the display of this page, and consolidates duplicate approaches to querying the catalog with filters.

  - The `useEntityTypeFilter` hook has been updated along with the underlying `EntityTypeFilter` to work with multiple values, to allow more flexibility for different user interfaces. It's unlikely that this change affects you; however, if you're using either of these directly, you'll need to update your usage.
  - `SearchToolbar` was renamed to `EntitySearchBar` and moved to `catalog-react` to be usable by other entity list pages
  - `UserListPicker` now has an `availableTypes` prop to restrict which user-related options to present

- Updated dependencies
  - @backstage/plugin-catalog-react@0.3.0

## 0.10.0

### Minor Changes

- 60e830222: Support for `Template` kinds with version `backstage.io/v1alpha1` has now been removed. This means that the old method of running templates with `Preparers`, `Templaters` and `Publishers` has also been removed. If you had any logic in these abstractions, they should now be moved to `actions` instead, and you can find out more about those in the [documentation](https://backstage.io/docs/features/software-templates/writing-custom-actions)

  If you need any help migrating existing templates, there's a [migration guide](https://backstage.io/docs/features/software-templates/migrating-from-v1alpha1-to-v1beta2). Reach out to us on Discord in the #support channel if you're having problems.

  The `scaffolder-backend` now no longer requires these `Preparers`, `Templaters`, and `Publishers` to be passed in, now all it needs is the `containerRunner`.

  Please update your `packages/backend/src/plugins/scaffolder.ts` like the following

  ```diff
  - import {
  -  DockerContainerRunner,
  -  SingleHostDiscovery,
  - } from '@backstage/backend-common';
  + import { DockerContainerRunner } from '@backstage/backend-common';
    import { CatalogClient } from '@backstage/catalog-client';
  - import {
  -   CookieCutter,
  -   CreateReactAppTemplater,
  -   createRouter,
  -   Preparers,
  -   Publishers,
  -   Templaters,
  - } from '@backstage/plugin-scaffolder-backend';
  + import { createRouter } from '@backstage/plugin-scaffolder-backend';
    import Docker from 'dockerode';
    import { Router } from 'express';
    import type { PluginEnvironment } from '../types';

    export default async function createPlugin({
      config,
      database,
      reader,
  +   discovery,
    }: PluginEnvironment): Promise<Router> {
      const dockerClient = new Docker();
      const containerRunner = new DockerContainerRunner({ dockerClient });

  -   const cookiecutterTemplater = new CookieCutter({ containerRunner });
  -   const craTemplater = new CreateReactAppTemplater({ containerRunner });
  -   const templaters = new Templaters();

  -   templaters.register('cookiecutter', cookiecutterTemplater);
  -   templaters.register('cra', craTemplater);
  -
  -   const preparers = await Preparers.fromConfig(config, { logger });
  -   const publishers = await Publishers.fromConfig(config, { logger });

  -   const discovery = SingleHostDiscovery.fromConfig(config);
      const catalogClient = new CatalogClient({ discoveryApi: discovery });

      return await createRouter({
  -     preparers,
  -     templaters,
  -     publishers,
  +     containerRunner,
        logger,
        config,
        database,

  ```

### Patch Changes

- 02b962394: Added a `context` parameter to validator functions, letting them have access to
  the API holder.

  If you have implemented custom validators and use `createScaffolderFieldExtension`,
  your `validation` function can now optionally accept a third parameter,
  `context: { apiHolder: ApiHolder }`.

- 6841e0113: fix minor version of git-url-parse as 11.5.x introduced a bug for Bitbucket Server
- 0adfae5c8: add support for uiSchema on dependent form fields
- bd764f78a: Pass through the `idToken` in `Authorization` Header for `listActions` request
- Updated dependencies
  - @backstage/integration@0.5.8
  - @backstage/core-components@0.1.5
  - @backstage/catalog-model@0.9.0
  - @backstage/catalog-client@0.3.16
  - @backstage/plugin-catalog-react@0.2.6

## 0.9.10

### Patch Changes

- 9e60a728e: Upgrade `rjsf` to 3.0.0.
- a94587cad: Update dependencies
- Updated dependencies
  - @backstage/plugin-catalog-react@0.2.5
  - @backstage/core-components@0.1.4
  - @backstage/integration@0.5.7
  - @backstage/catalog-client@0.3.15

## 0.9.9

### Patch Changes

- 5f4339b8c: Adding `FeatureFlag` component and treating `FeatureFlags` as first class citizens to composability API
- 71416fb64: Moved installation instructions from the main [backstage.io](https://backstage.io) documentation to the package README file. These instructions are not generally needed, since the plugin comes installed by default with `npx @backstage/create-app`.
- 48c9fcd33: Migrated to use the new `@backstage/core-*` packages rather than `@backstage/core`.
- Updated dependencies
  - @backstage/core-plugin-api@0.1.3
  - @backstage/catalog-client@0.3.14
  - @backstage/catalog-model@0.8.4
  - @backstage/integration-react@0.1.4
  - @backstage/plugin-catalog-react@0.2.4

## 0.9.8

### Patch Changes

- 27a9b503a: Introduce conditional steps in scaffolder templates.

  A step can now include an `if` property that only executes a step if the
  condition is truthy. The condition can include handlebar templates.

  ```yaml
  - id: register
      if: '{{ not parameters.dryRun }}'
      name: Register
      action: catalog:register
      input:
      repoContentsUrl: '{{ steps.publish.output.repoContentsUrl }}'
      catalogInfoPath: '/catalog-info.yaml'
  ```

  Also introduces a `not` helper in handlebar templates that allows to negate
  boolean expressions.

- 9b4010965: Provide a link to the template source on the `TemplateCard`.
- Updated dependencies [27a9b503a]
- Updated dependencies [f4e3ac5ce]
- Updated dependencies [7028ee1ca]
- Updated dependencies [70bc30c5b]
- Updated dependencies [eda9dbd5f]
  - @backstage/catalog-model@0.8.2
  - @backstage/integration-react@0.1.3
  - @backstage/plugin-catalog-react@0.2.2
  - @backstage/catalog-client@0.3.13
  - @backstage/integration@0.5.6

## 0.9.7

### Patch Changes

- 497f4ce18: Scaffolder Field Extensions are here! This means you'll now the ability to create custom field extensions and have the Scaffolder use the components when collecting information from the user in the wizard. By default we supply the `RepoUrlPicker` and the `OwnerPicker`, but if you want to provide some more extensions or override the built on ones you will have to change how the `ScaffolderPage` is wired up in your `app/src/App.tsx` to pass in the custom fields to the Scaffolder.

  You'll need to move this:

  ```tsx
  <Route path="/create" element={<ScaffolderPage />} />
  ```

  To this:

  ```tsx
  import {
    ScaffolderFieldExtensions,
    RepoUrlPickerFieldExtension,
    OwnerPickerFieldExtension,
  } from '@backstage/plugin-scaffolder';

  <Route path="/create" element={<ScaffolderPage />}>
    <ScaffolderFieldExtensions>
      <RepoUrlPickerFieldExtension />
      <OwnerPickerFieldExtension />

      {/*Any other extensions you want to provide*/}
    </ScaffolderFieldExtensions>
  </Route>;
  ```

  More documentation on how to write your own `FieldExtensions` to follow.

- 3772de8ba: Remove the trailing space from a the aria-label of the Template "CHOOSE" button.
- f430b6c6f: Don't merge with previous from state on form changes.
- 76f99a1a0: Export `createScaffolderFieldExtension` to enable the creation of new field extensions.
- 1157fa307: Add a `<EntityPicker>` field to the scaffolder to pick arbitrary entity kinds, like systems.
- Updated dependencies [e7c5e4b30]
- Updated dependencies [ebe802bc4]
- Updated dependencies [49d7ec169]
- Updated dependencies [1cf1d351f]
- Updated dependencies [deaba2e13]
- Updated dependencies [8e919a6f8]
  - @backstage/theme@0.2.8
  - @backstage/catalog-model@0.8.1
  - @backstage/integration@0.5.5
  - @backstage/core@0.7.12
  - @backstage/plugin-catalog-react@0.2.1

## 0.9.6

### Patch Changes

- Updated dependencies [0fd4ea443]
- Updated dependencies [add62a455]
- Updated dependencies [cc592248b]
- Updated dependencies [17c497b81]
- Updated dependencies [704875e26]
  - @backstage/integration@0.5.4
  - @backstage/catalog-client@0.3.12
  - @backstage/catalog-model@0.8.0
  - @backstage/core@0.7.11
  - @backstage/plugin-catalog-react@0.2.0

## 0.9.5

### Patch Changes

- f7f7783a3: Add Owner field in template card and new data distribution
  Add spec.owner as optional field into TemplateV1Alpha and TemplateV1Beta Schema
  Add relations ownedBy and ownerOf into Template entity
  Template documentation updated
- 81d7b9c6f: Added deprecation warnings for `v1alpha1` templates
- Updated dependencies [f7f7783a3]
- Updated dependencies [65e6c4541]
- Updated dependencies [68fdbf014]
- Updated dependencies [5da6a561d]
  - @backstage/catalog-model@0.7.10
  - @backstage/core@0.7.10
  - @backstage/integration@0.5.3

## 0.9.4

### Patch Changes

- 062bbf90f: chore: bump `@testing-library/user-event` from 12.8.3 to 13.1.8
- 81ef1d57b: Show error on task page if task does not exist.
- 675a569a9: chore: bump `react-use` dependency in all packages
- Updated dependencies [062bbf90f]
- Updated dependencies [10c008a3a]
- Updated dependencies [889d89b6e]
- Updated dependencies [16be1d093]
- Updated dependencies [3f988cb63]
- Updated dependencies [675a569a9]
  - @backstage/core@0.7.9
  - @backstage/integration-react@0.1.2
  - @backstage/plugin-catalog-react@0.1.6
  - @backstage/catalog-model@0.7.9

## 0.9.3

### Patch Changes

- 9314a8592: Close eventSource upon completion of a scaffolder task
- d8b81fd28: Bump `json-schema` dependency from `0.2.5` to `0.3.0`.
- Updated dependencies [38ca05168]
- Updated dependencies [f65adcde7]
- Updated dependencies [81c54d1f2]
- Updated dependencies [80888659b]
- Updated dependencies [7b8272fb7]
- Updated dependencies [d8b81fd28]
- Updated dependencies [d1b1306d9]
  - @backstage/integration@0.5.2
  - @backstage/core@0.7.8
  - @backstage/plugin-catalog-react@0.1.5
  - @backstage/theme@0.2.7
  - @backstage/catalog-model@0.7.8
  - @backstage/config@0.1.5
  - @backstage/catalog-client@0.3.11

## 0.9.2

### Patch Changes

- f6efa71ee: Enable starred templates on Scaffolder frontend
- 19a4dd710: Removed unused `swr` dependency.
- 23769512a: Support `anyOf`, `oneOf` and `allOf` schemas in the scaffolder template.
- Updated dependencies [9afcac5af]
- Updated dependencies [e0c9ed759]
- Updated dependencies [6eaecbd81]
  - @backstage/core@0.7.7

## 0.9.1

### Patch Changes

- 99fbef232: Adding Headings for Accessibility on the Scaffolder Plugin
- cb0206b2b: Respect top-level UI schema keys in scaffolder forms. Allows more advanced RJSF features such as explicit field ordering.
- Updated dependencies [94da20976]
- Updated dependencies [d8cc7e67a]
- Updated dependencies [99fbef232]
- Updated dependencies [ab07d77f6]
- Updated dependencies [931b21a12]
- Updated dependencies [937ed39ce]
- Updated dependencies [9a9e7a42f]
- Updated dependencies [50ce875a0]
  - @backstage/core@0.7.6
  - @backstage/theme@0.2.6

## 0.9.0

### Minor Changes

- a360f9478: Expose the catalog-import route as an external route from the scaffolder.

  This will make it possible to hide the "Register Existing Component" button
  when you for example are running backstage with `catalog.readonly=true`.

  As a consequence of this change you need add a new binding to your createApp call to
  keep the button visible. However, if you instead want to hide the button you can safely
  ignore the following example.

  To bind the external route from the catalog-import plugin to the scaffolder template
  index page, make sure you have the appropriate imports and add the following
  to the createApp call:

  ```typescript
  import { catalogImportPlugin } from '@backstage/plugin-catalog-import';

  const app = createApp({
    // ...
    bindRoutes({ bind }) {
      // ...
      bind(scaffolderPlugin.externalRoutes, {
        registerComponent: catalogImportPlugin.routes.importPage,
      });
    },
  });
  ```

### Patch Changes

- Updated dependencies [bb5055aee]
- Updated dependencies [d0d1c2f7b]
- Updated dependencies [5d0740563]
- Updated dependencies [5cafcf452]
- Updated dependencies [86a95ba67]
- Updated dependencies [442f34b87]
- Updated dependencies [e27cb6c45]
  - @backstage/catalog-model@0.7.7
  - @backstage/core@0.7.5
  - @backstage/catalog-client@0.3.10

## 0.8.2

### Patch Changes

- 3f96a9d5a: Support auth by sending cookies in event stream request
- 98dd5da71: Add support for multiple links to post-scaffold task summary page
- Updated dependencies [1279a3325]
- Updated dependencies [4a4681b1b]
- Updated dependencies [97b60de98]
- Updated dependencies [b051e770c]
- Updated dependencies [98dd5da71]
  - @backstage/core@0.7.4
  - @backstage/catalog-model@0.7.6

## 0.8.1

### Patch Changes

- 2ab6f3ff0: Add OwnerPicker component to scaffolder for specifying a component's owner from users and groups in the catalog.
- 676ede643: Added the `getOriginLocationByEntity` and `removeLocationById` methods to the catalog client
- Updated dependencies [676ede643]
- Updated dependencies [9f48b548c]
- Updated dependencies [b196a4569]
- Updated dependencies [8488a1a96]
  - @backstage/catalog-client@0.3.9
  - @backstage/plugin-catalog-react@0.1.4
  - @backstage/catalog-model@0.7.5

## 0.8.0

### Minor Changes

- 3385b374b: Use `scmIntegrationsApiRef` from the new `@backstage/integration-react`.

### Patch Changes

- 9ca0e4009: use local version of lowerCase and upperCase methods
- Updated dependencies [8686eb38c]
- Updated dependencies [0434853a5]
- Updated dependencies [8686eb38c]
- Updated dependencies [9ca0e4009]
- Updated dependencies [34ff49b0f]
  - @backstage/catalog-client@0.3.8
  - @backstage/config@0.1.4
  - @backstage/core@0.7.2
  - @backstage/plugin-catalog-react@0.1.2

## 0.7.1

### Patch Changes

- f98f212e4: Introduce scaffolder actions page which lists all available actions along with documentation about their input/output.

  Allow for actions to be extended with a description.

  The list actions page is by default available at `/create/actions`.

- 2089de76b: Make use of the new core `ItemCardGrid` and `ItemCardHeader` instead of the deprecated `ItemCard`.
- 4202807bb: Added a default type when is not defined in the schema to prevent id collision
- Updated dependencies [277644e09]
- Updated dependencies [52f613030]
- Updated dependencies [0b42fff22]
- Updated dependencies [0b42fff22]
- Updated dependencies [ff4d666ab]
- Updated dependencies [905cbfc96]
- Updated dependencies [2089de76b]
- Updated dependencies [d4e77ec5f]
- Updated dependencies [dc1fc92c8]
  - @backstage/integration@0.5.1
  - @backstage/catalog-model@0.7.4
  - @backstage/catalog-client@0.3.7
  - @backstage/core@0.7.1
  - @backstage/theme@0.2.4

## 0.7.0

### Minor Changes

- 8106c9528: The scaffolder has been updated to support the new `v1beta2` template schema which allows for custom template actions!

  See documentation for more information how to create and register new template actions.

  **Breaking changes**

  The backend scaffolder plugin now needs a `UrlReader` which can be pulled from the PluginEnvironment.

  The following change is required in `backend/src/plugins/scaffolder.ts`

  ```diff
   export default async function createPlugin({
     logger,
     config,
     database,
  +  reader,
   }: PluginEnvironment): Promise<Router> {

    // omitted code

    return await createRouter({
      preparers,
      templaters,
      publishers,
      logger,
      config,
      dockerClient,
      database,
      catalogClient,
  +   reader,
    });
  ```

### Patch Changes

- 12d8f27a6: Move logic for constructing the template form to the backend, using a new `./parameter-schema` endpoint that returns the form schema for a given template.
- bc327dc42: Tweak the template cards to be even more compliant with Material UI examples, and a little bit more dense.
- Updated dependencies [12d8f27a6]
- Updated dependencies [40c0fdbaa]
- Updated dependencies [2a271d89e]
- Updated dependencies [bece09057]
- Updated dependencies [169f48deb]
- Updated dependencies [8a1566719]
- Updated dependencies [9d455f69a]
- Updated dependencies [4c049a1a1]
- Updated dependencies [02816ecd7]
  - @backstage/catalog-model@0.7.3
  - @backstage/core@0.7.0
  - @backstage/plugin-catalog-react@0.1.1

## 0.6.0

### Minor Changes

- a5f42cf66: The Scaffolder and Catalog plugins have been migrated to partially require use of the [new composability API](https://backstage.io/docs/plugins/composability). The Scaffolder used to register its pages using the deprecated route registration plugin API, but those registrations have been removed. This means you now need to add the Scaffolder plugin page to the app directly.

  The page is imported from the Scaffolder plugin and added to the `<FlatRoutes>` component:

  ```tsx
  <Route path="/create" element={<ScaffolderPage />} />
  ```

  The Catalog plugin has also been migrated to use an [external route reference](https://backstage.io/docs/plugins/composability#binding-external-routes-in-the-app) to dynamically link to the create component page. This means you need to migrate the catalog plugin to use the new extension components, as well as bind the external route.

  To use the new extension components, replace existing usage of the `CatalogRouter` with the following:

  ```tsx
  <Route path="/catalog" element={<CatalogIndexPage />} />
  <Route path="/catalog/:namespace/:kind/:name" element={<CatalogEntityPage />}>
    <EntityPage />
  </Route>
  ```

  And to bind the external route from the catalog plugin to the scaffolder template index page, make sure you have the appropriate imports and add the following to the `createApp` call:

  ```ts
  import { catalogPlugin } from '@backstage/plugin-catalog';
  import { scaffolderPlugin } from '@backstage/plugin-scaffolder';

  const app = createApp({
    // ...
    bindRoutes({ bind }) {
      bind(catalogPlugin.externalRoutes, {
        createComponent: scaffolderPlugin.routes.root,
      });
    },
  });
  ```

- d0760ecdf: Moved common useStarredEntities hook to plugin-catalog-react
- e8e35fb5f: Adding Search and Filter features to Scaffolder/Templates Grid

### Patch Changes

- a5f42cf66: # Stateless scaffolding

  The scaffolder has been redesigned to be horizontally scalable and to persistently store task state and execution logs in the database.

  Each scaffolder task is given a unique task ID which is persisted in the database.
  Tasks are then picked up by a `TaskWorker` which performs the scaffolding steps.
  Execution logs are also persisted in the database meaning you can now refresh the scaffolder task status page without losing information.

  The task status page is now dynamically created based on the step information stored in the database.
  This allows for custom steps to be displayed once the next version of the scaffolder template schema is available.

  The task page is updated to display links to both the git repository and to the newly created catalog entity.

  Component registration has moved from the frontend into a separate registration step executed by the `TaskWorker`. This requires that a `CatalogClient` is passed to the scaffolder backend instead of the old `CatalogEntityClient`.

  Make sure to update `plugins/scaffolder.ts`

  ```diff
   import {
     CookieCutter,
     createRouter,
     Preparers,
     Publishers,
     CreateReactAppTemplater,
     Templaters,
  -  CatalogEntityClient,
   } from '@backstage/plugin-scaffolder-backend';

  +import { CatalogClient } from '@backstage/catalog-client';

   const discovery = SingleHostDiscovery.fromConfig(config);
  -const entityClient = new CatalogEntityClient({ discovery });
  +const catalogClient = new CatalogClient({ discoveryApi: discovery })

   return await createRouter({
     preparers,
     templaters,
     publishers,
     logger,
     config,
     dockerClient,
  -  entityClient,
     database,
  +  catalogClient,
   });
  ```

  As well as adding the `@backstage/catalog-client` packages as a dependency of your backend package.

- e488f0502: Update messages that process during loading, error, and no templates found.
  Remove unused dependencies.
- Updated dependencies [3a58084b6]
- Updated dependencies [e799e74d4]
- Updated dependencies [d0760ecdf]
- Updated dependencies [1407b34c6]
- Updated dependencies [88f1f1b60]
- Updated dependencies [bad21a085]
- Updated dependencies [9615e68fb]
- Updated dependencies [49f9b7346]
- Updated dependencies [5c2e2863f]
- Updated dependencies [3a58084b6]
- Updated dependencies [a1f5e6545]
- Updated dependencies [2c1f2a7c2]
  - @backstage/core@0.6.3
  - @backstage/plugin-catalog-react@0.1.0
  - @backstage/catalog-model@0.7.2
  - @backstage/config@0.1.3

## 0.5.1

### Patch Changes

- 6c4a76c59: Make the `TemplateCard` conform to what material-ui recommends in their examples. This fixes the extra padding around the buttons.
- Updated dependencies [fd3f2a8c0]
- Updated dependencies [d34d26125]
- Updated dependencies [0af242b6d]
- Updated dependencies [f4c2bcf54]
- Updated dependencies [10a0124e0]
- Updated dependencies [07e226872]
- Updated dependencies [f62e7abe5]
- Updated dependencies [96f378d10]
- Updated dependencies [688b73110]
  - @backstage/core@0.6.2
  - @backstage/plugin-catalog-react@0.0.4

## 0.5.0

### Minor Changes

- 6ed2b47d6: Include Backstage identity token in requests to backend plugins.

### Patch Changes

- Updated dependencies [19d354c78]
- Updated dependencies [b51ee6ece]
  - @backstage/plugin-catalog-react@0.0.3
  - @backstage/core@0.6.1

## 0.4.2

### Patch Changes

- 720149854: Migrated to new composability API, exporting the plugin as `scaffolderPlugin`. The template list page (`/create`) is exported as the `TemplateIndexPage` extension, and the templating page itself is exported as `TemplatePage`.
- 019fe39a0: Switch dependency from `@backstage/plugin-catalog` to `@backstage/plugin-catalog-react`.
- Updated dependencies [12ece98cd]
- Updated dependencies [d82246867]
- Updated dependencies [7fc89bae2]
- Updated dependencies [c810082ae]
- Updated dependencies [5fa3bdb55]
- Updated dependencies [6e612ce25]
- Updated dependencies [025e122c3]
- Updated dependencies [21e624ba9]
- Updated dependencies [da9f53c60]
- Updated dependencies [32c95605f]
- Updated dependencies [7881f2117]
- Updated dependencies [54c7d02f7]
- Updated dependencies [11cb5ef94]
  - @backstage/core@0.6.0
  - @backstage/plugin-catalog-react@0.0.2
  - @backstage/theme@0.2.3
  - @backstage/catalog-model@0.7.1

## 0.4.1

### Patch Changes

- 9dd057662: Upgrade [git-url-parse](https://www.npmjs.com/package/git-url-parse) to [v11.4.4](https://github.com/IonicaBizau/git-url-parse/pull/125) which fixes parsing an Azure DevOps branch ref.
- Updated dependencies [9dd057662]
- Updated dependencies [0b1182346]
  - @backstage/plugin-catalog@0.2.14

## 0.4.0

### Minor Changes

- ed6baab66: - Deprecating the `scaffolder.${provider}.token` auth duplication and favoring `integrations.${provider}` instead. If you receive deprecation warnings your config should change like the following:

  ```yaml
  scaffolder:
    github:
      token:
        $env: GITHUB_TOKEN
      visibility: public
  ```

  To something that looks like this:

  ```yaml
  integration:
    github:
      - host: github.com
        token:
          $env: GITHUB_TOKEN
  scaffolder:
    github:
      visibility: public
  ```

  You can also configure multiple different hosts under the `integration` config like the following:

  ```yaml
  integration:
    github:
      - host: github.com
        token:
          $env: GITHUB_TOKEN
      - host: ghe.mycompany.com
        token:
          $env: GITHUB_ENTERPRISE_TOKEN
  ```

  This of course is the case for all the providers respectively.

  - Adding support for cross provider scaffolding, you can now create repositories in for example Bitbucket using a template residing in GitHub.

  - Fix GitLab scaffolding so that it returns a `catalogInfoUrl` which automatically imports the project into the catalog.

  - The `Store Path` field on the `scaffolder` frontend has now changed so that you require the full URL to the desired destination repository.

  `backstage/new-repository` would become `https://github.com/backstage/new-repository` if provider was GitHub for example.

### Patch Changes

- Updated dependencies [def2307f3]
- Updated dependencies [efd6ef753]
- Updated dependencies [593632f07]
- Updated dependencies [33846acfc]
- Updated dependencies [a187b8ad0]
- Updated dependencies [f04db53d7]
- Updated dependencies [a93f42213]
  - @backstage/catalog-model@0.7.0
  - @backstage/core@0.5.0
  - @backstage/plugin-catalog@0.2.12

## 0.3.6

### Patch Changes

- 8e083f41f: Bug fix: User can retry creating a new component if an error occurs, without having to reload the page.
- 947d3c269: You can now maximize the logs into full-screen by clicking the button under each step of the job
- Updated dependencies [9c09a364f]
  - @backstage/plugin-catalog@0.2.10

## 0.3.5

### Patch Changes

- 19554f6d6: Added GitHub Actions for Create React App, and allow better imports of files inside a module when they're exposed using `files` in `package.json`
- Updated dependencies [1dc445e89]
- Updated dependencies [342270e4d]
  - @backstage/core@0.4.2
  - @backstage/plugin-catalog@0.2.8

## 0.3.4

### Patch Changes

- Updated dependencies [c911061b7]
- Updated dependencies [8ef71ed32]
- Updated dependencies [0e6298f7e]
- Updated dependencies [ac3560b42]
  - @backstage/catalog-model@0.6.0
  - @backstage/core@0.4.1
  - @backstage/plugin-catalog@0.2.7

## 0.3.3

### Patch Changes

- Updated dependencies [2527628e1]
- Updated dependencies [6011b7d3e]
- Updated dependencies [1c69d4716]
- Updated dependencies [83b6e0c1f]
- Updated dependencies [1665ae8bb]
- Updated dependencies [04f26f88d]
- Updated dependencies [ff243ce96]
  - @backstage/core@0.4.0
  - @backstage/plugin-catalog@0.2.6
  - @backstage/catalog-model@0.5.0
  - @backstage/theme@0.2.2

## 0.3.2

### Patch Changes

- a9fd599f7: Add Analyze location endpoint to catalog backend. Add catalog-import plugin and replace import-component with it. To start using Analyze location endpoint, you have add it to the `createRouter` function options in the `\backstage\packages\backend\src\plugins\catalog.ts` file:

  ```ts
  export default async function createPlugin(env: PluginEnvironment) {
    const builder = new CatalogBuilder(env);
    const {
      entitiesCatalog,
      locationsCatalog,
      higherOrderOperation,
      locationAnalyzer, //<--
    } = await builder.build();

    return await createRouter({
      entitiesCatalog,
      locationsCatalog,
      higherOrderOperation,
      locationAnalyzer, //<--
      logger: env.logger,
    });
  }
  ```

- Updated dependencies [08835a61d]
- Updated dependencies [a9fd599f7]
- Updated dependencies [bcc211a08]
- Updated dependencies [ebf37bbae]
  - @backstage/catalog-model@0.4.0
  - @backstage/plugin-catalog@0.2.5

## 0.3.1

### Patch Changes

- ef2831dde: Move constructing the catalog-info.yaml URL for scaffolded components to the publishers
- Updated dependencies [475fc0aaa]
- Updated dependencies [1166fcc36]
- Updated dependencies [1185919f3]
  - @backstage/core@0.3.2
  - @backstage/catalog-model@0.3.0
  - @backstage/plugin-catalog@0.2.3

## 0.3.0

### Minor Changes

- 59166e5ec: `createRouter` of scaffolder backend will now require additional option as `entityClient` which could be generated by `CatalogEntityClient` in `plugin-scaffolder-backend` package. Here is example to generate `entityClient`.

  ```js
  import { CatalogEntityClient } from '@backstage/plugin-scaffolder-backend';
  import { SingleHostDiscovery } from '@backstage/backend-common';

  const discovery = SingleHostDiscovery.fromConfig(config);
  const entityClient = new CatalogEntityClient({ discovery });
  ```

  - Scaffolder's API `/v1/jobs` will accept `templateName` instead of `template` Entity.

### Patch Changes

- Updated dependencies [7b37d65fd]
- Updated dependencies [4aca74e08]
- Updated dependencies [e8f69ba93]
- Updated dependencies [0c0798f08]
- Updated dependencies [0c0798f08]
- Updated dependencies [199237d2f]
- Updated dependencies [6627b626f]
- Updated dependencies [4577e377b]
- Updated dependencies [2d0bd1be7]
  - @backstage/core@0.3.0
  - @backstage/theme@0.2.1
  - @backstage/plugin-catalog@0.2.1

## 0.2.0

### Minor Changes

- 28edd7d29: Create backend plugin through CLI

### Patch Changes

- fb74f1db6: Make title meaningful after component creation

  Fixes #2458.

  After the change, the UX should look like this:

  ### If the component creation was successful:

  ![successfully-created-component](https://user-images.githubusercontent.com/33940798/94339294-8bd1e000-0016-11eb-885b-7936fcc23b63.gif)

  ### If the component creation failed:

  ![failed-to-create-component](https://user-images.githubusercontent.com/33940798/94339296-90969400-0016-11eb-9a74-ce16b3dd8d88.gif)

- c5ef12926: fix the accordion details design when job stage fail
- 1c8c43756: The new `scaffolder.github.baseUrl` config property allows to specify a custom base url for GitHub Enterprise instances
- Updated dependencies [28edd7d29]
- Updated dependencies [819a70229]
- Updated dependencies [3a4236570]
- Updated dependencies [ae5983387]
- Updated dependencies [0d4459c08]
- Updated dependencies [482b6313d]
- Updated dependencies [e0be86b6f]
- Updated dependencies [f70a52868]
- Updated dependencies [12b5fe940]
- Updated dependencies [368fd8243]
- Updated dependencies [1c60f716e]
- Updated dependencies [144c66d50]
- Updated dependencies [a768a07fb]
- Updated dependencies [b79017fd3]
- Updated dependencies [6d97d2d6f]
- Updated dependencies [5adfc005e]
- Updated dependencies [f0aa01bcc]
- Updated dependencies [0aecfded0]
- Updated dependencies [93a3fa3ae]
- Updated dependencies [782f3b354]
- Updated dependencies [8b9c8196f]
- Updated dependencies [2713f28f4]
- Updated dependencies [406015b0d]
- Updated dependencies [82759d3e4]
- Updated dependencies [60d40892c]
- Updated dependencies [ac8d5d5c7]
- Updated dependencies [2ebcfac8d]
- Updated dependencies [fa56f4615]
- Updated dependencies [ebca83d48]
- Updated dependencies [aca79334f]
- Updated dependencies [c0d5242a0]
- Updated dependencies [b3d57961c]
- Updated dependencies [0b956f21b]
- Updated dependencies [97c2cb19b]
- Updated dependencies [3beb5c9fc]
- Updated dependencies [754e31db5]
- Updated dependencies [1611c6dbc]
  - @backstage/plugin-catalog@0.2.0
  - @backstage/core@0.2.0
  - @backstage/catalog-model@0.2.0
  - @backstage/theme@0.2.0
