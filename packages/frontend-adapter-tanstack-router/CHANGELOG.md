# @backstage/frontend-adapter-tanstack-router

## 0.2.0-next.0

### Minor Changes

- 1fba2bb: Added `TanStackPageRouter` for page-scoped TanStack routing with app-owned history, including `createTanStackPageRouter` and `TanStackPageContent` for plugin-owned route trees; `@tanstack/react-router` and `@tanstack/history` are peer dependencies. See the [1.57 migration notes](https://backstage.io/docs/frontend-system/architecture/migrations#157) for detailed migration steps and the [TanStack page router guide](https://backstage.io/docs/frontend-system/building-plugins/page-routers#use-tanstack-router) for setup, navigation blockers, and custom history requirements.

### Patch Changes

- Updated dependencies
  - @backstage/frontend-plugin-api@0.19.0-next.2
  - @backstage/filter-predicates@0.2.1-next.0
