# @backstage/plugin-scaffolder-react

## 1.8.0-next.2

### Patch Changes

- 8fe56a8: Widen `@types/react` dependency range to include version 18.
- 2985186: Fix bug that erroneously caused a separator or a 0 to render in the TemplateCard for Templates with empty links
- Updated dependencies
  - @backstage/core-components@0.14.0-next.1
  - @backstage/core-plugin-api@1.9.0-next.1
  - @backstage/plugin-catalog-react@1.10.0-next.2
  - @backstage/theme@0.5.1-next.0
  - @backstage/catalog-client@1.6.0-next.1
  - @backstage/catalog-model@1.4.4-next.0
  - @backstage/types@1.1.1
  - @backstage/version-bridge@1.0.7
  - @backstage/plugin-scaffolder-common@1.5.0-next.1

## 1.8.0-next.1

### Minor Changes

- b07ec70: Use more distinguishable icons for link (`Link`) and text output (`Description`).

### Patch Changes

- 3f60ad5: fix for: converting circular structure to JSON error
- 31f0a0a: Added `ScaffolderPageContextMenu` to `ActionsPage`, `ListTaskPage`, and `TemplateEditorPage` so that you can more easily navigate between these pages
- 82affc7: Fix issue where `ui:schema` was replaced with an empty object if `dependencies` is defined
- Updated dependencies
  - @backstage/core-components@0.14.0-next.0
  - @backstage/catalog-model@1.4.4-next.0
  - @backstage/catalog-client@1.6.0-next.1
  - @backstage/core-plugin-api@1.8.3-next.0
  - @backstage/plugin-catalog-react@1.9.4-next.1
  - @backstage/theme@0.5.0
  - @backstage/types@1.1.1
  - @backstage/version-bridge@1.0.7
  - @backstage/plugin-scaffolder-common@1.5.0-next.1

## 1.8.0-next.0

### Minor Changes

- c56f1a2: Remove the old legacy exports from `/alpha`
- 11b9a08: Introduced the first version of recoverable tasks.

### Patch Changes

- 0b0c6b6: Allow defining default output text to be shown
- 6a74ffd: Updated dependency `@rjsf/utils` to `5.16.1`.
  Updated dependency `@rjsf/core` to `5.16.1`.
  Updated dependency `@rjsf/material-ui` to `5.16.1`.
  Updated dependency `@rjsf/validator-ajv8` to `5.16.1`.
- Updated dependencies
  - @backstage/plugin-catalog-react@1.9.4-next.0
  - @backstage/catalog-client@1.6.0-next.0
  - @backstage/plugin-scaffolder-common@1.5.0-next.0
  - @backstage/core-components@0.13.10
  - @backstage/catalog-model@1.4.3
  - @backstage/core-plugin-api@1.8.2
  - @backstage/theme@0.5.0
  - @backstage/types@1.1.1
  - @backstage/version-bridge@1.0.7

## 1.7.1

### Patch Changes

- c28f281: Scaffolder form now shows a list of errors at the top of the form.
- 0b9ce2b: Fix for a step with no properties
- 98ac5ab: Updated dependency `@rjsf/utils` to `5.15.1`.
  Updated dependency `@rjsf/core` to `5.15.1`.
  Updated dependency `@rjsf/material-ui` to `5.15.1`.
  Updated dependency `@rjsf/validator-ajv8` to `5.15.1`.
- 4016f21: Remove some unused dependencies
- d16f85f: Show first scaffolder output text by default
- Updated dependencies
  - @backstage/core-components@0.13.10
  - @backstage/plugin-scaffolder-common@1.4.5
  - @backstage/core-plugin-api@1.8.2
  - @backstage/catalog-client@1.5.2
  - @backstage/plugin-catalog-react@1.9.3
  - @backstage/catalog-model@1.4.3
  - @backstage/theme@0.5.0
  - @backstage/types@1.1.1
  - @backstage/version-bridge@1.0.7

## 1.7.1-next.2

### Patch Changes

- 98ac5ab: Updated dependency `@rjsf/utils` to `5.15.1`.
  Updated dependency `@rjsf/core` to `5.15.1`.
  Updated dependency `@rjsf/material-ui` to `5.15.1`.
  Updated dependency `@rjsf/validator-ajv8` to `5.15.1`.
