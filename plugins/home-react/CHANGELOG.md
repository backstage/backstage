# @backstage/plugin-home-react

## 0.1.32

### Patch Changes

- Updated dependencies
  - @backstage/frontend-plugin-api@0.13.0
  - @backstage/core-components@0.18.3
  - @backstage/core-plugin-api@1.12.0

## 0.1.32-next.0

### Patch Changes

- Updated dependencies
  - @backstage/core-plugin-api@1.11.2-next.0
  - @backstage/core-components@0.18.3-next.0
  - @backstage/frontend-plugin-api@0.12.2-next.0

## 0.1.31

### Patch Changes

- Updated dependencies
  - @backstage/core-components@0.18.2
  - @backstage/frontend-plugin-api@0.12.1
  - @backstage/core-plugin-api@1.11.1

## 0.1.31-next.1

### Patch Changes

- Updated dependencies
  - @backstage/core-components@0.18.2-next.1
  - @backstage/core-plugin-api@1.11.1-next.0
  - @backstage/frontend-plugin-api@0.12.1-next.1

## 0.1.31-next.0

### Patch Changes

- Updated dependencies
  - @backstage/core-components@0.18.2-next.0
  - @backstage/frontend-plugin-api@0.12.1-next.0
  - @backstage/core-plugin-api@1.11.0

## 0.1.30

### Patch Changes

- Updated dependencies
  - @backstage/frontend-plugin-api@0.12.0
  - @backstage/core-plugin-api@1.11.0
  - @backstage/core-components@0.18.0

## 0.1.30-next.0

### Patch Changes

- Updated dependencies
  - @backstage/frontend-plugin-api@0.11.1-next.0
  - @backstage/core-components@0.17.6-next.0

## 0.1.29

### Patch Changes

- Updated dependencies
  - @backstage/core-components@0.17.5
  - @backstage/frontend-plugin-api@0.11.0

## 0.1.29-next.0

### Patch Changes

- Updated dependencies
  - @backstage/frontend-plugin-api@0.11.0-next.0
  - @backstage/core-components@0.17.5-next.0
  - @backstage/core-plugin-api@1.10.9

## 0.1.28

### Patch Changes

- Updated dependencies
  - @backstage/core-components@0.17.4
  - @backstage/core-plugin-api@1.10.9
  - @backstage/frontend-plugin-api@0.10.4

## 0.1.28-next.1

### Patch Changes

- Updated dependencies
  - @backstage/core-components@0.17.4-next.1
  - @backstage/core-plugin-api@1.10.9-next.0
  - @backstage/frontend-plugin-api@0.10.4-next.1

## 0.1.28-next.0

### Patch Changes

- Updated dependencies
  - @backstage/core-components@0.17.4-next.0
  - @backstage/core-plugin-api@1.10.8
  - @backstage/frontend-plugin-api@0.10.4-next.0

## 0.1.27

### Patch Changes

- c83cd8b: Fixed some circular or otherwise unclear imports
- cef60db: Home plugin support i18n
- Updated dependencies
  - @backstage/core-components@0.17.3
  - @backstage/core-plugin-api@1.10.8
  - @backstage/frontend-plugin-api@0.10.3

## 0.1.27-next.0

### Patch Changes

- Updated dependencies
  - @backstage/core-components@0.17.3-next.0
  - @backstage/core-plugin-api@1.10.7

## 0.1.26

### Patch Changes

- 16eb4bf: Export ContentModal from `@backstage/plugin-home-react` so people can use this in other scenarios.
  Renamed `CatalogReactComponentsNameToClassKey` to `PluginHomeComponentsNameToClassKey` in `overridableComponents.ts`

  Made QuickStartCard `docsLinkTitle` prop more flexible to allow for any React.JSX.Element instead of just a string.
  Added QuickStartCard prop `additionalContent` which can eventually replace the prop `video`.

- Updated dependencies
  - @backstage/core-components@0.17.2
  - @backstage/core-plugin-api@1.10.7

## 0.1.26-next.2

### Patch Changes

