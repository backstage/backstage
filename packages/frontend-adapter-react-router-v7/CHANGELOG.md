# @backstage/frontend-adapter-react-router-v7

## 0.2.0-next.0

### Minor Changes

- 1fba2bb: Added `ReactRouterV7PageRouter` for page-scoped React Router v7 routing with app-owned history; React Router v7 is a peer dependency. Render it inside a lazily loaded page or sub-page component to support relative links, nested routes, and route parameters. See the [1.57 migration notes](https://backstage.io/docs/frontend-system/architecture/migrations#157) for detailed migration steps and the [page router guide](https://backstage.io/docs/frontend-system/building-plugins/page-routers#use-react-router-v7) for setup and nesting examples.

### Patch Changes

- Updated dependencies
  - @backstage/frontend-plugin-api@0.19.0-next.2
  - @backstage/filter-predicates@0.2.1-next.0
