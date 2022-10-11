# @backstage/plugin-github-pull-requests-board

## 0.1.4-next.2

### Patch Changes

- Updated dependencies
  - @backstage/plugin-catalog-react@1.2.0-next.2
  - @backstage/catalog-model@1.1.2-next.2
  - @backstage/core-components@0.11.2-next.2
  - @backstage/core-plugin-api@1.0.7-next.2
  - @backstage/integration@1.3.2-next.2
  - @backstage/theme@0.2.16

## 0.1.4-next.1

### Patch Changes

- 719ccbb963: Properly filter on relations instead of the spec, when finding by owner
- Updated dependencies
  - @backstage/plugin-catalog-react@1.2.0-next.1
  - @backstage/core-components@0.11.2-next.1
  - @backstage/core-plugin-api@1.0.7-next.1
  - @backstage/catalog-model@1.1.2-next.1
  - @backstage/integration@1.3.2-next.1
  - @backstage/theme@0.2.16

## 0.1.4-next.0

### Patch Changes

- Updated dependencies
  - @backstage/catalog-model@1.1.2-next.0
  - @backstage/core-components@0.11.2-next.0
  - @backstage/plugin-catalog-react@1.1.5-next.0
  - @backstage/core-plugin-api@1.0.7-next.0
  - @backstage/integration@1.3.2-next.0
  - @backstage/theme@0.2.16

## 0.1.3

### Patch Changes

- 7d47def9c4: Removed dependency on `@types/jest`.
- 2665ee4ed4: Clarified GitHub app permissions required by plugin
- d669d89206: Minor API signatures cleanup
- 667d917488: Updated dependency `msw` to `^0.47.0`.
- 87ec2ba4d6: Updated dependency `msw` to `^0.46.0`.
- bf5e9030eb: Updated dependency `msw` to `^0.45.0`.
- 723113296b: Add optional `pullRequestLimit` prop to `EntityTeamPullRequestsCard` and `EntityTeamPullRequestsContent` to limit the number of PRs shown per repository. Excluding this prop will default the number of pull requests shown to 10 per repository (the existing functionality).
- Updated dependencies
  - @backstage/core-components@0.11.1
  - @backstage/core-plugin-api@1.0.6
  - @backstage/plugin-catalog-react@1.1.4
  - @backstage/integration@1.3.1
  - @backstage/catalog-model@1.1.1

## 0.1.3-next.3

### Patch Changes

- 7d47def9c4: Removed dependency on `@types/jest`.
- Updated dependencies
  - @backstage/plugin-catalog-react@1.1.4-next.2
  - @backstage/catalog-model@1.1.1-next.0
  - @backstage/core-components@0.11.1-next.3
  - @backstage/core-plugin-api@1.0.6-next.3
  - @backstage/integration@1.3.1-next.2

## 0.1.3-next.2

### Patch Changes

- 2665ee4ed4: Clarified GitHub app permissions required by plugin
- 667d917488: Updated dependency `msw` to `^0.47.0`.
- 87ec2ba4d6: Updated dependency `msw` to `^0.46.0`.
- Updated dependencies
  - @backstage/integration@1.3.1-next.1
  - @backstage/core-components@0.11.1-next.2
  - @backstage/core-plugin-api@1.0.6-next.2

## 0.1.3-next.1

### Patch Changes

- d669d89206: Minor API signatures cleanup
- 723113296b: Add optional `pullRequestLimit` prop to `EntityTeamPullRequestsCard` and `EntityTeamPullRequestsContent` to limit the number of PRs shown per repository. Excluding this prop will default the number of pull requests shown to 10 per repository (the existing functionality).
- Updated dependencies
  - @backstage/core-components@0.11.1-next.1
  - @backstage/core-plugin-api@1.0.6-next.1
  - @backstage/plugin-catalog-react@1.1.4-next.1

## 0.1.3-next.0

### Patch Changes

- bf5e9030eb: Updated dependency `msw` to `^0.45.0`.
- Updated dependencies
  - @backstage/core-plugin-api@1.0.6-next.0
  - @backstage/core-components@0.11.1-next.0
  - @backstage/integration@1.3.1-next.0
  - @backstage/plugin-catalog-react@1.1.4-next.0

## 0.1.2

