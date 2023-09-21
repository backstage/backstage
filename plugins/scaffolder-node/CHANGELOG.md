# @backstage/plugin-scaffolder-node

## 0.2.3

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.19.5
  - @backstage/catalog-model@1.4.2
  - @backstage/errors@1.2.2
  - @backstage/integration@1.7.0
  - @backstage/plugin-scaffolder-common@1.4.1
  - @backstage/types@1.1.1
  - @backstage/backend-plugin-api@0.6.3

## 0.2.3-next.3

### Patch Changes

- Updated dependencies
  - @backstage/catalog-model@1.4.2-next.2
  - @backstage/errors@1.2.2-next.0
  - @backstage/integration@1.7.0-next.3
  - @backstage/plugin-scaffolder-common@1.4.1-next.2
  - @backstage/types@1.1.1-next.0
  - @backstage/backend-plugin-api@0.6.3-next.3
  - @backstage/backend-common@0.19.5-next.3

## 0.2.3-next.2

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.19.5-next.2
  - @backstage/integration@1.7.0-next.2
  - @backstage/backend-plugin-api@0.6.3-next.2
  - @backstage/catalog-model@1.4.2-next.1
  - @backstage/errors@1.2.1
  - @backstage/types@1.1.0
  - @backstage/plugin-scaffolder-common@1.4.1-next.1

## 0.2.3-next.1

### Patch Changes

- Updated dependencies
  - @backstage/integration@1.7.0-next.1
  - @backstage/backend-common@0.19.5-next.1
  - @backstage/backend-plugin-api@0.6.3-next.1
  - @backstage/catalog-model@1.4.2-next.0
  - @backstage/plugin-scaffolder-common@1.4.1-next.0
  - @backstage/errors@1.2.1
  - @backstage/types@1.1.0

## 0.2.2-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.19.4-next.0
  - @backstage/integration@1.7.0-next.0
  - @backstage/backend-plugin-api@0.6.2-next.0
  - @backstage/catalog-model@1.4.1
  - @backstage/errors@1.2.1
  - @backstage/types@1.1.0
  - @backstage/plugin-scaffolder-common@1.4.0

## 0.2.0

### Minor Changes

- e514aac3eac0: Introduce `each` property on action steps, allowing them to be ran repeatedly.

### Patch Changes

- 12a8c94eda8d: Add package repository and homepage metadata
- e07a4914f621: Added several new types that were moved from `@backstage/plugin-scaffolder-backend`.
- 349611126ae2: Added two new alpha extension points, `scaffolderTaskBrokerExtensionPoint` and `scaffolderTemplatingExtensionPoint`.
- 0b1d775be05b: Export `TemplateExample` from the `createTemplateAction` type.
- d3b31a791eb1: Deprecated `executeShellCommand`, `RunCommandOptions`, and `fetchContents` from `@backstage/plugin-scaffolder-backend`, since they are useful for Scaffolder modules (who should not be importing from the plugin package itself). You should now import these from `@backstage/plugin-scaffolder-backend-node` instead. `RunCommandOptions` was renamed in the Node package as `ExecuteShellCommandOptions`, for consistency.
- Updated dependencies
  - @backstage/backend-common@0.19.2
  - @backstage/backend-plugin-api@0.6.0
  - @backstage/integration@1.6.0
  - @backstage/plugin-scaffolder-common@1.4.0
  - @backstage/catalog-model@1.4.1
  - @backstage/errors@1.2.1
  - @backstage/types@1.1.0

## 0.1.6-next.2

### Patch Changes

- 0b1d775be05b: Export `TemplateExample` from the `createTemplateAction` type.
- Updated dependencies
  - @backstage/backend-plugin-api@0.6.0-next.2
  - @backstage/backend-common@0.19.2-next.2

## 0.1.6-next.1

### Patch Changes

- 12a8c94eda8d: Add package repository and homepage metadata
- d3b31a791eb1: Deprecated `executeShellCommand`, `RunCommandOptions`, and `fetchContents` from `@backstage/plugin-scaffolder-backend`, since they are useful for Scaffolder modules (who should not be importing from the plugin package itself). You should now import these from `@backstage/plugin-scaffolder-backend-node` instead. `RunCommandOptions` was renamed in the Node package as `ExecuteShellCommandOptions`, for consistency.
- Updated dependencies
  - @backstage/backend-common@0.19.2-next.1
  - @backstage/backend-plugin-api@0.6.0-next.1
  - @backstage/integration@1.5.1
  - @backstage/catalog-model@1.4.1
  - @backstage/errors@1.2.1
  - @backstage/types@1.1.0
  - @backstage/plugin-scaffolder-common@1.3.2

## 0.1.6-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@0.5.5-next.0
  - @backstage/catalog-model@1.4.1
  - @backstage/types@1.1.0
  - @backstage/plugin-scaffolder-common@1.3.2

## 0.1.5

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@0.5.4
  - @backstage/catalog-model@1.4.1
  - @backstage/types@1.1.0
  - @backstage/plugin-scaffolder-common@1.3.2

## 0.1.5-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@0.5.4-next.0
  - @backstage/catalog-model@1.4.1-next.0
  - @backstage/types@1.1.0
  - @backstage/plugin-scaffolder-common@1.3.2-next.0

## 0.1.4

### Patch Changes

- Updated dependencies
  - @backstage/types@1.1.0
  - @backstage/catalog-model@1.4.0
  - @backstage/backend-plugin-api@0.5.3
  - @backstage/plugin-scaffolder-common@1.3.1

## 0.1.4-next.2

### Patch Changes

