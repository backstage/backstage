# @backstage/plugin-scaffolder-backend-module-rails

## 0.4.10-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.18.2-next.1
  - @backstage/plugin-scaffolder-backend@1.11.0-next.1
  - @backstage/config@1.0.6
  - @backstage/errors@1.1.4
  - @backstage/integration@1.4.2
  - @backstage/types@1.0.2
  - @backstage/plugin-scaffolder-node@0.1.0-next.1

## 0.4.10-next.0

### Patch Changes

- d72866f0cc: Internal refactor to use the new `@backstage/plugin-scaffolder-node` package for some functionality
- Updated dependencies
  - @backstage/plugin-scaffolder-node@0.1.0-next.0
  - @backstage/plugin-scaffolder-backend@1.11.0-next.0
  - @backstage/backend-common@0.18.2-next.0

## 0.4.8

### Patch Changes

- 268b8634f9: handle skipActiveRecord rails new argument
- 2fadff2a25: Change scaffolder task actions to include markdown to demonstrate the new `ActionsPage` markdown feature.
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

- Updated dependencies
  - @backstage/plugin-scaffolder-backend@1.10.0
  - @backstage/backend-common@0.18.0
  - @backstage/config@1.0.6
  - @backstage/errors@1.1.4
  - @backstage/integration@1.4.2
  - @backstage/types@1.0.2

## 0.4.8-next.2

### Patch Changes

- 2fadff2a25: Change scaffolder task actions to include markdown to demonstrate the new `ActionsPage` markdown feature.
- Updated dependencies
  - @backstage/backend-common@0.18.0-next.1
  - @backstage/plugin-scaffolder-backend@1.10.0-next.2
  - @backstage/config@1.0.6-next.0
  - @backstage/errors@1.1.4
  - @backstage/integration@1.4.2-next.0
  - @backstage/types@1.0.2

## 0.4.8-next.1

### Patch Changes

- Updated dependencies
  - @backstage/plugin-scaffolder-backend@1.10.0-next.1
  - @backstage/backend-common@0.18.0-next.0
  - @backstage/config@1.0.6-next.0
  - @backstage/errors@1.1.4
  - @backstage/integration@1.4.2-next.0
  - @backstage/types@1.0.2

## 0.4.8-next.0

### Patch Changes

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

- Updated dependencies
  - @backstage/plugin-scaffolder-backend@1.9.1-next.0
  - @backstage/backend-common@0.17.0
  - @backstage/config@1.0.5
  - @backstage/errors@1.1.4
  - @backstage/integration@1.4.1
  - @backstage/types@1.0.2

## 0.4.7

### Patch Changes

- 935b66a646: Change step output template examples to use square bracket syntax.
- 27b23a86ad: Added more (optional) arguments to the `createFetchRailsAction` to be passed to `rails new`
- Updated dependencies
  - @backstage/plugin-scaffolder-backend@1.9.0
  - @backstage/backend-common@0.17.0
  - @backstage/errors@1.1.4
  - @backstage/integration@1.4.1
  - @backstage/types@1.0.2
  - @backstage/config@1.0.5

## 0.4.7-next.3

### Patch Changes

- 935b66a646: Change step output template examples to use square bracket syntax.
- Updated dependencies
  - @backstage/plugin-scaffolder-backend@1.9.0-next.3
  - @backstage/backend-common@0.17.0-next.3
  - @backstage/config@1.0.5-next.1
  - @backstage/errors@1.1.4-next.1
  - @backstage/integration@1.4.1-next.1
  - @backstage/types@1.0.2-next.1

## 0.4.7-next.2

### Patch Changes

- Updated dependencies
  - @backstage/plugin-scaffolder-backend@1.9.0-next.2
  - @backstage/backend-common@0.17.0-next.2
  - @backstage/config@1.0.5-next.1
  - @backstage/errors@1.1.4-next.1
  - @backstage/integration@1.4.1-next.1
  - @backstage/types@1.0.2-next.1

## 0.4.7-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.17.0-next.1
  - @backstage/types@1.0.2-next.1
  - @backstage/plugin-scaffolder-backend@1.8.1-next.1
  - @backstage/config@1.0.5-next.1
  - @backstage/integration@1.4.1-next.1
  - @backstage/errors@1.1.4-next.1

## 0.4.7-next.0

### Patch Changes

