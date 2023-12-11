---
id: extensions
title: Frontend Extensions
sidebar_label: Extensions
# prettier-ignore
description: Frontend extensions
---

> **NOTE: The new frontend system is in a highly experimental phase**

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

... TODO ...

## Extension Data

Communication between extensions happens in one direction, from one child extension through the attachment point to its parent. The child extension outputs data which is then passed as inputs to the parent extension. This data is called Extension Data, where the shape of each individual piece of data is described by an Extension Data Reference. These references are created separately from the extensions themselves, and can be shared across multiple different kinds of extenses. Each reference consists of an ID and a TypeScript type that the data needs to conform to, and represents one type of data that can be shared between extensions.

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

Note that the key used in the output map, in this case `element`, is only used internally within the definition of the extension itself. That actual identifier for the data when consumed by other extensions is the ID of the reference, in this case `core.reactElement`. This means that you can not output multiple different values for the same extension data reference, as they would conflict with each other. That in turn makes overly generic extension data references a bad idea, for example a generic "string" type. Instead create separate references for each type of data that you want to share.

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

We provide default `coreExtensionData`, which provides commonly used `ExtensionDataRef` - e.g. for `React.JSX.Element`, `RouteRef` or `AppTheme`. They can be used when creating your own extension. For example, the React Element extension data that we defined above is already provided as `coreExtensionData.reactElement`. For a full list and explanations of all types of core extension data, see the [core extension data reference](#TODO).

### Optional Extension Data

By default all extension data is required, meaning that the extension factory must provide a value for each output. However, it is possible to make extension data optional by calling the `.optional()` method. This makes it optional for the factory function to return a value as part of its output. When calling the `.optional()` method you create a new copy of the extension data reference, it does not mutate the existing reference.

```tsx
const extension = createExtension({
  // ...
  output: {
    element: coreExtensionData.reactElement.option(),
  },
  factory() {
    return {
      element: Math.random() < 0.5 ? <div>Hello World</div> : undefined,
    };
  },
});
```

## Extension Inputs

<!--

Introduce the concept of extension inputs and how they use extension data to reference types just like outputs

Show how to use the `createExtensionInput` API to create an input for an extension.

- Example of creating a single input

Talk about different types of inputs, singleton vs array + optional vs required.

 - Example of creating an optional singleton input - not the value is no longer an array

Talk about the shape of the input values and that you have access to the AppNode node in addition to the data, but discourage use of AppNode.

 - Example of how to access the AppNode next to the input data

-->

## Extension Configuration

<!--

Introduce the concept of extension configuration, highlight that it's different from app config

Show how to define a configuration schema for an extension, talk about it using zod (link to zod), in general explain everything there is to know about the schema

 - Example that creates a configuration schema for an extension

Show how to provide configuration for an extension - keep this part short, and instead link to the architecture section that talks about writing configuration

 - One example of a YAML configurations for the above extension

 -->

## Extension Creators

<!--

Introduce the concept of extension creators, talk about how they are used to provide an opinionated way of creating extensions for specific use cases. Mention a few of the built-in creators, link to the reference section on built-in extension kinds (TBD).

 - Example of using an existing extension creator to create an extension

Explain that each extension creator creates a specific "kind" of extensions - introduce the concept of extension kinds. Show an example of how the kind is used to build up the ID.

 - Example of creating a new extension creator for creating a specific kind of extension

Explain that extension creators should be exported from library packages (`-react`) rather than plugin packages.

 -->

## Extension Boundary

<!--

Introduce the need for extension specific React contexts, for example error boundaries and analytics.

Any React elements that are rendered by extension creators should be wrapped in the `ExtensionBoundary`

 - Example of how to use the `ExtensionBoundary` in an extension creator

 -->
