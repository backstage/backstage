---
id: first-steps
sidebar_label: 001 - Scaffolding the plugin
title: How to scaffold a new plugin?
description: How to scaffold a new Backstage backend plugin using the CLI
---

# Scaffolding a new plugin

<!-- Talk through how to run the `backstage-cli create` command as well as what the output it creates is. This should touch on why we install this into `packages/backend`. -->

## `yarn new`

A new, bare-bones backend plugin package can be created by issuing the following
command in your Backstage repository's root directory and selecting `backend-plugin`:

```sh
yarn new
```

You will be asked to supply a name for the plugin. This is an identifier that
will be part of the NPM package name, so make it short and containing only
lowercase characters separated by dashes, for our example, you should provide `todo`. For plugins you may write in the future, this should be an easy to remember indicator of what this plugins does, like if it's a
package that adds an integration with a system named Carmen, you would want to name it `carmen`.

This will create a new NPM package with a package name something like `@internal/backstage-plugin-carmen-backend`, depending on the other flags passed to the `new` command, and your settings for the `new` command in your root `package.json`. For future reference, we also support additional flags and configuration. Learn more at [the CLI docs](../../../tooling/cli/03-commands.md#new).

Creating the plugin will take a little while, so be patient. If it runs with no issues, it will run the initial installation and build commands, so that your package is ready to be hacked on!

Once the commands complete, you should see a new folder `plugins/todo-backend` with content like the below tree:

```
/ <- your Backstage app's root directory
    /plugins/
        /todo-backend/
            package.json
            README.md
            /dev/
                index.ts
            /src/
                index.ts
                plugin.ts
                plugin.test.ts
                router.ts
                router.test.ts
                setupTests.ts
                /services/
                    TodoListService.ts
```

Here is a quick overview of the key files:

- **`src/plugin.ts`** — The plugin definition. Calls `createBackendPlugin`,
  declares the services the plugin depends on, and wires the router into the
  HTTP service.
- **`src/router.ts`** — The Express router. Parses incoming requests,
  validates them with `zod`, calls into `TodoListService`, and returns
  responses.
- **`src/router.test.ts`** — Unit tests for the router using
  `@backstage/backend-test-utils` and `supertest`.
- **`src/services/TodoListService.ts`** — The service that holds the todo
  business logic, plus its `createServiceRef` factory so other plugins can
  depend on it. This is one flat file in the scaffold; you can split it
  into a directory if it grows.
- **`src/index.ts`** — The package entry point. Re-exports the plugin as
  the default export so the backend can pick it up with
  `backend.add(import('@internal/backstage-plugin-todo-backend'))`.
- **`dev/index.ts`** — A standalone backend that loads only this plugin. Run
  `yarn workspace @internal/backstage-plugin-todo-backend start` to launch
  it for fast iteration.
- **`package.json`** — Notice the `backstage.role` field is set to
  `"backend-plugin"`. This tells the Backstage tooling how to build and
  treat the package.

### Verifying the plugin

`yarn new` automatically adds the plugin to your example backend
(`packages/backend/src/index.ts`). Start the full stack from the repository
root:

```sh
yarn start
```

You should see a `Listening on :7007` line in the logs, and
`http://localhost:7007/api/todo/todos` should respond — the next chapter
walks through exercising the API.

### FAQs

<details>
  <summary>`yarn new` fails during installation</summary>

Make sure you have run `yarn install` in the repository root first and that
your Node.js version matches the one required by the project (check the
`engines` field in `package.json`).

</details>

<details>
  <summary>The plugin is not picked up by the backend</summary>

Confirm that `packages/backend/src/index.ts` contains a `backend.add(...)`
line for your new plugin. If it does not, `yarn new` did not finish wiring
the plugin in; add the import manually.

</details>
