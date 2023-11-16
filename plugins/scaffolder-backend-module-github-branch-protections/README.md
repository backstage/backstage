# @backstage/plugin-scaffolder-backend-module-github-branch-protections

Welcome to the Github Branch Protections module for Scaffolder.

## Getting started

## From your Backstage root directory

```bash
# From your Backstage root directory
yarn add --cwd packages/backend @backstage/plugin-scaffolder-backend-module-github-branch-protections
```

Configure the action:
(you can check the [docs](https://backstage.io/docs/features/software-templates/writing-custom-actions#registering-custom-actions) to see all options):

```typescript
// packages/backend/src/plugins/scaffolder.ts
import { CatalogClient } from '@backstage/catalog-client';
import {
  createRouter,
  createBuiltinActions,
} from '@backstage/plugin-scaffolder-backend';
import {
  DefaultGithubCredentialsProvider,
  GithubCredentialsProvider,
} from '@backstage/integration';
import { createGithubBranchProtectionsAction } from '@backstage/plugin-scaffolder-backend-module-github-branch-protections';

export default async function createPlugin(
  env: PluginEnvironment,
): Promise<Router> {
  const catalogClient = new CatalogClient({ discoveryApi: env.discovery });
  const integrations = ScmIntegrations.fromConfig(env.config);
  const githubCredentialsProvider: GithubCredentialsProvider =
    DefaultGithubCredentialsProvider.fromIntegrations(integrations);

  // Create BuiltIn Actions
  const builtInActions = createBuiltinActions({
    integrations,
    catalogClient,
    config: env.config,
    reader: env.reader,
  });

  // Add GitHub Actions
  const actions = [
    ...builtInActions,
    createGithubBranchProtectionsAction({
      integrations,
      config: env.config,
      githubCredentialsProvider,
    }),
  ];

  // Create Scaffolder Router
  return await createRouter({
    containerRunner,
    catalogClient,
    actions,
    logger: env.logger,
    config: env.config,
    database: env.database,
    reader: env.reader,
  });
}
```

After that you can use the action in your template:

```yaml
apiVersion: scaffolder.backstage.io/v1beta3
kind: Template
metadata:
  name: github-branch-protections-demo
  title: Gitlab DEMO
  description: Scaffolder Github Demo
spec:
  owner: backstage/techdocs-core
  type: service

  parameters:
    - title: Fill in some steps
      required:
        - name
      properties:
        description:
          title: description
          type: string
          description: Short description explaining the purpose of the repo
        name:
          title: Name
          type: string
          description: Unique name of the component
          ui:autofocus: true
          ui:options:
            rows: 5
    - title: Choose a location
      required:
        - repoUrl
      properties:
        repoUrl:
          title: Repository Location
          type: string
          ui:field: RepoUrlPicker
          ui:options:
            allowedHosts:
              - github.com

  steps:
    - id: fetch
      name: Fetch
      action: fetch:template
      input:
        url: https://github.com/TEMPLATE
        values:
          name: ${{ parameters.name }}

    - id: publishNewRepo
      name: Creating a new repository with appropriate permissions
      action: publish:github
      input:
        description: ${{ parameters.description }}
        repoUrl: ${{ parameters.repoUrl }}
        repoVisibility: public
        requiredApprovingReviewCount: 1
        requireCodeOwnerReviews: true
        requireBranchesToBeUpToDate: true
        dismissStaleReviews: true
        defaultBranch: main
        sourcePath: ./
        protectDefaultBranch: true
        protectEnforceAdmins: true
        deleteBranchOnMerge: true
        requiredStatusCheckContexts:
          - continuous-integration/jenkins/pr-head
        gitAuthorName: ${{ user.entity.metadata.name }}
        gitAuthorEmail: ${{ user.entity.spec.profile.email }}

    - id: AddRepoBranchProtections
      name: Adding repository branch protections
      action: github:branchprotections
      input:
        repoUrl: ${{ parameters.repoUrl }}
        branches: ['rc/*', 'development']
        requiredApprovingReviewCount: 1
        requiresCodeOwnerReviews: true
        requiresBranchesToBeUpToDate: true
        dismissStaleReviews: true
        isAdminEnforced: true
        requiresStatusChecks: true
        requiredStatusCheckContexts:
          - continuous-integration/jenkins/pr-head

    - id: register
      name: Register
      action: catalog:register
      input:
        repoContentsUrl: ${{ steps['publish'].output.repoContentsUrl }}
        catalogInfoPath: '/catalog-info.yaml'

  output:
    links:
      - title: Repository
        url: ${{ steps['publishNewRepo'].output.remoteUrl }}
```
