# @backstage/plugin-catalog-graph

## 0.2.26

### Patch Changes

- 99f05cbc70: The link from the `CatalogGraphCard` to the `CatalogGraphPage` no longer includes an explicit `maxDepth` parameter, letting the `CatalogGraphPage` choose the initial `maxDepth` instead.
- Updated dependencies
  - @backstage/catalog-model@1.1.5
  - @backstage/catalog-client@1.3.0
  - @backstage/plugin-catalog-react@1.2.4
  - @backstage/core-components@0.12.3
  - @backstage/core-plugin-api@1.3.0
  - @backstage/theme@0.2.16

## 0.2.26-next.2

### Patch Changes

- Updated dependencies
  - @backstage/core-plugin-api@1.3.0-next.1
  - @backstage/catalog-client@1.3.0-next.2
  - @backstage/plugin-catalog-react@1.2.4-next.2
  - @backstage/catalog-model@1.1.5-next.1
  - @backstage/core-components@0.12.3-next.2
  - @backstage/theme@0.2.16

## 0.2.26-next.1

### Patch Changes

- 99f05cbc70: The link from the `CatalogGraphCard` to the `CatalogGraphPage` no longer includes an explicit `maxDepth` parameter, letting the `CatalogGraphPage` choose the initial `maxDepth` instead.
- Updated dependencies
  - @backstage/catalog-client@1.3.0-next.1
  - @backstage/catalog-model@1.1.5-next.1
  - @backstage/core-components@0.12.3-next.1
  - @backstage/core-plugin-api@1.2.1-next.0
  - @backstage/theme@0.2.16
  - @backstage/plugin-catalog-react@1.2.4-next.1

## 0.2.26-next.0

### Patch Changes

- Updated dependencies
  - @backstage/catalog-model@1.1.5-next.0
  - @backstage/catalog-client@1.3.0-next.0
  - @backstage/plugin-catalog-react@1.2.4-next.0
  - @backstage/core-components@0.12.3-next.0
  - @backstage/core-plugin-api@1.2.0
  - @backstage/theme@0.2.16

## 0.2.25

### Patch Changes

- Updated dependencies
  - @backstage/core-components@0.12.2
  - @backstage/plugin-catalog-react@1.2.3

## 0.2.24

### Patch Changes

- cb716004ef: Internal refactor to improve tests
- 2e701b3796: Internal refactor to use `react-router-dom` rather than `react-router`.
- 454f2e90db: Set the default `maxDepth` prop for `EntityRelationsGraph` to a smaller value to provide better readability.
- Updated dependencies
  - @backstage/core-plugin-api@1.2.0
  - @backstage/catalog-client@1.2.0
  - @backstage/core-components@0.12.1
  - @backstage/plugin-catalog-react@1.2.2
  - @backstage/catalog-model@1.1.4
  - @backstage/theme@0.2.16

## 0.2.24-next.4

### Patch Changes

- 2e701b3796: Internal refactor to use `react-router-dom` rather than `react-router`.
- Updated dependencies
  - @backstage/core-components@0.12.1-next.4
  - @backstage/plugin-catalog-react@1.2.2-next.4
  - @backstage/catalog-client@1.2.0-next.1
  - @backstage/catalog-model@1.1.4-next.1
  - @backstage/core-plugin-api@1.2.0-next.2
  - @backstage/theme@0.2.16

## 0.2.24-next.3

### Patch Changes

- Updated dependencies
  - @backstage/core-components@0.12.1-next.3
  - @backstage/catalog-client@1.2.0-next.1
  - @backstage/catalog-model@1.1.4-next.1
  - @backstage/core-plugin-api@1.2.0-next.2
  - @backstage/theme@0.2.16
  - @backstage/plugin-catalog-react@1.2.2-next.3

## 0.2.24-next.2

### Patch Changes

- 454f2e90db: Set the default `maxDepth` prop for `EntityRelationsGraph` to a smaller value to provide better readability.
- Updated dependencies
  - @backstage/core-plugin-api@1.2.0-next.2
  - @backstage/core-components@0.12.1-next.2
  - @backstage/plugin-catalog-react@1.2.2-next.2
  - @backstage/catalog-client@1.2.0-next.1
  - @backstage/catalog-model@1.1.4-next.1
  - @backstage/theme@0.2.16

