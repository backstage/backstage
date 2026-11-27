---
id: scaffolder
title: Gitea Scaffolder Actions
sidebar_label: Scaffolder
description: Publishing repositories created by Software Templates to Gitea
---

The `@backstage/plugin-scaffolder-backend-module-gitea` package provides the
`publish:gitea` action for [Software Templates](../../features/software-templates/index.md).
The action initializes a git repository using the content of the scaffolder
workspace, creates the repository on a Gitea instance, and pushes the content
to it.

## Installation

Install the module in your backend package:

```bash title="From your Backstage root directory"
yarn --cwd packages/backend add @backstage/plugin-scaffolder-backend-module-gitea
```

Then register it in your backend:

```ts title="packages/backend/src/index.ts"
backend.add(import('@backstage/plugin-scaffolder-backend-module-gitea'));
```

## Configuration

The action uses the Gitea integration configuration in your `app-config.yaml`
file to authenticate with each Gitea instance. Unlike the other Gitea features,
the `publish:gitea` action requires both the `username` and `password` fields,
because it uses them to push the repository content over HTTPS:

```yaml title="app-config.yaml"
integrations:
  gitea:
    - host: gitea.example.com
      username: ${GITEA_USERNAME}
      password: ${GITEA_PASSWORD}
```

See [Gitea Locations](./locations.md#configuration) for a description of all
the available integration options.

### TLS certificates

Backstage sends HTTPS requests to the Gitea instance, so the instance needs a
valid TLS certificate. If your Gitea instance uses a self-signed certificate,
for example one created with `gitea cert --host localhost --ca`, the
certificate must be signed by a certificate authority that Node.js trusts. Set
the `NODE_EXTRA_CA_CERTS` environment variable to the path of the CA file
before you start Backstage.

:::danger
You can set `NODE_TLS_REJECT_UNAUTHORIZED=0` to temporarily turn off
certificate validation during local development, but never do this in
production.
:::

## Using the action in a template

To publish to Gitea from a template:

- Use the `RepoUrlPicker` field in the `spec.parameters` section so that users
  can select the Gitea host, the owner, and the name of the repository.
- Optionally, add a `repoVisibility` parameter so that users can choose
  between `public` and `private`. If you omit it, the action creates a `public`
  repository.
- Add a step that calls the `publish:gitea` action.

The owner selected in the `RepoUrlPicker` must be an organization that already
exists on the Gitea instance, otherwise the action fails. Make sure the
`allowedOwners` list only contains organizations that exist on the Gitea host.

```yaml title="template.yaml"
apiVersion: scaffolder.backstage.io/v1beta3
kind: Template
metadata:
  name: simple-gitea-project
  title: Create a Gitea repository
  description: Create a Gitea repository
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
            allowedOwners:
              - <organization-name>
            allowedHosts:
              - gitea.example.com
        repoVisibility:
          title: Visibility of the repository
          type: string
          default: public
          enum:
            - public
            - private

  steps:
    # ... steps that fetch and prepare the workspace content

    - id: publish
      name: Publish to Gitea
      action: publish:gitea
      input:
        description: This is ${{ parameters.repoUrl | parseRepoUrl | pick('repo') }}
        repoVisibility: ${{ parameters.repoVisibility }}
        repoUrl: ${{ parameters.repoUrl }}
        defaultBranch: main

  output:
    links:
      - title: Repository
        url: ${{ steps['publish'].output.repoContentsUrl }}
```

### Inputs

| Input              | Required | Description                                                                                                                                    |
| :----------------- | :------- | :--------------------------------------------------------------------------------------------------------------------------------------------- |
| `repoUrl`          | Yes      | The repository location, usually provided by the `RepoUrlPicker` field.                                                                        |
| `description`      | Yes      | The description of the repository.                                                                                                             |
| `defaultBranch`    | No       | The default branch of the repository. Defaults to `main`.                                                                                      |
| `repoVisibility`   | No       | The visibility of the repository, either `public` or `private`. Defaults to `public`.                                                          |
| `gitCommitMessage` | No       | The message of the initial commit. Defaults to `initial commit`.                                                                               |
| `gitAuthorName`    | No       | The author name of the initial commit. Defaults to the `scaffolder.defaultAuthor.name` configuration value.                                    |
| `gitAuthorEmail`   | No       | The author email of the initial commit. Defaults to the `scaffolder.defaultAuthor.email` configuration value.                                  |
| `sourcePath`       | No       | The path within the workspace to use as the repository root. If omitted, the action publishes the entire workspace.                            |
| `signCommit`       | No       | Signs the initial commit with the PGP key from the integration's `commitSigningKey` or the `scaffolder.defaultCommitSigningKey` configuration. |

### Outputs

| Output            | Description                                       |
| :---------------- | :------------------------------------------------ |
| `remoteUrl`       | The git URL of the new repository.                |
| `repoContentsUrl` | A URL to the root of the default branch in Gitea. |
| `commitHash`      | The git commit hash of the initial commit.        |