- Updated dependencies
  - @backstage/plugin-catalog-react@1.9.3-next.2

## 1.7.1-next.1

### Patch Changes

- Updated dependencies
  - @backstage/core-plugin-api@1.8.2-next.0
  - @backstage/core-components@0.13.10-next.1
  - @backstage/plugin-catalog-react@1.9.3-next.1
  - @backstage/catalog-client@1.5.2-next.0
  - @backstage/catalog-model@1.4.3
  - @backstage/theme@0.5.0
  - @backstage/types@1.1.1
  - @backstage/version-bridge@1.0.7
  - @backstage/plugin-scaffolder-common@1.4.4

## 1.7.1-next.0

### Patch Changes

- c28f281: Scaffolder form now shows a list of errors at the top of the form.
- 4016f21: Remove some unused dependencies
- Updated dependencies
  - @backstage/core-components@0.13.10-next.0
  - @backstage/catalog-client@1.5.2-next.0
  - @backstage/plugin-catalog-react@1.9.3-next.0
  - @backstage/catalog-model@1.4.3
  - @backstage/core-plugin-api@1.8.1
  - @backstage/theme@0.5.0
  - @backstage/types@1.1.1
  - @backstage/version-bridge@1.0.7
  - @backstage/plugin-scaffolder-common@1.4.4

## 1.7.0

### Minor Changes

- 33edf50: Added support for dealing with user provided secrets using a new field extension `ui:field: Secret`

### Patch Changes

- 670c7cc: Fix bug where `properties` is set to empty object when it should be empty for schema dependencies
- fa66d1b: Fixed bug in `ReviewState` where `enum` value was displayed in step review instead of the corresponding label when using `enumNames`
- e516bf4: Step titles in the Stepper are now clickable and redirect the user to the corresponding step, as an alternative to using the back buttons.
- aaa6fb3: Minor updates for TypeScript 5.2.2+ compatibility
- 2aee53b: Add horizontal slider if stepper overflows
- 2b72591: Updated dependency `@rjsf/utils` to `5.14.3`.
  Updated dependency `@rjsf/core` to `5.14.3`.
  Updated dependency `@rjsf/material-ui` to `5.14.3`.
  Updated dependency `@rjsf/validator-ajv8` to `5.14.3`.
- 6cd12f2: Updated dependency `@rjsf/utils` to `5.14.1`.
  Updated dependency `@rjsf/core` to `5.14.1`.
  Updated dependency `@rjsf/material-ui` to `5.14.1`.
  Updated dependency `@rjsf/validator-ajv8` to `5.14.1`.
- a518c5a: Updated dependency `@react-hookz/web` to `^23.0.0`.
- 64301d3: Updated dependency `@rjsf/utils` to `5.15.0`.
  Updated dependency `@rjsf/core` to `5.15.0`.
  Updated dependency `@rjsf/material-ui` to `5.15.0`.
  Updated dependency `@rjsf/validator-ajv8` to `5.15.0`.
- 63c494e: Updated dependency `@rjsf/utils` to `5.14.2`.
  Updated dependency `@rjsf/core` to `5.14.2`.
  Updated dependency `@rjsf/material-ui` to `5.14.2`.
  Updated dependency `@rjsf/validator-ajv8` to `5.14.2`.
- c8908d4: Use new option from RJSF 5.15
- 0cbb03b: Fixing regular expression ReDoS with zod packages. Upgrading to latest. ref: https://security.snyk.io/vuln/SNYK-JS-ZOD-5925617
- 5bb5240: Fixed issue for showing undefined for hidden form items
- Updated dependencies
  - @backstage/core-plugin-api@1.8.1
  - @backstage/plugin-catalog-react@1.9.2
  - @backstage/core-components@0.13.9
  - @backstage/theme@0.5.0
  - @backstage/catalog-client@1.5.0
  - @backstage/catalog-model@1.4.3
  - @backstage/errors@1.2.3
  - @backstage/types@1.1.1
  - @backstage/version-bridge@1.0.7
  - @backstage/plugin-scaffolder-common@1.4.4

## 1.6.2-next.3

### Patch Changes

