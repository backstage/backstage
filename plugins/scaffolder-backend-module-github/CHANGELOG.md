# @backstage/plugin-scaffolder-backend-module-github

## 0.5.5-next.2

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@1.1.1-next.1
  - @backstage/catalog-model@1.7.3-next.0
  - @backstage/config@1.3.2-next.0
  - @backstage/errors@1.2.7-next.0
  - @backstage/plugin-scaffolder-node@0.6.3-next.1
  - @backstage/catalog-client@1.9.1-next.0
  - @backstage/integration@1.16.1-next.0

## 0.5.5-next.1

### Patch Changes

- edaf925: Updates to allow users to subscribe to the newly created repository within GitHub to mimic similar functionality found within the GitHub UI.

## 0.5.5-next.0

### Patch Changes

- Updated dependencies
  - @backstage/plugin-scaffolder-node@0.6.3-next.0
  - @backstage/backend-plugin-api@1.1.1-next.0
  - @backstage/catalog-client@1.9.0
  - @backstage/catalog-model@1.7.2
  - @backstage/config@1.3.1
  - @backstage/errors@1.2.6
  - @backstage/integration@1.16.0

## 0.5.4

### Patch Changes

- 7df6179: adding requiredLinearHistory property for branch protection settings
- b5e002b: Change `github:environment:create` action to request and use a token when resolving reviewer entity refs from the Backstage catalog.
- e913fdf: Add github backend module to create-app and improve error messages
- 973dd6f: Minor spell fix in action parameters
- Updated dependencies
  - @backstage/integration@1.16.0
  - @backstage/backend-plugin-api@1.1.0
  - @backstage/plugin-scaffolder-node@0.6.2
  - @backstage/catalog-client@1.9.0
  - @backstage/errors@1.2.6
  - @backstage/catalog-model@1.7.2
  - @backstage/config@1.3.1

## 0.5.4-next.2

### Patch Changes

- e913fdf: Add github backend module to create-app and improve error messages
- Updated dependencies
  - @backstage/backend-plugin-api@1.1.0-next.2
  - @backstage/errors@1.2.6-next.0
  - @backstage/plugin-scaffolder-node@0.6.2-next.2
  - @backstage/catalog-client@1.9.0-next.2
  - @backstage/catalog-model@1.7.2-next.0
  - @backstage/config@1.3.1-next.0
  - @backstage/integration@1.16.0-next.1

## 0.5.4-next.1

### Patch Changes

- Updated dependencies
  - @backstage/catalog-client@1.9.0-next.1
  - @backstage/plugin-scaffolder-node@0.6.2-next.1
  - @backstage/backend-plugin-api@1.1.0-next.1
  - @backstage/catalog-model@1.7.1
  - @backstage/config@1.3.0
  - @backstage/errors@1.2.5
  - @backstage/integration@1.16.0-next.0

## 0.5.3-next.0

### Patch Changes

- Updated dependencies
  - @backstage/integration@1.16.0-next.0
  - @backstage/backend-plugin-api@1.0.3-next.0
  - @backstage/plugin-scaffolder-node@0.6.1-next.0
  - @backstage/catalog-client@1.8.1-next.0
  - @backstage/catalog-model@1.7.1
  - @backstage/config@1.3.0
  - @backstage/errors@1.2.5

## 0.5.2

### Patch Changes

- Updated dependencies
  - @backstage/catalog-client@1.8.0
  - @backstage/config@1.3.0
  - @backstage/backend-plugin-api@1.0.2
  - @backstage/plugin-scaffolder-node@0.6.0
  - @backstage/catalog-model@1.7.1
  - @backstage/errors@1.2.5
  - @backstage/integration@1.15.2

## 0.5.2-next.3

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@1.0.2-next.2
  - @backstage/catalog-client@1.8.0-next.1
  - @backstage/catalog-model@1.7.0
  - @backstage/config@1.2.0
  - @backstage/errors@1.2.4
  - @backstage/integration@1.15.1
  - @backstage/plugin-scaffolder-node@0.5.1-next.3

## 0.5.2-next.2

### Patch Changes