## 0.2.24-next.1

### Patch Changes

- Updated dependencies
  - @backstage/core-components@0.12.1-next.1
  - @backstage/core-plugin-api@1.1.1-next.1
  - @backstage/plugin-catalog-react@1.2.2-next.1
  - @backstage/catalog-client@1.2.0-next.1
  - @backstage/catalog-model@1.1.4-next.1
  - @backstage/theme@0.2.16

## 0.2.24-next.0

### Patch Changes

- cb716004ef: Internal refactor to improve tests
- Updated dependencies
  - @backstage/catalog-client@1.2.0-next.0
  - @backstage/core-components@0.12.1-next.0
  - @backstage/core-plugin-api@1.1.1-next.0
  - @backstage/plugin-catalog-react@1.2.2-next.0
  - @backstage/catalog-model@1.1.4-next.0
  - @backstage/theme@0.2.16

## 0.2.23

### Patch Changes

- da0bf25d1a: Preserve graph options and increment `maxDepth` by 1.

  The change will preserve options used at the `CatalogGraphCard`
  (displayed at the entity page) and additionally, increments the
  `maxDepth` option by 1 to increase the scope slightly compared to
  the graph already seen by the users.

  The default for `maxDepth` at `CatalogGraphCard` is 1.

- 21d84ef332: feat: Enable theme overrides for components in catalog-graph plugin
- Updated dependencies
  - @backstage/plugin-catalog-react@1.2.1
  - @backstage/core-components@0.12.0
  - @backstage/core-plugin-api@1.1.0
  - @backstage/catalog-model@1.1.3
  - @backstage/catalog-client@1.1.2
  - @backstage/theme@0.2.16

## 0.2.23-next.1

### Patch Changes

- da0bf25d1a: Preserve graph options and increment `maxDepth` by 1.

  The change will preserve options used at the `CatalogGraphCard`
  (displayed at the entity page) and additionally, increments the
  `maxDepth` option by 1 to increase the scope slightly compared to
  the graph already seen by the users.

  The default for `maxDepth` at `CatalogGraphCard` is 1.

- Updated dependencies
  - @backstage/core-components@0.12.0-next.1
  - @backstage/catalog-client@1.1.2-next.0
  - @backstage/catalog-model@1.1.3-next.0
  - @backstage/core-plugin-api@1.1.0-next.0
  - @backstage/theme@0.2.16
  - @backstage/plugin-catalog-react@1.2.1-next.1

## 0.2.23-next.0

### Patch Changes

- Updated dependencies
  - @backstage/plugin-catalog-react@1.2.1-next.0
  - @backstage/core-components@0.12.0-next.0
  - @backstage/core-plugin-api@1.1.0-next.0
  - @backstage/catalog-model@1.1.3-next.0
  - @backstage/catalog-client@1.1.2-next.0
  - @backstage/theme@0.2.16

## 0.2.22

### Patch Changes

- bde1e8c8e2: Added `curve` prop to the `DependencyGraph` component to select the type of layout
- Updated dependencies
  - @backstage/catalog-model@1.1.2
  - @backstage/plugin-catalog-react@1.2.0
  - @backstage/core-components@0.11.2
  - @backstage/catalog-client@1.1.1
  - @backstage/core-plugin-api@1.0.7
  - @backstage/theme@0.2.16

## 0.2.22-next.2

### Patch Changes

- Updated dependencies
  - @backstage/plugin-catalog-react@1.2.0-next.2
  - @backstage/catalog-client@1.1.1-next.2
  - @backstage/catalog-model@1.1.2-next.2
  - @backstage/core-components@0.11.2-next.2
  - @backstage/core-plugin-api@1.0.7-next.2
  - @backstage/theme@0.2.16

## 0.2.22-next.1

### Patch Changes

- Updated dependencies
  - @backstage/plugin-catalog-react@1.2.0-next.1
  - @backstage/catalog-client@1.1.1-next.1
  - @backstage/core-components@0.11.2-next.1
  - @backstage/core-plugin-api@1.0.7-next.1
  - @backstage/catalog-model@1.1.2-next.1
  - @backstage/theme@0.2.16

## 0.2.22-next.0

