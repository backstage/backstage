---
id: react-router-stable-migration
title: React Router 6.0 Migration
description: Guide for how to migrate from React Router v6 beta to React Router v6 stable
---

Backstage has for a long time been using `react-router` version `6.0.0-beta.0`.
We adopted this unstable version because v6 had some new features that fit
really well with Backstage, particularly relative routing. Because we jumped on
this early and unstable version, we knew that we would at some point need a
breaking migration to the stable version of `react-router` v6, which is the
point we're at now!

This migration is required but controlled by each app, meaning that you choose
when you want to migrate your app. There will however be some point in the
future where we drop support for the beta version of `react-router`, at which
time you would be forced to migrate.

The stable version of React Router v6 brings a number of improvements and bug
fixes. Notably, the way that paths are resolved has been improved, which fixes a
bug where paths like `/catalog` and `/catalog-import` could get confused.

## Migration

### Step 1 - Upgrade to Backstage 1.6

The first Backstage release to support `react-router` v6 is `1.6`. You should upgrade to this version first before you start migrating. If you are an early bird and want to try out migration before that release, it is also shipped in `1.6.0-next.1`.

### Step 2 - Move `react-router` to `peerDependencies`

It's important that only one version of `react-router` is installed in the
project at a time. Similar to how the `react` version is handled, all plugins
and packages now declare a peer dependency on the React Router dependencies,
rather than a direct dependency. The only exception to this is the app package
(in `packages/app/package.json`), which has the direct dependencies that end up
deciding what version of React Router that you are using in your project.

Your internal packages might specify a dependency on `react-router` or `react-router-dom` in their `package.json`, and it's important that those are converted to `peerDependencies` so that we can control the version of `react-router` in the app `package.json`.

You can automate this step by running the following command:

```bash
yarn backstage-cli migrate react-router-deps
```

For those interested in doing this manually, apply the below change to all `package.json` files except the one at `packages/app/package.json` or any other app packages. Skip moving any dependencies that don't already exist, and move both `dependencies` and `devDependencies`.

```diff title="package.json"
 dependencies {
   ...
-  "react-router-dom": "^6.0.0-beta.0",
-  "react-router": "^6.0.0-beta.0"
 },
 peerDependencies: {
   ...
+  "react-router-dom": "6.0.0-beta.0 || ^6.3.0",
+  "react-router": "6.0.0-beta.0 || ^6.3.0"
 },
```

### Step 3 - Ensure that your external plugins are updated

It's important that you also update your external plugins to their latest version as these will have to perform the same `peerDependencies` update.

During this migration there may be external plugins that need updating. If you encounter any plugins outside of the `@backstage` scope that are incompatible with your installation, make sure to check for an existing issue or raise a new one at the plugin's GitHub repository.

### Step 4 - Bump the React Router dependencies in your app

Now it's time to do the actual migration to the latest version of React Router. At this time of writing that is `6.3.0`, but that is of course a moving target.

The first step is to modify `packages/app/package.json`:

```diff title="package.json"
-    "react-router": "6.0.0-beta.0",
-    "react-router-dom": "6.0.0-beta.0",
+    "react-router": "^6.3.0",
+    "react-router-dom": "^6.3.0",
```

In case you happen to have multiple app packages in your project, apply the same change to all those packages.

Once the change has been made, run `yarn install`, and then `yarn why react-router` to validate the installation. You should see the following line in the log as the only resulting entry:

```bash
=> Found "react-router@6.3.0"
```

If you see multiple entries, and especially `=> Found "react-router@6.0.0-beta.0"`, then your dependencies have not yet been fully migrated to support React Router v6 stable. Double check the steps above, using the information that the Yarn `why` command logged. Repeat the same process for `yarn why react-router-dom`.

If you end up being stuck not being able to move your entire project to stable versions cleanly, then you can use Yarn `"resolutions"` overrides in your root `package.json`. Try to avoid this option as it may lead to hidden breakages at runtime, and verify any plugins that needed the override. A better option is likely to hold off migrating for a while until plugins have had time to be updated.

### Step 5 - Breaking Changes

