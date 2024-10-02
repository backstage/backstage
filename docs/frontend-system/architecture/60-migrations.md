---
id: migrations
title: Frontend System Migrations
sidebar_label: Migrations
# prettier-ignore
description: Migration documentation for different versions of the frontend system core APIs.
---

> **NOTE: The new frontend system is in alpha and is only supported by a small number of plugins.**

## Introduction

This section provides migration guides for different versions of the frontend system core APIs. Each guide will provide a summary of the changes that have been made for a particular Backstage release, and how to update your usage of the core APIs.

This guide is intended for app and plugin authors who have already migrated their code to the new frontend system, and are looking to keep it up to date with the latest changes. These guides do not cover trivial migrations that can be explained in a deprecation message, such as a renamed export.

## 1.31

### `namespace` parameter should be removed

The `namespace` parameter to all `createExtension`, `createExtensionBlueprint` or any `.make()` or `.makeWithOverrides()` method can be removed. This will now default to the `id` of the `plugin` which should already be the case.

### `createExtensionOverrides` -> `createFrontendModule`

Extensions will need to be wrapped in a module in order to be installed in the frontend. This means that the `createExtensionOverrides` function should be replaced with `createFrontendModule`, and the `pluginId` parameter should be set with the target `pluginId` that you're overriding.

For example:

```tsx
import {
  createPageExtension,
  createExtensionOverrides,
} from '@backstage/frontend-plugin-api';

const customSearchPage = PageBlueprint.make({
  namespace: 'search',
  params: {
    defaultPath: '/search',
    loader: () =>
      import('./CustomSearchPage').then(m => <m.CustomSearchPage />),
  },
});

export default createExtensionOverrides({
  extensions: [customSearchPage],
});
```

Should now look like this:

```tsx
import {
  createPageExtension,
  createFrontendModule,
} from '@backstage/frontend-plugin-api';

const customSearchPage = PageBlueprint.make({
  params: {
    defaultPath: '/search',
    loader: () =>
      import('./CustomSearchPage').then(m => <m.CustomSearchPage />),
  },
});

export default createFrontendModule({
  pluginId: 'search',
  extensions: [customSearchPage],
});
```

### Moved `createApp`

The `createApp` function has been moved to the new `@backstage/frontend-defaults` package. The old export from `@backstage/frontend-app-api` is now deprecated and should be replaced with the new one.

### Removed support for "v1" extensions

Extensions created with `@backstage/frontend-plugin-api` from before the 1.30 release are no longer supported by `createApp`. To be able to use extensions in a new app, they need to be created with `@backstage/frontend-plugin-api` version 0.7.0 or later.

### New type parameters for `ExtensionDefinition` and `ExtensionBlueprint`

The type parameters of `ExtensionDefinition` and `ExtensionBlueprint` have been updated to use a single type parameter with an object, in order to make them easier to read and evolve.

Existing usage can generally be updated as follows:

`ExtensionDefinition<any>` -> `ExtensionDefinition`
`ExtensionDefinition<any, any>` -> `ExtensionDefinition`
`ExtensionDefinition<TConfig>` -> `ExtensionDefinition<{ config: TConfig }>`
`ExtensionDefinition<TConfig, TConfigInput>` -> `ExtensionDefinition<{ config: TConfig, configInput: TConfigInput }>`

If you need to infer the parameter you can use `ExtensionDefinitionParameters` and `ExtensionBlueprintParameters`, for example:

```tsx
import {
  ExtensionDefinition,
  ExtensionDefinitionParameters,
} from '@backstage/frontend-plugin-api';

function myUtility<T extends ExtensionDefinitionParameters>(
  ext: ExtensionDefinition<T>,
): T['config'] {
  // ...
}
```

## 1.30

### Reworked extension inputs and outputs

In previous versions of the frontend system you would define extension inputs and outputs as an "data map" where each named property corresponded to a piece of data that could be accessed via the same name in the extension factory. In order to better support extension overrides and blueprints, as well as reduce the risk of confusion, these data maps have been replaced by an array of data references.

For example, an extension previously declared like this:

```tsx
createExtension({
  name: 'example',
  attachTo: { id: 'some-extension', input: 'content' },
  inputs: {
    header: createExtensionInput(
      { element: coreExtensionData.reactElement },
      {
        optional: true,
        singleton: true,
      },
    ),
  },
  output: { element: coreExtensionData.reactElement },
  factory({ inputs }) {
    return {
      element: <ExtensionPage header={inputs.header?.output.element} />,
    };
  },
});
```

Would now look like this:

```tsx
createExtension({
  name: 'example',
  attachTo: { id: 'some-extension', input: 'content' },
  inputs: {
    header: createExtensionInput([coreExtensionData.reactElement], {
      optional: true,
      singleton: true,
    }),
  },
  output: [coreExtensionData.reactElement],
  factory({ inputs }) {
    return [
      coreExtensionData.reactElement(
        <ExtensionPage
          header={inputs.header?.get(coreExtensionData.reactElement)}
        />,
      ),
    ];
  },
});
```

Note the changes to the `inputs` and `output` declarations, as well as how these are used in the factory. Both the `inputs` and `output` now declare their expected data using an array, without names tied to each piece of data. The `get` method on the input object is used to access the input data, and accept a data reference matching the data that was declared for that input.

The biggest change in practice is how the extension factories output their data. Instead of returning an object with the data values, you instead use each extension data reference to encapsulate a value and return a collection of these encapsulated values from the factory.

### Blueprints instead of extension creators

The "extension creator" pattern where `createExtension` was wrapped up in a function for creating specific kind of extensions has been replaced by [extension blueprints](./23-extension-blueprints.md). Extension creators were hard to implement and to maintain, with blueprints providing a much more consistent and powerful API surface for both plugin builders and integrators. For example, `createPageExtension` was the extension creator equivalent of `PageBlueprint`.

Replace all existing usages of extension creators in your plugin or app with the corresponding blueprint. For a given extension creator `create<Kind>Extension`, the blueprint equivalent is `<Kind>Blueprint`. There might be slight differences in the API between the two, but most often you just need to move the kind-specific options of the extension creator to be passed as parameters to the blueprint. Note that if your extension declared any additional inputs or config you'll need to use the [`.makeWithOverrides`](./23-extension-blueprints.md#creating-an-extension-from-a-blueprint-with-overrides) method of the blueprint.

If your plugin exports and extension creators, these should be migrated to blueprints instead.

### Extension tester rework

The `createExtensionTester` from the `@backstage/frontend-test-utils` package has been reworked to better support testing of extensions. The new API allows access to extension output directly using the new `.get(ref)` method, and also provides access to all tested extensions through the new `.query(id/extension)` method.

The `.render()` method that used to render the test subject in a test app has been deprecated. The extension tester no longer constructs a full app tree, but instead only instantiates the tree for the extensions under test. If you want to test the rendering of an extension that outputs in an app, you can instead use the `renderInTestApp` utility in combination with the new `.reactElement()` method of the extension tester: `renderInTestApp(tester.reactElement())`.

### Extension data references update

The way that extension data references are declared has been changed to allow for type inference of the ID. This requires the declaration to be split into two separate function calls, one to supply the type and the other to infer any options. For example, a reference that was previously declared like this:

```ts
export const myExtension = createExtensionDataRef<MyType>('my-plugin.my-data');
```

Should be updated to the following:

```ts
export const myExtension = createExtensionDataRef<MyType>().with({
  id: 'my-plugin.my-data',
});
```