- Updated dependencies
  - @backstage/catalog-client@1.8.0-next.1
  - @backstage/backend-plugin-api@1.0.2-next.2
  - @backstage/catalog-model@1.7.0
  - @backstage/config@1.2.0
  - @backstage/errors@1.2.4
  - @backstage/integration@1.15.1
  - @backstage/plugin-scaffolder-node@0.5.1-next.2

## 0.5.2-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@1.0.2-next.1
  - @backstage/catalog-client@1.8.0-next.0
  - @backstage/catalog-model@1.7.0
  - @backstage/config@1.2.0
  - @backstage/errors@1.2.4
  - @backstage/integration@1.15.1
  - @backstage/plugin-scaffolder-node@0.5.1-next.1

## 0.5.2-next.0

### Patch Changes

- Updated dependencies
  - @backstage/catalog-client@1.8.0-next.0
  - @backstage/backend-plugin-api@1.0.2-next.0
  - @backstage/catalog-model@1.7.0
  - @backstage/config@1.2.0
  - @backstage/errors@1.2.4
  - @backstage/integration@1.15.1
  - @backstage/plugin-scaffolder-node@0.5.1-next.0

## 0.5.1

### Patch Changes

- 8ce0c4c: Add `github:branch-protection:create` scaffolder action to set branch protection on an existing repository. Example usage:

  ```yaml
  - id: set-branch-protection
    name: Set Branch Protection
    action: github:branch-protection:create
    input:
      repoUrl: 'github.com?repo=backstage&owner=backstage'
      branch: master
      enforceAdmins: true # default
      requiredApprovingReviewCount: 1 # default
      requireBranchesToBeUpToDate: true # default
      requireCodeOwnerReviews: true
      dismissStaleReviews: true
      requiredConversationResolution: true
  ```

- 094eaa3: Remove references to in-repo backend-common
- Updated dependencies
  - @backstage/plugin-scaffolder-node@0.5.0
  - @backstage/integration@1.15.1
  - @backstage/catalog-client@1.7.1
  - @backstage/backend-plugin-api@1.0.1
  - @backstage/catalog-model@1.7.0
  - @backstage/config@1.2.0
  - @backstage/errors@1.2.4

## 0.5.1-next.2

### Patch Changes

- 8ce0c4c: Add `github:branch-protection:create` scaffolder action to set branch protection on an existing repository. Example usage:

  ```yaml
  - id: set-branch-protection
    name: Set Branch Protection
    action: github:branch-protection:create
    input:
      repoUrl: 'github.com?repo=backstage&owner=backstage'
      branch: master
      enforceAdmins: true # default
      requiredApprovingReviewCount: 1 # default
      requireBranchesToBeUpToDate: true # default
      requireCodeOwnerReviews: true
      dismissStaleReviews: true
      requiredConversationResolution: true
  ```

- Updated dependencies
  - @backstage/integration@1.15.1-next.1
  - @backstage/catalog-client@1.7.1-next.0
  - @backstage/plugin-scaffolder-node@0.5.0-next.2
  - @backstage/backend-plugin-api@1.0.1-next.1
  - @backstage/catalog-model@1.7.0
  - @backstage/config@1.2.0
  - @backstage/errors@1.2.4

## 0.5.1-next.1

### Patch Changes

- Updated dependencies
  - @backstage/integration@1.15.1-next.0
  - @backstage/backend-plugin-api@1.0.1-next.0
  - @backstage/catalog-client@1.7.0
  - @backstage/catalog-model@1.7.0
  - @backstage/config@1.2.0
  - @backstage/errors@1.2.4
  - @backstage/plugin-scaffolder-node@0.5.0-next.1

## 0.5.1-next.0

### Patch Changes

- 094eaa3: Remove references to in-repo backend-common
- Updated dependencies
  - @backstage/plugin-scaffolder-node@0.5.0-next.0
  - @backstage/backend-plugin-api@1.0.1-next.0
  - @backstage/catalog-client@1.7.0
  - @backstage/catalog-model@1.7.0
  - @backstage/config@1.2.0
  - @backstage/errors@1.2.4
  - @backstage/integration@1.15.0

## 0.5.0

### Minor Changes

