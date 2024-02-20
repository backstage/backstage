# @backstage/plugin-scaffolder-backend-module-gitea

## 0.1.0

### Minor Changes

- 458bf21: Created a gitea module for the scaffolder. This module provides a new action "publish:gitea" able to create a gitea repository owned by an organization. See: https://gitea.com/api/swagger#/organization/createOrgRepo

### Patch Changes

- ef0f44e: - Fix issue for infinite loop when repository already exists
  - Log the root cause of error reported by `checkGiteaOrg`
- Updated dependencies
  - @backstage/backend-plugin-api@0.6.10
  - @backstage/integration@1.9.0
  - @backstage/plugin-scaffolder-node@0.3.0
  - @backstage/config@1.1.1
  - @backstage/errors@1.2.3