- Updated dependencies
  - @backstage/plugin-scaffolder-backend@1.8.1-next.0
  - @backstage/backend-common@0.16.1-next.0
  - @backstage/integration@1.4.1-next.0
  - @backstage/types@1.0.2-next.0
  - @backstage/config@1.0.5-next.0
  - @backstage/errors@1.1.4-next.0

## 0.4.6

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.16.0
  - @backstage/plugin-scaffolder-backend@1.8.0
  - @backstage/integration@1.4.0
  - @backstage/types@1.0.1
  - @backstage/config@1.0.4
  - @backstage/errors@1.1.3

## 0.4.6-next.2

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.16.0-next.1
  - @backstage/plugin-scaffolder-backend@1.8.0-next.2
  - @backstage/config@1.0.4-next.0
  - @backstage/errors@1.1.3-next.0
  - @backstage/integration@1.4.0-next.0
  - @backstage/types@1.0.1-next.0

## 0.4.6-next.1

### Patch Changes

- Updated dependencies
  - @backstage/plugin-scaffolder-backend@1.8.0-next.1

## 0.4.6-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.16.0-next.0
  - @backstage/plugin-scaffolder-backend@1.8.0-next.0
  - @backstage/integration@1.4.0-next.0
  - @backstage/types@1.0.1-next.0
  - @backstage/config@1.0.4-next.0
  - @backstage/errors@1.1.3-next.0

## 0.4.5

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.15.2
  - @backstage/plugin-scaffolder-backend@1.7.0
  - @backstage/config@1.0.3
  - @backstage/errors@1.1.2
  - @backstage/integration@1.3.2
  - @backstage/types@1.0.0

## 0.4.5-next.2

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.15.2-next.2
  - @backstage/plugin-scaffolder-backend@1.7.0-next.2
  - @backstage/config@1.0.3-next.2
  - @backstage/errors@1.1.2-next.2
  - @backstage/integration@1.3.2-next.2
  - @backstage/types@1.0.0

## 0.4.5-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.15.2-next.1
  - @backstage/plugin-scaffolder-backend@1.7.0-next.1
  - @backstage/config@1.0.3-next.1
  - @backstage/errors@1.1.2-next.1
  - @backstage/integration@1.3.2-next.1
  - @backstage/types@1.0.0

## 0.4.5-next.0

### Patch Changes

- Updated dependencies
  - @backstage/plugin-scaffolder-backend@1.7.0-next.0
  - @backstage/backend-common@0.15.2-next.0
  - @backstage/config@1.0.3-next.0
  - @backstage/errors@1.1.2-next.0
  - @backstage/integration@1.3.2-next.0
  - @backstage/types@1.0.0

## 0.4.4

### Patch Changes

- 7d47def9c4: Removed dependency on `@types/jest`.
- Updated dependencies
  - @backstage/backend-common@0.15.1
  - @backstage/plugin-scaffolder-backend@1.6.0
  - @backstage/integration@1.3.1
  - @backstage/config@1.0.2
  - @backstage/errors@1.1.1

## 0.4.4-next.1

### Patch Changes

- 7d47def9c4: Removed dependency on `@types/jest`.
- Updated dependencies
  - @backstage/config@1.0.2-next.0
  - @backstage/errors@1.1.1-next.0
  - @backstage/integration@1.3.1-next.2
  - @backstage/backend-common@0.15.1-next.3
  - @backstage/plugin-scaffolder-backend@1.6.0-next.3

## 0.4.4-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.15.1-next.0
  - @backstage/plugin-scaffolder-backend@1.6.0-next.0
  - @backstage/integration@1.3.1-next.0

## 0.4.3

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.15.0
  - @backstage/integration@1.3.0
  - @backstage/plugin-scaffolder-backend@1.5.0

## 0.4.3-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.15.0-next.0
  - @backstage/integration@1.3.0-next.0
  - @backstage/plugin-scaffolder-backend@1.5.0-next.0

## 0.4.2

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.14.1
  - @backstage/plugin-scaffolder-backend@1.4.0
  - @backstage/integration@1.2.2
  - @backstage/errors@1.1.0

## 0.4.2-next.1

### Patch Changes

- Updated dependencies
  - @backstage/plugin-scaffolder-backend@1.4.0-next.1
  - @backstage/backend-common@0.14.1-next.1
  - @backstage/errors@1.1.0-next.0
  - @backstage/integration@1.2.2-next.1

