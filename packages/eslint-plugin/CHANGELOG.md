# @backstage/eslint-plugin

## 0.2.0

### Minor Changes

- 926389b: Added `@backstage/no-ui-css-imports-in-non-frontend` rule, which ensures that CSS from `@backstage/ui` is not imported outside of the frontend app.

## 0.2.0-next.0

### Minor Changes

- 926389b: Added `@backstage/no-ui-css-imports-in-non-frontend` rule, which ensures that CSS from `@backstage/ui` is not imported outside of the frontend app.

## 0.1.12

### Patch Changes

- 5e98e61: Minor doc updates
- a1dae71: Allow frontend plugin to import from another frontend plugin with same plugin id.

  This prevents the ESLint rule from incorrectly flagging these imports in the new frontend system
  where plugin override requires cross-plugin imports.

## 0.1.11

### Patch Changes

- 098ef95: Fix custom rules package scanning performance.
- 063b2d3: Added new eslint rule to restrict mixed plugin imports.

  New rule `@backstage/no-mixed-plugin-imports` disallows mixed imports between plugins that are mixing
  the backstage architecture. This rule forces that:

  - No imports from frontend plugins to backend plugins or other frontend plugins.
  - No imports from backend plugins to frontend plugins or other backend plugins.
  - No imports from common plugins to frontend or backend plugins.

  The current recommended configuration is giving a warning for mixed imports. This is to be changed in
  the future to an error so please adjust your workspace accordingly.

## 0.1.11-next.0

### Patch Changes

- 098ef95: Fix custom rules package scanning performance.

## 0.1.10

### Patch Changes

- b1c2a2d: Exclude `@material-ui/data-grid`
- 63963f6: Internal refactor to deal with `estree` upgrade

## 0.1.10-next.1

### Patch Changes

- b1c2a2d: Exclude `@material-ui/data-grid`

## 0.1.10-next.0

### Patch Changes

- 63963f6: Internal refactor to deal with `estree` upgrade

## 0.1.9

### Patch Changes

- 08895e3: Added support for linting dependencies on workspace packages with the `backstage.inline` flag.

## 0.1.9-next.0

### Patch Changes

- 08895e3: Added support for linting dependencies on workspace packages with the `backstage.inline` flag.

## 0.1.8

### Patch Changes

- 65ec043: add some `pickers` fixes

## 0.1.7

### Patch Changes

- 9ef572d: fix lint rule fixer for more than one `Component + Prop`
- 3a7eee7: eslint autofix for mui ThemeProvider
- d55828d: add fixer logic for import aliases

## 0.1.7-next.0

### Patch Changes

- 9ef572d: fix lint rule fixer for more than one `Component + Prop`
- 3a7eee7: eslint autofix for mui ThemeProvider

## 0.1.6

### Patch Changes

- 999224f: Bump dependency `minimatch` to v9

## 0.1.6-next.0

### Patch Changes

- 999224f: Bump dependency `minimatch` to v9

## 0.1.5

### Patch Changes

- 995d280: Added new `@backstage/no-top-level-material-ui-4-imports` rule that forbids top level imports from Material UI v4 packages

## 0.1.5-next.0

### Patch Changes

- 995d280: Added new `@backstage/no-top-level-material-ui-4-imports` rule that forbids top level imports from Material UI v4 packages

## 0.1.4

### Patch Changes

- 107dc46: The `no-undeclared-imports` rule will now prefer using version queries that already exist en the repo for the same dependency type when installing new packages.

## 0.1.4-next.0

### Patch Changes

- 107dc46ab1: The `no-undeclared-imports` rule will now prefer using version queries that already exist en the repo for the same dependency type when installing new packages.

## 0.1.3

### Patch Changes

- 911c25de59c: Add support for auto-fixing missing imports detected by the `no-undeclared-imports` rule.

## 0.1.3-next.0

### Patch Changes

- 911c25de59c: Add support for auto-fixing missing imports detected by the `no-undeclared-imports` rule.

## 0.1.2

### Patch Changes

- a061c466d66: Fixing a bug that we should check internal dependencies too

## 0.1.2-next.0

### Patch Changes

- a061c466d6: Fixing a bug that we should check internal dependencies too

## 0.1.0

### Minor Changes

- 179d301518: Added a new ESLint plugin with common rules for Backstage projects. See the [README](https://github.com/import-js/eslint-plugin-import/blob/main/packages/eslint-plugin/README.md) for more details.

## 0.1.0-next.0

### Minor Changes

- 179d301518: Added a new ESLint plugin with common rules for Backstage projects. See the [README](https://github.com/import-js/eslint-plugin-import/blob/main/packages/eslint-plugin/README.md) for more details.
