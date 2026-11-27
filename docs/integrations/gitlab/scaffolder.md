---
id: scaffolder
title: GitLab Scaffolder Actions
sidebar_label: Scaffolder
description: Creating and managing GitLab projects, merge requests, and more from Software Templates
---

The `@backstage/plugin-scaffolder-backend-module-gitlab` package provides
actions for [Software Templates](../../features/software-templates/index.md)
that work with GitLab. Templates can use them to publish new projects, open
merge requests, manage groups, issues, tokens, and CI/CD variables, and trigger
pipelines. The module also adds autocomplete of GitLab groups, repositories,
and branches to the `RepoUrlPicker` field.

## Installation

Install the module in your backend package:

```bash title="From your Backstage root directory"
yarn --cwd packages/backend add @backstage/plugin-scaffolder-backend-module-gitlab
```

Then register it in your backend:

```ts title="packages/backend/src/index.ts"
backend.add(import('@backstage/plugin-scaffolder-backend-module-gitlab'));
```

## Configuration

The actions authenticate with GitLab using the token from the GitLab
integration configuration for the host in the action's `repoUrl` input:

```yaml title="app-config.yaml"
integrations:
  gitlab:
    - host: gitlab.com
      token: ${GITLAB_TOKEN}
```

The token needs at least the `api`, `read_repository`, and `write_repository`
scopes. See [GitLab Locations](./locations.md) for all the available
integration options, including self-hosted GitLab instances.

### Using the signed-in user's credentials

