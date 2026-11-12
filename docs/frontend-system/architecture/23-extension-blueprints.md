---
id: extension-blueprints
title: Frontend Extension Blueprints
sidebar_label: Extensions Blueprints
description: Frontend extensions
---

The `createExtension` function and related APIs is considered a low-level building and fairly advanced building block, and is not typically what you would use when building plugins and features. Instead, the core APIs and plugins provide extension blueprints that makes it easier to create extensions for specific usages. These blueprints accept a number of parameters that is up to each blueprint to define, and then creates a new extension using the provided parameters. New blueprints are created using the `createExtensionBlueprint` function, and are by convention exported with the symbol `<Kind>Blueprint`. If you are curious about what blueprints are available from a plugin or package, look for `*Blueprint` exports in the package's API, for plugins these are typically found in the `*-react` package.

## Creating an extension from a blueprint

Every extension blueprint provides a `make` method that can be used to create new extensions. It is a simple way to create a new extension where the base blueprint provides all the necessary functionality. All you need to do is to provide the necessary blueprint parameters, but you also have the ability to provide additional options, for example a `name`, `attachTo`, `disabled`, or `if` predicate for the extension.

The following is a simple example of how one might use the blueprint `make` method to create a new extension:

```tsx
const myPageExtension = PageBlueprint.make({
  params: {
    path: '/my-page',
    loader: () => import('./components/MyPage').then(m => <m.MyPage />),
  },
});
```

The returned `myPageExtension` is an extension which is ready to be used in a plugin. It is the same type of object as is returned by the lower level `createExtension` function.

### Creating an extension from a blueprint with overrides

Every extension blueprint also provides a `makeWithOverrides` method. It is useful in cases where you want to provide additional integration points for an extension created with a blueprint. You might for example want to define additional inputs or configuration schema, or use the existing configuration to dynamically compute the parameters passed to the blueprint.

The following is an example of how one might use the blueprint `makeWithOverrides` method to create a new extension:

```tsx
import { z } from 'zod';

const myPageExtension = PageBlueprint.makeWithOverrides({
  // This defines additional configuration options for the extension.
  configSchema: {
    layout: z.enum(['grid', 'rows']).default('grid'),
  },
  // This defines additional inputs for the extension.
  inputs: {
    content: createExtensionInput([coreExtensionData.reactElement], {
      singleton: true,
      optional: true,
    }),
  },
  // The original blueprint factory is provided as the first argument.
  // By convention the name is `originalFactory`, but you can also pick a different name.
  factory(originalFactory, { config, inputs }) {
    // Call and forward the result from the original factory, providing
    // the blueprint parameters as the first argument.
    return originalFactory({
      path: '/my-page',
      loader: () =>
        import('./components/MyPage').then(m => (
          // We can now access values from the factory context when providing
          // the blueprint parameters, such as config values and inputs.
          <m.MyPage
            layout={config.layout}
            content={inputs.content?.get(coreExtensionData.reactElement)}
          />
        )),
    });
  },
});
```

When using `makeWithOverrides`, we no longer pass the blueprint parameters directly. Instead, we provide a `factory` function that receives the original blueprint factory as the first argument, and the extension factory context as the second. We can then call the original blueprint factory with the blueprint parameters and forward the result as the return value of out factory. Notice that when passing the blueprint parameters using this pattern we have access to a lot more information than when using the `make` method, at the cost of being more complex.

Apart from the addition of the blueprint parameters of the first argument to the original factory function, the `makeWithOverrides` method works the same way as [extension overrides](./25-extension-overrides.md). All the same options and rules apply, including the ability to define additional inputs, override outputs, and so on. For more details and examples on how this works, please refer to the [extension overrides](./25-extension-overrides.md) documentation. The patterns in that section also apply to the creation of extensions with the `makeWithOverrides` method.

### Creating an extension from a blueprint with advanced parameter types

