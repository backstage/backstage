---
id: confluence-to-markdown
title: Confluence to Markdown
description: Convert Confluence pages to Markdown using Software Templates
---

The `@backstage/plugin-scaffolder-backend-module-confluence-to-markdown` module
provides the `confluence:transform:markdown` action. It converts Confluence pages
to Markdown in an existing GitHub repository, downloads attachments, and adds
entries to the repository's MkDocs navigation.

## Installation

Install the module in your backend:

```shell title="From your Backstage root directory"
yarn --cwd packages/backend add @backstage/plugin-scaffolder-backend-module-confluence-to-markdown
```

Add the scaffolder plugin and the module to your backend:

```ts title="packages/backend/src/index.ts"
import { createBackend } from '@backstage/backend-defaults';

const backend = createBackend();

backend.add(import('@backstage/plugin-scaffolder-backend'));
backend.add(
  import('@backstage/plugin-scaffolder-backend-module-confluence-to-markdown'),
);

backend.start();
```

## Configuration

Configure the Confluence base URL and authentication in `app-config.yaml`:

```yaml
confluence:
  baseUrl: https://confluence.example.com
  auth:
    type: bearer
    token: ${CONFLUENCE_TOKEN}
```

### Base URL

For Confluence Cloud, include the product path, which is `wiki` by default, for
example `https://example.atlassian.net/wiki`. If your organization uses a
different product path, use that path instead.

For a self-hosted Confluence instance, use its base URL, for example
`https://confluence.example.com`.

### Authentication

The action supports three authentication methods:

| Method     | Required authentication fields | Description                          |
| ---------- | ------------------------------ | ------------------------------------ |
| `bearer`   | `token`                        | Sends the token as a bearer token.   |
| `basic`    | `email`, `token`               | Uses an email address and API token. |
| `userpass` | `username`, `password`         | Uses a username and password.        |

Set `confluence.auth.type` explicitly to match your Confluence instance. The
action defaults to `bearer` if the type is omitted, but the configuration schema
requires the field.

For `basic` authentication:

```yaml
confluence:
  baseUrl: https://example.atlassian.net/wiki
  auth:
    type: basic
    token: ${CONFLUENCE_TOKEN}
    email: ${CONFLUENCE_EMAIL}
```

For `userpass` authentication:

```yaml
confluence:
  baseUrl: https://confluence.example.com
  auth:
    type: userpass
    username: ${CONFLUENCE_USERNAME}
    password: ${CONFLUENCE_PASSWORD}
```

For token-based authentication, use a token with read access to the pages and
attachments you want to convert. Use the raw token value; the action handles
encoding for basic authentication. Keep credentials in environment variables
rather than committing them to configuration files.

### GitHub repository

Configure the [GitHub integration](../../integrations/github/locations.md) so
Backstage can read the target repository. The repository must already contain
the `mkdocs.yml` file specified by the action's `repoUrl` input. To add converted
pages to the navigation, that file must contain a `nav` list.

The action writes Markdown files to the `docs` directory alongside `mkdocs.yml`
and downloads attachments to `docs/img`. Page titles become Markdown filenames
with spaces replaced by hyphens. If a page title already exists as a top-level
navigation entry, the action fails rather than adding a duplicate.

## Template usage

The following template converts Confluence pages and opens a pull request with
the generated files. The publishing step also requires the
[GitHub action module](builtin-actions.md#installing-action-modules) and
credentials with permission to create a pull request in the target repository.

```yaml
apiVersion: scaffolder.backstage.io/v1beta3
kind: Template
metadata:
  name: confluence-to-markdown
  title: Confluence to Markdown
  description: Convert Confluence pages to Markdown and open a GitHub pull request.
spec:
  owner: group:default/backstage-admins
  type: documentation
  parameters:
    - title: Confluence and GitHub repository
      required:
        - confluenceUrls
        - repoUrl
      properties:
        confluenceUrls:
          title: Confluence page URLs
          type: array
          items:
            type: string
          minItems: 1
          maxItems: 5
          ui:options:
            addable: true
        repoUrl:
          title: URL of the repository's mkdocs.yml file
          type: string
          description: For example, https://github.com/my-org/my-repo/blob/main/mkdocs.yml
  steps:
    - id: create-docs
      name: Convert Confluence pages to Markdown
      action: confluence:transform:markdown
      input:
        confluenceUrls: ${{ parameters.confluenceUrls }}
        repoUrl: ${{ parameters.repoUrl }}
    - id: publish
      name: Open a GitHub pull request
      action: publish:github:pull-request
      input:
        repoUrl: github.com?repo=${{ steps['create-docs'].output.repo }}&owner=${{ steps['create-docs'].output.owner }}
        branchName: confluence-to-markdown
        title: Convert Confluence pages to Markdown
        description: Add Markdown documentation converted from Confluence.
```

Replace `group:default/backstage-admins` with a user or group in your catalog.
For GitHub Enterprise, replace `github.com` in the publishing step with your
GitHub hostname, without `https://`.

The one-to-five-page limit above is a template form constraint, not a limit
enforced by the action.

### Inputs

| Input            | Type       | Required | Description                                                                                                   |
| ---------------- | ---------- | -------- | ------------------------------------------------------------------------------------------------------------- |
| `confluenceUrls` | `string[]` | Yes      | URLs of Confluence pages to convert.                                                                          |
| `repoUrl`        | `string`   | Yes      | Full URL of the existing `mkdocs.yml` file, such as `https://github.com/my-org/my-repo/blob/main/mkdocs.yml`. |

Supported Confluence page URL formats are:

```text
<CONFLUENCE_BASE_URL>/display/<SPACEKEY>/<PAGE+TITLE>
<CONFLUENCE_BASE_URL>/spaces/<SPACEKEY>/pages/<PAGEID>/<PAGE+TITLE>
```

Replace `<CONFLUENCE_BASE_URL>` with your Confluence base URL, `<SPACEKEY>` with
the page's space key, `<PAGEID>` with the page ID, and `<PAGE+TITLE>` with its
title using `+` for spaces.

### Outputs

| Output  | Type     | Description                     |
| ------- | -------- | ------------------------------- |
| `repo`  | `string` | Name of the GitHub repository.  |
| `owner` | `string` | Owner of the GitHub repository. |

The action prepares files in the template workspace; it does not publish them.
Use a publishing action, as shown above, to send them to GitHub.

You can inspect registered actions and their parameters at `/create/actions` in
your Backstage application.
