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