Some blueprints may be defined with something known as "advanced parameter types". This is a feature that enables type inference and transform of the blueprint parameters, and the way that you pass the parameters look a little bit different. Rather than passing the parameters directly, they are instead passed as a callback function of the form `defineParams => defineParams(<params>)`.

An example of a blueprint that uses advanced parameter types is the `ApiBlueprint` blueprint. Using it to create a simple implementation for the `AlertApi` might look like this:

```ts
const alertApiBlueprint = ApiBlueprint.make({
  params: defineParams =>
    defineParams({
      api: alertApiRef,
      deps: {},
      factory: () => new MyAlertApi(),
    }),
});
```

This also works with `makeWithOverrides`, where the define callback is passed as the first argument to the original factory:

```ts
const alertApiBlueprint = ApiBlueprint.makeWithOverrides({
  factory(originalFactory, { config }) {
    return originalFactory(defineParams =>
      defineParams({
        api: alertApiRef,
        deps: {},
        factory: () => new MyAlertApi(config),
      }),
    );
  },
});
```

## Creating an extension blueprint

To create a new extension blueprint, you use the `createExtensionBlueprint` function. At the surface it is very similar to `createExtension`, but with a few key differences. Firstly you must provide a `kind` option, which will be the kind of all extensions created with the blueprint. See the [naming patterns section](./50-naming-patterns.md) for more information about how to select a good extension kind. Secondly, the `factory` function has a new signature where the first parameter is the blueprint parameters, and the second is the factory context. And finally, rather than returning an extension, `createExtensionBlueprint` returns a blueprint object with the `make` method and friends, which is used as is described above.

The following is an example of how one might create a new extension blueprint:

```tsx
export interface MyWidgetBlueprintParams {
  title: string;
  element: JSX.Element;
}

export const MyWidgetBlueprint = createExtensionBlueprint({
  kind: 'my-widget',
  attachTo: { id: 'page:my-plugin', input: 'widgets' },
  configSchema: {
    title: z.string().optional(),
  },
  output: [coreExtensionData.reactElement],
  factory(params: MyWidgetBlueprintParams, { config }) {
    return [
      // Note that while this is a valid pattern, you might often want to
      // return separate pieces of data instead, more on that below.
      coreExtensionData.reactElement(
        <MyWidgetContainer title={config.title ?? params.title}>
          {params.element}
        </MyWidgetContainer>,
      ),
    ];
  },
});
```

This is of course a quite bare-bones example blueprint, but still a very real example. Blueprints can be very simple, there's already a lot of value in encapsulating the extension kind, attachment point, and output in a blueprint.

Most of the options provided to `createExtensionBlueprint` can be overridden when using `makeWithOverrides` to create an extension from the blueprint. These overrides work the same way as [extension overrides](./25-extension-overrides.md), and we defer to that documentation for more information on how overrides work.

### Creating an extension blueprint with advanced parameter types

In some cases you may want to use inferred type parameters in the definition of the blueprint parameters. For this you need to use something known as "advanced parameter types". This is a feature that enables type inference and transform of the blueprint parameters, and the way you define the parameter type is a bit different. Rather than defining the type of the parameters as part of the factory function, you instead provide a separate `defineParams` options. This is a function that takes the parameters as a single argument, and must then return the parameters wrapped with the `createExtensionBlueprintParams` function.

The following is an example of how one might define a blueprint where the parameters make use of inferred types:

```ts
export interface MyWidgetBlueprintParams<T> {
  defaultOptions: T;
  elementFactory(options: T): JSX.Element;
}

export const MyWidgetBlueprint = createExtensionBlueprint({
  kind: 'my-widget',
  attachTo: { id: 'page:my-plugin', input: 'widgets' },
  output: [coreExtensionData.reactElement],
  defineParams<T>(params: MyWidgetBlueprintParams<T>) {
    return createExtensionBlueprintParams(params);
  },
  // Note that we no longer define the parameters type here, they are inferred from the defineParams function
  factory(params) {
    return [
      coreExtensionData.reactElement(
        <MyWidgetRenderer
          defaultOptions={params.defaultOptions}
          elementFactory={params.elementFactory}
        />,
      ),
    ];
  },
});
```