## 0.4.2-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.14.1-next.0
  - @backstage/plugin-scaffolder-backend@1.4.0-next.0
  - @backstage/integration@1.2.2-next.0

## 0.4.1

### Patch Changes

- Updated dependencies
  - @backstage/plugin-scaffolder-backend@1.3.0
  - @backstage/backend-common@0.14.0
  - @backstage/integration@1.2.1

## 0.4.1-next.1

### Patch Changes

- Updated dependencies
  - @backstage/plugin-scaffolder-backend@1.3.0-next.2
  - @backstage/backend-common@0.14.0-next.2
  - @backstage/integration@1.2.1-next.2

## 0.4.1-next.0

### Patch Changes

- Updated dependencies
  - @backstage/plugin-scaffolder-backend@1.3.0-next.0
  - @backstage/backend-common@0.13.6-next.0
  - @backstage/integration@1.2.1-next.0

## 0.4.0

### Minor Changes

- 3d001a3bcf: **BREAKING**: Added a new `allowedImageNames` option, which needs to list any image name for it to be allowed as `imageName` input.

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.13.3
  - @backstage/plugin-scaffolder-backend@1.2.0
  - @backstage/integration@1.2.0
  - @backstage/config@1.0.1

## 0.4.0-next.1

### Minor Changes

- 3d001a3bcf: **BREAKING**: Added a new `allowedImageNames` option, which needs to list any image name for it to be allowed as `imageName` input.

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.13.3-next.2
  - @backstage/plugin-scaffolder-backend@1.2.0-next.1
  - @backstage/config@1.0.1-next.0
  - @backstage/integration@1.2.0-next.1

## 0.3.7-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.13.3-next.0
  - @backstage/plugin-scaffolder-backend@1.2.0-next.0
  - @backstage/integration@1.2.0-next.0

## 0.3.6

### Patch Changes

- 230ad0826f: Bump to using `@types/node` v16
- Updated dependencies
  - @backstage/plugin-scaffolder-backend@1.1.0
  - @backstage/integration@1.1.0
  - @backstage/backend-common@0.13.2

## 0.3.6-next.2

### Patch Changes

- 230ad0826f: Bump to using `@types/node` v16
- Updated dependencies
  - @backstage/backend-common@0.13.2-next.2
  - @backstage/integration@1.1.0-next.2

## 0.3.6-next.1

### Patch Changes

- Updated dependencies
  - @backstage/plugin-scaffolder-backend@1.1.0-next.1
  - @backstage/integration@1.1.0-next.1
  - @backstage/backend-common@0.13.2-next.1

## 0.3.6-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.13.2-next.0
  - @backstage/integration@1.0.1-next.0
  - @backstage/plugin-scaffolder-backend@1.0.1-next.0

## 0.3.5

### Patch Changes

- 89c7e47967: Minor README update
- Updated dependencies
  - @backstage/plugin-scaffolder-backend@1.0.0
  - @backstage/backend-common@0.13.1
  - @backstage/integration@1.0.0
  - @backstage/config@1.0.0
  - @backstage/errors@1.0.0
  - @backstage/types@1.0.0

## 0.3.4

### Patch Changes

- 8122e27717: Updating documentation for supporting `apiVersion: scaffolder.backstage.io/v1beta3`
- e0a69ba49f: build(deps): bump `fs-extra` from 9.1.0 to 10.0.1
- Updated dependencies
  - @backstage/backend-common@0.13.0
  - @backstage/plugin-scaffolder-backend@0.18.0

## 0.3.4-next.0

### Patch Changes

- 8122e27717: Updating documentation for supporting `apiVersion: scaffolder.backstage.io/v1beta3`
- e0a69ba49f: build(deps): bump `fs-extra` from 9.1.0 to 10.0.1
- Updated dependencies
  - @backstage/backend-common@0.13.0-next.0
  - @backstage/plugin-scaffolder-backend@0.18.0-next.0

## 0.3.3

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.12.0
  - @backstage/plugin-scaffolder-backend@0.17.3
  - @backstage/integration@0.8.0

## 0.3.2

### Patch Changes

- 0f37cdef19: Migrated over from the deprecated `spec.metadata` to `spec.templateInfo` for the `name` and the `baseUrl` of the template.
- Updated dependencies
  - @backstage/backend-common@0.11.0
  - @backstage/plugin-scaffolder-backend@0.17.0
  - @backstage/integration@0.7.5

## 0.3.1

### Patch Changes

