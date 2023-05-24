---
'@backstage/core-app-api': patch
'@backstage/core-plugin-api': patch
'@backstage/dev-utils': patch
'@backstage/plugin-scaffolder-react': patch
'@backstage/plugin-scaffolder': patch
---

Add `PropsWithChildren` to usages of `ComponentType`, in preparation for React 18 where the children are no longer implicit.