- 16eb4bf: Export ContentModal from `@backstage/plugin-home-react` so people can use this in other scenarios.
  Renamed `CatalogReactComponentsNameToClassKey` to `PluginHomeComponentsNameToClassKey` in `overridableComponents.ts`

  Made QuickStartCard `docsLinkTitle` prop more flexible to allow for any React.JSX.Element instead of just a string.
  Added QuickStartCard prop `additionalContent` which can eventually replace the prop `video`.

- Updated dependencies
  - @backstage/core-components@0.17.2-next.1
  - @backstage/core-plugin-api@1.10.7-next.0

## 0.1.26-next.1

### Patch Changes

- Updated dependencies
  - @backstage/core-plugin-api@1.10.7-next.0
  - @backstage/core-components@0.17.2-next.1

## 0.1.26-next.0

### Patch Changes

- Updated dependencies
  - @backstage/core-components@0.17.2-next.0
  - @backstage/core-plugin-api@1.10.6

## 0.1.25

### Patch Changes

- a47fd39: Removes instances of default React imports, a necessary update for the upcoming React 19 migration.

  <https://legacy.reactjs.org/blog/2020/09/22/introducing-the-new-jsx-transform.html>

- 2e4cb15: Fixes auto-hiding of content divider when title not specified
- Updated dependencies
  - @backstage/core-components@0.17.1
  - @backstage/core-plugin-api@1.10.6

## 0.1.25-next.2

### Patch Changes

- a47fd39: Removes instances of default React imports, a necessary update for the upcoming React 19 migration.

  <https://legacy.reactjs.org/blog/2020/09/22/introducing-the-new-jsx-transform.html>

- Updated dependencies
  - @backstage/core-components@0.17.1-next.1
  - @backstage/core-plugin-api@1.10.6-next.0

## 0.1.25-next.1

### Patch Changes

- Updated dependencies
  - @backstage/core-components@0.17.1-next.0
  - @backstage/core-plugin-api@1.10.5

## 0.1.25-next.0

### Patch Changes

- 2e4cb15: Fixes auto-hiding of content divider when title not specified
- Updated dependencies
  - @backstage/core-components@0.17.0
  - @backstage/core-plugin-api@1.10.5

## 0.1.24

### Patch Changes

- c5a82fc: Don't render header divider on homepage cards if no title was specified.
- Updated dependencies
  - @backstage/core-components@0.17.0
  - @backstage/core-plugin-api@1.10.5

## 0.1.24-next.1

### Patch Changes

- Updated dependencies
  - @backstage/core-components@0.16.5-next.1
  - @backstage/core-plugin-api@1.10.4

## 0.1.24-next.0

### Patch Changes

- c5a82fc: Don't render header divider on homepage cards if no title was specified.
- Updated dependencies
  - @backstage/core-components@0.16.5-next.0
  - @backstage/core-plugin-api@1.10.4

## 0.1.23

### Patch Changes

- 58ec9e7: Removed older versions of React packages as a preparatory step for upgrading to React 19. This commit does not introduce any functional changes, but removes dependencies on previous React versions, allowing for a cleaner upgrade path in subsequent commits.
- Updated dependencies
  - @backstage/core-components@0.16.4
  - @backstage/core-plugin-api@1.10.4

## 0.1.23-next.1

### Patch Changes

- Updated dependencies
  - @backstage/core-components@0.16.4-next.1
  - @backstage/core-plugin-api@1.10.4-next.0

## 0.1.23-next.0

### Patch Changes

- 58ec9e7: Removed older versions of React packages as a preparatory step for upgrading to React 19. This commit does not introduce any functional changes, but removes dependencies on previous React versions, allowing for a cleaner upgrade path in subsequent commits.
- Updated dependencies
  - @backstage/core-components@0.16.4-next.0
  - @backstage/core-plugin-api@1.10.4-next.0

## 0.1.22

### Patch Changes

- d8f9079: Updated dependency `@rjsf/utils` to `5.23.2`.
  Updated dependency `@rjsf/core` to `5.23.2`.
  Updated dependency `@rjsf/material-ui` to `5.23.2`.
  Updated dependency `@rjsf/validator-ajv8` to `5.23.2`.
