---
id: extension-overrides
title: Frontend Extension Overrides
sidebar_label: Extension Overrides
# prettier-ignore
description: Frontend extension overrides
---

:::info
The new frontend system is in alpha and is only supported by a small number of plugins. If you want to use the new
plugin system, you must migrate your entire Backstage application or start a new application from scratch. We do not yet
recommend migrating any apps to the new system.
:::

## Introduction

An important customization point in the frontend system is the ability to override existing extensions. It can be used for anything from slight tweaks to the extension logic, to completely replacing an extension with a custom implementation. While extensions are encouraged to make themselves configurable, there are many situations where you need to override an extension to achieve the desired behavior. The ability to override extensions should be kept in mind when building plugins, and can be a powerful tool to allow for deeper customizations without the need to re-implement large parts of the plugin.

In general, most features should have a good level of customization built into them, so that users do not have to leverage extension overrides to achieve common goals. A well written feature often has [configuration](../../conf/) settings, or uses extension inputs for extensibility where applicable. An example of this is the search plugin, which allows you to provide result renderers as inputs rather than replacing the result page wholesale just to tweak how results are shown. Adopters should take advantage of those when possible in order to reduce the need and size of extension overrides.

## Overriding an extension

Every extension created with `createExtension` comes with an `override` method, including those created from an [extension blueprint](./23-extension-blueprints.md). The `override` method **creates a new extension**, it does not mutate the existing extension. This new extension in created in such a way that if it is installed adjacent to the existing extension, it will take precedence and override the existing extension. While the `override` method does create new extension instances, it is not intended to be used as a way to create multiple new extensions from a base template, for that use-case you will want to use an [extension blueprint](./23-extension-blueprints.md) instead.

The following is an example of calling the `.override(...)` method on an extension:

```tsx
const myOverrideExtension = myExtension.override({
  factory(originalFactory) {
    return originalFactory();
  },
});
```

This override is a no-op, it does not change the behavior of the extension, but simply forwards the outputs from the original extension factory. If you are familiar with [extension blueprints](./23-extension-blueprints.md), you will recognize this factory override pattern where we get access to the original factory function. In fact the only difference is that we do not need to pass any parameters to the original factory. The first parameter is now instead the optional factory context overrides, more on that as we dive into each override pattern in the following sections.

## Overriding original factory outputs

When overriding an extension you can choose to forward the existing outputs, or replace them with your own. The override factory has an exception to the rule that extension factories can only return a single value for each declared output. It will instead always use the **last** value provided for each extension data reference. This makes it possible to forward the outputs from the original factory, but also provide your own, for example:

```tsx
const myOverrideExtension = myExtension.override({
  factory(originalFactory) {
    return [
      ...originalFactory(),
      coreExtensionData.reactElement(<h1>Hello Override</h1>),
    ];
  },
});
```

You can also access individual data values from the original factory, in order to decorate the output:

```tsx
const myOverrideExtension = myExtension.override({
  factory(originalFactory) {
    const originalOutput = originalFactory();
    const originalElement = originalOutput.get(coreExtensionData.reactElement);

    return [
      ...originalOutput,
      coreExtensionData.reactElement(
        <details>
          <summary>Show original element</summary>
          {originalElement}
        </details>,
      ),
    ];
  },
});
```

