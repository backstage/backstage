---
id: understand-project
sidebar_label: 004 - Understand the project
title: 004 - Understand the project
description: Understand the main parts of a generated Backstage project
---

Audience: Developers and administrators

The generated project is a
[Yarn monorepo](https://yarnpkg.com/features/workspaces) containing a frontend
application, a backend application, configuration, and example catalog data. In
this final step, you will identify where each responsibility lives.

## Map the project

| Path                            | Responsibility                                                                |
| ------------------------------- | ----------------------------------------------------------------------------- |
| `app-config.yaml`               | Local application, backend, integration, authentication, and plugin settings. |
| `app-config.production.yaml`    | Configuration overrides intended for production deployments.                  |
| `backstage.json`                | The Backstage release version used by the project.                            |
| `examples/`                     | Local catalog entities and the example software template.                     |
| `packages/app/`                 | The frontend application and its package dependencies.                        |
| `packages/app/src/App.tsx`      | Creates the frontend app and installs local frontend features.                |
| `packages/app/src/modules/nav/` | Defines the generated app's sidebar navigation.                               |
| `packages/backend/`             | The backend application and its package dependencies.                         |
| `packages/backend/src/index.ts` | Adds backend plugins and starts the backend.                                  |
| `packages/backend/Dockerfile`   | Builds the backend and bundled frontend into a production container image.    |
| `package.json`                  | Defines the Yarn workspaces and project-level commands.                       |

## Understand configuration and example data

Open `app-config.yaml`. A fresh app uses this
[configuration file](../../conf/index.md) to set its title, organization name,
local URLs, in-memory database, guest authentication, and
[catalog locations](../../features/software-catalog/configuration.md).

The catalog locations point to the files in `examples/`. That is why the portal
contains the entities and software template you explored in the previous step.
When you later connect organizational data, you will replace or supplement
these example locations.

The generated `app-config.production.yaml` contains production-oriented
overrides. Do not treat it as a complete deployment configuration. The
Deployment Golden Path explains the database, authentication, secrets,
monitoring, and infrastructure decisions needed for production.

## Understand the frontend

Open `packages/app/src/App.tsx`. The generated app calls
[`createApp`](../../frontend-system/building-apps/01-index.md#the-app-instance)
from `@backstage/frontend-defaults` and installs the Catalog plugin and the
local navigation module explicitly.

The `app.packages: all` setting in `app-config.yaml` also enables
[package discovery](../../frontend-system/building-apps/05-installing-plugins.md#feature-discovery).
Frontend plugins added as dependencies of `packages/app` can expose features
that the app discovers automatically. The
[Frontend System documentation](../../frontend-system/index.md) explains how to
configure or override those features when you begin customizing the app.

## Understand the backend

Open `packages/backend/src/index.ts`. The file creates a
[Backstage backend](../../backend-system/index.md), adds the backend plugins
included in the template, and calls `backend.start()`.

Each `backend.add(import(...))` statement installs a backend plugin or module.
The generated backend includes support for:

- The [Software Catalog](../../features/software-catalog/index.md) and
  [Software Templates](../../features/software-templates/index.md).
- [Authentication](../../auth/index.md) and
  [permissions](../../permissions/getting-started.md).
- [Search](../../features/search/getting-started.md) and
  [TechDocs](../../features/techdocs/getting-started.md).
- [Kubernetes](../../features/kubernetes/index.md) and
  [notifications](../../notifications/index.md).

During local development, the frontend calls this backend at
`http://localhost:7007`. In the default production build, the backend also
serves the compiled frontend.

## Complete the Create App Golden Path

You now have a running stock Backstage app and know where to find its
configuration, frontend, backend, and example data. Continue with the path that
matches your next goal:

- [Build Backstage plugins](../plugins/index.md) to add organization-specific
  capabilities.
- [Deploy and operate Backstage](../deployment/index.md) to prepare the app for
  production.
- [Adopt Backstage](../adoption/001-getting-started.md) to plan a proof of
  concept and organizational rollout.
- [Customize Backstage UI](https://ui.backstage.io/?path=/docs/backstage-ui-foundations-styling--docs)
  to apply your organization's visual identity.
- [Install an existing frontend plugin](../../frontend-system/building-apps/05-installing-plugins.md)
  when you want to add community or third-party functionality.
- [Keep Backstage updated](../../getting-started/keeping-backstage-updated.md)
  as the project evolves.