- Updated dependencies
  - @backstage/core-plugin-api@1.10.3
  - @backstage/core-components@0.16.3

## 0.1.22-next.1

### Patch Changes

- Updated dependencies
  - @backstage/core-plugin-api@1.10.3-next.0
  - @backstage/core-components@0.16.3-next.0

## 0.1.22-next.0

### Patch Changes

- d8f9079: Updated dependency `@rjsf/utils` to `5.23.2`.
  Updated dependency `@rjsf/core` to `5.23.2`.
  Updated dependency `@rjsf/material-ui` to `5.23.2`.
  Updated dependency `@rjsf/validator-ajv8` to `5.23.2`.

## 0.1.21

### Patch Changes

- 9951ba4: Updated dependency `@rjsf/utils` to `5.23.1`.
  Updated dependency `@rjsf/core` to `5.23.1`.
  Updated dependency `@rjsf/material-ui` to `5.23.1`.
  Updated dependency `@rjsf/validator-ajv8` to `5.23.1`.
- Updated dependencies
  - @backstage/core-components@0.16.2
  - @backstage/core-plugin-api@1.10.2

## 0.1.21-next.2

### Patch Changes

- Updated dependencies
  - @backstage/core-components@0.16.2-next.2
  - @backstage/core-plugin-api@1.10.2-next.0

## 0.1.21-next.1

### Patch Changes

- Updated dependencies
  - @backstage/core-components@0.16.2-next.1
  - @backstage/core-plugin-api@1.10.1

## 0.1.21-next.0

### Patch Changes

- 9951ba4: Updated dependency `@rjsf/utils` to `5.23.1`.
  Updated dependency `@rjsf/core` to `5.23.1`.
  Updated dependency `@rjsf/material-ui` to `5.23.1`.
  Updated dependency `@rjsf/validator-ajv8` to `5.23.1`.
- Updated dependencies
  - @backstage/core-components@0.16.2-next.0
  - @backstage/core-plugin-api@1.10.1

## 0.1.19

### Patch Changes

- Updated dependencies
  - @backstage/core-components@0.16.0
  - @backstage/core-plugin-api@1.10.1

## 0.1.19-next.2

### Patch Changes

- Updated dependencies
  - @backstage/core-components@0.16.0-next.2
  - @backstage/core-plugin-api@1.10.0

## 0.1.19-next.1

### Patch Changes

- Updated dependencies
  - @backstage/core-components@0.16.0-next.1
  - @backstage/core-plugin-api@1.10.0

## 0.1.19-next.0

### Patch Changes

- Updated dependencies
  - @backstage/core-components@0.16.0-next.0
  - @backstage/core-plugin-api@1.10.0

## 0.1.18

### Patch Changes

- e969dc7: Move `@types/react` to a peer dependency.
- e698470: Updated dependency `@rjsf/utils` to `5.21.2`.
  Updated dependency `@rjsf/core` to `5.21.2`.
  Updated dependency `@rjsf/material-ui` to `5.21.2`.
  Updated dependency `@rjsf/validator-ajv8` to `5.21.2`.
- Updated dependencies
  - @backstage/core-components@0.15.1
  - @backstage/core-plugin-api@1.10.0

## 0.1.18-next.2

### Patch Changes

- Updated dependencies
  - @backstage/core-components@0.15.1-next.2
  - @backstage/core-plugin-api@1.10.0-next.1

## 0.1.18-next.1

### Patch Changes

- e969dc7: Move `@types/react` to a peer dependency.
- Updated dependencies
  - @backstage/core-components@0.15.1-next.1
  - @backstage/core-plugin-api@1.10.0-next.1

## 0.1.18-next.0

### Patch Changes

- Updated dependencies
  - @backstage/core-components@0.15.1-next.0
  - @backstage/core-plugin-api@1.10.0-next.0

## 0.1.17

### Patch Changes

- 0a50d44: Updated dependency `@rjsf/utils` to `5.21.1`.
  Updated dependency `@rjsf/core` to `5.21.1`.
  Updated dependency `@rjsf/material-ui` to `5.21.1`.
  Updated dependency `@rjsf/validator-ajv8` to `5.21.1`.
