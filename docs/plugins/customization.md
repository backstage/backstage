---
id: customization
title: Customization
description: Documentation on adding a customization logic to the plugin
---

## Overview

The Backstage core logic provides a possibility to make the component customizable in such a way that the application
developer can redefine the labels, icons, elements or even completely replace the component. It's up to each plugin
to decide what can be customized.

## For a plugin developer

When you are creating your plugin, you have a possibility to use a metadata field and define there all
customizable elements. For example

```typescript jsx
const plugin = createPlugin({
  id: 'myPlugin',
  metadata: {
    mainHeaderText: 'Welcome to my plugin',
    submitButton: () => <button>Save</button>,
  },
});
```

And the rendering part of the exposed component can retrieve that metadata as:

```typescript jsx
export function DefaultMyPluginWelcomePage(props: DefaultMyPluginWelcomeProps) {
  const { mainHeaderText, submitButton } = this.props.metadata;

  return (
    <div>
      <h1>{mainHeaderText}</h1>
      <div>{submitButton}</div>
    </div>
  );
}
```

## For an application developer using the plugin

The way to reconfigure the default values provided by the plugin you can do it via reconfigure method, defined on the
plugin. Example:

```typescript jsx
import { myPlugin } from '@backstage/my-plugin';

myPlugin.reconfigure({
  mainHeaderText: 'Custom header',
  submitButton: () => <button>Apply</button>,
});
```
