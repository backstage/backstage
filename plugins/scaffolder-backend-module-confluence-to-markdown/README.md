# @backstage/plugin-scaffolder-backend-module-confluence-to-markdown

Welcome to the `confluence:transform:markdown` action for the `scaffolder-backend`.

## Getting started

The following sections will help you getting started

### Configure Action in Backend

From your Backstage root directory run:

```bash
# From your Backstage root directory
yarn --cwd packages/backend add @backstage/plugin-scaffolder-backend-module-confluence-to-markdown
```

Then configure the action:
(you can check the [docs](https://backstage.io/docs/features/software-templates/writing-custom-actions#registering-custom-actions) to see all options):

```typescript
// packages/backend/src/plugins/scaffolder.ts

import { createBuiltinActions } from '@backstage/plugin-scaffolder-backend';
import { ScmIntegrations } from '@backstage/integration';
import { createConfluenceToMarkdownAction } from '@backstage/plugin-scaffolder-backend-module-confluence-to-markdown';

export default async function createPlugin(
  env: PluginEnvironment,
): Promise<Router> {
  const catalogClient = new CatalogClient({ discoveryApi: env.discovery });
  const integrations = ScmIntegrations.fromConfig(env.config);

  const builtInActions = createBuiltinActions({
    integrations,
    catalogClient,
    config: env.config,
    reader: env.reader,
  });

  const actions = [
    ...builtInActions,
    createConfluenceToMarkdownAction({
      integrations,
      config: env.config,
      reader: env.reader,
    }),
  ];

  return createRouter({
    actions,
    catalogClient: catalogClient,
    logger: env.logger,
    config: env.config,
    database: env.database,
    reader: env.reader,
  });
}
```

### Configuration

There is some configuration that needs to be setup to use this action, these are the base parameters:

```yaml
confluence:
  baseUrl: 'https://confluence.example.com'
  auth:
    token: '${CONFLUENCE_TOKEN}'
```

The sections below will go into more details about the Base URL and Auth Methods.

#### Base URL

The `baseUrl` for Confluence Cloud should include the product name which is `wiki` by default but can be something else if your Org has changed it. An example `baseUrl` for Confluence Cloud would look like this: `https://example.atlassian.net/wiki`

If you are using a self-hosted Confluence instance this does not apply to you. Your `baseUrl` would look something like this: `https://confluence.example.com`

#### Auth Methods

The default authorization method is `bearer` but `basic` and `userpass` are also supported. Here's how you would configure each of these:

For `bearer`:

```yaml
confluence:
  baseUrl: 'https://confluence.example.com'
  auth:
    type: 'bearer'
    token: '${CONFLUENCE_TOKEN}'
```

For `basic`:

```yaml
confluence:
  baseUrl: 'https://confluence.example.com'
  auth:
    type: 'basic'
    token: '${CONFLUENCE_TOKEN}'
    email: 'example@company.org'
```

For `userpass`

```yaml
confluence:
  baseUrl: 'https://confluence.example.com'
  auth:
    type: 'userpass'
    username: 'your-username'
    password: 'your-password'
```

**Note:** For `basic` and `bearer` authorization methods you will need an access token for authorization with `Read` permissions. You can create a Personal Access Token (PAT) in Confluence. The value used should be the raw token as it will be encoded for you by the action.

### Template Usage

Here's an example of how you can use the action in your template:

```yaml
apiVersion: scaffolder.backstage.io/v1beta3
kind: Template
metadata:
  name: confluence-to-markdown
  title: Confluence to Markdown
  description: This template converts a single Confluence document to Markdown for Techdocs and adds it to a given GitHub repo.
  tags:
    - do-not-use
    - poc
spec:
  owner: <YOUR_EMAIL>
  type: service
  parameters:
    - title: Confluence and Github Repo Information
      properties:
        confluenceUrls:
          type: array
          description: Urls for Confluence doc to be converted to markdown. In format <CONFLUENCE_BASE_URL>/display/<SPACEKEY>/<PAGE+TITLE> or <CONFLUENCE_BASE_URL>/spaces/<SPACEKEY>/pages/<PAGEID>/<PAGE+TITLE> for Confluence cloud
          items:
            type: string
          ui:options:
            addable: true
          minItems: 1
          maxItems: 5
        repoUrl:
          type: string
          title: GitHub URL mkdocs.yaml link
          description: The GitHub repo URL to your mkdocs.yaml file. Example <https://github.com/blob/master/mkdocs.yml>
  steps:
    - id: create-docs
      name: Get markdown file created and update markdown.yaml file
      action: confluence:transform:markdown
      input:
        confluenceUrls: ${{ parameters.confluenceUrls }}
        repoUrl: ${{ parameters.repoUrl }}
    - id: publish
      name: Publish PR to GitHub
      action: publish:github:pull-request
      input:
        repoUrl: <GITHUB_BASE_URL>?repo=${{ steps['create-docs'].output.repo }}&owner=${{ steps['create-docs'].output.owner }}
        branchName: confluence-to-markdown
        title: Confluence to Markdown
        description: PR for converting Confluence page to mkdocs
```

Replace `<GITHUB_BASE_URL>` with your GitHub URL without `https://`.

You can find a list of all registered actions including their parameters at the `/create/actions` route in your Backstage application.