- 64301d3: Updated dependency `@rjsf/utils` to `5.15.0`.
  Updated dependency `@rjsf/core` to `5.15.0`.
  Updated dependency `@rjsf/material-ui` to `5.15.0`.
  Updated dependency `@rjsf/validator-ajv8` to `5.15.0`.
- c8908d4: Use new option from RJSF 5.15
- Updated dependencies
  - @backstage/core-components@0.13.9-next.3
  - @backstage/catalog-client@1.5.0-next.1
  - @backstage/catalog-model@1.4.3
  - @backstage/core-plugin-api@1.8.1-next.1
  - @backstage/errors@1.2.3
  - @backstage/theme@0.5.0-next.1
  - @backstage/types@1.1.1
  - @backstage/version-bridge@1.0.7
  - @backstage/plugin-catalog-react@1.9.2-next.3
  - @backstage/plugin-scaffolder-common@1.4.3

## 1.6.2-next.2

### Patch Changes

- 5bb5240: Fixed issue for showing undefined for hidden form items
- Updated dependencies
  - @backstage/theme@0.5.0-next.1
  - @backstage/plugin-catalog-react@1.9.2-next.2
  - @backstage/catalog-client@1.5.0-next.1
  - @backstage/catalog-model@1.4.3
  - @backstage/core-components@0.13.9-next.2
  - @backstage/core-plugin-api@1.8.1-next.1
  - @backstage/errors@1.2.3
  - @backstage/types@1.1.1
  - @backstage/version-bridge@1.0.7
  - @backstage/plugin-scaffolder-common@1.4.3

## 1.6.2-next.1

### Patch Changes

- fa66d1b5b3: Fixed bug in `ReviewState` where `enum` value was displayed in step review instead of the corresponding label when using `enumNames`
- 2aee53bbeb: Add horizontal slider if stepper overflows
- 2b725913c1: Updated dependency `@rjsf/utils` to `5.14.3`.
  Updated dependency `@rjsf/core` to `5.14.3`.
  Updated dependency `@rjsf/material-ui` to `5.14.3`.
  Updated dependency `@rjsf/validator-ajv8` to `5.14.3`.
- a518c5a25b: Updated dependency `@react-hookz/web` to `^23.0.0`.
- Updated dependencies
  - @backstage/core-components@0.13.9-next.1
  - @backstage/core-plugin-api@1.8.1-next.1
  - @backstage/plugin-catalog-react@1.9.2-next.1
  - @backstage/catalog-client@1.5.0-next.0
  - @backstage/catalog-model@1.4.3
  - @backstage/errors@1.2.3
  - @backstage/theme@0.5.0-next.0
  - @backstage/types@1.1.1
  - @backstage/version-bridge@1.0.7
  - @backstage/plugin-scaffolder-common@1.4.3

## 1.6.2-next.0

### Patch Changes

- e516bf4da8: Step titles in the Stepper are now clickable and redirect the user to the corresponding step, as an alternative to using the back buttons.
- aaa6fb3bc9: Minor updates for TypeScript 5.2.2+ compatibility
- 6cd12f277b: Updated dependency `@rjsf/utils` to `5.14.1`.
  Updated dependency `@rjsf/core` to `5.14.1`.
  Updated dependency `@rjsf/material-ui` to `5.14.1`.
  Updated dependency `@rjsf/validator-ajv8` to `5.14.1`.
- 63c494ef22: Updated dependency `@rjsf/utils` to `5.14.2`.
  Updated dependency `@rjsf/core` to `5.14.2`.
  Updated dependency `@rjsf/material-ui` to `5.14.2`.
  Updated dependency `@rjsf/validator-ajv8` to `5.14.2`.
- Updated dependencies
  - @backstage/core-plugin-api@1.8.1-next.0
  - @backstage/plugin-catalog-react@1.9.2-next.0
  - @backstage/core-components@0.13.9-next.0
  - @backstage/theme@0.5.0-next.0
  - @backstage/catalog-client@1.4.6
  - @backstage/catalog-model@1.4.3
  - @backstage/errors@1.2.3
  - @backstage/types@1.1.1
  - @backstage/version-bridge@1.0.7
  - @backstage/plugin-scaffolder-common@1.4.3

## 1.6.0

### Minor Changes