Just as [extension factories can be declared as a generator function](./20-extensions.md#extension-factory-as-a-generator-function), so can the override factory. Using a generator function, the first example above can be written as follows:

```tsx
const myOverrideExtension = myExtension.override({
  *factory(originalFactory) {
    yield* originalFactory();
    yield coreExtensionData.reactElement(<h1>Hello Override</h1>);
  },
});
```

Note the `yield*` expression, which forwards all values from the provided iterable to the generator, in this case the original factory output.

## Overriding blueprint parameters

If you are overriding an extension that was originally created from an [extension blueprint](./23-extension-blueprints.md), you are able to override the parameters that were originally provided for the blueprint. This can be done directly as an option to `.override`, or when calling the original factory in the override factory. The provided parameter overrides will be merged with the existing parameters that where provided when creating the extension from the blueprint.

For example, consider the following extension created from the `PageBlueprint`:

```tsx
const exampleExtension = PageBlueprint.make({
  params: {
    loader: () =>
      import('./components/ExamplePage').then(m => <m.ExamplePage />),
    defaultPath: '/example',
  },
});
```

You can immediately override parameters through the `params` option:

```tsx
const overrideExtension = exampleExtension.override({
  params: {
    loader: () =>
      import('./components/OverridePage').then(m => <m.OverridePage />),
  },
});
```

It is also possible to pass parameter overrides when calling the original factory in the override factory:

```tsx
const overrideExtension = exampleExtension.override({
  factory(originalFactory) {
    return originalFactory({
      params: {
        loader: () =>
          import('./components/OverridePage').then(m => <m.OverridePage />),
      },
    });
  },
});
```

## Overriding declared outputs

When overriding an extension you can provide a new output declaration. This **replaces** any existing output declaration, which means that if you want to forward any of the original output you will need to declare it again. The following example shows how to override an extension and replace the output declaration:

```tsx
// Original extension
const exampleExtension = createExtension({
  name: 'example',
  output: [coreExtensionData.reactElement],
  factory: () => [coreExtensionData.reactElement(<h1>Example</h1>)],
});

// Override extension, with additional outputs
const overrideExtension = exampleExtension.override({
  output: [coreExtensionData.reactElement, coreExtensionData.routePath],
  factory(originalFactory) {
    return [...originalFactory(), coreExtensionData.routePath('/example')];
  },
});
```

When overriding the output declaration you don't need to include the original outputs. Just remember that you will no longer be able to directly forward the output from the original factory, and will still need to adhere to the contract of the input that the extension is attached to.

## Overriding declared inputs

When overriding an extension you can also provide new input declarations. You can define any number of new inputs, but you are **not** able to override the existing inputs declared by the original extension. The new inputs will be merged with the existing ones, giving the override factory access to both. The following example shows how to override an extension and add a new input declaration:

```tsx
const myOverrideExtension = myExtension.override({
  inputs: {
    myOverrideInput: createExtensionInput([coreExtensionData.reactElement]),
  },
  factory(originalFactory, { inputs }) {
    const originalOutput = originalFactory();
    const originalElement = originalOutput.get(coreExtensionData.reactElement);

    return [
      ...originalOutput,
      coreExtensionData.reactElement(
        <div>
          <h1>Original element</h1>
          {originalElement}
          <h1>Additional inputs</h1>
          <ul>
            {inputs.myOverrideInput.map(i => (
              <li key={i.node.spec.id}>
                {i.get(coreExtensionData.reactElement)}
              </li>
            ))}
          </ul>
        </div>,
      ),
    ];
  },
});
```

## Overriding configuration schema

Overriding the configuration schema works very similarly to overriding the declared inputs. You can define new configuration fields that will be merged with the existing ones, but you can not re-declare existing fields. The following example shows how to override an extension and add a new configuration field:

```tsx
const exampleExtension = createExtension({
  config: {
    schema: {
      foo: z => z.string(),
    },
  },
  // ...
});

const overrideExtension = exampleExtension.override({
  config: {
    schema: {
      bar: z => z.string(),
    },
  },
  factory(originalFactory, { config }) {
    //
    console.log(`foo=${config.foo} bar=${config.bar}`);
    return originalFactory();
  },
});
```

## Overriding original factory config context

In all examples so far we have called the `originalFactory` callback without any arguments. It is however possible to override parts of the factory context for the original factory using the first parameter of the original factory. This can be useful if you want to override the provided configuration or change the inputs in some way. Note that if you are implementing a `factory` for a blueprint, the override factory context will instead be the second parameter of the original factory function. The following is an example of how to override the configuration for the original factory:

```tsx
const exampleExtension = createExtension({
  name: 'example',
  config: {
    schema: {
      layout: z => z.enum(['grid', 'list']).optional(),
    },
  },
  output: [coreExtensionData.reactElement],
  factory: ({ config }) => [
    coreExtensionData.reactElement(
      <MyExtension layout={config.layout ?? 'list'} />,
    ),
  ],
});

const overrideExtension = exampleExtension.override({
  factory(originalFactory, { config }) {
    return originalFactory({
      config: {
        // Switch default layout from 'list' to 'grid'
        layout: config.layout ?? 'grid',
      },
    });
  },
});
```

As can be seen in the above example we can provide a new configuration object in the `originalFactory` call using the `config` property. When providing the `config` property we will completely override the original configuration object that would otherwise have been provided to the original factory. Note that this object must adhere to the output type of the configuration schema, which might not be intuitive. It's due to the configuration having already been processed and validated by Zod at this point, which means that things like defaults in the schema will not be applied again.

## Overriding original factory inputs context

In addition to the configuration, you are also able to override the inputs provided to the original factory. Just like when overriding configuration you will completely replace the original inputs with the new ones, but you are able to forward the inputs that you are receiving to the override factory.

You can override each input in one of two ways, which can not be combined. You can forward (or not forward) the original input, optionally filtering out individual items or reordering them. Or you can provide new values for the input, which will replace the original input. When providing new values you must forward all existing inputs and the inputs can not be reordered, and when forwarding the existing inputs you can not provide new values.

The following example shows how to override the values provided for each input item:

```tsx
const exampleExtension = createExtension({
  inputs: {
    items: createExtensionInput([coreExtensionData.reactElement]),
  },
  // ...
});

const overrideExtension = exampleExtension.override({
  factory(originalFactory, { inputs }) {
    return originalFactory({
      inputs: {
        items: inputs.items.map(i => [
          coreExtensionData.reactElement(
            <ItemWrapper>{i.get(coreExtensionData.reactElement)}</ItemWrapper>,
          ),
        ]),
      },
    });
  },
});
```

In contrast, the following example shows how to forward the original inputs, but in a different order:

```tsx
const exampleExtension = createExtension({
  inputs: {
    content: createExtensionInput([coreExtensionData.reactElement], {
      singleton: true,
      optional: true,
    }),
    items: createExtensionInput([coreExtensionData.reactElement]),
  },
  // ...
});

const overrideExtension = exampleExtension.override({
  factory(originalFactory, { inputs }) {
    return originalFactory({
      inputs: {
        // We can also skip forwarding the original input, if we want to remove it
        content: inputs.content,
        // Sort items input by their extension ID
        items: inputs.items.toSorted((a, b) =>
          a.node.spec.id.localeCompare(b.node.spec.id),
        ),
      },
    });
  },
});
```

## Installing override extension in an app

To install extension overrides in a Backstage app you should use `plugin.withOverrides` whenever you are overriding or adding extensions for a plugin. See the section on [overriding a plugin](./15-plugins.md#overriding-a-plugin) for more information.

Note that while using either of these options you don't necessarily need to use the extension `.override(...)` method to create the overrides. You can also create new extensions with `createExtension` or a blueprint that are either completely net-new extensions, or override an existing extension by using the same `kind`, `namespace` and `name` to produce the same extension ID.

### Creating a frontend module

The following example shows how to create a frontend module that overrides the search page from the search plugin:

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

Assuming the above code resides in the `@internal/search-page` package, you can install it in your app like this:

```tsx title="packages/app/src/App.tsx"
import { createApp } from '@backstage/frontend-defaults';
import searchPageModule from '@internal/search-page';

const app = createApp({
  // highlight-next-line
  features: [searchPageModule],
});

export default app.createRoot();
```

You must define a `pluginId` when creating a frontend module, and the plugin must also be installed for the module to be loaded.
