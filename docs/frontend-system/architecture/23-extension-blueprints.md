---
id: extension-blueprints
title: Frontend Extension Blueprints
sidebar_label: Extensions Blueprints
# prettier-ignore
description: Frontend extensions
---

:::info
The new frontend system is in alpha and is only supported by a small number of plugins. If you want to use the new
plugin system, you must migrate your entire Backstage application or start a new application from scratch. We do not yet
recommend migrating any apps to the new system.
:::

The `createExtension` function and related APIs is considered a low-level building and fairly advanced building block, and is not typically what you would use when building plugins and features. Instead, the core APIs and plugins provide extension blueprints that makes it easier to create extensions for specific usages. These blueprints accept a number of parameters that is up to each blueprint to define, and then creates a new extension using the provided parameters. New blueprints are created using the `createExtensionBlueprint` function, and are by convention exported with the symbol `<Kind>Blueprint`. If you are curious about what blueprints are available from a plugin or package, look for `*Blueprint` exports in the package's API, for plugins these are typically found in the `*-react` package.

## Creating an extension from a blueprint

Every extension blueprint provides a `make` method that can be used to create new extensions. It is a simple way to create a new extension where the base blueprint provides all the necessary functionality. All you need to do is to provide the necessary blueprint parameters, but you also have the ability to provide additional options, for example a `name` for the extension.

The following is a simple example of how one might use the blueprint `make` method to create a new extension:

```tsx
const myPageExtension = PageBlueprint.make({
  params: {
    defaultPath: '/my-page',
    loader: () => import('./components/MyPage').then(m => <m.MyPage />),
  },
});
```

The returned `myPageExtension` is an extension which is ready to be used in a plugin. It is the same type of object as is returned by the lower level `createExtension` function.

## Creating an extension from a blueprint with overrides

Every extension blueprint also provides a `makeWithOverrides` method. It is useful in cases where you want to provide additional integration points for an extension created with a blueprint. You might for example want to define additional inputs or configuration schema, or use the existing configuration to dynamically compute the parameters passed to the blueprint.

The following is an example of how one might use the blueprint `makeWithOverrides` method to create a new extension:

```tsx
const myPageExtension = PageBlueprint.makeWithOverrides({
  config: {
    schema: {
      layout: z => z.enum(['grid', 'rows']).default('grid'),
    },
  },
  // The original blueprint factory is provided as the first argument
  factory(originalFactory, { config }) {
    // Call and forward the result from the original factory, providing
    // the blueprint parameters as the first argument.
    return originalFactory({
      defaultPath: '/my-page',
      loader: () =>
        import('./components/MyPage').then(m => (
          // We can now access values from the factory context when providing
          // the blueprint parameters, such as config values.
          <m.MyPage layout={config.layout} />
        )),
    });
  },
});
```

When using `makeWithOverrides`, we no longer pass the blueprint parameters directly. Instead, we provide a `factory` function that receives the original blueprint factory as the first argument, and the extension factory context as the second. We can then call the original blueprint factory with the blueprint parameters and forward the result as the return value of out factory. Notice that when passing the blueprint parameters using this pattern we have access to a lot more information than when using the `make` method, at the cost of being more complex.

Apart from the addition of the blueprint parameters of the first argument to the original factory function, the `makeWithOverrides` method works the same way as [extension overrides](./25-extension-overrides.md). All the same options and rules apply, including the ability to define additional inputs, override outputs, and so on. We therefore defer to the [extension overrides](./25-extension-overrides.md) documentation for more information on how to use the `makeWithOverrides` method.

## Creating an extension blueprint

To create a new extension blueprint, you use the `createExtensionBlueprint` function. At the surface it is very similar to `createExtension`, but with a few key differences. Firstly you must provide a `kind` option, which will be the kind of all extensions created with the blueprint. See the [naming patterns section](./50-naming-patterns.md) for more information about how to select a good extension kind. Secondly, the `factory` function has a new signature where the first parameter is the blueprint parameters, and the second is the factory context. And finally, rather than returning an extension, `createExtensionBlueprint` returns a blueprint object with the `make` method and friends, which is used as is described above.

The following is an example of how one might create a new extension blueprint:

```tsx
export interface MyWidgetBlueprintParams {
  defaultTitle: string;
  element: JSX.Element;
}

export const MyWidgetBlueprint = createExtensionBlueprint({
  kind: 'my-widget',
  attachTo: { id: 'page:my-plugin', input: 'widgets' },
  config: {
    schema: {
      title: z.string().optional(),
    },
  },
  output: [coreExtensionData.reactElement],
  factory(params: MyWidgetBlueprintParams, { config }) {
    return [
      // Note that while this is a valid pattern, you might often want to
      // return separate pieces of data instead, more on that below.
      coreExtensionData.reactElement(
        <MyWidgetContainer title={config.title ?? params.defaultTitle}>
          {params.element}
        </MyWidgetContainer>,
      ),
    ];
  },
});
```

This is of course a quite bare-bones example blueprint, but still a very real example. Blueprints can be very simple, there's already a lot of value in encapsulating the extension kind, attachment point, and output in a blueprint.

Most of the options provided to `createExtensionBlueprint` can be overridden when using `makeWithOverrides` to create an extension from the blueprint. These overrides work the same way as [extension overrides](./25-extension-overrides.md), and we defer to that documentation for more information on how overrides work.

### Blueprint-specific extension data references

In some cases you may want to define and provide [extension data reference](./20-extensions.md#extension-data-references) that are specific to your blueprint. In the above example we might want to forward the `title` as data for example, rather than encapsulating it into the `MyWidgetContainer` component. This gives the parent extension more flexibility in the rendering for our example widget extensions.

To do that, we create a new extension data reference for our widget title. This reference is provided via the `dataRefs` options when we create the blueprint, which makes it available for use via `MyWidgetBlueprint.dataRefs.widgetTitle`.

```tsx
export interface MyWidgetBlueprintParams {
  defaultTitle: string;
  element: JSX.Element;
}

const widgetTitleRef = createExtensionDataRef<string>().with({
  id: 'my-plugin.widget.title',
});

export const MyWidgetBlueprint = createExtensionBlueprint({
  kind: 'my-widget',
  attachTo: { id: 'page:my-plugin', input: 'widgets' },
  config: {
    schema: {
      title: z.string().optional(),
    },
  },
  output: [widgetTitleRef, coreExtensionData.reactElement],
  factory(params: MyWidgetBlueprintParams, { config }) {
    return [
      widgetTitleRef(config.title ?? params.defaultTitle),
      coreExtensionData.reactElement(params.element),
    ];
  },
  dataRefs: {
    widgetTitle: widgetTitleRef,
  },
});
```

### Extension Blueprints in libraries

If you are publishing a plugin, the extension creators should always be exported from frontend library packages (e.g. `*-react`) rather than plugin packages.
