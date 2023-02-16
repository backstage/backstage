---
id: extension-points
title: Backend Plugin Extension Points
sidebar_label: Extension Points
# prettier-ignore
description: Extension points of backend plugins
---

> **DISCLAIMER: The new backend system is in alpha, and still under active development. While we have reviewed the interfaces carefully, they may still be iterated on before the stable release.**

While plugins are able to accept options for lightweight forms of customization and extension, you quickly hit a limit where you need something more powerful to allow users to extend your plugin. For this purpose, the backend system provides a mechanism for plugins to provide extension points, which can be used to expose deeper customizations for your plugin. Extension points are used by modules, which are installed in the backend adjacent to plugins. Modules are covered more in-depth in the [next section](./06-modules.md).

Extension points are quite similar to services, in that they both encapsulate an interface in a reference object. The key difference is that extension points are registered and provided by plugins themselves, and do not have any factory associated with them. Extension points for a given plugin are also only accessible to modules that extend that same plugin.

Extension points should always be exported from a plugin node library package, for example `@backstage/plugin-catalog-node`. This is to allow for modules to avoid a direct dependency on the plugin, and make it easier to evolve extension points over time. You can export as many different extension points as you want, just be mindful of the complexity of the API surface. It is however often better to export multiple extension points with few methods, rather than few extension points with many methods, as that tends to be easier to maintain.

## Defining an Extension Point

Extension points are created using the `createExtensionPoint` method from `@backstage/backend-plugin-api`. You need to provide the type, as well as an ID.

```ts
import { createExtensionPoint } from '@backstage/backend-plugin-api';

export interface ScaffolderActionsExtensionPoint {
  addAction(action: ScaffolderAction): void;
}

export const scaffolderActionsExtensionPoint =
  createExtensionPoint<ScaffolderActionsExtensionPoint>({
    id: 'scaffolder.actions',
  });
```

## Registering an Extension Point

For modules to be able to use your extension point, an implementation of it must be registered by the plugin. This is done using the `registerExtensionPoint` method in the `register` callback of the plugin definition.

```ts
class ActionsExtension implements ScaffolderActionsExtensionPoint {
  addActions(...actions: TemplateAction<any>[]): void { ... }

  getRegisteredActions() { ... }
}

export const scaffolderPlugin = createBackendPlugin(
  {
    pluginId: 'scaffolder',
    register(env) {
      const actionsExtensions = new ActionsExtension();
      env.registerExtensionPoint(
        scaffolderActionsExtensionPoint,
        actionsExtensions,
      );

      env.registerInit({
        deps: { ... },
        async init({ ... }) {
          const actions = actionsExtension.getRegisteredActions();

          // Use the registered actions when setting up the scaffolder ...
        },
      });
    },
  },
);
```

There are a couple of things to note here. The first is that our `ActionsExtension` class both implements the `ScaffolderActionsExtensionPoint` interface, but also has additional public methods. These methods won't be available to the modules that use this extension, but we can use them here in the implementation of our plugin. Note also that the `ActionsExtension` class is _not_ exported to the outside, since it's only for the internal use of this plugin during its setup phase.

The second is that we create our `ActionsExtension` instance within the `register` method, and then access it directly in our `init` method. This is both safe to do and an intended convenience. All modules that extend our plugin will be completely initialized before our plugin gets initialized, which means that at the point where our `init` method is called, all actions have been added and can be accessed.

## Extension Point Design

Designing the extension point interface requires careful consideration. It is a public API surface that your plugin will need to maintain over time. Keep in mind that the installation of modules is an intentional action by the user, meaning you can always design an extension point interface for additions only. For example, there is no need for the `scaffolderActionsExtensionPoint` to support removal of actions, since the user can just uninstall the module that added the action.

Another pattern that can be used is a type of singleton pattern where the extension point is used to add or override some default behavior. For example, let's say the scaffolder wants to expose a way to customize the execution of template tasks. It wouldn't really make sense to allow multiple modules to each add their own task runners, so instead we use a setter to ensure that only one task runner is installed, throwing an error if any other module tries to install another task runner.

```ts
interface ScaffolderTaskRunnerExtensionPoint {
  setTaskRunner(taskRunner: TaskRunner): void;
}
```

If you want to make breaking changes to an extension point that already has some usage, we recommend that you instead deprecate the existing one and create a new one with a different name. You might want to use a completely new name, but you can also suffix the existing one with a version number, for example `scaffolderActionsV2ExtensionPoint`.
