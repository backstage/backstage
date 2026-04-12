---
id: first-steps
sidebar_label: 001 - Scaffolding the plugin
title: How to scaffold a new plugin?
description: How to scaffold a new Backstage frontend plugin using the CLI
---

# Scaffolding a new plugin

Create a new frontend plugin package by running the following command in your
Backstage repository's root directory:

```sh
yarn new --select frontend-plugin --option pluginId=todo --option owner=
```

This creates a new NPM package named something like `@internal/plugin-todo`,
depending on the flags passed to the `new` command and your settings in the root
`package.json`. For more options, see
[the CLI docs](../../../tooling/cli/03-commands.md#new).

Creating the plugin takes a moment. Once the command finishes, a new folder
appears at `plugins/todo` (the path depends on the plugin ID you chose) with
a structure like this:

```
plugins/todo/
├── dev/          # Standalone dev server setup
├── src/
│   ├── components/
│   │   ├── TodoList/
│   │   └── TodoPage/
│   └── ...       # Plugin definition, routes, tests
└── package.json
```

## What did we create?

Here is a quick overview of the key files:

- **`src/plugin.tsx`** — The main plugin definition. This is where the plugin
  is created using `createFrontendPlugin` and where page extensions are
  registered using `PageBlueprint`.

- **`src/plugin.test.ts`** — Tests for the plugin definition. Verifies that
  the plugin and its extensions are created correctly.

- **`src/routes.ts`** — Route reference definitions used for navigation between plugins.

- **`src/index.ts`** — The package entry point, which exports the plugin as
  the default export.

- **`src/components/TodoPage/`** — The main page component. It fetches todo
  items from the backend and renders them using the `TodoList` component.

- **`src/components/TodoList/`** — A presentational component that renders a
  table of todo items using `@backstage/ui`.

- **`dev/index.tsx`** — A standalone development app that loads only your
  plugin. Run `yarn start` from the plugin directory to launch it.

- **`package.json`** — Notice the `backstage.role` field is set to
  `"frontend-plugin"`. This tells the Backstage tooling how to build and
  treat the package.

## Verifying the plugin

If your app has feature discovery enabled (the default), your plugin is
automatically picked up. If you are not using feature discovery, see the
[installation docs](../../../frontend-system/building-apps/05-installing-plugins.md)
for how to manually add the plugin to your app. Start the full app from the
repository root:

```sh
yarn start
```

Then navigate to `http://localhost:3000/todo` in your browser (the path
matches the plugin ID you chose). You see the todo page with a header and
example data. If you also have the backend todo plugin running, the page
displays your real todo items instead.

Run the plugin in isolation using its standalone development server:

```sh
yarn workspace @internal/plugin-todo start
```

## Common issues

- **Plugin page not showing up.** Verify that `app.packages` is set to `all`
  in your `app-config.yaml`. If you use include/exclude filters, make sure your
  plugin package is not excluded.
- **`yarn new --select frontend-plugin --option pluginId=todo --option owner=` fails during installation.** Make sure
  you have run `yarn install` in the repository root first and that your
  Node.js version matches the one required by the project.
- **TypeScript errors after scaffolding.** Run `yarn tsc` from the repository
  root to check for type errors. A fresh scaffold should compile cleanly — if
  not, try running `yarn install` again.
