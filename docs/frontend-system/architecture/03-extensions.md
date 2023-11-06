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
  id: 'my-extension',
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
  factory({ bind }) {
    bind({
      element: <div>Hello World</div>,
    });
  },
});
```

Note that while the `createExtension` is public API and used in many places, it is not typically what you use when building plugins and features. Instead there are many extension creator functions exported by both the core APIs and plugins that make it easier to create extensions for more specific usages.

... TODO ...

## Extension Data

TODO

## Extension Inputs

TODO

## Configuration

TODO

## Configuration Schema

TODO

## Extension Creators

TODO

## Extension Boundary

TODO
