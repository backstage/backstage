---
'@backstage/plugin-scaffolder-backend': major
---

Removal of deprecated re-exports from module packages.

The following functions have been re-exported from the `scaffolder-backend` plugin for quite some time, and now it's time to clean them up. They've been moved as follows:

- `createPublishAzureAction` should be imported from `@backstage/plugin-scaffolder-backend-module-azure` instead.

- `createPublishBitbucketCloudAction` should be imported from `@backstage/plugin-scaffolder-backend-module-bitbucket-cloud` instead.

- `createPublishBitbucketServerAction` and `createPublishBitbucketServerPullRequestAction` can be imported from `@backstage/plugin-scaffolder-backend-module-bitbucket-server` instead.

- `createPublishBitbucketAction` should be imported from `@backstage/plugin-scaffolder-backend-module-bitbucket` instead.

- `createPublishGerritAction` and `createPublishGerritReviewAction` can be imported from `@backstage/plugin-scaffolder-backend-module-gerrit` instead.

- `createGithubActionsDispatchAction`, `createGithubDeployKeyAction`, `createGithubEnvironmentAction`, `createGithubIssuesLabelAction`, `CreateGithubPullRequestActionOptions`, `createGithubRepoCreateAction`, `createGithubRepoPushAction`, `createGithubWebhookAction`, and `createPublishGithubAction` can be imported from `@backstage/plugin-scaffolder-backend-module-github` instead.

- `createPublishGitlabAction` should be imported from `@backstage/plugin-scaffolder-backend-module-gitlab` instead.

- `ActionContext`. `createTemplateAction`, `executeShellCommand`, `ExecuteShellCommandOptions`, `fetchContents`, `TaskSecrets`, and `TemplateAction` should be imported from `@backstage/plugin-scaffolder-node` instead.

- `ScaffolderEntitiesProcessor` should be imported from `@backstage/plugin-catalog-backend-module-scaffolder-entity-model` instead.