- 3fdffbb699: Release design improvements for the `Scaffolder` plugin and support v5 of `@rjsf/*` libraries.

  This change should be non-breaking. If you're seeing typescript issues after migrating please [open an issue](https://github.com/backstage/backstage/issues/new/choose)

  The `next` versions like `createNextFieldExtension` and `NextScaffolderPage` have been promoted to the public interface under `createScaffolderFieldExtension` and `ScaffolderPage`, so any older imports which are no longer found will need updating from `@backstage/plugin-scaffolder/alpha` or `@backstage/plugin-scaffolder-react/alpha` will need to be imported from `@backstage/plugin-scaffolder` and `@backstage/plugin-scaffolder-react` respectively.

  The legacy versions are now available in `/alpha` under `createLegacyFieldExtension` and `LegacyScaffolderPage` if you're running into issues, but be aware that these will be removed in a next mainline release.

### Patch Changes

- 6c2b872153: Add official support for React 18.
- 171a99816b: Fixed `backstage:featureFlag` in `scaffolder/next` by sorting out `manifest.steps`.
- c838da0edd: Updated dependency `@rjsf/utils` to `5.13.6`.
  Updated dependency `@rjsf/core` to `5.13.6`.
  Updated dependency `@rjsf/material-ui` to `5.13.6`.
  Updated dependency `@rjsf/validator-ajv8` to `5.13.6`.
- 69c14904b6: Use `EntityRefLinks` with `hideIcons` property to avoid double icons
- 62b5922916: Internal theme type updates
- dda56ae265: Preserve step's time execution for a non-running task.
- 76d07da66a: Make it possible to define control buttons text (Back, Create, Review) per template
- Updated dependencies
  - @backstage/plugin-catalog-react@1.9.0
  - @backstage/core-components@0.13.8
  - @backstage/plugin-scaffolder-common@1.4.3
  - @backstage/core-plugin-api@1.8.0
  - @backstage/version-bridge@1.0.7
  - @backstage/theme@0.4.4
  - @backstage/catalog-client@1.4.6
  - @backstage/catalog-model@1.4.3
  - @backstage/errors@1.2.3
  - @backstage/types@1.1.1

## 1.6.0-next.2

### Patch Changes

- Updated dependencies
  - @backstage/core-components@0.13.8-next.2
  - @backstage/plugin-catalog-react@1.9.0-next.2

## 1.6.0-next.1

### Patch Changes

- 62b5922916: Internal theme type updates
- 76d07da66a: Make it possible to define control buttons text (Back, Create, Review) per template
- Updated dependencies
  - @backstage/plugin-catalog-react@1.9.0-next.1
  - @backstage/plugin-scaffolder-common@1.4.3-next.1
  - @backstage/core-components@0.13.8-next.1
  - @backstage/catalog-client@1.4.5
  - @backstage/catalog-model@1.4.3
  - @backstage/core-plugin-api@1.8.0-next.0
  - @backstage/errors@1.2.3
  - @backstage/theme@0.4.4-next.0
  - @backstage/types@1.1.1
  - @backstage/version-bridge@1.0.7-next.0

## 1.6.0-next.0

### Minor Changes

- 3fdffbb699: Release design improvements for the `Scaffolder` plugin and support v5 of `@rjsf/*` libraries.

  This change should be non-breaking. If you're seeing typescript issues after migrating please [open an issue](https://github.com/backstage/backstage/issues/new/choose)

  The `next` versions like `createNextFieldExtension` and `NextScaffolderPage` have been promoted to the public interface under `createScaffolderFieldExtension` and `ScaffolderPage`, so any older imports which are no longer found will need updating from `@backstage/plugin-scaffolder/alpha` or `@backstage/plugin-scaffolder-react/alpha` will need to be imported from `@backstage/plugin-scaffolder` and `@backstage/plugin-scaffolder-react` respectively.

  The legacy versions are now available in `/alpha` under `createLegacyFieldExtension` and `LegacyScaffolderPage` if you're running into issues, but be aware that these will be removed in a next mainline release.

### Patch Changes

- 6c2b872153: Add official support for React 18.
- Updated dependencies
  - @backstage/core-components@0.13.7-next.0
  - @backstage/plugin-scaffolder-common@1.4.3-next.0
  - @backstage/plugin-catalog-react@1.9.0-next.0
  - @backstage/core-plugin-api@1.8.0-next.0
  - @backstage/version-bridge@1.0.7-next.0
  - @backstage/theme@0.4.4-next.0
  - @backstage/catalog-client@1.4.5
  - @backstage/catalog-model@1.4.3
  - @backstage/errors@1.2.3
  - @backstage/types@1.1.1

