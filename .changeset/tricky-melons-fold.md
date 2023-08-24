---
'@backstage/backend-app-api': minor
---

refactor!: updated `ServiceRegistry` to have a static create method and private constructor.
fix: updated `ServiceRegistry` to perform circular dependency check on creation.
fix: updated `detectCircularDependency` in `DependencyGraph` to return circular dependencies starting from the first node
