---
id: extensions
title: Frontend Extensions
sidebar_label: Extensions
# prettier-ignore
description: Frontend extensions
---

> **NOTE: The new frontend system is in alpha and is only supported by a small number of plugins.**

As mentioned in the [previous section](./02-app.md), Backstage apps are built up from a tree of extensions. This section will go into more detail about what extensions are, how to create and use them, and how to create your own extensibility patterns.

## Extension Structure

Each extensions has a number of different properties that define how it behaves and how it interacts with other extensions and the rest of the app. Some of these properties are fixed, while others can be customized by integrators. The diagram below illustrates the structure of an extension.

![frontend extension structure diagram](../../assets/frontend-system/architecture-extension.drawio.svg)

### ID

<!--
Update this to be 3 different sections: name, kind and namespace
-->

The ID of an extension is used to uniquely identity it, and it should ideally by unique across the entire Backstage ecosystem. For each frontend app instance there can only be a single extension for any given ID. Installing multiple extensions with the same ID will either result in an error or one of the extensions will override the others. The ID is also used to reference the extensions from other extensions, in configuration, and in other places such as developer tools and analytics.

### Output

The output of an extension is the data that it provides to its parent extension, and ultimately its contribution to the app. The output itself comes in the form of a collection of arbitrary values, anything that can be represented as a TypeScript type. However, each individual output value must be associated with a shared reference known as an extension data reference. You must also use these same references to be able to access individual output values of an extension.

### Inputs

The inputs of an extension define the data that it received from its children. Each extension can have multiple different inputs identified by an input name. These inputs each have their own set of data that they expect, which is defined as a collection of extension data references. An extension will only have access to the data that it has explicitly requested from each input.

### Attachment Point

The attachment point of an extension decides where in the app extension tree it will be located. It is defined by the ID of the parent extension, as well as the name of the input to attach to. Through the attachment point the extension will share its own output as inputs to the parent extension. An extension can only be attached to an input that matches its own output, it is an error to try to attach an extension to an input the requires data that the extension does not provide in its output.

The attachment point is one of the configurable properties of an extension, and can be overridden by integrators. In doing so, care must be taken to make sure that one doesn't attach an extension to an incompatible input. Extensions can also only be attached to a single input and parent at a time. This means that the app extension tree can not contain any cycles, as the extension ancestry will either be terminated at the root, or be detached from it.

### Disabled

Each extension in the app can be disabled, meaning it will not be instantiated and its parent will effectively not see it in its inputs. When creating an extension you can also specify whether extensions should be disabled by default. This makes it possible to for example install multiple extensions in an app, but only choose to enable one or a few of them depending on the environment.

The ordering of extensions is sometimes very important, as it may for example affect in which order they show up in the UI. When an extension is toggled from disabled to enabled through configuration it resets the ordering of the extension, pushing it to the end of the list. It is generally recommended to leave extensions as disabled by default if their order is important, allowing for the order in which their are enabled in the configuration to determine their order in the app.

### Configuration & Configuration Schema

Each extension can define a configuration schema that describes the configuration that it accepts. This schema is used to validate the configuration provided by integrators, but also to fill in default configuration values. The configuration itself is provided by integrators in order to customize the extension. It is not possible to provide a default configuration of an extension, this must instead be done through defaults in the configuration schema. This allows for a simpler configuration logic where multiple configurations of the same extension completely replace each other rather than being merged.

### Factory

The extension factory is the implementation of the extension itself. It is a function that is provided with any inputs and configuration that the extension received, and must produce the output that it defined. When an app instance starts up it will call the factory function of each extension that is part of the app, starting at leaf nodes and working its way up to the root of the app extension tree. The factory will only be called for active extensions, which is an extension that is not disabled and has an active parent.

Extension factories should be lean and not do any heavy lifting or async work, as they are called during the initialization of the app. For example, if you need to do an expensive computation to generate your output, then prefer outputting a callback that does the computation instead. This allows the parent extension to defer the computation for later so that you avoid blocking the app startup.

## Creating an Extensions

Extensions are created using the `createExtension` function from `@backstage/frontend-plugin-api`. At minimum you need to provide an ID, attachment point, output definition, and a factory function. The following example shows the creation of a minimal extension:

```tsx
const extension = createExtension({
  name: 'my-extension',
  // This is the attachment point, `id` is the ID of the parent extension,
  // while `input` is the name of the input to attach to.
  attachTo: { id: 'my-parent', input: 'content' },
  // The output map defines the outputs of the extension. The object keys
  // are only used internally to map the outputs of the factory and do
  // not need to match the keys of the input.
  output: {
    element: coreExtensionData.reactElement,
  },
  // This factory is called to instantiate the extensions and produce its output.
  factory() {
    return {
      element: <div>Hello World</div>,
    };
  },
});
```

Note that while the `createExtension` is public API and used in many places, it is not typically what you use when building plugins and features. Instead there are many extension creator functions exported by both the core APIs and plugins that make it easier to create extensions for more specific usages.

## Extension Data