### Patch Changes

- Updated dependencies
  - @backstage/catalog-model@1.1.2-next.0
  - @backstage/core-components@0.11.2-next.0
  - @backstage/catalog-client@1.1.1-next.0
  - @backstage/plugin-catalog-react@1.1.5-next.0
  - @backstage/core-plugin-api@1.0.7-next.0
  - @backstage/theme@0.2.16

## 0.2.21

### Patch Changes

- 817f3196f6: Updated React Router dependencies to be peer dependencies.
- 7d47def9c4: Removed dependency on `@types/jest`.
- Updated dependencies
  - @backstage/core-components@0.11.1
  - @backstage/core-plugin-api@1.0.6
  - @backstage/plugin-catalog-react@1.1.4
  - @backstage/catalog-client@1.1.0
  - @backstage/catalog-model@1.1.1

## 0.2.21-next.2

### Patch Changes

- 7d47def9c4: Removed dependency on `@types/jest`.
- Updated dependencies
  - @backstage/plugin-catalog-react@1.1.4-next.2
  - @backstage/catalog-client@1.1.0-next.2
  - @backstage/catalog-model@1.1.1-next.0
  - @backstage/core-components@0.11.1-next.3
  - @backstage/core-plugin-api@1.0.6-next.3

## 0.2.21-next.1

### Patch Changes

- 817f3196f6: Updated React Router dependencies to be peer dependencies.
- Updated dependencies
  - @backstage/core-components@0.11.1-next.1
  - @backstage/core-plugin-api@1.0.6-next.1
  - @backstage/plugin-catalog-react@1.1.4-next.1

## 0.2.21-next.0

### Patch Changes

- Updated dependencies
  - @backstage/core-plugin-api@1.0.6-next.0
  - @backstage/core-components@0.11.1-next.0
  - @backstage/catalog-client@1.0.5-next.0
  - @backstage/plugin-catalog-react@1.1.4-next.0

## 0.2.20

### Patch Changes

- Updated dependencies
  - @backstage/core-components@0.11.0
  - @backstage/core-plugin-api@1.0.5
  - @backstage/plugin-catalog-react@1.1.3

## 0.2.20-next.1

### Patch Changes

- Updated dependencies
  - @backstage/plugin-catalog-react@1.1.3-next.2
  - @backstage/core-components@0.11.0-next.2

## 0.2.20-next.0

### Patch Changes

- Updated dependencies
  - @backstage/core-plugin-api@1.0.5-next.0
  - @backstage/plugin-catalog-react@1.1.3-next.0
  - @backstage/core-components@0.10.1-next.0

## 0.2.19

### Patch Changes

- Updated dependencies
  - @backstage/core-components@0.10.0
  - @backstage/catalog-model@1.1.0
  - @backstage/core-plugin-api@1.0.4
  - @backstage/catalog-client@1.0.4
  - @backstage/plugin-catalog-react@1.1.2
  - @backstage/theme@0.2.16

## 0.2.19-next.3

### Patch Changes

- Updated dependencies
  - @backstage/core-plugin-api@1.0.4-next.0
  - @backstage/core-components@0.10.0-next.3
  - @backstage/catalog-client@1.0.4-next.2
  - @backstage/catalog-model@1.1.0-next.3
  - @backstage/plugin-catalog-react@1.1.2-next.3

## 0.2.19-next.2

### Patch Changes

- Updated dependencies
  - @backstage/core-components@0.10.0-next.2
  - @backstage/catalog-model@1.1.0-next.2
  - @backstage/theme@0.2.16-next.1
  - @backstage/plugin-catalog-react@1.1.2-next.2

## 0.2.19-next.1

### Patch Changes

- Updated dependencies
  - @backstage/core-components@0.9.6-next.1
  - @backstage/catalog-model@1.1.0-next.1
  - @backstage/theme@0.2.16-next.0
  - @backstage/catalog-client@1.0.4-next.1
  - @backstage/plugin-catalog-react@1.1.2-next.1

## 0.2.19-next.0

### Patch Changes

- Updated dependencies
  - @backstage/catalog-model@1.1.0-next.0
  - @backstage/core-components@0.9.6-next.0
  - @backstage/catalog-client@1.0.4-next.0
  - @backstage/plugin-catalog-react@1.1.2-next.0

