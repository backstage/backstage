---
id: linking-local-packages
title: Linking in Local Packages
description: How to link in other local packages into your Backstage monorepo
---

## Why?

If you are looking to make changes within the core Backstage repository and test
those changes within your Backstage application, you will need to link the two
together:

```text
~/backstage                // cloned from Github
~/my-backstage-application // generated using npx
```

For example, you might want to make modifications to `@backstage/core-plugin-api` and try them out in your company's
instance of Backstage.

## External workspace linking

:::info
Workspace linking is an experimental feature and may not work in all cases.
:::

The `backstage-cli package start` command that is used for local development of all packages supports a `--link` flag that can be used to link a single external workspace to the current workspace. It hooks into the module resolution and will override all imports of packages in the linked workspace to be imported from there instead. The only exception are the `react` and `react-dom` packages, which will always be resolved from the target package.

When linking an external workspace, make sure that dependencies are installed and up to date in both workspaces, and that the versions of `react` and `react-dom` are the same in both workspaces.

If you're within the `packages/app` folder inside your `my-backstage-application` workspace in the above example, you can link the `backstage` workspace using the following command:

```bash
yarn start --link ../../../backstage
```

The path provided to the `--link` option can be a relative or absolute path, and should point to the root of the external workspace.

With the `start` command up and running and serving the development version of your frontend app in the browser, you can now make changes to both workspaces and see the changes reflected in the browser.

You can also link backend packages using the exact same process, simply start your backend package with the same `--link <workspace-path>` option.

## Common Problems

### React errors

If you are encountering errors related to React, it is likely that the versions of React in the two workspaces are different. Make sure that the versions of `react` and `react-dom` are the same in both workspaces, or at least that they are in sync between the package that you're serving the app from and the external workspace.