- fa9d8da: Updated dependency `@rjsf/utils` to `5.20.1`.
  Updated dependency `@rjsf/core` to `5.20.1`.
  Updated dependency `@rjsf/material-ui` to `5.20.1`.
  Updated dependency `@rjsf/validator-ajv8` to `5.20.1`.
- Updated dependencies
  - @backstage/core-components@0.15.0
  - @backstage/core-plugin-api@1.9.4

## 0.1.17-next.1

### Patch Changes

- fa9d8da: Updated dependency `@rjsf/utils` to `5.20.1`.
  Updated dependency `@rjsf/core` to `5.20.1`.
  Updated dependency `@rjsf/material-ui` to `5.20.1`.
  Updated dependency `@rjsf/validator-ajv8` to `5.20.1`.
- Updated dependencies
  - @backstage/core-components@0.14.11-next.1
  - @backstage/core-plugin-api@1.9.4-next.0

## 0.1.17-next.0

### Patch Changes

- Updated dependencies
  - @backstage/core-components@0.14.11-next.0
  - @backstage/core-plugin-api@1.9.3

## 0.1.16

### Patch Changes

- Updated dependencies
  - @backstage/core-components@0.14.10
  - @backstage/core-plugin-api@1.9.3

## 0.1.16-next.0

### Patch Changes

- Updated dependencies
  - @backstage/core-components@0.14.10-next.0
  - @backstage/core-plugin-api@1.9.3

## 0.1.15

### Patch Changes

- cc81579: Updated dependency `@rjsf/utils` to `5.18.5`.
  Updated dependency `@rjsf/core` to `5.18.5`.
  Updated dependency `@rjsf/material-ui` to `5.18.5`.
  Updated dependency `@rjsf/validator-ajv8` to `5.18.5`.
- Updated dependencies
  - @backstage/core-components@0.14.9
  - @backstage/core-plugin-api@1.9.3

## 0.1.15-next.2

### Patch Changes

- Updated dependencies
  - @backstage/core-components@0.14.9-next.1

## 0.1.15-next.1

### Patch Changes

- cc81579: Updated dependency `@rjsf/utils` to `5.18.5`.
  Updated dependency `@rjsf/core` to `5.18.5`.
  Updated dependency `@rjsf/material-ui` to `5.18.5`.
  Updated dependency `@rjsf/validator-ajv8` to `5.18.5`.
- Updated dependencies
  - @backstage/core-components@0.14.9-next.0
  - @backstage/core-plugin-api@1.9.3

## 0.1.15-next.0

### Patch Changes

- Updated dependencies
  - @backstage/core-components@0.14.9-next.0
  - @backstage/core-plugin-api@1.9.3

## 0.1.14

### Patch Changes

- d44a20a: Added additional plugin metadata to `package.json`.
- 6cb4886: Updated dependency `@rjsf/utils` to `5.18.4`.
  Updated dependency `@rjsf/core` to `5.18.4`.
  Updated dependency `@rjsf/material-ui` to `5.18.4`.
  Updated dependency `@rjsf/validator-ajv8` to `5.18.4`.
- Updated dependencies
  - @backstage/core-components@0.14.8
  - @backstage/core-plugin-api@1.9.3

## 0.1.14-next.2

### Patch Changes

- d44a20a: Added additional plugin metadata to `package.json`.
- Updated dependencies
  - @backstage/core-components@0.14.8-next.2
  - @backstage/core-plugin-api@1.9.3-next.0

## 0.1.14-next.1

### Patch Changes

- Updated dependencies
  - @backstage/core-components@0.14.8-next.1
  - @backstage/core-plugin-api@1.9.3-next.0

## 0.1.14-next.0

### Patch Changes

- Updated dependencies
  - @backstage/core-components@0.14.8-next.0
  - @backstage/core-plugin-api@1.9.2

## 0.1.13

### Patch Changes