## 0.2.18

### Patch Changes

- Updated dependencies
  - @backstage/plugin-catalog-react@1.1.1
  - @backstage/core-components@0.9.5
  - @backstage/catalog-client@1.0.3
  - @backstage/core-plugin-api@1.0.3
  - @backstage/catalog-model@1.0.3

## 0.2.18-next.1

### Patch Changes

- Updated dependencies
  - @backstage/core-components@0.9.5-next.1
  - @backstage/catalog-client@1.0.3-next.0
  - @backstage/core-plugin-api@1.0.3-next.0
  - @backstage/catalog-model@1.0.3-next.0
  - @backstage/plugin-catalog-react@1.1.1-next.1

## 0.2.18-next.0

### Patch Changes

- Updated dependencies
  - @backstage/plugin-catalog-react@1.1.1-next.0
  - @backstage/core-components@0.9.5-next.0

## 0.2.17

### Patch Changes

- f2d4136b72: Fix kind filter error in the dev app
- Updated dependencies
  - @backstage/core-components@0.9.4
  - @backstage/core-plugin-api@1.0.2
  - @backstage/plugin-catalog-react@1.1.0
  - @backstage/catalog-client@1.0.2
  - @backstage/catalog-model@1.0.2

## 0.2.17-next.2

### Patch Changes

- Updated dependencies
  - @backstage/core-components@0.9.4-next.1
  - @backstage/plugin-catalog-react@1.1.0-next.2
  - @backstage/catalog-model@1.0.2-next.0
  - @backstage/core-plugin-api@1.0.2-next.1
  - @backstage/catalog-client@1.0.2-next.0

## 0.2.17-next.1

### Patch Changes

- Updated dependencies
  - @backstage/core-components@0.9.4-next.0
  - @backstage/core-plugin-api@1.0.2-next.0
  - @backstage/plugin-catalog-react@1.1.0-next.1

## 0.2.17-next.0

### Patch Changes

- Updated dependencies
  - @backstage/plugin-catalog-react@1.1.0-next.0

## 0.2.16

### Patch Changes

- 7c7919777e: build(deps-dev): bump `@testing-library/react-hooks` from 7.0.2 to 8.0.0
- 24254fd433: build(deps): bump `@testing-library/user-event` from 13.5.0 to 14.0.0
- 77800a32dd: Added renderNode and renderLabel property to EntityRelationsGraph to support customization using CustomNode and CustomLabel components
- 99063c39ae: Minor API report cleanup
- Updated dependencies
  - @backstage/plugin-catalog-react@1.0.1
  - @backstage/catalog-model@1.0.1
  - @backstage/core-components@0.9.3
  - @backstage/core-plugin-api@1.0.1
  - @backstage/catalog-client@1.0.1

## 0.2.16-next.3

### Patch Changes

- 24254fd433: build(deps): bump `@testing-library/user-event` from 13.5.0 to 14.0.0
- Updated dependencies
  - @backstage/core-components@0.9.3-next.2
  - @backstage/core-plugin-api@1.0.1-next.0
  - @backstage/plugin-catalog-react@1.0.1-next.3

## 0.2.16-next.2

### Patch Changes

- 99063c39ae: Minor API report cleanup
- Updated dependencies
  - @backstage/core-components@0.9.3-next.1
  - @backstage/plugin-catalog-react@1.0.1-next.2
  - @backstage/catalog-model@1.0.1-next.1

## 0.2.16-next.1

### Patch Changes

- 77800a32dd: Added renderNode and renderLabel property to EntityRelationsGraph to support customization using CustomNode and CustomLabel components
- Updated dependencies
  - @backstage/plugin-catalog-react@1.0.1-next.1

## 0.2.16-next.0

### Patch Changes

- Updated dependencies
  - @backstage/catalog-model@1.0.1-next.0
  - @backstage/plugin-catalog-react@1.0.1-next.0
  - @backstage/core-components@0.9.3-next.0
  - @backstage/catalog-client@1.0.1-next.0

## 0.2.15

### Patch Changes

