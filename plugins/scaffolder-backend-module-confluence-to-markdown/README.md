# @backstage/plugin-scaffolder-backend-module-confluence-to-markdown

Welcome to the `confluence:transform:markdown` action for the `scaffolder-backend`.

## Getting started

You need to configure the action in your backend:

## From your Backstage root directory

```bash
# From your Backstage root directory
yarn add --cwd packages/backend @backstage/plugin-scaffolder-backend-module-confluence-to-markdown
```

Configure the action:
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

You will also need an access token for authorization with `Read` permissions. You can create a Personal Access Token (PAT) in confluence and add the PAT to your `app-config.yaml`

```yaml
confluence:
  baseUrl: ${CONFLUENCE_BASE_URL}
  token: ${CONFLUENCE_TOKEN}
```

After that you can use the action in your template:

```yaml
apiVersion: scaffolder.backstage.io/v1beta3
kind: Template
metadata:
  name: confluence-to-markdown
  title: Confluence to Markdown
  description: This template converts a single confluence document to Markdown for Techdocs and adds it to a given GitHub repo.
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
          description: Urls for confluence doc to be converted to markdown. In format <CONFLUENCE_BASE_URL>/display/<SPACEKEY>/<PAGE+TITLE>
          items:
            type: string
            default: confluence url
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
        description: PR for converting confluence page to mkdocs
    - id: merge
      name: Merge PR
      action: publish:github:merge-pull-request
      input:
        prUrl: ${{ steps['publish'].output.remoteUrl }}
        forceAdmin: true
```

Replace `<GITHUB_BASE_URL>` with your GitHub url without `https://`.

You can find a list of all registered actions including their parameters at the /create/actions route in your Backstage application.