- 0040ec2: Updated dependency `@rjsf/utils` to `5.18.2`.
  Updated dependency `@rjsf/core` to `5.18.2`.
  Updated dependency `@rjsf/material-ui` to `5.18.2`.
  Updated dependency `@rjsf/validator-ajv8` to `5.18.2`.
- Updated dependencies
  - @backstage/core-components@0.14.7

## 0.1.13-next.1

### Patch Changes

- Updated dependencies
  - @backstage/core-components@0.14.6-next.1

## 0.1.13-next.0

### Patch Changes

- 0040ec2: Updated dependency `@rjsf/utils` to `5.18.2`.
  Updated dependency `@rjsf/core` to `5.18.2`.
  Updated dependency `@rjsf/material-ui` to `5.18.2`.
  Updated dependency `@rjsf/validator-ajv8` to `5.18.2`.
- Updated dependencies
  - @backstage/core-components@0.14.5-next.0
  - @backstage/core-plugin-api@1.9.2

## 0.1.12

### Patch Changes

- 293347f: Added ESLint rule `no-top-level-material-ui-4-imports` in the `home-react` plugin to migrate the Material UI imports.
- Updated dependencies
  - @backstage/core-components@0.14.4
  - @backstage/core-plugin-api@1.9.2

## 0.1.12-next.0

### Patch Changes

- Updated dependencies
  - @backstage/core-components@0.14.4-next.0
  - @backstage/core-plugin-api@1.9.1

## 0.1.11

### Patch Changes

- Updated dependencies
  - @backstage/core-components@0.14.3
  - @backstage/core-plugin-api@1.9.1

## 0.1.10

### Patch Changes

- Updated dependencies
  - @backstage/core-components@0.14.2
  - @backstage/core-plugin-api@1.9.1

## 0.1.9

### Patch Changes

- 0cecb09: Updated dependency `@rjsf/utils` to `5.17.1`.
  Updated dependency `@rjsf/core` to `5.17.1`.
  Updated dependency `@rjsf/material-ui` to `5.17.1`.
  Updated dependency `@rjsf/validator-ajv8` to `5.17.1`.
- Updated dependencies
  - @backstage/core-components@0.14.1
  - @backstage/core-plugin-api@1.9.1

## 0.1.9-next.2

### Patch Changes

- Updated dependencies
  - @backstage/core-components@0.14.1-next.2
  - @backstage/core-plugin-api@1.9.1-next.1

## 0.1.9-next.1

### Patch Changes

- Updated dependencies
  - @backstage/core-components@0.14.1-next.1
  - @backstage/core-plugin-api@1.9.1-next.1

## 0.1.9-next.0

### Patch Changes

- 0cecb09: Updated dependency `@rjsf/utils` to `5.17.1`.
  Updated dependency `@rjsf/core` to `5.17.1`.
  Updated dependency `@rjsf/material-ui` to `5.17.1`.
  Updated dependency `@rjsf/validator-ajv8` to `5.17.1`.
- Updated dependencies
  - @backstage/core-components@0.14.1-next.0
  - @backstage/core-plugin-api@1.9.1-next.0

## 0.1.8

### Patch Changes

- e6f0831: Updated dependency `@rjsf/utils` to `5.17.0`.
  Updated dependency `@rjsf/core` to `5.17.0`.
  Updated dependency `@rjsf/material-ui` to `5.17.0`.
  Updated dependency `@rjsf/validator-ajv8` to `5.17.0`.
- 6a74ffd: Updated dependency `@rjsf/utils` to `5.16.1`.
  Updated dependency `@rjsf/core` to `5.16.1`.
  Updated dependency `@rjsf/material-ui` to `5.16.1`.
  Updated dependency `@rjsf/validator-ajv8` to `5.16.1`.
- Updated dependencies
  - @backstage/core-components@0.14.0
  - @backstage/core-plugin-api@1.9.0

## 0.1.8-next.3

### Patch Changes

- e6f0831: Updated dependency `@rjsf/utils` to `5.17.0`.
  Updated dependency `@rjsf/core` to `5.17.0`.
  Updated dependency `@rjsf/material-ui` to `5.17.0`.
  Updated dependency `@rjsf/validator-ajv8` to `5.17.0`.