- Updated dependencies
  - @backstage/catalog-model@1.4.0-next.1
  - @backstage/backend-plugin-api@0.5.3-next.2
  - @backstage/types@1.0.2
  - @backstage/plugin-scaffolder-common@1.3.1-next.1

## 0.1.4-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@0.5.3-next.1
  - @backstage/catalog-model@1.4.0-next.0
  - @backstage/plugin-scaffolder-common@1.3.1-next.0
  - @backstage/types@1.0.2

## 0.1.4-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@0.5.3-next.0
  - @backstage/catalog-model@1.3.0
  - @backstage/types@1.0.2
  - @backstage/plugin-scaffolder-common@1.3.0

## 0.1.3

### Patch Changes

- 6d954de4b06: Update typing for `RouterOptions::actions` and `ScaffolderActionsExtensionPoint::addActions` to allow any kind of action being assigned to it.
- Updated dependencies
  - @backstage/plugin-scaffolder-common@1.3.0
  - @backstage/backend-plugin-api@0.5.2
  - @backstage/catalog-model@1.3.0
  - @backstage/types@1.0.2

## 0.1.3-next.2

### Patch Changes

- Updated dependencies
  - @backstage/plugin-scaffolder-common@1.3.0-next.0

## 0.1.3-next.1

### Patch Changes

- 6d954de4b06: Update typing for `RouterOptions::actions` and `ScaffolderActionsExtensionPoint::addActions` to allow any kind of action being assigned to it.
- Updated dependencies
  - @backstage/backend-plugin-api@0.5.2-next.1

## 0.1.3-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@0.5.2-next.0
  - @backstage/catalog-model@1.3.0
  - @backstage/types@1.0.2
  - @backstage/plugin-scaffolder-common@1.2.7

## 0.1.2

### Patch Changes

- e27ddc36dad: Added a possibility to cancel the running task (executing of a scaffolder template)
- a7eb36c6e38: Improve type-check for scaffolder output parameters
- 1e4f5e91b8e: Bump `zod` and `zod-to-json-schema` dependencies.
- 2898b6c8d52: Minor type tweaks for TypeScript 5.0
- Updated dependencies
  - @backstage/plugin-scaffolder-common@1.2.7
  - @backstage/catalog-model@1.3.0
  - @backstage/backend-plugin-api@0.5.1
  - @backstage/types@1.0.2

## 0.1.2-next.3

### Patch Changes

- Updated dependencies
  - @backstage/catalog-model@1.3.0-next.0
  - @backstage/backend-plugin-api@0.5.1-next.2
  - @backstage/types@1.0.2
  - @backstage/plugin-scaffolder-common@1.2.7-next.2

## 0.1.2-next.2

### Patch Changes

- 2898b6c8d52: Minor type tweaks for TypeScript 5.0
- Updated dependencies
  - @backstage/backend-plugin-api@0.5.1-next.2
  - @backstage/catalog-model@1.2.1
  - @backstage/types@1.0.2
  - @backstage/plugin-scaffolder-common@1.2.7-next.1

## 0.1.2-next.1

### Patch Changes

- a7eb36c6e38: Improve type-check for scaffolder output parameters
- 1e4f5e91b8e: Bump `zod` and `zod-to-json-schema` dependencies.
- Updated dependencies
  - @backstage/plugin-scaffolder-common@1.2.7-next.1
  - @backstage/backend-plugin-api@0.5.1-next.1
  - @backstage/catalog-model@1.2.1
  - @backstage/types@1.0.2

## 0.1.2-next.0

### Patch Changes

- e27ddc36dad: Added a possibility to cancel the running task (executing of a scaffolder template)
- Updated dependencies
  - @backstage/plugin-scaffolder-common@1.2.7-next.0
  - @backstage/backend-plugin-api@0.5.1-next.0
  - @backstage/catalog-model@1.2.1
  - @backstage/types@1.0.2

## 0.1.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@0.5.0
  - @backstage/catalog-model@1.2.1
  - @backstage/types@1.0.2
  - @backstage/plugin-scaffolder-common@1.2.6

## 0.1.1-next.2

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@0.4.1-next.2

## 0.1.1-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@0.4.1-next.1
  - @backstage/catalog-model@1.2.1-next.1
  - @backstage/types@1.0.2
  - @backstage/plugin-scaffolder-common@1.2.6-next.1

## 0.1.1-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@0.4.1-next.0
  - @backstage/catalog-model@1.2.1-next.0
  - @backstage/types@1.0.2
  - @backstage/plugin-scaffolder-common@1.2.6-next.0

## 0.1.0

### Minor Changes

- d72866f0cc: New package that takes over some of the types and functionality from `@backstage/plugin-scaffolder-backend` that are shared with other modules

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@0.4.0
  - @backstage/catalog-model@1.2.0
  - @backstage/types@1.0.2
  - @backstage/plugin-scaffolder-common@1.2.5

## 0.1.0-next.2

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@0.4.0-next.2
  - @backstage/catalog-model@1.2.0-next.1
  - @backstage/types@1.0.2
  - @backstage/plugin-scaffolder-common@1.2.5-next.1

## 0.1.0-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@0.3.2-next.1
  - @backstage/catalog-model@1.1.6-next.0
  - @backstage/types@1.0.2
  - @backstage/plugin-scaffolder-common@1.2.5-next.0

## 0.1.0-next.0

### Minor Changes

- d72866f0cc: New package that takes over some of the types and functionality from `@backstage/plugin-scaffolder-backend` that are shared with other modules

### Patch Changes

- Updated dependencies
  - @backstage/catalog-model@1.1.6-next.0
  - @backstage/plugin-scaffolder-common@1.2.5-next.0
  - @backstage/backend-plugin-api@0.3.2-next.0
