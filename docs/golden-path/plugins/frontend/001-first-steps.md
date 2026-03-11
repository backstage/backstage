---
id: first-steps
sidebar_label: 001 - Scaffolding the plugin
title: How to scaffold a new plugin?
---

# Scaffolding a new frontend plugin

## Prerequisites

Before creating a frontend plugin, install dependencies from your Backstage repository root:

```sh
yarn install
```

## 1. Run `yarn new`

From your Backstage repository root, run:

```sh
yarn new
```

When prompted, select `frontend-plugin` and provide a plugin ID such as `todo`.

The plugin ID becomes part of package and route naming, so keep it short and lowercase with dashes.

Creating the plugin may take a little while. When it succeeds, the generated package is ready to start iterating on.

## 2. Verify the plugin scaffold

After scaffolding, verify these checks before moving on:

- `plugins/<your-plugin-id>` exists and contains `src/plugin.ts`
- The plugin page is registered in the local app routes
- Navigating to `http://localhost:3000/<your-plugin-id>` loads the plugin page

Run TypeScript compilation from the repository root to verify type safety:

```sh
yarn tsc
```

## What did we create?

You should now have a new plugin package under `plugins/<your-plugin-id>` with a structure similar to:

```
/ <- your Backstage app's root directory
    /plugins/
        /todo/
            package.json
            README.md
            eslintrc.js
            /dev/
                index.tsx
            /src/
                plugin.ts
                index.ts
                ...
```

At a high level:

- `src/plugin.ts` defines the plugin and its route references
- `src/index.ts` exports your plugin for use by the app
- `dev/index.tsx` is used for local plugin-focused development

## Common issues

### Plugin does not appear in the app

Check that the plugin was registered in the app and that you restarted `yarn start` after scaffolding.

### TypeScript errors after scaffolding

Run:

```sh
yarn tsc
```

If errors persist, confirm dependencies were installed from the repository root with `yarn install`.