- d425fc4: **BREAKING**: The return values from `createBackendPlugin`, `createBackendModule`, and `createServiceFactory` are now simply `BackendFeature` and `ServiceFactory`, instead of the previously deprecated form of a function that returns them. For this reason, `createServiceFactory` also no longer accepts the callback form where you provide direct options to the service. This also affects all `coreServices.*` service refs.

  This may in particular affect tests; if you were effectively doing `createBackendModule({...})()` (note the parentheses), you can now remove those extra parentheses at the end. You may encounter cases of this in your `packages/backend/src/index.ts` too, where you add plugins, modules, and services. If you were using `createServiceFactory` with a function as its argument for the purpose of passing in options, this pattern has been deprecated for a while and is no longer supported. You may want to explore the new multiton patterns to achieve your goals, or moving settings to app-config.

  As part of this change, the `IdentityFactoryOptions` type was removed, and can no longer be used to tweak that service. The identity service was also deprecated some time ago, and you will want to [migrate to the new auth system](https://backstage.io/docs/tutorials/auth-service-migration) if you still rely on it.

### Patch Changes

- 22a19e6: Added the ability for the actions `publish:github` and `github:repo:create` to take inputs for 'custom properties' for organization repositories.
- 162cdf4: Update dependency @octokit/webhooks to 10.9.2 due to SNYK-JS-OCTOKITWEBHOOKS-6129527
- 7976081: Added support for all request parameters in the Github create/update environment API in the Github environment create scaffolder action.

  Disable MultiEntityPicker when `maxItems` limit is reached defined in `JSONSchema`

- Updated dependencies
  - @backstage/backend-common@0.25.0
  - @backstage/backend-plugin-api@1.0.0
  - @backstage/catalog-model@1.7.0
  - @backstage/catalog-client@1.7.0
  - @backstage/integration@1.15.0
  - @backstage/config@1.2.0
  - @backstage/errors@1.2.4
  - @backstage/plugin-scaffolder-node@0.4.11

## 0.5.0-next.2

### Patch Changes

- 22a19e6: Added the ability for the actions `publish:github` and `github:repo:create` to take inputs for 'custom properties' for organization repositories.
- Updated dependencies
  - @backstage/backend-common@0.25.0-next.2
  - @backstage/backend-plugin-api@1.0.0-next.2
  - @backstage/integration@1.15.0-next.0
  - @backstage/config@1.2.0
  - @backstage/errors@1.2.4
  - @backstage/plugin-scaffolder-node@0.4.11-next.2

## 0.5.0-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.25.0-next.1
  - @backstage/backend-plugin-api@0.9.0-next.1
  - @backstage/config@1.2.0
  - @backstage/errors@1.2.4
  - @backstage/integration@1.14.0
  - @backstage/plugin-scaffolder-node@0.4.11-next.1

## 0.5.0-next.0

### Minor Changes

- d425fc4: **BREAKING**: The return values from `createBackendPlugin`, `createBackendModule`, and `createServiceFactory` are now simply `BackendFeature` and `ServiceFactory`, instead of the previously deprecated form of a function that returns them. For this reason, `createServiceFactory` also no longer accepts the callback form where you provide direct options to the service. This also affects all `coreServices.*` service refs.

  This may in particular affect tests; if you were effectively doing `createBackendModule({...})()` (note the parentheses), you can now remove those extra parentheses at the end. You may encounter cases of this in your `packages/backend/src/index.ts` too, where you add plugins, modules, and services. If you were using `createServiceFactory` with a function as its argument for the purpose of passing in options, this pattern has been deprecated for a while and is no longer supported. You may want to explore the new multiton patterns to achieve your goals, or moving settings to app-config.

  As part of this change, the `IdentityFactoryOptions` type was removed, and can no longer be used to tweak that service. The identity service was also deprecated some time ago, and you will want to [migrate to the new auth system](https://backstage.io/docs/tutorials/auth-service-migration) if you still rely on it.

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@0.9.0-next.0
  - @backstage/backend-common@0.25.0-next.0
  - @backstage/plugin-scaffolder-node@0.4.11-next.0
  - @backstage/config@1.2.0
  - @backstage/errors@1.2.4
  - @backstage/integration@1.14.0

## 0.4.1

### Patch Changes

- d21d307: Added examples for github:environment:create action and improve its test cases
- 6d4cb97: Added examples for github:repo:create action and improved test cases
- cd203f1: Added examples for action github:pages and improved its test cases
- Updated dependencies
  - @backstage/backend-plugin-api@0.8.0
  - @backstage/backend-common@0.24.0
  - @backstage/plugin-scaffolder-node@0.4.9
  - @backstage/integration@1.14.0
  - @backstage/config@1.2.0
  - @backstage/errors@1.2.4

## 0.4.1-next.3

### Patch Changes

- 6d4cb97: Added examples for github:repo:create action and improved test cases
- cd203f1: Added examples for action github:pages and improved its test cases
- Updated dependencies
  - @backstage/backend-plugin-api@0.8.0-next.3
  - @backstage/backend-common@0.23.4-next.3
  - @backstage/config@1.2.0
  - @backstage/errors@1.2.4
  - @backstage/integration@1.14.0-next.0
  - @backstage/plugin-scaffolder-node@0.4.9-next.3

## 0.4.1-next.2

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@0.8.0-next.2
  - @backstage/plugin-scaffolder-node@0.4.9-next.2
  - @backstage/backend-common@0.23.4-next.2
  - @backstage/integration@1.14.0-next.0
  - @backstage/config@1.2.0
  - @backstage/errors@1.2.4

## 0.4.1-next.1

### Patch Changes

- d21d307: Added examples for github:environment:create action and improve its test cases
- Updated dependencies
  - @backstage/backend-plugin-api@0.7.1-next.1
  - @backstage/backend-common@0.23.4-next.1
  - @backstage/integration@1.14.0-next.0
  - @backstage/config@1.2.0
  - @backstage/errors@1.2.4
  - @backstage/plugin-scaffolder-node@0.4.9-next.1

## 0.4.1-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.23.4-next.0
  - @backstage/integration@1.14.0-next.0
  - @backstage/backend-plugin-api@0.7.1-next.0
  - @backstage/config@1.2.0
  - @backstage/errors@1.2.4
  - @backstage/plugin-scaffolder-node@0.4.9-next.0

## 0.4.0

### Minor Changes

- 70c4b36: Adds support for custom tag policies when creating GitHub environments.

### Patch Changes

- ccfc9d1: Fixed bug resulting from missing required owner and repo arguments in `getEnvironmentPublicKey` in action `github:environment:create`.

  Adding environment secrets now works as expected.

- 141f366: Added action to enable GitHub Pages on a repo
- 4410fed: Fixed issue with octokit call missing owner and repo when creating environment variables and secrets using github:environment:create action
- dfaa28d: Adds `requireLastPushApproval` input property to configure Branch Protection Settings in `github:publish` action

  Adds `requireLastPushApproval` input property to configure Branch Protection Settings in `github:repo:push` action

- Updated dependencies
  - @backstage/backend-plugin-api@0.7.0
  - @backstage/backend-common@0.23.3
  - @backstage/integration@1.13.0
  - @backstage/plugin-scaffolder-node@0.4.8
  - @backstage/config@1.2.0
  - @backstage/errors@1.2.4

## 0.4.0-next.1

### Patch Changes

- 141f366: Added action to enable GitHub Pages on a repo
- dfaa28d: Adds `requireLastPushApproval` input property to configure Branch Protection Settings in `github:publish` action

  Adds `requireLastPushApproval` input property to configure Branch Protection Settings in `github:repo:push` action

- Updated dependencies
  - @backstage/backend-common@0.23.3-next.1
  - @backstage/backend-plugin-api@0.6.22-next.1
  - @backstage/config@1.2.0
  - @backstage/errors@1.2.4
  - @backstage/integration@1.13.0-next.0
  - @backstage/plugin-scaffolder-node@0.4.8-next.1

## 0.4.0-next.0

### Minor Changes

- 70c4b36: Adds support for custom tag policies when creating GitHub environments.

### Patch Changes

- 4410fed: Fixed issue with octokit call missing owner and repo when creating environment variables and secrets using github:environment:create action
- Updated dependencies
  - @backstage/backend-plugin-api@0.6.21-next.0
  - @backstage/backend-common@0.23.2-next.0
  - @backstage/integration@1.13.0-next.0
  - @backstage/plugin-scaffolder-node@0.4.7-next.0
  - @backstage/config@1.2.0
  - @backstage/errors@1.2.4

## 0.3.0

### Minor Changes

- 403394a: Allow empty author info in createPullRequest action for Github

### Patch Changes

- f145a04: Added handling for dry run to githubPullRequest and githubWebhook and added tests for this functionality
- 78a0b08: Internal refactor to handle `BackendFeature` contract change.
- d44a20a: Added additional plugin metadata to `package.json`.
- Updated dependencies
  - @backstage/backend-common@0.23.0
  - @backstage/backend-plugin-api@0.6.19
  - @backstage/integration@1.12.0
  - @backstage/plugin-scaffolder-node@0.4.5
  - @backstage/config@1.2.0
  - @backstage/errors@1.2.4

## 0.3.0-next.3

### Patch Changes

- d44a20a: Added additional plugin metadata to `package.json`.
- Updated dependencies
  - @backstage/backend-plugin-api@0.6.19-next.3
  - @backstage/integration@1.12.0-next.1
  - @backstage/plugin-scaffolder-node@0.4.5-next.3
  - @backstage/backend-common@0.23.0-next.3
  - @backstage/config@1.2.0
  - @backstage/errors@1.2.4

## 0.3.0-next.2

### Minor Changes

- 403394a: Allow empty author info in createPullRequest action for Github

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@0.6.19-next.2
  - @backstage/backend-common@0.23.0-next.2
  - @backstage/integration@1.12.0-next.0
  - @backstage/plugin-scaffolder-node@0.4.5-next.2
  - @backstage/config@1.2.0
  - @backstage/errors@1.2.4

## 0.2.9-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@0.6.19-next.1
  - @backstage/backend-common@0.23.0-next.1
  - @backstage/plugin-scaffolder-node@0.4.5-next.1

## 0.2.9-next.0

### Patch Changes

- f145a04: Added handling for dry run to githubPullRequest and githubWebhook and added tests for this functionality
- Updated dependencies
  - @backstage/backend-common@0.22.1-next.0
  - @backstage/backend-plugin-api@0.6.19-next.0
  - @backstage/plugin-scaffolder-node@0.4.5-next.0
  - @backstage/config@1.2.0
  - @backstage/errors@1.2.4
  - @backstage/integration@1.11.0

## 0.2.8

### Patch Changes

- 5d99272: Update local development dependencies.
- d229dc4: Move path utilities from `backend-common` to the `backend-plugin-api` package.
- 52ab241: Adding support to change the default commit author for `publish:github:pull-request`
- Updated dependencies
  - @backstage/backend-common@0.22.0
  - @backstage/backend-plugin-api@0.6.18
  - @backstage/plugin-scaffolder-node@0.4.4
  - @backstage/integration@1.11.0

## 0.2.8-next.2

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.22.0-next.2
  - @backstage/plugin-scaffolder-node@0.4.4-next.2
  - @backstage/integration@1.11.0-next.0

## 0.2.8-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.22.0-next.1
  - @backstage/plugin-scaffolder-node@0.4.4-next.1
  - @backstage/backend-plugin-api@0.6.18-next.1

## 0.2.8-next.0

### Patch Changes

- 5d99272: Update local development dependencies.
- Updated dependencies
  - @backstage/backend-common@0.21.8-next.0
  - @backstage/backend-plugin-api@0.6.18-next.0
  - @backstage/plugin-scaffolder-node@0.4.4-next.0
  - @backstage/config@1.2.0
  - @backstage/errors@1.2.4
  - @backstage/integration@1.10.0

## 0.2.7

### Patch Changes

- d5a1fe1: Replaced winston logger with `LoggerService`
- 33f958a: Improve examples to ensure consistency across all publish actions
- Updated dependencies
  - @backstage/backend-common@0.21.7
  - @backstage/backend-plugin-api@0.6.17
  - @backstage/integration@1.10.0
  - @backstage/plugin-scaffolder-node@0.4.3
  - @backstage/config@1.2.0
  - @backstage/errors@1.2.4

## 0.2.7-next.1

### Patch Changes

- 33f958a: Improve examples to ensure consistency across all publish actions
- Updated dependencies
  - @backstage/backend-common@0.21.7-next.1
  - @backstage/backend-plugin-api@0.6.17-next.1
  - @backstage/plugin-scaffolder-node@0.4.3-next.1
  - @backstage/config@1.2.0
  - @backstage/errors@1.2.4
  - @backstage/integration@1.10.0-next.0

## 0.2.7-next.0

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.21.7-next.0
  - @backstage/integration@1.10.0-next.0
  - @backstage/backend-plugin-api@0.6.17-next.0
  - @backstage/config@1.2.0
  - @backstage/errors@1.2.4
  - @backstage/plugin-scaffolder-node@0.4.3-next.0

## 0.2.6

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.21.6
  - @backstage/backend-plugin-api@0.6.16
  - @backstage/plugin-scaffolder-node@0.4.2
  - @backstage/config@1.2.0
  - @backstage/errors@1.2.4
  - @backstage/integration@1.9.1

## 0.2.5

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.21.5
  - @backstage/plugin-scaffolder-node@0.4.1
  - @backstage/backend-plugin-api@0.6.15
  - @backstage/config@1.2.0
  - @backstage/errors@1.2.4
  - @backstage/integration@1.9.1

## 0.2.4

### Patch Changes

- f44589d: Introduced `createMockActionContext` to unify the way of creating scaffolder mock context.

  It will help to maintain tests in a long run during structural changes of action context.

- 35fe005: Export `getOctokitOptions` for easy re-use of Octokit configuration handling
- 1753898: Updated dependency `octokit-plugin-create-pull-request` to `^5.0.0`.
- Updated dependencies
  - @backstage/plugin-scaffolder-node@0.4.0
  - @backstage/backend-common@0.21.4
  - @backstage/integration@1.9.1
  - @backstage/config@1.2.0
  - @backstage/errors@1.2.4
  - @backstage/backend-plugin-api@0.6.14

## 0.2.4-next.2

### Patch Changes

- Updated dependencies
  - @backstage/plugin-scaffolder-node@0.4.0-next.2
  - @backstage/integration@1.9.1-next.2
  - @backstage/backend-common@0.21.4-next.2
  - @backstage/backend-plugin-api@0.6.14-next.2
  - @backstage/config@1.2.0-next.1
  - @backstage/errors@1.2.4-next.0

## 0.2.4-next.1

### Patch Changes

- 35fe005: Export `getOctokitOptions` for easy re-use of Octokit configuration handling
- Updated dependencies
  - @backstage/config@1.2.0-next.1
  - @backstage/plugin-scaffolder-node@0.4.0-next.1
  - @backstage/backend-common@0.21.4-next.1
  - @backstage/backend-plugin-api@0.6.14-next.1
  - @backstage/integration@1.9.1-next.1
  - @backstage/errors@1.2.4-next.0

## 0.2.3-next.0

### Patch Changes

- f44589d: Introduced `createMockActionContext` to unify the way of creating scaffolder mock context.

  It will help to maintain tests in a long run during structural changes of action context.

- 1753898: Updated dependency `octokit-plugin-create-pull-request` to `^5.0.0`.
- Updated dependencies
  - @backstage/backend-common@0.21.3-next.0
  - @backstage/errors@1.2.4-next.0
  - @backstage/plugin-scaffolder-node@0.3.3-next.0
  - @backstage/backend-plugin-api@0.6.13-next.0
  - @backstage/config@1.1.2-next.0
  - @backstage/integration@1.9.1-next.0

## 0.2.0

### Minor Changes

- fd5eb1c: Allow to force the creation of a pull request from a forked repository
- 3d5c668: support oidc customization

### Patch Changes

- e9a5228: Exporting a default module for the new Backend System
- 8472188: Added or fixed the `repository` field in `package.json`.
- 6bb6f3e: Updated dependency `fs-extra` to `^11.2.0`.
  Updated dependency `@types/fs-extra` to `^11.0.0`.
- Updated dependencies
  - @backstage/backend-common@0.21.0
  - @backstage/backend-plugin-api@0.6.10
  - @backstage/integration@1.9.0
  - @backstage/plugin-scaffolder-node@0.3.0
  - @backstage/config@1.1.1
  - @backstage/errors@1.2.3

## 0.2.0-next.3

### Patch Changes

- 8472188: Added or fixed the `repository` field in `package.json`.
- Updated dependencies
  - @backstage/backend-common@0.21.0-next.3
  - @backstage/integration@1.9.0-next.1
  - @backstage/plugin-scaffolder-node@0.3.0-next.3
  - @backstage/backend-plugin-api@0.6.10-next.3
  - @backstage/config@1.1.1
  - @backstage/errors@1.2.3

## 0.2.0-next.2

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.21.0-next.2
  - @backstage/backend-plugin-api@0.6.10-next.2
  - @backstage/plugin-scaffolder-node@0.3.0-next.2
  - @backstage/config@1.1.1
  - @backstage/errors@1.2.3
  - @backstage/integration@1.9.0-next.0

## 0.2.0-next.1

### Minor Changes

- fd5eb1c: Allow to force the creation of a pull request from a forked repository

### Patch Changes

- Updated dependencies
  - @backstage/backend-plugin-api@0.6.10-next.1
  - @backstage/backend-common@0.21.0-next.1
  - @backstage/integration@1.9.0-next.0
  - @backstage/plugin-scaffolder-node@0.3.0-next.1
  - @backstage/config@1.1.1
  - @backstage/errors@1.2.3

## 0.1.2-next.0

### Patch Changes

- e9a5228: Exporting a default module for the new Backend System
- Updated dependencies
  - @backstage/backend-common@0.21.0-next.0
  - @backstage/plugin-scaffolder-node@0.3.0-next.0
  - @backstage/backend-plugin-api@0.6.10-next.0
  - @backstage/config@1.1.1
  - @backstage/errors@1.2.3
  - @backstage/integration@1.8.0

## 0.1.1

### Patch Changes

- 5470300: Ensure `teamReviewers` list is unique before calling API
- bf92ae3: Updated dependency `octokit` to `^3.0.0`.
- Updated dependencies
  - @backstage/backend-common@0.20.1
  - @backstage/plugin-scaffolder-node@0.2.10
  - @backstage/config@1.1.1
  - @backstage/errors@1.2.3
  - @backstage/integration@1.8.0

## 0.1.1-next.2

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.20.1-next.2
  - @backstage/plugin-scaffolder-node@0.2.10-next.2

## 0.1.1-next.1

### Patch Changes

- Updated dependencies
  - @backstage/backend-common@0.20.1-next.1
  - @backstage/integration@1.8.0
  - @backstage/config@1.1.1
  - @backstage/plugin-scaffolder-node@0.2.10-next.1
  - @backstage/errors@1.2.3

## 0.1.1-next.0

### Patch Changes

- bf92ae3: Updated dependency `octokit` to `^3.0.0`.
- Updated dependencies
  - @backstage/backend-common@0.20.1-next.0
  - @backstage/config@1.1.1
  - @backstage/errors@1.2.3
  - @backstage/integration@1.8.0
  - @backstage/plugin-scaffolder-node@0.2.10-next.0

## 0.1.0

### Minor Changes

- 219d7f0: Create new scaffolder module for external integrations

### Patch Changes

- cb6a65e: The `scaffolder.defaultCommitMessage` config value is now being used if provided and uses "initial commit" when it is not provided.
- 28949ea: Add a new action for creating github-autolink references for a repository: `github:autolinks:create`
- Updated dependencies
  - @backstage/backend-common@0.20.0
  - @backstage/plugin-scaffolder-node@0.2.9
  - @backstage/integration@1.8.0
  - @backstage/config@1.1.1
  - @backstage/errors@1.2.3

## 0.1.0-next.0

### Minor Changes

- 219d7f0: Create new scaffolder module for external integrations

### Patch Changes

- Updated dependencies
  - @backstage/plugin-scaffolder-node@0.2.9-next.3
  - @backstage/backend-common@0.20.0-next.3
  - @backstage/config@1.1.1
  - @backstage/errors@1.2.3
  - @backstage/integration@1.8.0-next.1
