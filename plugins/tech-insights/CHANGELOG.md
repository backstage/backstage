# @backstage/plugin-tech-insights

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
