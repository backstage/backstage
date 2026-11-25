---
id: sentry
title: Sentry Scaffolder Actions
description: Create Sentry projects and retrieve their DSNs from Software Templates.
---

The `@backstage/plugin-scaffolder-backend-module-sentry` package adds actions
for creating Sentry projects and retrieving a project's public DSN from
Software Templates.

## Installation

From your Backstage root directory, install the package:

```shell
yarn --cwd packages/backend add @backstage/plugin-scaffolder-backend-module-sentry
```

Add the Scaffolder and Sentry modules to your backend in
`packages/backend/src/index.ts`:

```ts
import { createBackend } from '@backstage/backend-defaults';

const backend = createBackend();

backend.add(import('@backstage/plugin-scaffolder-backend'));
backend.add(import('@backstage/plugin-scaffolder-backend-module-sentry'));

backend.start();
```

## Configuration

Configure a Sentry API token in `app-config.yaml`:

```yaml
scaffolder:
  sentry:
    token: ${SENTRY_TOKEN}
```

The token is used by both actions unless an `authToken` is provided as an
action input. Project creation requires the Sentry `project:write` scope.
Fetching a DSN requires one of `project:admin`, `project:read`, or
`project:write`.

The actions use `https://sentry.io/api/0` by default. To use a different Sentry
API base URL, configure it in `app-config.yaml`:

```yaml
scaffolder:
  sentry:
    apiBaseUrl: https://sentry.example.com/api/0
```

## Usage

The following template creates a project and fetches its DSN. The configured
token is used for both actions.

```yaml
apiVersion: scaffolder.backstage.io/v1beta3
kind: Template
metadata:
  name: sentry-project
  title: Create a Sentry project
  description: Creates a Sentry project and retrieves its DSN.
spec:
  owner: user:default/guest
  type: service
  parameters:
    - title: Sentry project details
      required:
        - name
        - organizationSlug
        - teamSlug
        - projectSlug
      properties:
        name:
          title: Project name
          type: string
        organizationSlug:
          title: Organization slug
          type: string
        teamSlug:
          title: Team slug
          type: string
        projectSlug:
          title: Project slug
          type: string
  steps:
    - id: create-sentry-project
      name: Create Sentry project
      action: sentry:project:create
      input:
        organizationSlug: ${{ parameters.organizationSlug }}
        teamSlug: ${{ parameters.teamSlug }}
        name: ${{ parameters.name }}
        slug: ${{ parameters.projectSlug }}
    - id: fetch-sentry-dsn
      name: Fetch Sentry DSN
      action: sentry:fetch:dsn
      input:
        organizationSlug: ${{ parameters.organizationSlug }}
        projectSlug: ${{ parameters.projectSlug }}
```

The `sentry:fetch:dsn` action returns the project's public DSN in
`steps['fetch-sentry-dsn'].output.dsn`.

## Action reference

### `sentry:project:create`

Creates a project for the specified Sentry team.

| Input              | Required | Description                                                                                       |
| ------------------ | -------- | ------------------------------------------------------------------------------------------------- |
| `organizationSlug` | Yes      | Slug of the Sentry organization.                                                                  |
| `teamSlug`         | Yes      | Slug of the team that will own the project.                                                       |
| `name`             | Yes      | Project name.                                                                                     |
| `slug`             | No       | Project slug. Sentry generates one from the name if omitted.                                      |
| `platform`         | No       | Sentry platform for the project.                                                                  |
| `authToken`        | No       | Sentry token for this action. Overrides the configured token. Requires the `project:write` scope. |
| `apiBaseUrl`       | No       | Compatibility value that must match the effective API base URL configured for the backend.        |

The action returns the Sentry project `id` and `result`.

### `sentry:fetch:dsn`

Fetches the public DSN for an existing Sentry project.

| Input              | Required | Description                                                                                                                                   |
| ------------------ | -------- | --------------------------------------------------------------------------------------------------------------------------------------------- |
| `organizationSlug` | Yes      | Slug of the Sentry organization.                                                                                                              |
| `projectSlug`      | Yes      | Slug of the Sentry project.                                                                                                                   |
| `authToken`        | No       | Sentry token for this action. Overrides the configured token. Requires one of the `project:admin`, `project:read`, or `project:write` scopes. |
| `apiBaseUrl`       | No       | Compatibility value that must match the effective API base URL configured for the backend.                                                    |

The action returns the public DSN in `dsn`. It supports dry runs.
