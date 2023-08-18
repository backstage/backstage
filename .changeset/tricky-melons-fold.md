---
'@backstage/backend-app-api': patch
---

fix: :bug: implemented up front circular dependency check in the `BackendInitializer`
fix: :bug: updated `detectCircularDependency` in `DependencyGraph` to return circular dependencies starting from the first node