## 1.5.6

### Patch Changes

- 9a1fce352e: Updated dependency `@testing-library/jest-dom` to `^6.0.0`.
- f95af4e540: Updated dependency `@testing-library/dom` to `^9.0.0`.
- Updated dependencies
  - @backstage/plugin-catalog-react@1.8.5
  - @backstage/core-plugin-api@1.7.0
  - @backstage/core-components@0.13.6
  - @backstage/catalog-model@1.4.3
  - @backstage/errors@1.2.3
  - @backstage/version-bridge@1.0.6
  - @backstage/theme@0.4.3
  - @backstage/catalog-client@1.4.5
  - @backstage/types@1.1.1
  - @backstage/plugin-scaffolder-common@1.4.2

## 1.5.6-next.2

### Patch Changes

- Updated dependencies
  - @backstage/core-components@0.13.6-next.2
  - @backstage/core-plugin-api@1.7.0-next.1
  - @backstage/catalog-model@1.4.3-next.0
  - @backstage/plugin-catalog-react@1.8.5-next.2
  - @backstage/errors@1.2.3-next.0
  - @backstage/theme@0.4.3-next.0
  - @backstage/catalog-client@1.4.5-next.0
  - @backstage/types@1.1.1
  - @backstage/version-bridge@1.0.5
  - @backstage/plugin-scaffolder-common@1.4.2-next.0

## 1.5.6-next.1

### Patch Changes

- Updated dependencies
  - @backstage/core-components@0.13.6-next.1
  - @backstage/plugin-catalog-react@1.8.5-next.1
  - @backstage/core-plugin-api@1.7.0-next.0
  - @backstage/catalog-client@1.4.4
  - @backstage/catalog-model@1.4.2
  - @backstage/errors@1.2.2
  - @backstage/theme@0.4.2
  - @backstage/types@1.1.1
  - @backstage/version-bridge@1.0.5
  - @backstage/plugin-scaffolder-common@1.4.1

## 1.5.6-next.0

### Patch Changes

- Updated dependencies
  - @backstage/plugin-catalog-react@1.8.5-next.0
  - @backstage/core-plugin-api@1.7.0-next.0
  - @backstage/core-components@0.13.6-next.0
  - @backstage/catalog-client@1.4.4
  - @backstage/catalog-model@1.4.2
  - @backstage/errors@1.2.2
  - @backstage/theme@0.4.2
  - @backstage/types@1.1.1
  - @backstage/version-bridge@1.0.5
  - @backstage/plugin-scaffolder-common@1.4.1

## 1.5.5

### Patch Changes

- 406b786a2a2c: Mark package as being free of side effects, allowing more optimized Webpack builds.
- b16c341ced45: Updated dependency `@rjsf/utils` to `5.13.0`.
  Updated dependency `@rjsf/core-v5` to `npm:@rjsf/core@5.13.0`.
  Updated dependency `@rjsf/material-ui-v5` to `npm:@rjsf/material-ui@5.13.0`.
  Updated dependency `@rjsf/validator-ajv8` to `5.13.0`.
- 27fef07f9229: Updated dependency `use-immer` to `^0.9.0`.
- Updated dependencies
  - @backstage/plugin-catalog-react@1.8.4
  - @backstage/core-components@0.13.5
  - @backstage/catalog-client@1.4.4
  - @backstage/catalog-model@1.4.2
  - @backstage/core-plugin-api@1.6.0
  - @backstage/errors@1.2.2
  - @backstage/plugin-scaffolder-common@1.4.1
  - @backstage/theme@0.4.2
  - @backstage/types@1.1.1
  - @backstage/version-bridge@1.0.5

## 1.5.5-next.3

### Patch Changes

- 406b786a2a2c: Mark package as being free of side effects, allowing more optimized Webpack builds.
- b16c341ced45: Updated dependency `@rjsf/utils` to `5.13.0`.
  Updated dependency `@rjsf/core-v5` to `npm:@rjsf/core@5.13.0`.
  Updated dependency `@rjsf/material-ui-v5` to `npm:@rjsf/material-ui@5.13.0`.
  Updated dependency `@rjsf/validator-ajv8` to `5.13.0`.