Most actions accept a `token` input. When you provide it, the action uses that
token instead of the integration token. A common pattern is to request the
signed-in user's GitLab token with the `requestUserCredentials` option of the
`RepoUrlPicker` field, and pass it to the action from the template secrets.
See [`requestUserCredentials`](../../features/software-templates/ui-options-examples.md#requestusercredentials)
for details.

If you set `scaffolder.requireScmUserCredentials` to `true`, actions that
support it fail unless a `token` input is provided. In that mode, the
`setUserAsOwner` and `ownerUsername` inputs of `publish:gitlab` can't be used,
because they rely on the integration token. See
[Requiring SCM user credentials](../../features/software-templates/configuration.md#requiring-scm-user-credentials).

## Available actions

| Action                             | Description                                                                                                |
| ---------------------------------- | ---------------------------------------------------------------------------------------------------------- |
| `publish:gitlab`                   | Initializes a git repository with the content of the workspace and publishes it to a new GitLab project.   |
| `publish:gitlab:merge-request`     | Commits the content of the workspace to a new branch of an existing project and opens a merge request.     |
| `gitlab:repo:push`                 | Commits the content of the workspace directly to a branch of an existing project, without a merge request. |
| `gitlab:group:ensureExists`        | Creates a group and its parent groups if they don't exist, and returns the ID of the group.                |
| `gitlab:group:access`              | Adds users or groups to a GitLab group, or removes them from it.                                           |
| `gitlab:group:migrate`             | Imports a project from another GitLab instance using GitLab's direct transfer migration.                   |
| `gitlab:issues:create`             | Creates an issue in a project.                                                                             |
| `gitlab:issue:edit`                | Edits an existing issue, for example to change its labels, assignees, or state.                            |
| `gitlab:projectAccessToken:create` | Creates a project access token, and optionally stores it as a CI/CD variable of the project.               |
| `gitlab:projectDeployToken:create` | Creates a project deploy token, and optionally stores it as a CI/CD variable of the project.               |
| `gitlab:projectVariable:create`    | Creates a CI/CD variable in a project.                                                                     |
| `gitlab:pipeline:trigger`          | Triggers a pipeline for a branch of a project, optionally with variables.                                  |
| `gitlab:user:info`                 | Returns information about a GitLab user, or about the user that owns the token if no user ID is given.     |

For the full list of inputs and outputs of each action, open the
`/create/actions` page of your Backstage instance, for example
`http://localhost:3000/create/actions`. It also shows examples for each action.

Most actions take a `repoUrl` input in the format
`gitlab.com?owner=<group-or-user>&repo=<project>`, which is the value the
`RepoUrlPicker` field produces.

## Publishing a new project

The `publish:gitlab` action creates a project and pushes the content of the
workspace to it. Use the `RepoUrlPicker` field to let users choose the group
and project name:

```yaml title="template.yaml"
apiVersion: scaffolder.backstage.io/v1beta3
kind: Template
metadata:
  name: gitlab-project
  title: Create a GitLab project
spec:
  owner: guests
  type: service

  parameters:
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
    # ... steps that create content in the workspace

    - id: publish
      name: Publish to GitLab
      action: publish:gitlab
      input:
        repoUrl: ${{ parameters.repoUrl }}
        defaultBranch: main
        settings:
          visibility: internal
          description: Created from a Backstage template
          topics:
            - backstage

    - id: register
      name: Register in the catalog
      action: catalog:register
      input:
        repoContentsUrl: ${{ steps['publish'].output.repoContentsUrl }}
        catalogInfoPath: /catalog-info.yaml

  output:
    links:
      - title: Repository
        url: ${{ steps['publish'].output.remoteUrl }}
```

Useful inputs of `publish:gitlab` include:

- `settings`: project settings such as `visibility` (`private` by default),
  `description`, `topics`, `merge_method`, `squash_option`, and the merge
  request pipeline and discussion rules. The top-level `repoVisibility` and
  `topics` inputs are deprecated in favor of `settings.visibility` and
  `settings.topics`.
- `branches`: additional branches to create or protect.
- `projectVariables`: CI/CD variables to create in the new project.
- `sourcePath`: a directory of the workspace to publish. Set it to `false` to
  create an empty project.
- `skipExisting`: set to `true` to skip publishing when the project already
  exists, instead of failing.
- `setUserAsOwner` and `ownerUsername`: make a user the owner of the new
  project. Both require a privileged token in the integration configuration.

The action outputs the `remoteUrl`, `repoContentsUrl`, `projectId`, and
`commitHash` of the new project, and `created`, which is `false` when
`skipExisting` skipped an existing project.

## Updating an existing project

Use `publish:gitlab:merge-request` to propose changes through a merge request,
or `gitlab:repo:push` to commit them directly to a branch:

```yaml
steps:
  - id: merge-request
    name: Open a merge request
    action: publish:gitlab:merge-request
    input:
      repoUrl: gitlab.com?owner=my-group&repo=my-project
      branchName: add-catalog-info
      title: Add catalog-info.yaml
      description: This merge request was created from a Backstage template.
      targetPath: .
      removeSourceBranch: true

output:
  links:
    - title: Merge request
      url: ${{ steps['merge-request'].output.mergeRequestUrl }}
```

Both actions take a `commitAction` input that controls how each file of the
workspace is committed: `create`, `update`, `delete`, or `auto`.
`publish:gitlab:merge-request` also supports `skip`. The default is `auto`,
which compares the workspace with the repository and creates missing files,
updates changed files, and skips unchanged files.

When `commitAction` is `auto`, the action first lists the files in the
repository. If the listing returns a 404, for example when pushing to a new
branch, all files are treated as new. If the listing fails for another reason,
the action checks each file individually instead. Any other error stops the
action before it commits anything.

## Managing groups, issues, tokens, and pipelines

The other actions are typically combined with `publish:gitlab` in a single
template. For example, the following steps make sure a group exists, publish a
project into it, create a deploy token stored as a CI/CD variable, and open an
issue:

```yaml
steps:
  - id: group
    name: Ensure the group exists
    action: gitlab:group:ensureExists
    input:
      repoUrl: ${{ parameters.repoUrl }}
      path:
        - my-org
        - my-team

  - id: publish
    name: Publish to GitLab
    action: publish:gitlab
    input:
      repoUrl: gitlab.com?owner=my-org/my-team&repo=${{ parameters.name }}

  - id: deploy-token
    name: Create a deploy token
    action: gitlab:projectDeployToken:create
    input:
      repoUrl: gitlab.com?owner=my-org/my-team&repo=${{ parameters.name }}
      projectId: ${{ steps['publish'].output.projectId }}
      name: ${{ parameters.name }}-registry
      scopes:
        - read_registry
      variableKey: REGISTRY_DEPLOY_TOKEN
      variableProtected: true

  - id: issue
    name: Create an onboarding issue
    action: gitlab:issues:create
    input:
      repoUrl: gitlab.com?owner=my-org/my-team&repo=${{ parameters.name }}
      projectId: ${{ steps['publish'].output.projectId }}
      title: Finish setting up ${{ parameters.name }}
      labels: onboarding
```

Always set `variableKey` on `gitlab:projectAccessToken:create` and
`gitlab:projectDeployToken:create`. The action then stores the new token as a
CI/CD variable of the project with that key and leaves the raw token out of
its outputs. Without `variableKey`, the raw token is returned in the
deprecated `access_token` or `deploy_token` output and is kept in the task
state.
