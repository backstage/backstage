# @backstage/plugin-tech-insights

## 0.1.5

### Patch Changes

- 34883f5c9e: Added possibility to pass customized title and description for the scorecards instead of using hardcoded ones.
- a60eb0f0dd: adding new operation to run checks for multiple entities in one request
- 48580d0fbb: fix React warning because of missing `key` prop
- Updated dependencies
  - @backstage/core-components@0.8.4
  - @backstage/core-plugin-api@0.5.0
  - @backstage/plugin-catalog-react@0.6.11
  - @backstage/plugin-tech-insights-common@0.2.1
  - @backstage/errors@0.2.0
  - @backstage/catalog-model@0.9.9

## 0.1.4

### Patch Changes

- 4ce51ab0f1: Internal refactor of the `react-use` imports to use `react-use/lib/*` instead.
- 96fb10fe25: remove unnecessary http request when running all checks
- Updated dependencies
  - @backstage/core-plugin-api@0.4.1
  - @backstage/plugin-catalog-react@0.6.10
  - @backstage/core-components@0.8.3

## 0.1.3

### Patch Changes

- a86f5c1701: Fixed API auth in tech-insights plugin
- d83079fc11: Export `techInsightsApiRef` and associated types.
- Updated dependencies
  - @backstage/plugin-catalog-react@0.6.9

## 0.1.2

### Patch Changes

- 6ff4408fa6: RunChecks endpoint now handles missing retriever data in checks. Instead of
  showing server errors, the checks will be shown for checks whose retrievers have
  data, and a warning will be shown if no checks are returned.
- Updated dependencies
  - @backstage/core-plugin-api@0.4.0
  - @backstage/plugin-catalog-react@0.6.8
  - @backstage/core-components@0.8.2

## 0.1.1

### Patch Changes

- cd450844f6: Moved React dependencies to `peerDependencies` and allow both React v16 and v17 to be used.
- Updated dependencies
  - @backstage/core-components@0.8.0
  - @backstage/core-plugin-api@0.3.0
  - @backstage/plugin-catalog-react@0.6.5

## 0.1.0

### Minor Changes

- b5bd60fddc: New package containing UI components for the Tech Insights plugin.

### Patch Changes

- Updated dependencies
  - @backstage/plugin-tech-insights-common@0.2.0
  - @backstage/core-components@0.7.6
  - @backstage/theme@0.2.14
  - @backstage/core-plugin-api@0.2.2
