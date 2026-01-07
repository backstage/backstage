# @backstage/plugin-scaffolder-backend-module-azure

The Azure DevOps module for [@backstage/plugin-scaffolder-backend](https://www.npmjs.com/package/@backstage/plugin-scaffolder-backend).

This module provides scaffolder actions for Azure DevOps integration.

## Installation

```bash
# From your Backstage root directory
yarn --cwd packages/backend add @backstage/plugin-scaffolder-backend-module-azure
```

Then add it to your backend:

```ts title="packages/backend/src/index.ts"
import { createBackend } from '@backstage/backend-defaults';

const backend = createBackend();

// ... other plugins

backend.add(import('@backstage/plugin-scaffolder-backend'));
backend.add(import('@backstage/plugin-scaffolder-backend-module-azure'));

backend.start();
```

## Actions

### `publish:azure`

Initializes a git repository with the content in the workspace and publishes it to Azure DevOps.

#### Input Parameters

| Parameter          | Type      | Required | Description                                                                                             |
| ------------------ | --------- | -------- | ------------------------------------------------------------------------------------------------------- |
| `repoUrl`          | `string`  | Yes      | Repository URL in the format: `dev.azure.com?organization=<org>&project=<project>&repo=<repo>`          |
| `description`      | `string`  | No       | Repository description                                                                                  |
| `defaultBranch`    | `string`  | No       | Default branch for the repository. Default: `master`                                                    |
| `sourcePath`       | `string`  | No       | Path within the workspace to use as repository root. If omitted, the entire workspace will be published |
| `token`            | `string`  | No       | Personal Access Token for Azure DevOps authentication                                                   |
| `gitCommitMessage` | `string`  | No       | Initial commit message. Default: `initial commit`                                                       |
| `gitAuthorName`    | `string`  | No       | Author name for the commit. Default: `Scaffolder`                                                       |
| `gitAuthorEmail`   | `string`  | No       | Author email for the commit                                                                             |
| `signCommit`       | `boolean` | No       | Sign the commit with the configured PGP private key                                                     |

#### Output Parameters

| Parameter         | Type     | Description                             |
| ----------------- | -------- | --------------------------------------- |
| `remoteUrl`       | `string` | URL to the repository                   |
| `repoContentsUrl` | `string` | URL to the root of the repository (web) |
| `repositoryId`    | `string` | ID of the created repository            |
| `commitHash`      | `string` | Git commit hash of the initial commit   |

#### Examples

**Basic usage:**

```yaml
steps:
  - id: publish
    action: publish:azure
    name: Publish to Azure DevOps
    input:
      repoUrl: 'dev.azure.com?organization=myorg&project=myproject&repo=myrepo'
```

**With custom branch and commit message:**

```yaml
steps:
  - id: publish
    action: publish:azure
    name: Publish to Azure DevOps
    input:
      repoUrl: 'dev.azure.com?organization=myorg&project=myproject&repo=myrepo'
      defaultBranch: main
      gitCommitMessage: 'Initial project setup'
```

**With author information:**

```yaml
steps:
  - id: publish
    action: publish:azure
    name: Publish to Azure DevOps
    input:
      repoUrl: 'dev.azure.com?organization=myorg&project=myproject&repo=myrepo'
      gitAuthorName: 'John Doe'
      gitAuthorEmail: 'john.doe@example.com'
```

**Using a specific source path:**

```yaml
steps:
  - id: publish
    action: publish:azure
    name: Publish to Azure DevOps
    input:
      repoUrl: 'dev.azure.com?organization=myorg&project=myproject&repo=myrepo'
      sourcePath: 'packages/my-app'
```

**With authentication token:**

```yaml
steps:
  - id: publish
    action: publish:azure
    name: Publish to Azure DevOps
    input:
      repoUrl: 'dev.azure.com?organization=myorg&project=myproject&repo=myrepo'
      token: ${{ secrets.AZURE_TOKEN }}
```

## Configuration

To use this module, you need to configure Azure DevOps integration in your `app-config.yaml`:

```yaml
integrations:
  azure:
    - host: dev.azure.com
      credentials:
        - personalAccessToken: ${AZURE_TOKEN}
```

For more information on Azure DevOps integration, see the [Azure DevOps integration documentation](https://backstage.io/docs/integrations/azure/locations).