- a422d7ce5e: chore(deps): bump `@testing-library/react` from 11.2.6 to 12.1.3
- f24ef7864e: Minor typo fixes
- Updated dependencies
  - @backstage/core-components@0.9.2
  - @backstage/core-plugin-api@1.0.0
  - @backstage/plugin-catalog-react@1.0.0
  - @backstage/catalog-model@1.0.0
  - @backstage/catalog-client@1.0.0

## 0.2.14

### Patch Changes

- bf95bb806c: Remove usages of now-removed `CatalogApi.getEntityByName`
- Updated dependencies
  - @backstage/plugin-catalog-react@0.9.0
  - @backstage/core-components@0.9.1
  - @backstage/catalog-model@0.13.0
  - @backstage/catalog-client@0.9.0

## 0.2.14-next.0

### Patch Changes

- bf95bb806c: Remove usages of now-removed `CatalogApi.getEntityByName`
- Updated dependencies
  - @backstage/plugin-catalog-react@0.9.0-next.0
  - @backstage/core-components@0.9.1-next.0
  - @backstage/catalog-model@0.13.0-next.0
  - @backstage/catalog-client@0.9.0-next.0

## 0.2.13

### Patch Changes

- 899f196af5: Use `getEntityByRef` instead of `getEntityByName` in the catalog client
- f41a293231: - **DEPRECATION**: Deprecated `formatEntityRefTitle` in favor of the new `humanizeEntityRef` method instead. Please migrate to using the new method instead.
- 36aa63022b: Use `CompoundEntityRef` instead of `EntityName`, and `getCompoundEntityRef` instead of `getEntityName`, from `@backstage/catalog-model`.
- Updated dependencies
  - @backstage/catalog-model@0.12.0
  - @backstage/catalog-client@0.8.0
  - @backstage/core-components@0.9.0
  - @backstage/plugin-catalog-react@0.8.0
  - @backstage/core-plugin-api@0.8.0

## 0.2.12

### Patch Changes

- a8331830f1: Remove use of deprecated `useEntityKinds` hook.
- 6e1cbc12a6: Updated according to the new `getEntityFacets` catalog API method
- 919cf2f836: Minor updates to match the new `targetRef` field of relations, and to stop consuming the `target` field
- Updated dependencies
  - @backstage/core-components@0.8.10
  - @backstage/plugin-catalog-react@0.7.0
  - @backstage/catalog-model@0.11.0
  - @backstage/catalog-client@0.7.2
  - @backstage/core-plugin-api@0.7.0

## 0.2.11

### Patch Changes

- c77c5c7eb6: Added `backstage.role` to `package.json`
- 538ca90790: Use updated type names from `@backstage/catalog-client`
- deaf6065db: Adapt to the new `CatalogApi.getLocationByRef`
- 7aeb491394: Replace use of deprecated `ENTITY_DEFAULT_NAMESPACE` constant with `DEFAULT_NAMESPACE`.
- Updated dependencies
  - @backstage/catalog-client@0.7.0
  - @backstage/core-components@0.8.9
  - @backstage/core-plugin-api@0.6.1
  - @backstage/plugin-catalog-react@0.6.15
  - @backstage/catalog-model@0.10.0
  - @backstage/theme@0.2.15

## 0.2.10

### Patch Changes

- 7bb1bde7f6: Minor API cleanups
- Updated dependencies
  - @backstage/catalog-client@0.6.0
  - @backstage/core-components@0.8.8
  - @backstage/plugin-catalog-react@0.6.14

## 0.2.10-next.0

### Patch Changes

- 7bb1bde7f6: Minor API cleanups
- Updated dependencies
  - @backstage/core-components@0.8.8-next.0
  - @backstage/plugin-catalog-react@0.6.14-next.0

## 0.2.9

### Patch Changes

- Updated dependencies
  - @backstage/core-components@0.8.7
  - @backstage/plugin-catalog-react@0.6.13

## 0.2.9-next.0

### Patch Changes

- Updated dependencies
  - @backstage/core-components@0.8.7-next.0
  - @backstage/plugin-catalog-react@0.6.13-next.0

## 0.2.8

### Patch Changes

- a3c4438abf: Deprecated the external `catalogEntity` route as this is now imported directly from `@backstage/plugin-catalog-react` instead.

  This means you can remove the route binding from your `App.tsx`:

  ```diff
  -    bind(catalogGraphPlugin.externalRoutes, {
  -      catalogEntity: catalogPlugin.routes.catalogEntity,
  -    });
  ```