For a new app created with `npx @backstage/create-app`, the above steps are all you need to do. If you have created internal plugins and customizations then be sure to review the breaking changes in the [React Router changelog](https://reactrouter.com/docs/en/v6/upgrading/reach#breaking-updates) and validate all parts of your app. We've summarized the most important breaking changes below.

## Breaking Changes

See [changelog](https://reactrouter.com/docs/en/v6/upgrading/reach#breaking-updates) for a full list of breaking changes. Below we highlight a couple of the most important ones.

### Route paths

`Route` components must always contain a `path` or `index` prop.

```tsx
<Routes>
  {/* Invalid */}
  <Route element={<Example />} />

  {/* Valid */}
  <Route path="/" element={<Example />} />

  {/* Valid but discouraged due to incompatibility with react-router beta */}
  <Route index element={<Example />} />
</Routes>
```

Absolute route paths within each `Routes` element must now match their own location, meaning that the following is invalid:

```tsx
<Routes>
  <Route path="/foo">
    <Route path="/bar" /> {/* INVALID, must be "/foo/bar" or "bar" */}
  </Route>
</Routes>
```

### Routes and Route components

The `Routes` and `Route` component both received a large related breaking changes. It is no longer possible
to have anything but `Route` elements and React fragments be a child of a `Routes` element. This means that
structures like these:

```tsx
<Routes>
  <MyComponent path="/foo" />
  ...
</Routes>
```

need to be migrated to this:

```tsx
<Routes>
  <Route path="/foo" element={<MyComponent />} />
  ...
</Routes>
```

Somewhat related to the `Routes` change, it is no longer possible to render a
`Route` element by itself, outside of a `Routes` wrapper. Previously, rendering
such a `Route` element would cause the contents of its `element` prop to be
rendered instead, but it will now throw an error.

### `PermissionedRoute`

Because of the above change, the `PermissionedRoute` component no longer works in all situations with React Router v6 stable. It has been deprecated in favor of the new `RequirePermission` component, which can be placed anywhere in order to perform a permissions check.

It's crucial that you update to `RequirePermission` at the same time as you update to React Router v6 stable as the `PermissionedRoute` component will no longer function.

```tsx
{/* highlight-remove-start */}
<PermissionedRoute
  path="/catalog-import"
  permission={catalogEntityCreatePermission}
  element={<CatalogImportPage />}
{/* highlight-remove-end */}
{/* highlight-add-start */}
<Route
  path="/catalog-import"
  element={
    <RequirePermission permission={catalogEntityCreatePermission}>
      <CatalogImportPage />
    </RequirePermission>
  }
{/* highlight-add-end */}
/>
```

### `<Navigate />` component

When migrating over to React Router v6 stable, you might also see browser console warnings for the `Navigate` component. This will need to be wrapped up in a `Route` component with the `Navigate` component in the `element` prop.

```tsx
{/* prettier-ignore */ /* highlight-remove-next-line */}
<Navigate key="/" to="catalog" />;
{/* prettier-ignore */ /* highlight-add-next-line */}
<Route path="/" element={<Navigate to="catalog" />} />;
```

### `NavLink`

The `NavLink` component no longer has the `activeClassName` and `activeStyle` props. Instead, the `className` and `style` props accept a callback that receives a boolean indicating whether the link is active.

## For Plugin Authors

There are a few things to keep in mind when migrating a published plugin. You of course need to make sure that dependencies on React Router are moved to `peerDependencies` as described above.
In addition, you need to make sure that your plugin truly is compatible with both versions of React Router at runtime. To help you achieve that, you can follow these additional guidelines:

- Bump the version of `react-router` and `react-router-dom` in your own project to use the stable version. Place them in `devDependencies` if your plugin is a single package project. The stable version is more strict, so this is the better baseline to work from.
- Make sure all `Route` elements have a `path` prop. Do not use the new `index` props, as it is not supported by the beta version. Use `path="/"` for the index routes within a `Routes`.
- If you are using `NavLink`, use both the new and old APIs simultaneously, and work around any TypeScript errors.

## Troubleshooting

Check the browser console for React Router related error messages.

Check `yarn.lock` for packages depending on older versions of `react-router`:

```bash
yarn why react-router
```