### Patch Changes

- 73268a67ff: Fixed rendering when PR contains references to deleted Github accounts
- Updated dependencies
  - @backstage/integration@1.3.0
  - @backstage/core-components@0.11.0
  - @backstage/core-plugin-api@1.0.5
  - @backstage/plugin-catalog-react@1.1.3

## 0.1.2-next.1

### Patch Changes

- Updated dependencies
  - @backstage/plugin-catalog-react@1.1.3-next.2
  - @backstage/core-components@0.11.0-next.2

## 0.1.2-next.0

### Patch Changes

- 73268a67ff: Fixed rendering when PR contains references to deleted Github accounts
- Updated dependencies
  - @backstage/integration@1.3.0-next.0
  - @backstage/core-plugin-api@1.0.5-next.0
  - @backstage/plugin-catalog-react@1.1.3-next.0
  - @backstage/core-components@0.10.1-next.0

## 0.1.1

### Patch Changes

- c6690d9d24: Fix bug on fetching teams repositories where were being filtered by type service unnecessarily
- 04e1504e85: Support namespaced teams and fetch all kinds
- 9de15a41d7: Upgrade @octokit/rest to 19.0.3
- a70869e775: Updated dependency `msw` to `^0.43.0`.
- 8006d0f9bf: Updated dependency `msw` to `^0.44.0`.
- Updated dependencies
  - @backstage/core-components@0.10.0
  - @backstage/catalog-model@1.1.0
  - @backstage/core-plugin-api@1.0.4
  - @backstage/integration@1.2.2
  - @backstage/plugin-catalog-react@1.1.2
  - @backstage/theme@0.2.16

## 0.1.1-next.3

### Patch Changes

- a70869e775: Updated dependency `msw` to `^0.43.0`.
- Updated dependencies
  - @backstage/core-plugin-api@1.0.4-next.0
  - @backstage/core-components@0.10.0-next.3
  - @backstage/integration@1.2.2-next.3
  - @backstage/catalog-model@1.1.0-next.3
  - @backstage/plugin-catalog-react@1.1.2-next.3

## 0.1.1-next.2

### Patch Changes

- Updated dependencies
  - @backstage/core-components@0.10.0-next.2
  - @backstage/catalog-model@1.1.0-next.2
  - @backstage/theme@0.2.16-next.1
  - @backstage/integration@1.2.2-next.2
  - @backstage/plugin-catalog-react@1.1.2-next.2

## 0.1.1-next.1

### Patch Changes

- Updated dependencies
  - @backstage/core-components@0.9.6-next.1
  - @backstage/catalog-model@1.1.0-next.1
  - @backstage/theme@0.2.16-next.0
  - @backstage/integration@1.2.2-next.1
  - @backstage/plugin-catalog-react@1.1.2-next.1

## 0.1.1-next.0

### Patch Changes

- c6690d9d24: Fix bug on fetching teams repositories where were being filtered by type service unnecessarily
- 04e1504e85: Support namespaced teams and fetch all kinds
- Updated dependencies
  - @backstage/catalog-model@1.1.0-next.0
  - @backstage/core-components@0.9.6-next.0
  - @backstage/integration@1.2.2-next.0
  - @backstage/plugin-catalog-react@1.1.2-next.0

## 0.1.0

### Minor Changes

- fc9927c81d: Add Github Pull Requests board plugin

### Patch Changes

- 8f7b1835df: Updated dependency `msw` to `^0.41.0`.
- Updated dependencies
  - @backstage/plugin-catalog-react@1.1.1
  - @backstage/core-components@0.9.5
  - @backstage/integration@1.2.1
  - @backstage/core-plugin-api@1.0.3
  - @backstage/catalog-model@1.0.3

## 0.1.0-next.0

### Minor Changes

- fc9927c81d: Add Github Pull Requests board plugin

### Patch Changes

- 8f7b1835df: Updated dependency `msw` to `^0.41.0`.
- Updated dependencies
  - @backstage/core-components@0.9.5-next.1
  - @backstage/core-plugin-api@1.0.3-next.0
  - @backstage/integration@1.2.1-next.1
  - @backstage/catalog-model@1.0.3-next.0
  - @backstage/plugin-catalog-react@1.1.1-next.1
