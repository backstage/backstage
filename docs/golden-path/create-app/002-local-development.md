---
id: local-development
sidebar_label: 002 - Run the app locally
title: 002 - Run the app locally
description: Start and verify a generated Backstage app
---

Audience: Developers and administrators

In this step, you will start the generated frontend and backend and verify that
the stock app works.

## Start Backstage

1. From the generated project directory, run:

   ```shell
   yarn start
   ```

   This starts the frontend and backend development processes in the same
   terminal. The first startup can take a little longer while the frontend is
   compiled.

1. If a browser does not open automatically, visit
   [http://localhost:3000](http://localhost:3000).

1. If prompted to sign in, select the
   [guest provider](../../auth/guest/provider.md). The generated app uses guest
   authentication for local development.

## Verify the app

The [Software Catalog](../../features/software-catalog/index.md) is the
generated app's home page. Confirm that the catalog contains the
**example-website** [Component](../../features/software-catalog/system-model.md).
This entity comes from the example data included with the generated project.

The development processes listen on these ports:

| Process  | URL                     | Purpose                                  |
| -------- | ----------------------- | ---------------------------------------- |
| Frontend | `http://localhost:3000` | Serves the Backstage user interface.     |
| Backend  | `http://localhost:7007` | Serves plugin APIs and application data. |

If the catalog does not load, check the terminal for an error from either
process before continuing.

## Understand local development

The frontend is a React application in `packages/app`, built with the
[Backstage frontend system](../../frontend-system/index.md). During development,
the Backstage CLI compiles it again when frontend files change.

The backend is a Node.js application in `packages/backend`, built with the
[Backstage backend system](../../backend-system/index.md). The development
process restarts it when backend files change. It uses an in-memory SQLite
database by default, so its data does not persist after you stop the app.

Keep `yarn start` running for the next step. When you are finished with the
tutorial, press **Control+C** in the terminal to stop both processes.

## Next step

Continue to [explore the generated portal](./003-explore-app.md).
