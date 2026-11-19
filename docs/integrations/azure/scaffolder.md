---
id: scaffolder
title: Azure DevOps Scaffolder Actions
sidebar_label: Scaffolder
description: Publishing repositories created by Software Templates to Azure DevOps
---

The `@backstage/plugin-scaffolder-backend-module-azure` package provides the
`publish:azure` action for [Software Templates](../../features/software-templates/index.md).
The action initializes a git repository using the content of the scaffolder
workspace, creates the repository in an existing Azure DevOps project, and
pushes the content to it.

## Installation

Install the module in your backend package:

```bash title="From your Backstage root directory"
yarn --cwd packages/backend add @backstage/plugin-scaffolder-backend-module-azure
```

Then register it in your backend:

```ts title="packages/backend/src/index.ts"
backend.add(import('@backstage/plugin-scaffolder-backend-module-azure'));
```

## Configuration

The action authenticates with Azure DevOps using the credentials in the Azure
DevOps integration configuration in your `app-config.yaml` file. For example,
with a personal access token:

```yaml title="app-config.yaml"
integrations:
  azure:
    - host: dev.azure.com
      credentials:
        - personalAccessToken: ${AZURE_TOKEN}
```

The action also supports service principals and managed identities. See
[Azure DevOps Locations](./locations.md#authentication) for all the available
authentication options.

The credentials need permission to create repositories in the target project
and to push to them.

### Using the signed-in user's credentials

If you pass a `token` input to the action, the action uses it instead of the
integration credentials. A common pattern is to request the signed-in user's
Azure DevOps token with the `requestUserCredentials` option of the
`RepoUrlPicker` field, and pass it to the action from the template secrets.
See [`requestUserCredentials`](../../features/software-templates/ui-options-examples.md#requestusercredentials)
for details.

If you set `scaffolder.requireScmUserCredentials` to `true`, the action fails
unless a `token` input is provided. See
[Requiring SCM user credentials](../../features/software-templates/configuration.md#requiring-scm-user-credentials).

### Commit author and signing

If a template doesn't set `gitAuthorName` or `gitAuthorEmail`, the action uses
the `scaffolder.defaultAuthor` configuration, and then falls back to
`Scaffolder` and `scaffolder@backstage.io`. See
[Publishing defaults](../../features/software-templates/configuration.md#publishing-defaults).

To sign the initial commit, set `signCommit: true` in the template and
configure a PGP private key, either as `commitSigningKey` on the Azure DevOps
integration or as `scaffolder.defaultCommitSigningKey`. The action fails if
`signCommit` is set and no signing key is configured.

## Using the action in a template

To publish to Azure DevOps from a template:

- Use the `RepoUrlPicker` field in the `spec.parameters` section so that users
  can select the host, organization, project, and repository name. Use the
  `allowedOrganizations` and `allowedProjects` options to limit the choices.
- Add a step that calls the `publish:azure` action.

The organization and project must already exist in Azure DevOps, otherwise the
action fails. The action creates only the repository.

```yaml title="template.yaml"
apiVersion: scaffolder.backstage.io/v1beta3
kind: Template
metadata:
  name: azure-devops-repository
  title: Create an Azure DevOps repository
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
              - dev.azure.com
            allowedOrganizations:
              - my-organization
            allowedProjects:
              - my-project

  steps:
    # ... steps that create content in the workspace

    - id: publish
      name: Publish to Azure DevOps
      action: publish:azure
      input:
        repoUrl: ${{ parameters.repoUrl }}
        defaultBranch: main
        gitCommitMessage: Initial project setup

  output:
    links:
      - title: Repository
        url: ${{ steps['publish'].output.repoContentsUrl }}
```

The `repoUrl` value has the format
`dev.azure.com?organization=<organization>&project=<project>&repo=<repository>`.
You can also write it by hand instead of using the `RepoUrlPicker`.

To publish only part of the workspace, set `sourcePath` to a directory inside
the workspace:

```yaml
- id: publish
  name: Publish to Azure DevOps
  action: publish:azure
  input:
    repoUrl: ${{ parameters.repoUrl }}
    sourcePath: packages/my-app
```

## Action reference

### Inputs

| Input              | Type      | Required | Description                                                                                                                           |
| ------------------ | --------- | -------- | ------------------------------------------------------------------------------------------------------------------------------------- |
| `repoUrl`          | `string`  | Yes      | The repository location, in the format `dev.azure.com?organization=<organization>&project=<project>&repo=<repository>`.               |
| `description`      | `string`  | No       | A description of the repository. The action accepts this input but doesn't currently apply it to the Azure DevOps repository.         |
| `defaultBranch`    | `string`  | No       | The default branch of the repository. Defaults to `master`.                                                                           |
| `sourcePath`       | `string`  | No       | The path within the workspace to use as the repository root. If omitted, the action publishes the entire workspace.                   |
| `token`            | `string`  | No       | An Azure DevOps token to use instead of the integration credentials.                                                                  |
| `gitCommitMessage` | `string`  | No       | The message of the initial commit. Defaults to `initial commit`.                                                                      |
| `gitAuthorName`    | `string`  | No       | The author name of the initial commit. Defaults to `scaffolder.defaultAuthor.name`, or `Scaffolder` if that isn't set.                |
| `gitAuthorEmail`   | `string`  | No       | The author email of the initial commit. Defaults to `scaffolder.defaultAuthor.email`, or `scaffolder@backstage.io` if that isn't set. |
| `signCommit`       | `boolean` | No       | Whether to sign the initial commit with the configured PGP private key.                                                               |

### Outputs

| Output            | Type     | Description                                           |
| ----------------- | -------- | ----------------------------------------------------- |
| `remoteUrl`       | `string` | The git remote URL of the new repository.             |
| `repoContentsUrl` | `string` | The URL of the repository in the Azure DevOps web UI. |
| `repositoryId`    | `string` | The ID of the new repository.                         |
| `commitHash`      | `string` | The hash of the initial commit.                       |
