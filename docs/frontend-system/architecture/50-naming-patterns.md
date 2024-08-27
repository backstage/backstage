---
id: naming-patterns
title: Frontend System Naming Patterns
sidebar_label: Naming Patterns
# prettier-ignore
description: Naming patterns in the frontend system
---

> **NOTE: The new frontend system is in alpha and is only supported by a small number of plugins.**

These are the naming patterns to adhere to within the frontend system. They help us keep exports and IDs consistent across packages and make it easier to understand the usage and intent of exports and IDs.

As a rule, all names should be camel case, with the exceptions of plugin and extension IDs, which should use kebab case.

## Plugins

| Description | Pattern      | Examples                              |
| ----------- | ------------ | ------------------------------------- |
| ID          | `'<id>'`     | `'catalog'`, `'user-settings'`        |
| Symbol      | `<id>Plugin` | `catalogPlugin`, `userSettingsPlugin` |

Example:

```ts
// This declaration is only for internal usage in tests. This could also be a direct default export.
export const userSettingsPlugin = createFrontendPlugin({
  id: 'user-settings',
  ...
})

// The plugin instance should be the default export of the package, typically this is placed in src/index.ts
export { userSettingsPlugin as default } from './plugin';
```

Note that while we use this naming pattern for the plugin instance this is only for internal usage within the package. Plugins are always exported as the default export of the plugin package.

## Extensions

| Description | Pattern                         | Examples                                                            |
| ----------- | ------------------------------- | ------------------------------------------------------------------- |
| Blueprint   | `<Kind>Blueprint`               | `PageBlueprint`, `EntityCardBlueprint`                              |
| ID          | `[<kind>:]<namespace>[/<name>]` | `'core.nav'`, `'page:user-settings'`, `'entity-card:catalog/about'` |
| Symbol      | `<namespace>[<Name>][<Kind>]`   | `coreNav`, `userSettingsPage`, `catalogAboutEntityCard`             |

When you create a new extension you never provide the ID directly. Instead, you indirectly or directly provide the kind, namespace, and name parts that make up the ID. The kind is always provided by the extension blueprint, the only exception is if you use `createExtension` directly. Any extension that is provided by a plugin will by default have its namespace set to the plugin ID, so you generally only need to provide an explicit namespace if you want to override an existing extension. The name is also optional, and primarily used to distinguish between multiple extensions of the same kind and namespace. If a plugin doesn't need to distinguish between different extensions of the same kind, the name can be omitted.

Example:

```ts
// This is an extension blueprint that is used to create an extension of the 'page' kind.
export const PageBlueprint = createExtensionBlueprint({
  kind: 'page',
  // ...
});

// The namespace is inferred from the plugin ID, in this case 'catalog'
// The final ID for this extension will be 'page:catalog/entity'
const catalogEntityPage = PageBlueprint.make({
  name: 'entity',
  // ...
});

// The name is omitted, because the catalog plugin only provides a single extension of this kind
// The final ID for this extension will be 'search-result-list-item:catalog'
const catalogSearchResultListItem = SearchResultListItemBlueprint.make({
  // ...
});

// Note that the extensions themselves are not exported, only the plugin instance
export const catalogPlugin = createFrontendPlugin({
  id: 'catalog',
  extensions: [catalogEntityPage, catalogSearchResultListItem /* ... */],
});
```

## Extension Data

| Description          | Pattern                               | Examples                                                                      |
| -------------------- | ------------------------------------- | ----------------------------------------------------------------------------- |
| Interface            | `<Name>ExtensionData`                 | `SearchResultItemExtensionData`                                               |
| Standalone Reference | `<name>ExtensionDataRef`              | `searchResultItemExtensionDataRef`                                            |
| Standalone ID        | `<namespace>.<name>`                  | `'search.search-result-item'`                                                 |
| Grouped Reference    | `<group>ExtensionData.<name>`         | `coreExtensionData.reactElement`, `catalogFilterExtensionData.functionFilter` |
| Grouped ID           | `<group>.<name>`                      | `'core.react-element'`, `'catalog-filter.function-filter'`                    |
| Creator Reference    | `create<Kind>Extension.<name>DataRef` | `createGraphiQLEndpointExtension.endpointDataRef`                             |
| Creator ID           | `<namespace>.<kind>.<name>`           | `'graphiql.graphiql-endpoint.endpoint'`                                       |

Extension data references can be defined in a couple of different ways, depending on the intended usage, all of which are covered below.

#### Standalone Extension Data

The most simple way of defining extension data is a standalone reference. This is useful when you want to export a single reference that isn't closely tied to a specific kind of extension. Because this creates an extra export for each reference, the two other ways of defining extension data are preferred when possible.

```ts
// A separate named type declaration is only needed for bespoke complex extension data types
export interface SearchResultItemExtensionData {
  /* ... */
}

export const searchResultItemExtensionDataRef =
  createExtensionDataRef<SearchResultItemExtensionData>().with({
    id: 'search.search-result-item',
  });
```

#### Grouped Extension Data

This way of defining extension data is similar to the standalone way, but it used when you want to export multiple pieces of grouped extension data for general use. This avoids separate exports and helps make related extension data references easier to discover. The name of the group should generally by the same as the namespace of the exporting package, typically the plugin ID. If the group needs to be more specific it should be prefixed with the namespace.

```ts
export const coreExtensionData = {
  reactElement: createExtensionDataRef<ReactElement>().with({
    id: 'core.react-element',
  }),
  routePath: createExtensionDataRef<string>().with({
    id: 'core.route-path',
  }),
};
```

#### Extension Creator Extension Data

This is a convenient way of defining extension data when that data is only meant to be produced by a specific extension creator. It avoids additional exports and clearly signals that this piece of data belongs to this particular kind of extension.

```ts
export function createGraphiQLEndpointExtension(options) {
  /* ... */
}

// Use a TypeScript namespace to merge the extension data references with the extension creator
export namespace createGraphiQLEndpointExtension {
  export const endpointDataRef = createExtensionDataRef</* ... */>().with({
    id: 'graphiql.graphiql-endpoint.endpoint',
  });
}
```

## Extension Inputs

Extension inputs do not have naming patterns for all types of input, but there are some specific use-cases where we encourage using a recognizable input name.

| Name       | Description                                                                                                                                                   |
| ---------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `children` | An extension input that accepts `coreExtensionData.reactElement` data and nothing else, used in a way that is equivalent of the `children` property in React. |
