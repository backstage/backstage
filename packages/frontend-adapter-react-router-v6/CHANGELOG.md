# @backstage/frontend-adapter-react-router-v6

## 0.2.0

### Minor Changes

- 1fba2bb: Added `ReactRouterV6PageRouter` for page-scoped React Router v6 routing with app-owned history; React Router v6 is a peer dependency. Render it inside a lazily loaded page or sub-page component to support relative links, nested routes, and route parameters. See the [1.57 migration notes](https://backstage.io/docs/frontend-system/architecture/migrations#157) for detailed migration steps and the [page router guide](https://backstage.io/docs/frontend-system/building-plugins/page-routers#use-react-router-v6) for setup and nesting examples.

### Patch Changes

- 4bbc7a9: Removed explicit support for React 17: the peer dependency range for `react`, `react-dom` and `@types/react` is now `^18.0.0`. React 17 is no longer tested or guaranteed to work, although it may continue to work in some cases. See the [migration guide](https://backstage.io/docs/frontend-system/architecture/migrations#157).
- 9d0a31b: Removed an unused `use-sync-external-store` dependency, which is no longer needed now that React 18 is the minimum supported version.
- Updated dependencies
  - @backstage/frontend-plugin-api@1.0.0
  - @backstage/errors@1.4.0
  - @backstage/version-bridge@1.1.0
  - @backstage/filter-predicates@0.2.1

## 0.2.0-next.0

### Minor Changes

- 1fba2bb: Added `ReactRouterV6PageRouter` for page-scoped React Router v6 routing with app-owned history; React Router v6 is a peer dependency. Render it inside a lazily loaded page or sub-page component to support relative links, nested routes, and route parameters. See the [1.57 migration notes](https://backstage.io/docs/frontend-system/architecture/migrations#157) for detailed migration steps and the [page router guide](https://backstage.io/docs/frontend-system/building-plugins/page-routers#use-react-router-v6) for setup and nesting examples.

### Patch Changes

- Updated dependencies
  - @backstage/frontend-plugin-api@0.19.0-next.2
  - @backstage/filter-predicates@0.2.1-next.0
