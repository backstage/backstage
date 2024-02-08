---
id: built-in-data-refs
title: Built-in data refs
sidebar_label: Built-in data refs
# prettier-ignore
description: Configuring or overriding built-in extension data references
---

> **NOTE: The new frontend system is in alpha and is only supported by a small number of plugins.**

To have a better understanding of extension data references please read [the corresponding architecture section](../architecture/03-extensions.md#extension-data) first.

## Built-in extension data references

Data references help to define the inputs and outputs of an extension. A data ref is uniquely identified through its `id`. Through the data ref, strong typing is enforced for the input/output of the extension.

### `reactElement`

|         id          |     type      |
| :-----------------: | :-----------: |
| `core.reactElement` | `JSX.Element` |

The `reactElement` data reference can be used for defining the extension input/output of React elements. Example usage could be something like this:

```tsx
import {
  coreExtensionData,
  createExtensionInput,
  createPageExtension,
} from '@backstage/frontend-plugin-api';

const homePage = createPageExtension({
  defaultPath: '/home',
  routeRef: rootRouteRef,
  inputs: {
    props: createExtensionInput({
      children: coreExtensionData.reactElement.optional(),
    }),
  },
});
```

### `routePath`

|         id          |   type   |
| :-----------------: | :------: |
| `core.routing.path` | `string` |

The `routePath` data reference can be used for defining the extension input/output of string paths.

### `routeRef`

|         id         |    type    |
| :----------------: | :--------: |
| `core.routing.ref` | `RouteRef` |

The `routeRef` data reference can be used for defining the extension input/output of route references.

### Other data references

There are other data refs in the frontend system you might stumble upon while building your plugin. Most of them were created for use cases inside the core of the system, but they can be used also in your plugin.