Communication between extensions happens in one direction, from one child extension through the attachment point to its parent. The child extension outputs data which is then passed as inputs to the parent extension. This data is called Extension Data, where the shape of each individual piece of data is described by an Extension Data Reference. These references are created separately from the extensions themselves, and can be shared across multiple different kinds of extensions. Each reference consists of an ID and a TypeScript type that the data needs to conform to, and represents one type of data that can be shared between extensions.

### Extension Data References

To create a new extension data reference to represent a type of shared extension data you use the `createExtensionDataRef` function. When defining a new reference you need to provide an ID and a TypeScript type, for example:

```ts
export const reactElementExtensionDataRef =
  createExtensionDataRef<React.JSX.Element>('my-plugin.reactElement');
```

The `ExtensionDataRef` can then be used to describe an output property of the extension. This will enforce typing on the return value of the extension factory:

```tsx
const extension = createExtension({
  // ...
  output: {
    element: reactElementExtensionDataRef,
  },
  factory() {
    return {
      element: <div>Hello World</div>,
    };
  },
});
```

### Extension Data Uniqueness

Note that the key used in the output map, in this case `element`, is only used internally within the definition of the extension itself. That actual identifier for the data when consumed by other extensions is the ID of the reference, in this case [`core.reactElement`](https://github.com/backstage/backstage/blob/916da47e8abdb880877daa18881eb8fdbb33e70a/packages/frontend-plugin-api/src/wiring/coreExtensionData.ts#L23). This means that you can not output multiple different values for the same extension data reference, as they would conflict with each other. That in turn makes overly generic extension data references a bad idea, for example a generic "string" type. Instead create separate references for each type of data that you want to share.

```tsx
const extension = createExtension({
  // ...
  output: {
    // ❌ Bad example - outputting values of same type
    element1: reactElementExtensionDataRef,
    element2: reactElementExtensionDataRef,
  },
  factory() {
    return {
      element1: <div>Hello World</div>,
      element2: <div>Hello World</div>,
    };
  },
});
```

### Core Extension Data

We provide default `coreExtensionData`, which provides commonly used `ExtensionDataRef`s - e.g. for `React.JSX.Element` and `RouteRef`. They can be used when creating your own extension. For example, the React Element extension data that we defined above is already provided as `coreExtensionData.reactElement`.

For a full list and explanations of all types of core extension data, see the [core extension data reference](../building-plugins/04-built-in-data-refs.md).

### Optional Extension Data

By default all extension data is required, meaning that the extension factory must provide a value for each output. However, it is possible to make extension data optional by calling the `.optional()` method. This makes it optional for the factory function to return a value as part of its output. When calling the `.optional()` method you create a new copy of the extension data reference, it does not mutate the existing reference.

```tsx
const extension = createExtension({
  // ...
  output: {
    element: coreExtensionData.reactElement.optional(),
  },
  factory() {
    return {
      element:
        Math.random() < 0.5 ? <img src="./assets/logo.png" /> : undefined,
    };
  },
});
```

## Extension Inputs

The Extension Data can be passed up to other extensions through their extension inputs. Similar to the outputs seen before, let's create an example of an extension with a extension input:

```tsx
const navigationExtension = createExtension({
  // ...
  inputs: {
    // [1]: Input
    logo: createExtensionInput(
      {
        element: coreExtensionData.reactElement,
      },
      { singleton: true, optional: true },
    ),
  },
  factory({ inputs }) {
    return {
      element: (
        <nav>{inputs.logo.output?.element ?? <span>Backstage</span>}</nav>
      ),
    };
  },
  // ...
});
```

The input (see [1] above) is an object that we create using `createExtensionInput`. The first argument is the set of extension data that we accept via this input, and works just like the `output` option. The second argument is optional, and it allows us to put constraints on the extensions that are attached to our input. If the `singleton: true` option is set, only a single extension can attached at a time, and unless the `optional: true` option is set it will also be required that there is exactly on attached extension.

So how can we now attach the output to the parent extension's input? If we think about a navigation component, like the Sidebar in Backstage, there might be plugins that want to attach a link to their plugin to this navigation component. In this case the plugin only needs to know the extension `id` and the name of the extension `input` to attach the extension `output` returned by the `factory` to the specified extension:

```tsx
const navigationItemExtension = createExtension({
  // ...
  attachTo: { id: 'app/nav', input: 'items' },
  factory() {
    return {
      element: <Link to="/home">Home</Link>,
    };
  },
});

const navigationExtension = createExtension({
  // ...
  // [2]: Extension `id` will be `app/nav` following the extension naming pattern
  namespace: 'app',
  name: 'nav',
  output: {
    element: coreExtensionData.reactElement,
  },
  inputs: {
    items: createExtensionInput({
      element: coreExtensionData.reactElement,
    }),
  },
  factory({ inputs }) {
    return {
      element: (
        <nav>
          <ul>
            {inputs.items.map(item => {
              return <li>{item.output.element}</li>;
            })}
          </ul>
        </nav>
      ),
    };
  },
  // ...
});
```

In this case the extension input `items` is an array, where each individual item is an extension that attached itself to the extension inputs of this `id`.

With the `inputs` not only the `output` of an extensions item is passed to the extension, but also the `node`. However, it is discouraged to consume the `node` here unless needed. If we are looking at the `factory` function from the example above we could access the `node` like the following:

```tsx
  // ...
  factory({ inputs }) {
    return {
      element: (
        <nav>
          <ul>
            {inputs.items.map(({output, node}) => {
              const _node: AppNode = node;
              return <li>{output.element}</li>;
            })}
          </ul>
        </nav>
      ),
    };
  },
```

## Extension Configuration

With the `app-config.yaml` there is already the option to pass configuration to plugins or the app to e.g. define the `baseURL` of your app. For extensions this concept would be limiting as an extension can be independent of the plugin & initiated several times. Therefore we created a possibility to configure each extension individually through config. The extension config schema is created using the [`zod`](https://zod.dev/) library, which in addition to TypeScript type checking also provides runtime validation and coercion. If we continue with the example of the `navigationExtension` and now want it to contain a configurable title, we could make it available like the following:

```tsx
const navigationExtension = createExtension({
  // ...
  namespace: 'app',
  name: 'nav',
  // [3]: Extension `id` will be `app/nav` following the extension naming pattern
  configSchema: createSchemaFromZod(z =>
    z.object({
      title: z.string().default('Sidebar Title'),
    }),
  ),
  factory({ config }) {
    return {
      element: (
        <nav>
          <span>{config.title}</span>
          <ul>{/* ... */}</ul>
        </nav>
      ),
    };
  },
  // ...
});
```

To now change the text of the title from "Sidebar Title" to "Backstage" we can look at the `id` of the extension & add the following to the `app-config.yaml`:

```yaml
app:
  # ...
  extensions:
    # ...
    - app/nav:
        config:
          title: 'Backstage'
```

## Extension Creators

With creating an extension by using `createExtension(...)` you have the advantage that the extension can be anything in your Backstage application. We realised that this comes with the trade-off of having to repeat boilerplate code for similar building blocks. Here extension creators come into play for covering common building blocks in Backstage like pages using `createPageExtension`, themes using the `createThemeExtension` or items for the navigation using `createNavItemExtension`.

If we follow the example from above all items of the navigation have similarities, like they all want to be attached to the same extension with the same input as well as rendering the same navigation item component. Therefore `createExtension` can be abstracted for this use case to `createNavItemExtension` and if we add the extension to the app it will end up in the right place & looks like we expect a navigation item to look.

```tsx
export const HomeNavIcon = createNavItemExtension({
  routeRef: routeRefForTheHomePage,
  title: 'Home',
  icon: HomeIcon,
});
```

### Extension Kind

With the example `HomeNavIcon` will end up on the extension input `items` of the extensions with the id `app/nav`. It raises the question what the `id` of the `HomeNavIcon` itself is. The extension creator for the navigation item has a defined `kind`, which by convention matches the own name. So in this example `createNavItemExtension` sets the kind to `nav-item`.

The `id` of the extension is then build out of `namespace`, `name` & `kind` like the following - where `namespace` & `name` are optional properties that can be passed to the extension creator:

```
id: kind:namespace/name
```

For more information on naming of extension refer to the [naming patterns documentation](./08-naming-patterns.md).

### Extension Creators in libraries

Extension creators should be exported from frontend library packages (e.g. `*-react`) rather than plugin packages.

If an extension is only for in-house tweaks, it's okay to put it in the plugin package. But if you want other open source plugins to use it, or you already have a `-react` package, always put extension creators in the `-react` package.

## Extension Boundary

The `ExtensionBoundary` wraps extensions with several React contexts for different purposes

### Suspense

All React elements rendered by extension creators should be wrapped in the extension boundary. With `Suspense` the extension can than load resources asynchronously with having a loading fallback. It also allows to lazy load the whole extension similar to how plugins are currently lazy loaded in Backstage.

### Error Boundary

Similar to plugins the `ErrorBoundary` for extension allows to pass in a fallback component in case there is an uncaught error inside of the component. With this the error can be isolated & it would prevent the rest of the plugin to crash.

### Analytics

Analytics information are provided through the `AnalyticsContext`, which will give `extensionId` & `pluginId` as context to analytics event fired inside of the extension. Additionally `RouteTracker` will capture an analytics event for routable extension to inform which extension metadata gets associated with a navigation event when the route navigated to is a gathered `mountPoint`.

The `ExtensionBoundary` can be used like the following in an extension creator:

```tsx
export function createSomeExtension<
  TConfig extends {},
  TInputs extends AnyExtensionInputMap,
>(options): ExtensionDefinition<TConfig> {
  return createExtension({
    // ...
    factory({ config, inputs, node }) {
      const ExtensionComponent = lazy(() =>
        options
          .loader({ config, inputs })
          .then(element => ({ default: () => element })),
      );

      return {
        path: config.path,
        routeRef: options.routeRef,
        element: (
          <ExtensionBoundary node={node} routable>
            <ExtensionComponent />
          </ExtensionBoundary>
        ),
      };
    },
  });
}
```
