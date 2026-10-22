# Plugin packaging

Read when creating or changing a plugin's entry point, `package.json`, exports, extension names, or feature flags. Every item here type-checks when it is wrong, and most fail without an error.

## The plugin must be the package's default export

Feature discovery (`app.packages: all`) imports each discovered package's main entry, and its `./alpha` entry if `exports` declares one. It keeps only the **default export**, and only if that export is a frontend plugin, a frontend module, or a feature loader. Anything else is skipped without a warning.

```ts
// src/index.ts
export { default } from './plugin';
```

A named export alone is not enough:

```ts
// ❌ Not discovered: there is no default export
export { default as myPlugin } from './plugin';

// ✅ Keep the named export if consumers use it, but add the default
export { default } from './plugin';
export { default as myPlugin } from './plugin';
```

The symptom is a plugin whose pages, tabs, and APIs never appear, with nothing in the console. Component-only plugins can look fine, because nothing visible depends on the plugin being installed.

## `package.json` requirements for discovery

Discovery only looks at packages that meet all of these:

- The package is listed in the app package's `dependencies`. Dependencies of dependencies are not discovered.
- `backstage.role` is `frontend-plugin` or `frontend-plugin-module`.
- `package.json` itself can be resolved. If the package has an `exports` field, it must include `"./package.json"`, or discovery cannot read the role and skips the package without a warning.

```json
{
  "backstage": {
    "role": "frontend-plugin",
    "pluginId": "my-plugin"
  },
  "exports": {
    ".": "./src/index.ts",
    "./package.json": "./package.json"
  }
}
```

Set `backstage.pluginId` to the exact `pluginId` passed to `createFrontendPlugin`. `yarn backstage-cli repo fix --publish` can set it, but it guesses the ID from a `plugin-<id>` package name, so check the result when the package name and the runtime ID differ. For `frontend-plugin-module` packages, `pluginId` is the ID of the plugin the module extends.

## The `exports` field blocks deep imports

Once `exports` is set, imports of anything not listed in it fail with `TS2307: Cannot find module`, including deep imports such as `my-plugin/src/components/Foo`. Before adding `exports`, search the repository for deep imports of the package:

```bash
grep -rn "from '<package-name>/src/" --include='*.ts' --include='*.tsx' .
```

For each match, re-export the symbol from `src/index.ts` and change the consumer to import from the package root. Keep the re-exports to what other packages actually need, because they become the package's public API.

## Give each extension of the same kind a unique `name`

An extension's ID is built from its kind, the plugin ID, and its optional `name`: `page:my-plugin` without a name, `page:my-plugin/details` with `name: 'details'`. Two extensions of the same kind without names get the same ID.

- **Within one plugin or module**, `createFrontendPlugin` and `createFrontendModule` throw `Plugin 'my-plugin' provided duplicate extensions: page:my-plugin`.
- **Across features**, for example two installed packages that use the same `pluginId`, the app keeps the first extension, ignores the other, and logs an `EXTENSION_IGNORED` warning: `The 'page:my-plugin' extension from the 'my-plugin' plugin is a duplicate and will be ignored`.

```tsx
const listPage = PageBlueprint.make({
  name: 'list',
  params: { path: '/my-plugin', routeRef: rootRouteRef, loader },
});

const detailsPage = PageBlueprint.make({
  name: 'details',
  params: { path: '/my-plugin/:id', routeRef: detailsRouteRef, loader },
});
```

The same applies to multiple `ApiBlueprint`, `EntityContentBlueprint`, and `EntityCardBlueprint` extensions in one plugin.

## Declare feature flags on the plugin

Declare feature flags on `createFrontendPlugin` (or `createFrontendModule`) instead of registering them imperatively. Components read them through `featureFlagsApiRef` as before.

```tsx
export default createFrontendPlugin({
  pluginId: 'my-plugin',
  featureFlags: [
    { name: 'my-plugin-beta', description: 'Enables the beta list view' },
  ],
  extensions: [listPage],
});
```

Names must start with a lowercase letter, contain only lowercase letters, numbers, and hyphens, and be at most 150 characters. An invalid name, such as `myPlugin/beta` or `my_plugin_beta`, does not fail the app. The flag is not registered, and the app logs a `FEATURE_FLAG_INVALID` warning. Renaming a flag turns it off for every user who had turned it on.

See [Feature flags](https://backstage.io/docs/frontend-system/building-plugins/feature-flags) for using flags in extensions.