- Updated dependencies
  - @backstage/core-components@0.14.0-next.2
  - @backstage/core-plugin-api@1.9.0-next.1

## 0.1.8-next.2

### Patch Changes

- Updated dependencies
  - @backstage/core-components@0.14.0-next.1
  - @backstage/core-plugin-api@1.9.0-next.1

## 0.1.8-next.1

### Patch Changes

- Updated dependencies
  - @backstage/core-components@0.14.0-next.0
  - @backstage/core-plugin-api@1.8.3-next.0

## 0.1.8-next.0

### Patch Changes

- 6a74ffd: Updated dependency `@rjsf/utils` to `5.16.1`.
  Updated dependency `@rjsf/core` to `5.16.1`.
  Updated dependency `@rjsf/material-ui` to `5.16.1`.
  Updated dependency `@rjsf/validator-ajv8` to `5.16.1`.
- Updated dependencies
  - @backstage/core-components@0.13.10
  - @backstage/core-plugin-api@1.8.2

## 0.1.7

### Patch Changes

- 98ac5ab: Updated dependency `@rjsf/utils` to `5.15.1`.
  Updated dependency `@rjsf/core` to `5.15.1`.
  Updated dependency `@rjsf/material-ui` to `5.15.1`.
  Updated dependency `@rjsf/validator-ajv8` to `5.15.1`.
- 4016f21: Remove some unused dependencies
- Updated dependencies
  - @backstage/core-components@0.13.10
  - @backstage/core-plugin-api@1.8.2

## 0.1.7-next.2

### Patch Changes

- 98ac5ab: Updated dependency `@rjsf/utils` to `5.15.1`.
  Updated dependency `@rjsf/core` to `5.15.1`.
  Updated dependency `@rjsf/material-ui` to `5.15.1`.
  Updated dependency `@rjsf/validator-ajv8` to `5.15.1`.

## 0.1.7-next.1

### Patch Changes

- Updated dependencies
  - @backstage/core-plugin-api@1.8.2-next.0
  - @backstage/core-components@0.13.10-next.1

## 0.1.7-next.0

### Patch Changes

- 4016f21: Remove some unused dependencies
- Updated dependencies
  - @backstage/core-components@0.13.10-next.0
  - @backstage/core-plugin-api@1.8.1

## 0.1.6

### Patch Changes

- 2b72591: Updated dependency `@rjsf/utils` to `5.14.3`.
  Updated dependency `@rjsf/core` to `5.14.3`.
  Updated dependency `@rjsf/material-ui` to `5.14.3`.
  Updated dependency `@rjsf/validator-ajv8` to `5.14.3`.
- 6cd12f2: Updated dependency `@rjsf/utils` to `5.14.1`.
  Updated dependency `@rjsf/core` to `5.14.1`.
  Updated dependency `@rjsf/material-ui` to `5.14.1`.
  Updated dependency `@rjsf/validator-ajv8` to `5.14.1`.
- 64301d3: Updated dependency `@rjsf/utils` to `5.15.0`.
  Updated dependency `@rjsf/core` to `5.15.0`.
  Updated dependency `@rjsf/material-ui` to `5.15.0`.
  Updated dependency `@rjsf/validator-ajv8` to `5.15.0`.
- 63c494e: Updated dependency `@rjsf/utils` to `5.14.2`.
  Updated dependency `@rjsf/core` to `5.14.2`.
  Updated dependency `@rjsf/material-ui` to `5.14.2`.
  Updated dependency `@rjsf/validator-ajv8` to `5.14.2`.
- Updated dependencies
  - @backstage/core-plugin-api@1.8.1
  - @backstage/core-components@0.13.9

## 0.1.6-next.3

### Patch Changes

- 64301d3: Updated dependency `@rjsf/utils` to `5.15.0`.
  Updated dependency `@rjsf/core` to `5.15.0`.
  Updated dependency `@rjsf/material-ui` to `5.15.0`.
  Updated dependency `@rjsf/validator-ajv8` to `5.15.0`.