- Updated dependencies
  - @backstage/catalog-client@1.4.4-next.2
  - @backstage/catalog-model@1.4.2-next.2
  - @backstage/core-components@0.13.5-next.3
  - @backstage/core-plugin-api@1.6.0-next.3
  - @backstage/errors@1.2.2-next.0
  - @backstage/plugin-catalog-react@1.8.4-next.3
  - @backstage/plugin-scaffolder-common@1.4.1-next.2
  - @backstage/theme@0.4.2-next.0
  - @backstage/types@1.1.1-next.0
  - @backstage/version-bridge@1.0.5-next.0

## 1.5.5-next.2

### Patch Changes

- 27fef07f9229: Updated dependency `use-immer` to `^0.9.0`.
- Updated dependencies
  - @backstage/core-components@0.13.5-next.2
  - @backstage/core-plugin-api@1.6.0-next.2
  - @backstage/plugin-catalog-react@1.8.4-next.2
  - @backstage/catalog-model@1.4.2-next.1
  - @backstage/catalog-client@1.4.4-next.1
  - @backstage/errors@1.2.1
  - @backstage/theme@0.4.1
  - @backstage/types@1.1.0
  - @backstage/version-bridge@1.0.4
  - @backstage/plugin-scaffolder-common@1.4.1-next.1

## 1.5.5-next.1

### Patch Changes

- Updated dependencies
  - @backstage/plugin-catalog-react@1.8.4-next.1
  - @backstage/core-components@0.13.5-next.1
  - @backstage/catalog-model@1.4.2-next.0
  - @backstage/core-plugin-api@1.6.0-next.1
  - @backstage/catalog-client@1.4.4-next.0
  - @backstage/plugin-scaffolder-common@1.4.1-next.0
  - @backstage/errors@1.2.1
  - @backstage/theme@0.4.1
  - @backstage/types@1.1.0
  - @backstage/version-bridge@1.0.4

## 1.5.4-next.0

### Patch Changes

- Updated dependencies
  - @backstage/core-plugin-api@1.6.0-next.0
  - @backstage/core-components@0.13.5-next.0
  - @backstage/catalog-client@1.4.3
  - @backstage/catalog-model@1.4.1
  - @backstage/errors@1.2.1
  - @backstage/theme@0.4.1
  - @backstage/types@1.1.0
  - @backstage/version-bridge@1.0.4
  - @backstage/plugin-catalog-react@1.8.3-next.0
  - @backstage/plugin-scaffolder-common@1.4.0

## 1.5.2

### Patch Changes

- ba9ee98a37bd: Fixed bug in Workflow component by passing a prop `templateName` down to Stepper component.
- Updated dependencies
  - @backstage/core-components@0.13.4
  - @backstage/plugin-catalog-react@1.8.1
  - @backstage/plugin-scaffolder-common@1.4.0
  - @backstage/core-plugin-api@1.5.3
  - @backstage/catalog-client@1.4.3
  - @backstage/catalog-model@1.4.1
  - @backstage/errors@1.2.1
  - @backstage/theme@0.4.1
  - @backstage/types@1.1.0
  - @backstage/version-bridge@1.0.4

## 1.5.2-next.1

### Patch Changes

- Updated dependencies
  - @backstage/plugin-catalog-react@1.8.1-next.1

## 1.5.2-next.0

### Patch Changes

- ba9ee98a37bd: Fixed bug in Workflow component by passing a prop `templateName` down to Stepper component.
- Updated dependencies
  - @backstage/core-components@0.13.4-next.0
  - @backstage/core-plugin-api@1.5.3
  - @backstage/plugin-catalog-react@1.8.1-next.0
  - @backstage/catalog-client@1.4.3
  - @backstage/catalog-model@1.4.1
  - @backstage/errors@1.2.1
  - @backstage/theme@0.4.1
  - @backstage/types@1.1.0
  - @backstage/version-bridge@1.0.4
  - @backstage/plugin-scaffolder-common@1.3.2

## 1.5.1

### Patch Changes

