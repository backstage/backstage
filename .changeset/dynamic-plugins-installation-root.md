---
'@backstage/backend-dynamic-feature-service': patch
---

The dynamic plugins root directory is now resolved from the root of the Backstage installation, while modules shared with the backend are still resolved from the root of the workspace, as groundwork for pnpm support. In a Yarn workspace both are the same directory, so nothing changes.
