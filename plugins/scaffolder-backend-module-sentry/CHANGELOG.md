# @backstage/plugin-scaffolder-backend-module-sentry

## 0.2.0-next.2

### Patch Changes

- 5d1670f: Update README installation instructions
- Updated dependencies
  - @backstage/backend-plugin-api@1.0.0-next.2
  - @backstage/config@1.2.0
  - @backstage/errors@1.2.4
  - @backstage/plugin-scaffolder-node@0.4.11-next.2

## 0.2.0-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@0.9.0-next.1
  - @backstage/config@1.2.0
  - @backstage/errors@1.2.4
  - @backstage/plugin-scaffolder-node@0.4.11-next.1

## 0.2.0-next.0

### Minor Changes

- d425fc4: **BREAKING**: The return values from `createBackendPlugin`, `createBackendModule`, and `createServiceFactory` are now simply `BackendFeature` and `ServiceFactory`, instead of the previously deprecated form of a function that returns them. For this reason, `createServiceFactory` also no longer accepts the callback form where you provide direct options to the service. This also affects all `coreServices.*` service refs.

  This may in particular affect tests; if you were effectively doing `createBackendModule({...})()` (note the parentheses), you can now remove those extra parentheses at the end. You may encounter cases of this in your `packages/backend/src/index.ts` too, where you add plugins, modules, and services. If you were using `createServiceFactory` with a function as its argument for the purpose of passing in options, this pattern has been deprecated for a while and is no longer supported. You may want to explore the new multiton patterns to achieve your goals, or moving settings to app-config.

  As part of this change, the `IdentityFactoryOptions` type was removed, and can no longer be used to tweak that service. The identity service was also deprecated some time ago, and you will want to [migrate to the new auth system](https://backstage.io/docs/tutorials/auth-service-migration) if you still rely on it.

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@0.9.0-next.0
  - @backstage/plugin-scaffolder-node@0.4.11-next.0
  - @backstage/config@1.2.0
  - @backstage/errors@1.2.4

## 0.1.31

### Patch Changes

- 93095ee: Make sure node-fetch is version 2.7.0 or greater
- 382e868: Added test cases for sentry:project:create examples
- Updated dependencies
  - @backstage/backend-plugin-api@0.8.0
  - @backstage/plugin-scaffolder-node@0.4.9
  - @backstage/config@1.2.0
  - @backstage/errors@1.2.4

## 0.1.31-next.3

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@0.8.0-next.3
  - @backstage/config@1.2.0
  - @backstage/errors@1.2.4
  - @backstage/plugin-scaffolder-node@0.4.9-next.3

## 0.1.31-next.2

### Patch Changes

- 93095ee: Make sure node-fetch is version 2.7.0 or greater
- 382e868: Added test cases for sentry:project:create examples
- Updated dependencies
  - @backstage/backend-plugin-api@0.8.0-next.2
  - @backstage/plugin-scaffolder-node@0.4.9-next.2
  - @backstage/config@1.2.0
  - @backstage/errors@1.2.4

## 0.1.31-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@0.7.1-next.1
  - @backstage/config@1.2.0
  - @backstage/errors@1.2.4
  - @backstage/plugin-scaffolder-node@0.4.9-next.1

## 0.1.31-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@0.7.1-next.0
  - @backstage/config@1.2.0
  - @backstage/errors@1.2.4
  - @backstage/plugin-scaffolder-node@0.4.9-next.0

## 0.1.30

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@0.7.0
  - @backstage/plugin-scaffolder-node@0.4.8
  - @backstage/config@1.2.0
  - @backstage/errors@1.2.4

## 0.1.30-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@0.6.22-next.1
  - @backstage/config@1.2.0
  - @backstage/errors@1.2.4
  - @backstage/plugin-scaffolder-node@0.4.8-next.1

## 0.1.29-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@0.6.21-next.0
  - @backstage/plugin-scaffolder-node@0.4.7-next.0
  - @backstage/config@1.2.0
  - @backstage/errors@1.2.4

## 0.1.27

### Patch Changes

- 78a0b08: Internal refactor to handle `BackendFeature` contract change.
- d44a20a: Added additional plugin metadata to `package.json`.
- 1354d81: Use `node-fetch` instead of native fetch, as per https://backstage.io/docs/architecture-decisions/adrs-adr013
- Updated dependencies
  - @backstage/backend-plugin-api@0.6.19
  - @backstage/plugin-scaffolder-node@0.4.5
  - @backstage/config@1.2.0
  - @backstage/errors@1.2.4

## 0.1.27-next.3

### Patch Changes

- d44a20a: Added additional plugin metadata to `package.json`.
- Updated dependencies
  - @backstage/backend-plugin-api@0.6.19-next.3
  - @backstage/plugin-scaffolder-node@0.4.5-next.3
  - @backstage/config@1.2.0
  - @backstage/errors@1.2.4

## 0.1.27-next.2

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@0.6.19-next.2
  - @backstage/plugin-scaffolder-node@0.4.5-next.2
  - @backstage/config@1.2.0
  - @backstage/errors@1.2.4

## 0.1.27-next.1

### Patch Changes

- 1354d81: Use `node-fetch` instead of native fetch, as per https://backstage.io/docs/architecture-decisions/adrs-adr013
- Updated dependencies
  - @backstage/backend-plugin-api@0.6.19-next.1
  - @backstage/plugin-scaffolder-node@0.4.5-next.1

## 0.1.27-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@0.6.19-next.0
  - @backstage/plugin-scaffolder-node@0.4.5-next.0
  - @backstage/config@1.2.0
  - @backstage/errors@1.2.4

## 0.1.26

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@0.6.18
  - @backstage/plugin-scaffolder-node@0.4.4

## 0.1.26-next.1

### Patch Changes

- Updated dependencies
  - @backstage/plugin-scaffolder-node@0.4.4-next.1
  - @backstage/backend-plugin-api@0.6.18-next.1

## 0.1.26-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@0.6.18-next.0
  - @backstage/plugin-scaffolder-node@0.4.4-next.0
  - @backstage/config@1.2.0
  - @backstage/errors@1.2.4

## 0.1.25

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@0.6.17
  - @backstage/plugin-scaffolder-node@0.4.3
  - @backstage/config@1.2.0
  - @backstage/errors@1.2.4

## 0.1.25-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@0.6.17-next.1
  - @backstage/plugin-scaffolder-node@0.4.3-next.1
  - @backstage/config@1.2.0
  - @backstage/errors@1.2.4

## 0.1.25-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@0.6.17-next.0
  - @backstage/config@1.2.0
  - @backstage/errors@1.2.4
  - @backstage/plugin-scaffolder-node@0.4.3-next.0

## 0.1.24

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@0.6.16
  - @backstage/plugin-scaffolder-node@0.4.2
  - @backstage/config@1.2.0
  - @backstage/errors@1.2.4

## 0.1.23

### Patch Changes

- Updated dependencies
  - @backstage/plugin-scaffolder-node@0.4.1
  - @backstage/backend-plugin-api@0.6.15
  - @backstage/config@1.2.0
  - @backstage/errors@1.2.4

## 0.1.22

### Patch Changes

- f44589d: Introduced `createMockActionContext` to unify the way of creating scaffolder mock context.

  It will help to maintain tests in a long run during structural changes of action context.

- Updated dependencies
  - @backstage/plugin-scaffolder-node@0.4.0
  - @backstage/config@1.2.0
  - @backstage/errors@1.2.4
  - @backstage/backend-plugin-api@0.6.14

## 0.1.22-next.2

### Patch Changes

- Updated dependencies
  - @backstage/plugin-scaffolder-node@0.4.0-next.2
  - @backstage/backend-plugin-api@0.6.14-next.2
  - @backstage/config@1.2.0-next.1
  - @backstage/errors@1.2.4-next.0

## 0.1.22-next.1

### Patch Changes

- Updated dependencies
  - @backstage/config@1.2.0-next.1
  - @backstage/plugin-scaffolder-node@0.4.0-next.1
  - @backstage/backend-plugin-api@0.6.14-next.1
  - @backstage/errors@1.2.4-next.0

## 0.1.21-next.0

### Patch Changes

- f44589d: Introduced `createMockActionContext` to unify the way of creating scaffolder mock context.

  It will help to maintain tests in a long run during structural changes of action context.

- Updated dependencies
  - @backstage/errors@1.2.4-next.0
  - @backstage/plugin-scaffolder-node@0.3.3-next.0
  - @backstage/backend-plugin-api@0.6.13-next.0
  - @backstage/config@1.1.2-next.0

## 0.1.18

### Patch Changes

- e9a5228: Exporting a default module for the new Backend System
- 9aac2b0: Use `--cwd` as the first `yarn` argument
- Updated dependencies
  - @backstage/backend-plugin-api@0.6.10
  - @backstage/plugin-scaffolder-node@0.3.0
  - @backstage/config@1.1.1
  - @backstage/errors@1.2.3

## 0.1.18-next.3

### Patch Changes

- Updated dependencies
  - @backstage/plugin-scaffolder-node@0.3.0-next.3
  - @backstage/backend-plugin-api@0.6.10-next.3
  - @backstage/config@1.1.1
  - @backstage/errors@1.2.3

## 0.1.18-next.2

### Patch Changes

- 9aac2b0: Use `--cwd` as the first `yarn` argument
- Updated dependencies
  - @backstage/backend-plugin-api@0.6.10-next.2
  - @backstage/plugin-scaffolder-node@0.3.0-next.2
  - @backstage/config@1.1.1
  - @backstage/errors@1.2.3

## 0.1.18-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@0.6.10-next.1
  - @backstage/plugin-scaffolder-node@0.3.0-next.1
  - @backstage/config@1.1.1
  - @backstage/errors@1.2.3

## 0.1.18-next.0

### Patch Changes

- e9a5228: Exporting a default module for the new Backend System
- Updated dependencies
  - @backstage/plugin-scaffolder-node@0.3.0-next.0
  - @backstage/backend-plugin-api@0.6.10-next.0
  - @backstage/config@1.1.1
  - @backstage/errors@1.2.3

## 0.1.17

### Patch Changes

- Updated dependencies
  - @backstage/plugin-scaffolder-node@0.2.10
  - @backstage/config@1.1.1
  - @backstage/errors@1.2.3

## 0.1.17-next.2

### Patch Changes

- Updated dependencies
  - @backstage/plugin-scaffolder-node@0.2.10-next.2

## 0.1.17-next.1

### Patch Changes

- Updated dependencies
  - @backstage/config@1.1.1
  - @backstage/plugin-scaffolder-node@0.2.10-next.1
  - @backstage/errors@1.2.3

## 0.1.17-next.0

### Patch Changes

- Updated dependencies
  - @backstage/config@1.1.1
  - @backstage/errors@1.2.3
  - @backstage/plugin-scaffolder-node@0.2.10-next.0

## 0.1.16

### Patch Changes

- 7f8a801: Added examples for `sentry:project:create` scaffolder action and unit tests.
- Updated dependencies
  - @backstage/plugin-scaffolder-node@0.2.9
  - @backstage/config@1.1.1
  - @backstage/errors@1.2.3

## 0.1.16-next.3

### Patch Changes

- Updated dependencies
  - @backstage/plugin-scaffolder-node@0.2.9-next.3
  - @backstage/config@1.1.1
  - @backstage/errors@1.2.3

## 0.1.16-next.2

### Patch Changes

- Updated dependencies
  - @backstage/config@1.1.1
  - @backstage/errors@1.2.3
  - @backstage/plugin-scaffolder-node@0.2.9-next.2

## 0.1.16-next.1

### Patch Changes

- 7f8a801e6d: Added examples for `sentry:project:create` scaffolder action and unit tests.
- Updated dependencies
  - @backstage/config@1.1.1
  - @backstage/errors@1.2.3
  - @backstage/plugin-scaffolder-node@0.2.9-next.1

## 0.1.16-next.0

### Patch Changes

- Updated dependencies
  - @backstage/plugin-scaffolder-node@0.2.9-next.0
  - @backstage/config@1.1.1
  - @backstage/errors@1.2.3

## 0.1.15

### Patch Changes

- Updated dependencies
  - @backstage/plugin-scaffolder-node@0.2.8
  - @backstage/config@1.1.1
  - @backstage/errors@1.2.3

## 0.1.15-next.2

### Patch Changes

- Updated dependencies
  - @backstage/plugin-scaffolder-node@0.2.8-next.2

## 0.1.15-next.1

### Patch Changes

- Updated dependencies
  - @backstage/plugin-scaffolder-node@0.2.8-next.1
  - @backstage/config@1.1.1
  - @backstage/errors@1.2.3

## 0.1.15-next.0

### Patch Changes

- Updated dependencies
  - @backstage/plugin-scaffolder-node@0.2.8-next.0
  - @backstage/config@1.1.1
  - @backstage/errors@1.2.3

## 0.1.14

### Patch Changes

- Updated dependencies
  - @backstage/errors@1.2.3
  - @backstage/plugin-scaffolder-node@0.2.6
  - @backstage/config@1.1.1

## 0.1.14-next.2

### Patch Changes

- Updated dependencies
  - @backstage/errors@1.2.3-next.0
  - @backstage/plugin-scaffolder-node@0.2.6-next.2
  - @backstage/config@1.1.1-next.0

## 0.1.13-next.1

### Patch Changes

- Updated dependencies
  - @backstage/plugin-scaffolder-node@0.2.5-next.1
  - @backstage/config@1.1.0
  - @backstage/errors@1.2.2

## 0.1.13-next.0

### Patch Changes

- Updated dependencies
  - @backstage/plugin-scaffolder-node@0.2.5-next.0
  - @backstage/config@1.1.0
  - @backstage/errors@1.2.2

## 0.1.11

### Patch Changes

- Updated dependencies
  - @backstage/config@1.1.0
  - @backstage/errors@1.2.2
  - @backstage/plugin-scaffolder-node@0.2.3

## 0.1.11-next.3

### Patch Changes

- Updated dependencies
  - @backstage/config@1.1.0-next.2
  - @backstage/errors@1.2.2-next.0
  - @backstage/plugin-scaffolder-node@0.2.3-next.3

## 0.1.11-next.2

### Patch Changes

- Updated dependencies
  - @backstage/config@1.1.0-next.1
  - @backstage/plugin-scaffolder-node@0.2.3-next.2
  - @backstage/errors@1.2.1

## 0.1.11-next.1

### Patch Changes

- Updated dependencies
  - @backstage/config@1.1.0-next.0
  - @backstage/plugin-scaffolder-node@0.2.3-next.1
  - @backstage/errors@1.2.1

## 0.1.10-next.0

### Patch Changes

- Updated dependencies
  - @backstage/config@1.0.8
  - @backstage/errors@1.2.1
  - @backstage/plugin-scaffolder-node@0.2.2-next.0

## 0.1.8

### Patch Changes

- 12a8c94eda8d: Add package repository and homepage metadata
- Updated dependencies
  - @backstage/plugin-scaffolder-node@0.2.0
  - @backstage/config@1.0.8
  - @backstage/errors@1.2.1

## 0.1.8-next.2

### Patch Changes

- Updated dependencies
  - @backstage/plugin-scaffolder-node@0.1.6-next.2

## 0.1.8-next.1

### Patch Changes

- 12a8c94eda8d: Add package repository and homepage metadata
- Updated dependencies
  - @backstage/plugin-scaffolder-node@0.1.6-next.1
  - @backstage/config@1.0.8
  - @backstage/errors@1.2.1

## 0.1.8-next.0

### Patch Changes

- Updated dependencies
  - @backstage/config@1.0.8
  - @backstage/errors@1.2.1
  - @backstage/plugin-scaffolder-node@0.1.6-next.0

## 0.1.7

### Patch Changes

- Updated dependencies
  - @backstage/errors@1.2.1
  - @backstage/config@1.0.8
  - @backstage/plugin-scaffolder-node@0.1.5

## 0.1.7-next.0

### Patch Changes

- Updated dependencies
  - @backstage/errors@1.2.1-next.0
  - @backstage/config@1.0.8
  - @backstage/plugin-scaffolder-node@0.1.5-next.0

## 0.1.6

### Patch Changes

- Updated dependencies
  - @backstage/errors@1.2.0
  - @backstage/config@1.0.8
  - @backstage/plugin-scaffolder-node@0.1.4

## 0.1.6-next.2

### Patch Changes

- Updated dependencies
  - @backstage/config@1.0.7
  - @backstage/errors@1.2.0-next.0
  - @backstage/plugin-scaffolder-node@0.1.4-next.2

## 0.1.6-next.1

### Patch Changes

- Updated dependencies
  - @backstage/errors@1.2.0-next.0
  - @backstage/plugin-scaffolder-node@0.1.4-next.1
  - @backstage/config@1.0.7

## 0.1.6-next.0

### Patch Changes

- Updated dependencies
  - @backstage/config@1.0.7
  - @backstage/errors@1.1.5
  - @backstage/plugin-scaffolder-node@0.1.4-next.0

## 0.1.5

### Patch Changes

- Updated dependencies
  - @backstage/plugin-scaffolder-node@0.1.3
  - @backstage/config@1.0.7
  - @backstage/errors@1.1.5

## 0.1.5-next.2

### Patch Changes

- Updated dependencies
  - @backstage/plugin-scaffolder-node@0.1.3-next.2
  - @backstage/config@1.0.7

## 0.1.5-next.1

### Patch Changes

- Updated dependencies
  - @backstage/plugin-scaffolder-node@0.1.3-next.1
  - @backstage/config@1.0.7

## 0.1.5-next.0

### Patch Changes

- Updated dependencies
  - @backstage/config@1.0.7
  - @backstage/errors@1.1.5
  - @backstage/plugin-scaffolder-node@0.1.3-next.0

## 0.1.4

### Patch Changes

- Updated dependencies
  - @backstage/plugin-scaffolder-node@0.1.2
  - @backstage/config@1.0.7
  - @backstage/errors@1.1.5

## 0.1.4-next.3

### Patch Changes

- Updated dependencies
  - @backstage/config@1.0.7
  - @backstage/errors@1.1.5
  - @backstage/plugin-scaffolder-node@0.1.2-next.3

## 0.1.4-next.2

### Patch Changes

- Updated dependencies
  - @backstage/plugin-scaffolder-node@0.1.2-next.2
  - @backstage/config@1.0.7
  - @backstage/errors@1.1.5

## 0.1.4-next.1

### Patch Changes

- Updated dependencies
  - @backstage/plugin-scaffolder-node@0.1.2-next.1
  - @backstage/config@1.0.7
  - @backstage/errors@1.1.5

## 0.1.4-next.0

### Patch Changes

- Updated dependencies
  - @backstage/plugin-scaffolder-node@0.1.2-next.0
  - @backstage/config@1.0.7
  - @backstage/errors@1.1.5

## 0.1.3

### Patch Changes

- Updated dependencies
  - @backstage/errors@1.1.5
  - @backstage/config@1.0.7
  - @backstage/plugin-scaffolder-node@0.1.1

## 0.1.3-next.2

### Patch Changes

- Updated dependencies
  - @backstage/plugin-scaffolder-node@0.1.1-next.2
  - @backstage/config@1.0.7-next.0

## 0.1.3-next.1

### Patch Changes

- Updated dependencies
  - @backstage/errors@1.1.5-next.0
  - @backstage/config@1.0.7-next.0
  - @backstage/plugin-scaffolder-node@0.1.1-next.1

## 0.1.3-next.0

### Patch Changes

- Updated dependencies
  - @backstage/config@1.0.6
  - @backstage/errors@1.1.4
  - @backstage/plugin-scaffolder-node@0.1.1-next.0

## 0.1.2

### Patch Changes

- da418c89e4: Fix broken module exports and dependencies to match a backend module, rather than a frontend plugin.
- d72866f0cc: Internal refactor to use the new `@backstage/plugin-scaffolder-node` package for some functionality
- Updated dependencies
  - @backstage/plugin-scaffolder-node@0.1.0
  - @backstage/config@1.0.6
  - @backstage/errors@1.1.4

## 0.1.2-next.2

### Patch Changes

- Updated dependencies
  - @backstage/plugin-scaffolder-node@0.1.0-next.2
  - @backstage/config@1.0.6
  - @backstage/errors@1.1.4

## 0.1.2-next.1

### Patch Changes

- da418c89e4: Fix broken module exports and dependencies to match a backend module, rather than a frontend plugin.
- Updated dependencies
  - @backstage/config@1.0.6
  - @backstage/errors@1.1.4
  - @backstage/plugin-scaffolder-node@0.1.0-next.1

## 0.1.2-next.0

### Patch Changes

- d72866f0cc: Internal refactor to use the new `@backstage/plugin-scaffolder-node` package for some functionality
- Updated dependencies
  - @backstage/plugin-scaffolder-node@0.1.0-next.0

## 0.1.0

### Minor Changes

- 66ff367af6: Add Sentry "Create Project" Scaffolder as new package

### Patch Changes

- Updated dependencies
  - @backstage/plugin-scaffolder-backend@1.10.0
  - @backstage/config@1.0.6
  - @backstage/errors@1.1.4
  - @backstage/integration@1.4.2
