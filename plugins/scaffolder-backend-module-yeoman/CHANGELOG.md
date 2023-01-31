# @backstage/plugin-scaffolder-backend-module-yeoman

## 0.2.15-next.1

### Patch Changes

- Updated dependencies
  - @backstage/config@1.0.6
  - @backstage/types@1.0.2
  - @backstage/plugin-scaffolder-node@0.1.0-next.1

## 0.2.15-next.0

### Patch Changes

- d72866f0cc: Internal refactor to use the new `@backstage/plugin-scaffolder-node` package for some functionality
- Updated dependencies
  - @backstage/plugin-scaffolder-node@0.1.0-next.0

## 0.2.13

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
  - @backstage/plugin-scaffolder-backend@1.10.0
  - @backstage/config@1.0.6
  - @backstage/types@1.0.2

## 0.2.13-next.2

### Patch Changes

- Updated dependencies
  - @backstage/plugin-scaffolder-backend@1.10.0-next.2
  - @backstage/config@1.0.6-next.0
  - @backstage/types@1.0.2

## 0.2.13-next.1

### Patch Changes

- Updated dependencies
  - @backstage/plugin-scaffolder-backend@1.10.0-next.1
  - @backstage/config@1.0.6-next.0
  - @backstage/types@1.0.2

## 0.2.13-next.0

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
  - @backstage/config@1.0.5
  - @backstage/types@1.0.2

## 0.2.12

### Patch Changes

- 935b66a646: Change step output template examples to use square bracket syntax.
- Updated dependencies
  - @backstage/plugin-scaffolder-backend@1.9.0
  - @backstage/types@1.0.2
  - @backstage/config@1.0.5

## 0.2.12-next.3

### Patch Changes

- 935b66a646: Change step output template examples to use square bracket syntax.
- Updated dependencies
  - @backstage/plugin-scaffolder-backend@1.9.0-next.3
  - @backstage/config@1.0.5-next.1
  - @backstage/types@1.0.2-next.1

## 0.2.12-next.2

### Patch Changes

- Updated dependencies
  - @backstage/plugin-scaffolder-backend@1.9.0-next.2
  - @backstage/config@1.0.5-next.1
  - @backstage/types@1.0.2-next.1

## 0.2.12-next.1

### Patch Changes

- Updated dependencies
  - @backstage/types@1.0.2-next.1
  - @backstage/plugin-scaffolder-backend@1.8.1-next.1
  - @backstage/config@1.0.5-next.1

## 0.2.12-next.0

### Patch Changes

- Updated dependencies
  - @backstage/plugin-scaffolder-backend@1.8.1-next.0
  - @backstage/types@1.0.2-next.0
  - @backstage/config@1.0.5-next.0

## 0.2.11

### Patch Changes

- Updated dependencies
  - @backstage/plugin-scaffolder-backend@1.8.0
  - @backstage/types@1.0.1
  - @backstage/config@1.0.4

## 0.2.11-next.2

### Patch Changes

- Updated dependencies
  - @backstage/plugin-scaffolder-backend@1.8.0-next.2
  - @backstage/config@1.0.4-next.0
  - @backstage/types@1.0.1-next.0

## 0.2.11-next.1

### Patch Changes

- Updated dependencies
  - @backstage/plugin-scaffolder-backend@1.8.0-next.1

## 0.2.11-next.0

### Patch Changes

- Updated dependencies
  - @backstage/plugin-scaffolder-backend@1.8.0-next.0
  - @backstage/types@1.0.1-next.0
  - @backstage/config@1.0.4-next.0

## 0.2.10

### Patch Changes

- Updated dependencies
  - @backstage/plugin-scaffolder-backend@1.7.0
  - @backstage/config@1.0.3
  - @backstage/types@1.0.0

## 0.2.10-next.2

### Patch Changes

- Updated dependencies
  - @backstage/plugin-scaffolder-backend@1.7.0-next.2
  - @backstage/config@1.0.3-next.2
  - @backstage/types@1.0.0

## 0.2.10-next.1

### Patch Changes

- Updated dependencies
  - @backstage/plugin-scaffolder-backend@1.7.0-next.1
  - @backstage/config@1.0.3-next.1
  - @backstage/types@1.0.0

## 0.2.10-next.0

### Patch Changes

- Updated dependencies
  - @backstage/plugin-scaffolder-backend@1.7.0-next.0
  - @backstage/config@1.0.3-next.0
  - @backstage/types@1.0.0

## 0.2.9

### Patch Changes

- 7d47def9c4: Removed dependency on `@types/jest`.
- Updated dependencies
  - @backstage/plugin-scaffolder-backend@1.6.0
  - @backstage/config@1.0.2

## 0.2.9-next.1

### Patch Changes

