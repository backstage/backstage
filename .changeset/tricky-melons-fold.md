---
'@backstage/backend-app-api': patch
---

fix: :bug: implemented a circular dependency check in the `ServiceRegistry`
fix: :bug: updated `detectCircularDependency` in `DependencyGraph` to return circular dependencies starting from the first node