If you happen to ask yourself, "why can't I just define type parameters on the factory function instead?", this is a limitation in the TypeScript type system. We could technically support that in the blueprint definition, but there would be no way for that logic to be carried forward to the blueprint `.make` and `.makeWithOverrides` methods.

### Blueprint-specific extension data references

In some cases you may want to define and provide [extension data reference](./20-extensions.md#extension-data-references) that are specific to your blueprint. In the above example we might want to forward the `title` as data for example, rather than encapsulating it into the `MyWidgetContainer` component. This gives the parent extension more flexibility in the rendering for our example widget extensions.

To do that, we create a new extension data reference for our widget title. This reference is provided via the `dataRefs` options when we create the blueprint, which makes it available for use via `MyWidgetBlueprint.dataRefs.widgetTitle`.

```tsx
export interface MyWidgetBlueprintParams {
  title: string;
  element: JSX.Element;
}

const widgetTitleRef = createExtensionDataRef<string>().with({
  id: 'my-plugin.widget.title',
});

export const MyWidgetBlueprint = createExtensionBlueprint({
  kind: 'my-widget',
  attachTo: { id: 'page:my-plugin', input: 'widgets' },
  configSchema: {
    title: z.string().optional(),
  },
  output: [widgetTitleRef, coreExtensionData.reactElement],
  factory(params: MyWidgetBlueprintParams, { config }) {
    return [
      widgetTitleRef(config.title ?? params.title),
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

### Deferred loading of blueprint extensions

:::note
Deferred loading is experimental, and the details described here may change.
:::

An app can [defer loading a plugin](../building-plugins/01-index.md#deferred-loading) until one of its elements is rendered. Until then, the app uses a stand-in for each extension of the plugin, which is built from a manifest that the CLI creates by analyzing the source code of the plugin without running it. The stand-in must output the same data as the real extension, apart from the React element. The CLI finds that data by evaluating the factory of the blueprint with the params of each extension, without running it, so you don't need to do anything to support deferred loading in your blueprint. For example, the stand-in of an extension made with the following blueprint outputs the `title` param, or the `title` config when it is set:

```tsx
export const MyWidgetBlueprint = createExtensionBlueprint({
  kind: 'my-widget',
  attachTo: { id: 'page:my-plugin', input: 'widgets' },
  output: [coreExtensionData.reactElement, widgetTitleRef],
  configSchema: {
    title: z.string().optional(),
  },
  *factory(
    params: { title: string; loader: () => Promise<JSX.Element> },
    { node, config },
  ) {
    yield coreExtensionData.reactElement(
      ExtensionBoundary.lazy(node, params.loader),
    );
    yield widgetTitleRef(config.title ?? params.title);
  },
});
```

The value that is passed to the React element output is never evaluated, so params and config that are only used to create the element can be anything. The factory is evaluated once without config, and once with a value for each config key on its own. A config key that doesn't change the other outputs is applied once the plugin has loaded, while a config key that sets an output to its value is applied by the stand-in.

Only a small part of the language is evaluated: constants, property access, `typeof`, comparisons, the `&&`, `||`, `??`, `!` and conditional operators, `if` statements, `yield`, and `yield*` of other generator functions in the same package. Function calls are not evaluated, so their results can only be used to create the element. Any other statement or value in the path to an output, such as a loop, a call, or a param that isn't a literal value, makes the plugin load together with the app, and the manifest records the reason. The factory of `PageBlueprint`, `SubPageBlueprint`, `EntityCardBlueprint` and `EntityContentBlueprint` can be evaluated, so keep the factory of your blueprint just as simple if you want its extensions to be deferred.