- 7d47def9c4: Removed dependency on `@types/jest`.
- Updated dependencies
  - @backstage/config@1.0.2-next.0
  - @backstage/plugin-scaffolder-backend@1.6.0-next.3

## 0.2.9-next.0

### Patch Changes

- Updated dependencies
  - @backstage/plugin-scaffolder-backend@1.6.0-next.0

## 0.2.8

### Patch Changes

- Updated dependencies
  - @backstage/plugin-scaffolder-backend@1.5.0

## 0.2.8-next.0

### Patch Changes

- Updated dependencies
  - @backstage/plugin-scaffolder-backend@1.5.0-next.0

## 0.2.7

### Patch Changes

- Updated dependencies
  - @backstage/plugin-scaffolder-backend@1.4.0

## 0.2.7-next.0

### Patch Changes

- Updated dependencies
  - @backstage/plugin-scaffolder-backend@1.4.0-next.0

## 0.2.6

### Patch Changes

- Updated dependencies
  - @backstage/plugin-scaffolder-backend@1.3.0

## 0.2.6-next.0

### Patch Changes

- Updated dependencies
  - @backstage/plugin-scaffolder-backend@1.3.0-next.0

## 0.2.5

### Patch Changes

- Updated dependencies
  - @backstage/plugin-scaffolder-backend@1.2.0
  - @backstage/config@1.0.1

## 0.2.5-next.1

### Patch Changes

- Updated dependencies
  - @backstage/plugin-scaffolder-backend@1.2.0-next.1
  - @backstage/config@1.0.1-next.0

## 0.2.5-next.0

### Patch Changes

- Updated dependencies
  - @backstage/plugin-scaffolder-backend@1.2.0-next.0

## 0.2.4

### Patch Changes

- Updated dependencies
  - @backstage/plugin-scaffolder-backend@1.1.0

## 0.2.4-next.1

### Patch Changes

- Updated dependencies
  - @backstage/plugin-scaffolder-backend@1.1.0-next.1

## 0.2.4-next.0

### Patch Changes

- Updated dependencies
  - @backstage/plugin-scaffolder-backend@1.0.1-next.0

## 0.2.3

### Patch Changes

- 89c7e47967: Minor README update
- Updated dependencies
  - @backstage/plugin-scaffolder-backend@1.0.0
  - @backstage/config@1.0.0
  - @backstage/types@1.0.0

## 0.2.2

### Patch Changes

- 8122e27717: Updating documentation for supporting `apiVersion: scaffolder.backstage.io/v1beta3`
- Updated dependencies
  - @backstage/plugin-scaffolder-backend@0.18.0

## 0.2.2-next.0

### Patch Changes

- 8122e27717: Updating documentation for supporting `apiVersion: scaffolder.backstage.io/v1beta3`
- Updated dependencies
  - @backstage/plugin-scaffolder-backend@0.18.0-next.0

## 0.2.1

### Patch Changes

- Updated dependencies
  - @backstage/plugin-scaffolder-backend@0.17.0

## 0.2.0

### Minor Changes

- 661594bf43: Updated to the latest version of `@backstage/plugin-scaffolder-backend`, meaning the `TemplateAction` now exposes the precise input type rather than `any`.

### Patch Changes

- c77c5c7eb6: Added `backstage.role` to `package.json`
- c82cd1b137: Bump `yeoman-environment` dependency from `^3.6.0` to `^3.9.1`.
- Updated dependencies
  - @backstage/plugin-scaffolder-backend@0.16.0
  - @backstage/config@0.1.14
  - @backstage/types@0.1.2

## 0.1.5

### Patch Changes

- Updated dependencies
  - @backstage/plugin-scaffolder-backend@0.15.24

## 0.1.5-next.0

### Patch Changes

- Updated dependencies
  - @backstage/plugin-scaffolder-backend@0.15.24-next.0

## 0.1.4

### Patch Changes

- Updated dependencies
  - @backstage/plugin-scaffolder-backend@0.15.23

## 0.1.4-next.0

### Patch Changes

- Updated dependencies
  - @backstage/plugin-scaffolder-backend@0.15.23-next.0

## 0.1.3

### Patch Changes

- Updated dependencies
  - @backstage/config@0.1.13
  - @backstage/plugin-scaffolder-backend@0.15.21

## 0.1.3-next.0

### Patch Changes

- Updated dependencies
  - @backstage/config@0.1.13-next.0
  - @backstage/plugin-scaffolder-backend@0.15.21-next.0

## 0.1.2

### Patch Changes

- 290fbb3ec2: Add missing API docs to scaffolder action plugins
- Updated dependencies
  - @backstage/plugin-scaffolder-backend@0.15.12

## 0.1.1

### Patch Changes

- 10615525f3: Switch to use the json and observable types from `@backstage/types`
- Updated dependencies
  - @backstage/config@0.1.11
  - @backstage/plugin-scaffolder-backend@0.15.11