- Updated dependencies
  - @backstage/core-components@0.8.6

## 0.2.7

### Patch Changes

- Updated dependencies
  - @backstage/core-components@0.8.5
  - @backstage/core-plugin-api@0.6.0
  - @backstage/plugin-catalog-react@0.6.12
  - @backstage/catalog-model@0.9.10
  - @backstage/catalog-client@0.5.5

## 0.2.7-next.0

### Patch Changes

- Updated dependencies
  - @backstage/core-components@0.8.5-next.0
  - @backstage/core-plugin-api@0.6.0-next.0
  - @backstage/plugin-catalog-react@0.6.12-next.0
  - @backstage/catalog-model@0.9.10-next.0
  - @backstage/catalog-client@0.5.5-next.0

## 0.2.6

### Patch Changes

- Updated dependencies
  - @backstage/core-components@0.8.4
  - @backstage/core-plugin-api@0.5.0
  - @backstage/plugin-catalog-react@0.6.11
  - @backstage/catalog-client@0.5.4
  - @backstage/catalog-model@0.9.9

## 0.2.5

### Patch Changes

- 4ce51ab0f1: Internal refactor of the `react-use` imports to use `react-use/lib/*` instead.
- Updated dependencies
  - @backstage/core-plugin-api@0.4.1
  - @backstage/plugin-catalog-react@0.6.10
  - @backstage/core-components@0.8.3

## 0.2.4

### Patch Changes

- Updated dependencies
  - @backstage/core-plugin-api@0.4.0
  - @backstage/plugin-catalog-react@0.6.8
  - @backstage/core-components@0.8.2
  - @backstage/catalog-client@0.5.3

## 0.2.3

### Patch Changes

- cd450844f6: Moved React dependencies to `peerDependencies` and allow both React v16 and v17 to be used.
- Updated dependencies
  - @backstage/core-components@0.8.0
  - @backstage/core-plugin-api@0.3.0
  - @backstage/plugin-catalog-react@0.6.5

## 0.2.2

### Patch Changes

- a125278b81: Refactor out the deprecated path and icon from RouteRefs
- Updated dependencies
  - @backstage/catalog-client@0.5.2
  - @backstage/catalog-model@0.9.7
  - @backstage/plugin-catalog-react@0.6.4
  - @backstage/core-components@0.7.4
  - @backstage/core-plugin-api@0.2.0

## 0.2.1

### Patch Changes

- ce0aef1841: Capture analytics events for clicks in the graph.
- Updated dependencies
  - @backstage/core-components@0.7.1
  - @backstage/core-plugin-api@0.1.11
  - @backstage/plugin-catalog-react@0.6.1
  - @backstage/catalog-model@0.9.5

## 0.2.0

### Minor Changes

- 5c42360577: Add documentation and more type safety around DependencyGraph

### Patch Changes

- Updated dependencies
  - @backstage/plugin-catalog-react@0.6.0
  - @backstage/core-components@0.7.0
  - @backstage/theme@0.2.11

## 0.1.3

### Patch Changes

- 81a41ec249: Added a `name` key to all extensions in order to improve Analytics API metadata.
- Updated dependencies
  - @backstage/core-components@0.6.1
  - @backstage/core-plugin-api@0.1.10
  - @backstage/plugin-catalog-react@0.5.2
  - @backstage/catalog-model@0.9.4
  - @backstage/catalog-client@0.5.0

## 0.1.2

### Patch Changes

- Updated dependencies
  - @backstage/core-plugin-api@0.1.9
  - @backstage/core-components@0.6.0
  - @backstage/plugin-catalog-react@0.5.1

## 0.1.1

### Patch Changes

- c0eb1fb9df: Make zooming configurable for `<CatalogGraphCard>` and disable it by default.
  This resolves an issue that scrolling on the entity page is sometimes captured
  by the graph making the page hard to use.
- Updated dependencies
  - @backstage/core-components@0.5.0
  - @backstage/catalog-client@0.4.0
  - @backstage/plugin-catalog-react@0.5.0
  - @backstage/catalog-model@0.9.3