- f74a27de4d2c: Made markdown description theme-able
- Updated dependencies
  - @backstage/theme@0.4.1
  - @backstage/errors@1.2.1
  - @backstage/plugin-catalog-react@1.8.0
  - @backstage/core-components@0.13.3
  - @backstage/core-plugin-api@1.5.3
  - @backstage/catalog-client@1.4.3
  - @backstage/catalog-model@1.4.1
  - @backstage/types@1.1.0
  - @backstage/version-bridge@1.0.4
  - @backstage/plugin-scaffolder-common@1.3.2

## 1.5.1-next.2

### Patch Changes

- Updated dependencies
  - @backstage/plugin-catalog-react@1.8.0-next.2
  - @backstage/theme@0.4.1-next.1
  - @backstage/core-plugin-api@1.5.3-next.1
  - @backstage/core-components@0.13.3-next.2
  - @backstage/catalog-client@1.4.3-next.0
  - @backstage/catalog-model@1.4.1-next.0
  - @backstage/errors@1.2.1-next.0
  - @backstage/types@1.1.0
  - @backstage/version-bridge@1.0.4
  - @backstage/plugin-scaffolder-common@1.3.2-next.0

## 1.5.1-next.1

### Patch Changes

- f74a27de4d2c: Made markdown description theme-able
- Updated dependencies
  - @backstage/theme@0.4.1-next.0
  - @backstage/core-components@0.13.3-next.1
  - @backstage/core-plugin-api@1.5.3-next.0
  - @backstage/plugin-catalog-react@1.7.1-next.1

## 1.5.1-next.0

### Patch Changes

- Updated dependencies
  - @backstage/errors@1.2.1-next.0
  - @backstage/core-components@0.13.3-next.0
  - @backstage/catalog-client@1.4.3-next.0
  - @backstage/catalog-model@1.4.1-next.0
  - @backstage/core-plugin-api@1.5.2
  - @backstage/theme@0.4.0
  - @backstage/types@1.1.0
  - @backstage/version-bridge@1.0.4
  - @backstage/plugin-catalog-react@1.7.1-next.0
  - @backstage/plugin-scaffolder-common@1.3.2-next.0

## 1.5.0

### Minor Changes

- 6b571405f806: `scaffolder/next`: Provide some default template components to `rjsf` to allow for standardization and markdown descriptions
- 4505dc3b4598: `scaffolder/next`: Don't render `TemplateGroups` when there's no results in with search query
- a452bda74d7a: Fixed typescript casting bug for useTemplateParameterSchema hook
- 6b571405f806: `scaffolder/next`: provide a `ScaffolderField` component which is meant to replace some of the `FormControl` components from Material UI, making it easier to write `FieldExtensions`.

### Patch Changes

- 84a5c7724c7e: fixed refresh problem when backstage backend disconnects without any feedback to user. Now we send a generic message and try to reconnect after 15 seconds
- cf34311cdbe1: Extract `ui:*` fields from conditional `then` and `else` schema branches.
- 2ff94da135a4: bump `rjsf` dependencies to 5.7.3
- 74b216ee4e50: Add `PropsWithChildren` to usages of `ComponentType`, in preparation for React 18 where the children are no longer implicit.
- Updated dependencies
  - @backstage/core-plugin-api@1.5.2
  - @backstage/catalog-client@1.4.2
  - @backstage/core-components@0.13.2
  - @backstage/types@1.1.0
  - @backstage/theme@0.4.0
  - @backstage/plugin-catalog-react@1.7.0
  - @backstage/catalog-model@1.4.0
  - @backstage/errors@1.2.0
  - @backstage/version-bridge@1.0.4
  - @backstage/plugin-scaffolder-common@1.3.1

## 1.5.0-next.3

### Minor Changes

- a452bda74d7a: Fixed typescript casting bug for useTemplateParameterSchema hook

### Patch Changes

- Updated dependencies
  - @backstage/core-components@0.13.2-next.3
  - @backstage/catalog-model@1.4.0-next.1
  - @backstage/catalog-client@1.4.2-next.2
  - @backstage/core-plugin-api@1.5.2-next.0
  - @backstage/errors@1.2.0-next.0
  - @backstage/theme@0.4.0-next.1
  - @backstage/types@1.0.2
  - @backstage/version-bridge@1.0.4
  - @backstage/plugin-catalog-react@1.7.0-next.3
  - @backstage/plugin-scaffolder-common@1.3.1-next.1