- Updated dependencies
  - @backstage/core-components@0.13.9-next.3
  - @backstage/core-plugin-api@1.8.1-next.1

## 0.1.6-next.2

### Patch Changes

- Updated dependencies
  - @backstage/core-components@0.13.9-next.2
  - @backstage/core-plugin-api@1.8.1-next.1

## 0.1.6-next.1

### Patch Changes

- 2b725913c1: Updated dependency `@rjsf/utils` to `5.14.3`.
  Updated dependency `@rjsf/core` to `5.14.3`.
  Updated dependency `@rjsf/material-ui` to `5.14.3`.
  Updated dependency `@rjsf/validator-ajv8` to `5.14.3`.
- Updated dependencies
  - @backstage/core-components@0.13.9-next.1
  - @backstage/core-plugin-api@1.8.1-next.1

## 0.1.6-next.0

### Patch Changes

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
  - @backstage/core-components@0.13.9-next.0

## 0.1.5

### Patch Changes

- 6c2b872153: Add official support for React 18.
- c838da0edd: Updated dependency `@rjsf/utils` to `5.13.6`.
  Updated dependency `@rjsf/core` to `5.13.6`.
  Updated dependency `@rjsf/material-ui` to `5.13.6`.
  Updated dependency `@rjsf/validator-ajv8` to `5.13.6`.
- 4aa43f62aa: Updated dependency `cross-fetch` to `^4.0.0`.
- Updated dependencies
  - @backstage/core-components@0.13.8
  - @backstage/core-plugin-api@1.8.0

## 0.1.5-next.2

### Patch Changes

- Updated dependencies
  - @backstage/core-components@0.13.8-next.2

## 0.1.5-next.1

### Patch Changes

- Updated dependencies
  - @backstage/core-components@0.13.8-next.1
  - @backstage/core-plugin-api@1.8.0-next.0

## 0.1.5-next.0

### Patch Changes

- 6c2b872153: Add official support for React 18.
- Updated dependencies
  - @backstage/core-components@0.13.7-next.0
  - @backstage/core-plugin-api@1.8.0-next.0

## 0.1.4

### Patch Changes

- 9a1fce352e: Updated dependency `@testing-library/jest-dom` to `^6.0.0`.
- f95af4e540: Updated dependency `@testing-library/dom` to `^9.0.0`.
- Updated dependencies
  - @backstage/core-plugin-api@1.7.0
  - @backstage/core-components@0.13.6

## 0.1.4-next.2

### Patch Changes

- Updated dependencies
  - @backstage/core-components@0.13.6-next.2
  - @backstage/core-plugin-api@1.7.0-next.1

## 0.1.4-next.1

### Patch Changes

- Updated dependencies
  - @backstage/core-components@0.13.6-next.1
  - @backstage/core-plugin-api@1.7.0-next.0

## 0.1.4-next.0

### Patch Changes

- Updated dependencies
  - @backstage/core-plugin-api@1.7.0-next.0
  - @backstage/core-components@0.13.6-next.0

## 0.1.3

### Patch Changes

- 482bb5c0bbf8: Moved `@types/react` to be a regular dependency
- 406b786a2a2c: Mark package as being free of side effects, allowing more optimized Webpack builds.
- 8cec7664e146: Removed `@types/node` dependency
- b16c341ced45: Updated dependency `@rjsf/utils` to `5.13.0`.
  Updated dependency `@rjsf/core-v5` to `npm:@rjsf/core@5.13.0`.
  Updated dependency `@rjsf/material-ui-v5` to `npm:@rjsf/material-ui@5.13.0`.
  Updated dependency `@rjsf/validator-ajv8` to `5.13.0`.
- Updated dependencies
  - @backstage/core-components@0.13.5
  - @backstage/core-plugin-api@1.6.0

## 0.1.3-next.3

### Patch Changes