- Fix for the previous release with missing type declarations.
- Updated dependencies
  - @backstage/backend-common@0.10.9
  - @backstage/config@0.1.15
  - @backstage/errors@0.2.2
  - @backstage/integration@0.7.4
  - @backstage/types@0.1.3
  - @backstage/plugin-scaffolder-backend@0.16.1

## 0.3.0

### Minor Changes

- 661594bf43: Updated to the latest version of `@backstage/plugin-scaffolder-backend`, meaning the `TemplateAction` now exposes the precise input type rather than `any`.

### Patch Changes

- c77c5c7eb6: Added `backstage.role` to `package.json`
- Updated dependencies
  - @backstage/backend-common@0.10.8
  - @backstage/errors@0.2.1
  - @backstage/integration@0.7.3
  - @backstage/plugin-scaffolder-backend@0.16.0
  - @backstage/config@0.1.14
  - @backstage/types@0.1.2

## 0.2.6

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.10.7
  - @backstage/plugin-scaffolder-backend@0.15.24

## 0.2.6-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.10.7-next.0
  - @backstage/plugin-scaffolder-backend@0.15.24-next.0

## 0.2.5

### Patch Changes

- Updated dependencies
  - @backstage/plugin-scaffolder-backend@0.15.23
  - @backstage/backend-common@0.10.6

## 0.2.5-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.10.6-next.0
  - @backstage/plugin-scaffolder-backend@0.15.23-next.1

## 0.2.5-next.0

### Patch Changes

- Updated dependencies
  - @backstage/plugin-scaffolder-backend@0.15.23-next.0

## 0.2.4

### Patch Changes

- Updated dependencies
  - @backstage/integration@0.7.2
  - @backstage/backend-common@0.10.4
  - @backstage/config@0.1.13
  - @backstage/plugin-scaffolder-backend@0.15.21

## 0.2.4-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.10.4-next.0
  - @backstage/config@0.1.13-next.0
  - @backstage/plugin-scaffolder-backend@0.15.21-next.0
  - @backstage/integration@0.7.2-next.0

## 0.2.3

### Patch Changes

- Updated dependencies
  - @backstage/config@0.1.12
  - @backstage/plugin-scaffolder-backend@0.15.20
  - @backstage/integration@0.7.1
  - @backstage/backend-common@0.10.3
  - @backstage/errors@0.2.0

## 0.2.2

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.10.1
  - @backstage/plugin-scaffolder-backend@0.15.19
  - @backstage/integration@0.7.0

## 0.2.1

### Patch Changes

- fc8fc02510: Add new options to rails new (force and skipTests)
- Updated dependencies
  - @backstage/backend-common@0.10.0
  - @backstage/plugin-scaffolder-backend@0.15.18

## 0.2.0

### Minor Changes

- 64db0efffe: update publish format from ESM to CJS

### Patch Changes

- Updated dependencies
  - @backstage/plugin-scaffolder-backend@0.15.16
  - @backstage/backend-common@0.9.13

## 0.1.7

### Patch Changes

- 290fbb3ec2: Add missing API docs to scaffolder action plugins
- Updated dependencies
  - @backstage/backend-common@0.9.9
  - @backstage/plugin-scaffolder-backend@0.15.12

## 0.1.6

### Patch Changes

- 10615525f3: Switch to use the json and observable types from `@backstage/types`
- Updated dependencies
  - @backstage/config@0.1.11
  - @backstage/errors@0.1.4
  - @backstage/integration@0.6.9
  - @backstage/backend-common@0.9.8
  - @backstage/plugin-scaffolder-backend@0.15.11

## 0.1.5

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.9.0
  - @backstage/plugin-scaffolder-backend@0.15.2
  - @backstage/integration@0.6.2
  - @backstage/config@0.1.8

## 0.1.4

### Patch Changes

- Updated dependencies
  - @backstage/integration@0.6.0
  - @backstage/plugin-scaffolder-backend@0.15.0
  - @backstage/backend-common@0.8.9

## 0.1.3

### Patch Changes

- e114cc7e0: updated paths to consider differences between platform (windows corrected)
- Updated dependencies
  - @backstage/backend-common@0.8.6
  - @backstage/plugin-scaffolder-backend@0.14.0

## 0.1.2

### Patch Changes

- Updated dependencies
  - @backstage/integration@0.5.8
  - @backstage/plugin-scaffolder-backend@0.13.0
  - @backstage/backend-common@0.8.5