## 1.5.0-next.2

### Patch Changes

- cf34311cdbe1: Extract `ui:*` fields from conditional `then` and `else` schema branches.
- 2ff94da135a4: bump `rjsf` dependencies to 5.7.3
- Updated dependencies
  - @backstage/theme@0.4.0-next.1
  - @backstage/plugin-catalog-react@1.7.0-next.2
  - @backstage/core-components@0.13.2-next.2
  - @backstage/core-plugin-api@1.5.2-next.0

## 1.5.0-next.1

### Minor Changes

- 6b571405f806: `scaffolder/next`: Provide some default template components to `rjsf` to allow for standardization and markdown descriptions
- 4505dc3b4598: `scaffolder/next`: Don't render `TemplateGroups` when there's no results in with search query
- 6b571405f806: `scaffolder/next`: provide a `ScaffolderField` component which is meant to replace some of the `FormControl` components from Material UI, making it easier to write `FieldExtensions`.

### Patch Changes

- 74b216ee4e50: Add `PropsWithChildren` to usages of `ComponentType`, in preparation for React 18 where the children are no longer implicit.
- Updated dependencies
  - @backstage/errors@1.2.0-next.0
  - @backstage/core-components@0.13.2-next.1
  - @backstage/plugin-catalog-react@1.7.0-next.1
  - @backstage/catalog-model@1.4.0-next.0
  - @backstage/core-plugin-api@1.5.2-next.0
  - @backstage/catalog-client@1.4.2-next.1
  - @backstage/plugin-scaffolder-common@1.3.1-next.0
  - @backstage/theme@0.4.0-next.0
  - @backstage/types@1.0.2
  - @backstage/version-bridge@1.0.4

## 1.4.1-next.0

### Patch Changes

- 84a5c7724c7e: fixed refresh problem when backstage backend disconnects without any feedback to user. Now we send a generic message and try to reconnect after 15 seconds
- Updated dependencies
  - @backstage/catalog-client@1.4.2-next.0
  - @backstage/plugin-catalog-react@1.7.0-next.0
  - @backstage/theme@0.4.0-next.0
  - @backstage/core-components@0.13.2-next.0
  - @backstage/core-plugin-api@1.5.1
  - @backstage/catalog-model@1.3.0
  - @backstage/errors@1.1.5
  - @backstage/types@1.0.2
  - @backstage/version-bridge@1.0.4
  - @backstage/plugin-scaffolder-common@1.3.0

## 1.4.0

### Minor Changes

- 82e10a6939c: Add support for Markdown text blob outputs from templates

### Patch Changes

- ad1a1429de4: Improvements to the `scaffolder/next` buttons UX:

  - Added padding around the "Create" button in the `Stepper` component
  - Added a button bar that includes the "Cancel" and "Start Over" buttons to the `OngoingTask` component. The state of these buttons match their existing counter parts in the Context Menu
  - Added a "Show Button Bar"/"Hide Button Bar" item to the `ContextMenu` component

- Updated dependencies
  - @backstage/theme@0.3.0
  - @backstage/plugin-catalog-react@1.6.0
  - @backstage/plugin-scaffolder-common@1.3.0
  - @backstage/core-components@0.13.1
  - @backstage/catalog-client@1.4.1
  - @backstage/catalog-model@1.3.0
  - @backstage/core-plugin-api@1.5.1
  - @backstage/errors@1.1.5
  - @backstage/types@1.0.2
  - @backstage/version-bridge@1.0.4

## 1.4.0-next.2

### Minor Changes

- 82e10a6939c: Add support for Markdown text blob outputs from templates

### Patch Changes

- Updated dependencies
  - @backstage/theme@0.3.0-next.0
  - @backstage/plugin-scaffolder-common@1.3.0-next.0
  - @backstage/core-components@0.13.1-next.1
  - @backstage/plugin-catalog-react@1.6.0-next.2
  - @backstage/core-plugin-api@1.5.1

## 1.3.1-next.1

### Patch Changes

- Updated dependencies
  - @backstage/core-components@0.13.1-next.0
  - @backstage/core-plugin-api@1.5.1
  - @backstage/plugin-catalog-react@1.6.0-next.1

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