- 406b786a2a2c: Mark package as being free of side effects, allowing more optimized Webpack builds.
- b16c341ced45: Updated dependency `@rjsf/utils` to `5.13.0`.
  Updated dependency `@rjsf/core-v5` to `npm:@rjsf/core@5.13.0`.
  Updated dependency `@rjsf/material-ui-v5` to `npm:@rjsf/material-ui@5.13.0`.
  Updated dependency `@rjsf/validator-ajv8` to `5.13.0`.
- Updated dependencies
  - @backstage/core-components@0.13.5-next.3
  - @backstage/core-plugin-api@1.6.0-next.3

## 0.1.3-next.2

### Patch Changes

- 8cec7664e146: Removed `@types/node` dependency
- Updated dependencies
  - @backstage/core-components@0.13.5-next.2
  - @backstage/core-plugin-api@1.6.0-next.2

## 0.1.3-next.1

### Patch Changes

- Updated dependencies
  - @backstage/core-components@0.13.5-next.1
  - @backstage/core-plugin-api@1.6.0-next.1

## 0.1.3-next.0

### Patch Changes

- 482bb5c0bbf8: Moved `@types/react` to be a regular dependency
- Updated dependencies
  - @backstage/core-plugin-api@1.6.0-next.0
  - @backstage/core-components@0.13.5-next.0

## 0.1.2

### Patch Changes

- bf67dce73174: Make `title` optional when defining the `createCardExtension`
- Updated dependencies
  - @backstage/core-components@0.13.4
  - @backstage/core-plugin-api@1.5.3

## 0.1.2-next.0

### Patch Changes

- bf67dce73174: Make `title` optional when defining the `createCardExtension`
- Updated dependencies
  - @backstage/core-components@0.13.4-next.0
  - @backstage/core-plugin-api@1.5.3

## 0.1.1

### Patch Changes

- 0b89ca8ce24a: Add possibility to customize the settings widget for different
  properties by using the `uiSchema` provided by the json-schema.
  More information here: https://rjsf-team.github.io/react-jsonschema-form/docs/api-reference/uiSchema
- Updated dependencies
  - @backstage/core-components@0.13.3
  - @backstage/core-plugin-api@1.5.3

## 0.1.1-next.2

### Patch Changes

- 0b89ca8ce24a: Add possibility to customize the settings widget for different
  properties by using the `uiSchema` provided by the json-schema.
  More information here: https://rjsf-team.github.io/react-jsonschema-form/docs/api-reference/uiSchema
- Updated dependencies
  - @backstage/core-plugin-api@1.5.3-next.1
  - @backstage/core-components@0.13.3-next.2

## 0.1.1-next.1

### Patch Changes

- Updated dependencies
  - @backstage/core-components@0.13.3-next.1
  - @backstage/core-plugin-api@1.5.3-next.0

## 0.1.1-next.0

### Patch Changes

- Updated dependencies
  - @backstage/core-components@0.13.3-next.0
  - @backstage/core-plugin-api@1.5.2

## 0.1.0

### Minor Changes

- 41e8037a8a6d: Extract new plugin-home-react package and deprecate createCardExtension in plugin-home

### Patch Changes

- 2ff94da135a4: bump `rjsf` dependencies to 5.7.3
- Updated dependencies
  - @backstage/core-plugin-api@1.5.2
  - @backstage/core-components@0.13.2

## 0.1.0-next.3

### Patch Changes

- Updated dependencies
  - @backstage/core-components@0.13.2-next.3
  - @backstage/core-plugin-api@1.5.2-next.0

## 0.1.0-next.2

### Patch Changes

- 2ff94da135a4: bump `rjsf` dependencies to 5.7.3
- Updated dependencies
  - @backstage/core-components@0.13.2-next.2
  - @backstage/core-plugin-api@1.5.2-next.0

## 0.1.0-next.1

### Patch Changes

- Updated dependencies
  - @backstage/core-components@0.13.2-next.1
  - @backstage/core-plugin-api@1.5.2-next.0

## 0.1.0-next.0

### Minor Changes

- 41e8037a8a6d: Extract new plugin-home-react package and deprecate createCardExtension in plugin-home

### Patch Changes

- Updated dependencies
  - @backstage/core-components@0.13.2-next.0
  - @backstage/core-plugin-api@1.5.1
