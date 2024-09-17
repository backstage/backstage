# @backstage/plugin-scaffolder-backend-module-yeoman

## 0.4.0-next.2

### Patch Changes

- 5d1670f: Update README installation instructions
- Updated dependencies
  - @backstage/backend-plugin-api@1.0.0-next.2
  - @backstage/types@1.1.1
  - @backstage/plugin-scaffolder-node@0.4.11-next.2
  - @backstage/plugin-scaffolder-node-test-utils@0.1.12-next.2

## 0.4.0-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@0.9.0-next.1
  - @backstage/types@1.1.1
  - @backstage/plugin-scaffolder-node@0.4.11-next.1
  - @backstage/plugin-scaffolder-node-test-utils@0.1.12-next.1

## 0.4.0-next.0

### Minor Changes

- d425fc4: **BREAKING**: The return values from `createBackendPlugin`, `createBackendModule`, and `createServiceFactory` are now simply `BackendFeature` and `ServiceFactory`, instead of the previously deprecated form of a function that returns them. For this reason, `createServiceFactory` also no longer accepts the callback form where you provide direct options to the service. This also affects all `coreServices.*` service refs.

  This may in particular affect tests; if you were effectively doing `createBackendModule({...})()` (note the parentheses), you can now remove those extra parentheses at the end. You may encounter cases of this in your `packages/backend/src/index.ts` too, where you add plugins, modules, and services. If you were using `createServiceFactory` with a function as its argument for the purpose of passing in options, this pattern has been deprecated for a while and is no longer supported. You may want to explore the new multiton patterns to achieve your goals, or moving settings to app-config.

  As part of this change, the `IdentityFactoryOptions` type was removed, and can no longer be used to tweak that service. The identity service was also deprecated some time ago, and you will want to [migrate to the new auth system](https://backstage.io/docs/tutorials/auth-service-migration) if you still rely on it.

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@0.9.0-next.0
  - @backstage/plugin-scaffolder-node@0.4.11-next.0
  - @backstage/types@1.1.1
  - @backstage/plugin-scaffolder-node-test-utils@0.1.12-next.0

## 0.3.7

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@0.8.0
  - @backstage/plugin-scaffolder-node@0.4.9
  - @backstage/types@1.1.1
  - @backstage/plugin-scaffolder-node-test-utils@0.1.10

## 0.3.7-next.3

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@0.8.0-next.3
  - @backstage/types@1.1.1
  - @backstage/plugin-scaffolder-node@0.4.9-next.3
  - @backstage/plugin-scaffolder-node-test-utils@0.1.10-next.3

## 0.3.7-next.2

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@0.8.0-next.2
  - @backstage/plugin-scaffolder-node@0.4.9-next.2
  - @backstage/plugin-scaffolder-node-test-utils@0.1.10-next.2
  - @backstage/types@1.1.1

## 0.3.7-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@0.7.1-next.1
  - @backstage/types@1.1.1
  - @backstage/plugin-scaffolder-node@0.4.9-next.1
  - @backstage/plugin-scaffolder-node-test-utils@0.1.10-next.1

## 0.3.7-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@0.7.1-next.0
  - @backstage/types@1.1.1
  - @backstage/plugin-scaffolder-node@0.4.9-next.0
  - @backstage/plugin-scaffolder-node-test-utils@0.1.10-next.0

## 0.3.6

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@0.7.0
  - @backstage/plugin-scaffolder-node@0.4.8
  - @backstage/plugin-scaffolder-node-test-utils@0.1.9
  - @backstage/types@1.1.1

## 0.3.6-next.1

### Patch Changes

- Updated dependencies
  - @backstage/plugin-scaffolder-node-test-utils@0.1.9-next.1
  - @backstage/backend-plugin-api@0.6.22-next.1
  - @backstage/types@1.1.1
  - @backstage/plugin-scaffolder-node@0.4.8-next.1

## 0.3.5-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@0.6.21-next.0
  - @backstage/plugin-scaffolder-node@0.4.7-next.0
  - @backstage/plugin-scaffolder-node-test-utils@0.1.8-next.0
  - @backstage/types@1.1.1

## 0.3.2

### Patch Changes

- 78a0b08: Internal refactor to handle `BackendFeature` contract change.
- d44a20a: Added additional plugin metadata to `package.json`.
- Updated dependencies
  - @backstage/backend-plugin-api@0.6.19
  - @backstage/plugin-scaffolder-node-test-utils@0.1.5
  - @backstage/plugin-scaffolder-node@0.4.5
  - @backstage/types@1.1.1

## 0.3.2-next.2

### Patch Changes

- d44a20a: Added additional plugin metadata to `package.json`.
- Updated dependencies
  - @backstage/backend-plugin-api@0.6.19-next.3
  - @backstage/plugin-scaffolder-node-test-utils@0.1.5-next.3
  - @backstage/plugin-scaffolder-node@0.4.5-next.3
  - @backstage/types@1.1.1

## 0.3.2-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@0.6.19-next.2
  - @backstage/plugin-scaffolder-node@0.4.5-next.2
  - @backstage/plugin-scaffolder-node-test-utils@0.1.5-next.2
  - @backstage/types@1.1.1

## 0.3.2-next.0

### Patch Changes

- Updated dependencies
  - @backstage/plugin-scaffolder-node-test-utils@0.1.5-next.0
  - @backstage/backend-plugin-api@0.6.19-next.0
  - @backstage/plugin-scaffolder-node@0.4.5-next.0
  - @backstage/types@1.1.1

## 0.3.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@0.6.18
  - @backstage/plugin-scaffolder-node@0.4.4
  - @backstage/plugin-scaffolder-node-test-utils@0.1.4

## 0.3.1-next.1

### Patch Changes

- Updated dependencies
  - @backstage/plugin-scaffolder-node@0.4.4-next.1
  - @backstage/plugin-scaffolder-node-test-utils@0.1.4-next.1
  - @backstage/backend-plugin-api@0.6.18-next.1

## 0.3.1-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@0.6.18-next.0
  - @backstage/plugin-scaffolder-node@0.4.4-next.0
  - @backstage/types@1.1.1
  - @backstage/plugin-scaffolder-node-test-utils@0.1.4-next.0

## 0.3.0

### Minor Changes

- fae9638: Add examples for `run:yeoman` scaffolder action.

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@0.6.17
  - @backstage/plugin-scaffolder-node@0.4.3
  - @backstage/plugin-scaffolder-node-test-utils@0.1.3
  - @backstage/types@1.1.1

## 0.2.38-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@0.6.17-next.1
  - @backstage/plugin-scaffolder-node@0.4.3-next.1
  - @backstage/plugin-scaffolder-node-test-utils@0.1.3-next.1
  - @backstage/types@1.1.1

## 0.2.38-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@0.6.17-next.0
  - @backstage/types@1.1.1
  - @backstage/plugin-scaffolder-node@0.4.3-next.0
  - @backstage/plugin-scaffolder-node-test-utils@0.1.3-next.0

## 0.2.37

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@0.6.16
  - @backstage/plugin-scaffolder-node@0.4.2
  - @backstage/plugin-scaffolder-node-test-utils@0.1.2
  - @backstage/types@1.1.1

## 0.2.36

### Patch Changes

- Updated dependencies
  - @backstage/plugin-scaffolder-node@0.4.1
  - @backstage/plugin-scaffolder-node-test-utils@0.1.1
  - @backstage/backend-plugin-api@0.6.15
  - @backstage/types@1.1.1

## 0.2.35

### Patch Changes

- f44589d: Introduced `createMockActionContext` to unify the way of creating scaffolder mock context.

  It will help to maintain tests in a long run during structural changes of action context.

- Updated dependencies
  - @backstage/plugin-scaffolder-node@0.4.0
  - @backstage/plugin-scaffolder-node-test-utils@0.1.0
  - @backstage/backend-plugin-api@0.6.14
  - @backstage/types@1.1.1

## 0.2.35-next.2

### Patch Changes

- Updated dependencies
  - @backstage/plugin-scaffolder-node@0.4.0-next.2
  - @backstage/plugin-scaffolder-node-test-utils@0.1.0-next.2
  - @backstage/backend-plugin-api@0.6.14-next.2
  - @backstage/types@1.1.1

## 0.2.35-next.1

### Patch Changes

- Updated dependencies
  - @backstage/plugin-scaffolder-node@0.4.0-next.1
  - @backstage/plugin-scaffolder-node-test-utils@0.1.0-next.1
  - @backstage/backend-plugin-api@0.6.14-next.1
  - @backstage/types@1.1.1

## 0.2.34-next.0

### Patch Changes

- f44589d: Introduced `createMockActionContext` to unify the way of creating scaffolder mock context.

  It will help to maintain tests in a long run during structural changes of action context.

- Updated dependencies
  - @backstage/plugin-scaffolder-node@0.3.3-next.0
  - @backstage/backend-plugin-api@0.6.13-next.0
  - @backstage/plugin-scaffolder-node-test-utils@0.1.0-next.0
  - @backstage/types@1.1.1

## 0.2.31

### Patch Changes

- e9a5228: Exporting a default module for the new Backend System
- 9aac2b0: Use `--cwd` as the first `yarn` argument
- Updated dependencies
  - @backstage/backend-plugin-api@0.6.10
  - @backstage/plugin-scaffolder-node@0.3.0
  - @backstage/types@1.1.1

## 0.2.31-next.3

### Patch Changes

- Updated dependencies
  - @backstage/plugin-scaffolder-node@0.3.0-next.3
  - @backstage/backend-plugin-api@0.6.10-next.3
  - @backstage/types@1.1.1

## 0.2.31-next.2

### Patch Changes

- 9aac2b0: Use `--cwd` as the first `yarn` argument
- Updated dependencies
  - @backstage/backend-plugin-api@0.6.10-next.2
  - @backstage/plugin-scaffolder-node@0.3.0-next.2
  - @backstage/types@1.1.1

## 0.2.31-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@0.6.10-next.1
  - @backstage/plugin-scaffolder-node@0.3.0-next.1
  - @backstage/types@1.1.1

## 0.2.31-next.0

### Patch Changes

- e9a5228: Exporting a default module for the new Backend System
- Updated dependencies
  - @backstage/plugin-scaffolder-node@0.3.0-next.0
  - @backstage/backend-plugin-api@0.6.10-next.0
  - @backstage/types@1.1.1

## 0.2.30

### Patch Changes

- 4016f21: Remove some unused dependencies
- Updated dependencies
  - @backstage/plugin-scaffolder-node@0.2.10
  - @backstage/types@1.1.1

## 0.2.30-next.2

### Patch Changes

- Updated dependencies
  - @backstage/plugin-scaffolder-node@0.2.10-next.2

## 0.2.30-next.1

### Patch Changes

- Updated dependencies
  - @backstage/plugin-scaffolder-node@0.2.10-next.1
  - @backstage/types@1.1.1

## 0.2.30-next.0

### Patch Changes

- 4016f21: Remove some unused dependencies
- Updated dependencies
  - @backstage/types@1.1.1
  - @backstage/plugin-scaffolder-node@0.2.10-next.0

## 0.2.29

### Patch Changes

- Updated dependencies
  - @backstage/plugin-scaffolder-node@0.2.9
  - @backstage/config@1.1.1
  - @backstage/types@1.1.1

## 0.2.29-next.3

### Patch Changes

- Updated dependencies
  - @backstage/plugin-scaffolder-node@0.2.9-next.3
  - @backstage/config@1.1.1
  - @backstage/types@1.1.1

## 0.2.29-next.2

### Patch Changes

- Updated dependencies
  - @backstage/config@1.1.1
  - @backstage/types@1.1.1
  - @backstage/plugin-scaffolder-node@0.2.9-next.2

## 0.2.29-next.1

### Patch Changes

- Updated dependencies
  - @backstage/config@1.1.1
  - @backstage/types@1.1.1
  - @backstage/plugin-scaffolder-node@0.2.9-next.1

## 0.2.29-next.0

### Patch Changes

- Updated dependencies
  - @backstage/plugin-scaffolder-node@0.2.9-next.0
  - @backstage/config@1.1.1
  - @backstage/types@1.1.1

## 0.2.28

### Patch Changes

- Updated dependencies
  - @backstage/plugin-scaffolder-node@0.2.8
  - @backstage/config@1.1.1
  - @backstage/types@1.1.1

## 0.2.28-next.2

### Patch Changes

- Updated dependencies
  - @backstage/plugin-scaffolder-node@0.2.8-next.2

## 0.2.28-next.1

### Patch Changes

- Updated dependencies
  - @backstage/plugin-scaffolder-node@0.2.8-next.1
  - @backstage/config@1.1.1
  - @backstage/types@1.1.1

## 0.2.28-next.0

### Patch Changes

- Updated dependencies
  - @backstage/plugin-scaffolder-node@0.2.8-next.0
  - @backstage/config@1.1.1
  - @backstage/types@1.1.1

## 0.2.27

### Patch Changes

- Updated dependencies
  - @backstage/plugin-scaffolder-node@0.2.6
  - @backstage/config@1.1.1
  - @backstage/types@1.1.1

## 0.2.27-next.2

### Patch Changes

- Updated dependencies
  - @backstage/plugin-scaffolder-node@0.2.6-next.2
  - @backstage/config@1.1.1-next.0
  - @backstage/types@1.1.1

## 0.2.26-next.1

### Patch Changes

- Updated dependencies
  - @backstage/plugin-scaffolder-node@0.2.5-next.1
  - @backstage/config@1.1.0
  - @backstage/types@1.1.1

## 0.2.26-next.0

### Patch Changes

- Updated dependencies
  - @backstage/plugin-scaffolder-node@0.2.5-next.0
  - @backstage/config@1.1.0
  - @backstage/types@1.1.1

## 0.2.24

### Patch Changes

- 4fa1c74cbadc: Enables dry-run functionality for the run:yeoman scaffolder action
- Updated dependencies
  - @backstage/config@1.1.0
  - @backstage/types@1.1.1
  - @backstage/plugin-scaffolder-node@0.2.3

## 0.2.24-next.3

### Patch Changes

- 4fa1c74cbadc: Enables dry-run functionality for the run:yeoman scaffolder action
- Updated dependencies
  - @backstage/config@1.1.0-next.2
  - @backstage/types@1.1.1-next.0
  - @backstage/plugin-scaffolder-node@0.2.3-next.3

## 0.2.24-next.2

### Patch Changes

- Updated dependencies
  - @backstage/config@1.1.0-next.1
  - @backstage/plugin-scaffolder-node@0.2.3-next.2
  - @backstage/types@1.1.0

## 0.2.24-next.1

### Patch Changes

- Updated dependencies
  - @backstage/config@1.1.0-next.0
  - @backstage/plugin-scaffolder-node@0.2.3-next.1
  - @backstage/types@1.1.0

## 0.2.23-next.0

### Patch Changes

- Updated dependencies
  - @backstage/config@1.0.8
  - @backstage/types@1.1.0
  - @backstage/plugin-scaffolder-node@0.2.2-next.0

## 0.2.21

### Patch Changes

- 12a8c94eda8d: Add package repository and homepage metadata
- Updated dependencies
  - @backstage/plugin-scaffolder-node@0.2.0
  - @backstage/config@1.0.8
  - @backstage/types@1.1.0

## 0.2.21-next.2

### Patch Changes

- Updated dependencies
  - @backstage/plugin-scaffolder-node@0.1.6-next.2

## 0.2.21-next.1

### Patch Changes

- 12a8c94eda8d: Add package repository and homepage metadata
- Updated dependencies
  - @backstage/plugin-scaffolder-node@0.1.6-next.1
  - @backstage/config@1.0.8
  - @backstage/types@1.1.0

## 0.2.21-next.0

### Patch Changes

- Updated dependencies
  - @backstage/config@1.0.8
  - @backstage/types@1.1.0
  - @backstage/plugin-scaffolder-node@0.1.6-next.0

## 0.2.20

### Patch Changes

- Updated dependencies
  - @backstage/config@1.0.8
  - @backstage/types@1.1.0
  - @backstage/plugin-scaffolder-node@0.1.5

## 0.2.20-next.0

### Patch Changes

- Updated dependencies
  - @backstage/config@1.0.8
  - @backstage/types@1.1.0
  - @backstage/plugin-scaffolder-node@0.1.5-next.0

## 0.2.19

### Patch Changes

- Updated dependencies
  - @backstage/types@1.1.0
  - @backstage/config@1.0.8
  - @backstage/plugin-scaffolder-node@0.1.4

## 0.2.19-next.2

### Patch Changes

- Updated dependencies
  - @backstage/config@1.0.7
  - @backstage/types@1.0.2
  - @backstage/plugin-scaffolder-node@0.1.4-next.2

## 0.2.19-next.1

### Patch Changes

- Updated dependencies
  - @backstage/plugin-scaffolder-node@0.1.4-next.1
  - @backstage/config@1.0.7
  - @backstage/types@1.0.2

## 0.2.19-next.0

### Patch Changes

- Updated dependencies
  - @backstage/config@1.0.7
  - @backstage/types@1.0.2
  - @backstage/plugin-scaffolder-node@0.1.4-next.0

## 0.2.18

### Patch Changes

- Updated dependencies
  - @backstage/plugin-scaffolder-node@0.1.3
  - @backstage/config@1.0.7
  - @backstage/types@1.0.2

## 0.2.18-next.2

### Patch Changes

- Updated dependencies
  - @backstage/plugin-scaffolder-node@0.1.3-next.2
  - @backstage/config@1.0.7

## 0.2.18-next.1

### Patch Changes

- Updated dependencies
  - @backstage/plugin-scaffolder-node@0.1.3-next.1
  - @backstage/config@1.0.7

## 0.2.18-next.0

### Patch Changes

- Updated dependencies
  - @backstage/config@1.0.7
  - @backstage/types@1.0.2
  - @backstage/plugin-scaffolder-node@0.1.3-next.0

## 0.2.17

### Patch Changes

- Updated dependencies
  - @backstage/plugin-scaffolder-node@0.1.2
  - @backstage/config@1.0.7
  - @backstage/types@1.0.2

## 0.2.17-next.3

### Patch Changes

- Updated dependencies
  - @backstage/config@1.0.7
  - @backstage/types@1.0.2
  - @backstage/plugin-scaffolder-node@0.1.2-next.3

## 0.2.17-next.2

### Patch Changes

- Updated dependencies
  - @backstage/plugin-scaffolder-node@0.1.2-next.2
  - @backstage/config@1.0.7
  - @backstage/types@1.0.2

## 0.2.17-next.1

### Patch Changes

- Updated dependencies
  - @backstage/plugin-scaffolder-node@0.1.2-next.1
  - @backstage/config@1.0.7
  - @backstage/types@1.0.2

## 0.2.17-next.0

### Patch Changes

- Updated dependencies
  - @backstage/plugin-scaffolder-node@0.1.2-next.0
  - @backstage/config@1.0.7
  - @backstage/types@1.0.2

## 0.2.16

### Patch Changes

- Updated dependencies
  - @backstage/config@1.0.7
  - @backstage/types@1.0.2
  - @backstage/plugin-scaffolder-node@0.1.1

## 0.2.16-next.2

### Patch Changes

- Updated dependencies
  - @backstage/plugin-scaffolder-node@0.1.1-next.2
  - @backstage/config@1.0.7-next.0

## 0.2.16-next.1

### Patch Changes

- Updated dependencies
  - @backstage/config@1.0.7-next.0
  - @backstage/types@1.0.2
  - @backstage/plugin-scaffolder-node@0.1.1-next.1

## 0.2.16-next.0

### Patch Changes

- Updated dependencies
  - @backstage/config@1.0.6
  - @backstage/types@1.0.2
  - @backstage/plugin-scaffolder-node@0.1.1-next.0

## 0.2.15

### Patch Changes

- d72866f0cc: Internal refactor to use the new `@backstage/plugin-scaffolder-node` package for some functionality
- Updated dependencies
  - @backstage/plugin-scaffolder-node@0.1.0
  - @backstage/config@1.0.6
  - @backstage/types@1.0.2

## 0.2.15-next.2

### Patch Changes

- Updated dependencies
  - @backstage/plugin-scaffolder-node@0.1.0-next.2
  - @backstage/config@1.0.6
  - @backstage/types@1.0.2

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
