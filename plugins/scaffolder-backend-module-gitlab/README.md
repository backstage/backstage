# scaffolder-backend-module-gitlab

Welcome to the Gitlab Module for Scaffolder.

Here you can find all Gitlab related features to improve your scaffolder:

## Getting started

## From your Backstage root directory

```bash
# From your Backstage root directory
yarn --cwd packages/backend add @backstage/plugin-scaffolder-backend-module-gitlab
```

Configure the action:
(you can check the [docs](https://backstage.io/docs/features/software-templates/writing-custom-actions#registering-custom-actions) to see all options):

```typescript
// packages/backend/src/plugins/scaffolder.ts

import {
  createGitlabProjectAccessTokenAction,
  createGitlabProjectDeployTokenAction,
  createGitlabProjectVariableAction,
  createGitlabGroupEnsureExistsAction,
  createGitlabIssueAction,
} from '@backstage/plugin-scaffolder-backend-module-gitlab';

// Create BuiltIn Actions
const builtInActions = createBuiltinActions({
  integrations,
  catalogClient,
  config: env.config,
  reader: env.reader,
});

// Add Gitlab Actions
const actions = [
  ...builtInActions,
  createGitlabProjectAccessTokenAction({ integrations: integrations }),
  createGitlabProjectDeployTokenAction({ integrations: integrations }),
  createGitlabProjectVariableAction({ integrations: integrations }),
  createGitlabGroupEnsureExistsAction({ integrations: integrations }),
  createGitlabIssueAction({ integrations: integrations }),
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
```

After that you can use the action in your template:

```yaml
apiVersion: scaffolder.backstage.io/v1beta3
kind: Template
metadata:
  name: gitlab-demo
  title: Gitlab DEMO
  description: Scaffolder Gitlab Demo
spec:
  owner: backstage/techdocs-core
  type: service

  parameters:
    - title: Fill in some steps
      required:
        - name
      properties:
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
              - gitlab.com

  steps:
    - id: fetch
      name: Fetch
      action: fetch:template
      input:
        url: https://github.com/TEMPLATE
        values:
          name: ${{ parameters.name }}
    - id: createGitlabGroup
      name: Ensure Gitlab group exists
      action: gitlab:group:ensureExists
      input:
        repoUrl: ${{ parameters.repoUrl }}
        path:
          - path
          - to
          - group

    - id: publish
      name: Publish
      action: publish:gitlab
      input:
        description: This is ${{ parameters.name }}
        repoUrl: ${{ parameters.repoUrl }}?owner=${{ steps.createGitlabGroup.output.groupId }}
        sourcePath: pimcore
        defaultBranch: main

    - id: gitlab-deploy-token
      name: Create Deploy Token
      action: gitlab:projectDeployToken:create
      input:
        repoUrl: ${{ parameters.repoUrl }}
        projectId: "${{ steps['publish'].output.projectId }}"
        name: ${{ parameters.name }}-secret
        username: ${{ parameters.name }}-secret
        scopes: ['read_registry']

    - id: gitlab-access-token
      name: Gitlab Project Access Token
      action: gitlab:projectAccessToken:create
      input:
        repoUrl: ${{ parameters.repoUrl }}
        projectId: "${{ steps['publish-manifest'].output.projectId }}"
        name: ${{ parameters.name }}-access-token
        accessLevel: 40
        scopes: ['read_repository', 'write_repository']

    - id: gitlab-project-variable
      name: Gitlab Project Variable
      action: gitlab:projectVariable:create
      input:
        repoUrl: ${{ parameters.repoUrl }}
        projectId: "${{ steps['publish'].output.projectId }}"
        key: 'VARIABLE_NAME'
        value: "${{ steps['gitlab-access-token'].output.access_token }}"
        variableType: 'env_var'
        masked: true
        variableProtected: false
        raw: false
        environmentScope: '*'

    - id: register
      name: Register
      action: catalog:register
      input:
        repoContentsUrl: ${{ steps['publish'].output.repoContentsUrl }}
        catalogInfoPath: '/catalog-info.yaml'

    - id: gitlabIssue
      name: Issues
      action: gitlab:issues:create
      input:
        repoUrl: ${{ parameters.repoUrl }}
        token: ${{ secrets.USER_OAUTH_TOKEN }}
        projectId: 1111111
        title: Test Issue
        assignees:
          - 2222222
        description: This is the description of the issue
        confidential: true
        createdAt: 2022-09-27 18:00:00.000
        dueDate: 2024-09-28 12:00:00.000
        epicId: 3333333
        labels: phase1:label1,phase2:label2
  output:
    links:
      - title: Repository
        url: ${{ steps['publish'].output.remoteUrl }}
      - title: Link to new issue
        url: ${{ steps['gitlabIssue'].output.issueUrl }}
```
