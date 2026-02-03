# Kubernetes

Welcome to the Backstage Kubernetes frontend plugin!

This plugin exposes information about your entity-specific Kubernetes objects with a desire to provide value to the service owner, rather than just a Kubernetes cluster administrator.

It will elevate the visibility of errors where identified, and provide drill down about the deployments, pods, and other objects for a service.

It directly interfaces with the [Kubernetes Backend Plugin (`@backstage-plugin-kubernetes-backend`)](https://github.com/backstage/backstage/tree/master/plugins/kubernetes-backend).

_This plugin was created through the Backstage CLI_

## Introduction

See our announcement blog post [New Backstage feature: Kubernetes for Service Owners](https://backstage.io/blog/2021/01/12/new-backstage-feature-kubernetes-for-service-owners) to learn more about the motivation behind developing the plugin.

## Setup & Configuration

This plugin must be explicitly added to a Backstage app, along with it's peer backend plugin.

It requires configuration in the Backstage `app-config.yaml` to connect to a Kubernetes API control plane.

In addition, configuration of an entity's `catalog-info.yaml` helps identify which specific Kubernetes object(s) should be presented on a specific entity catalog page.

For more information, see the [formal documentation about the Kubernetes feature in Backstage](https://backstage.io/docs/features/kubernetes/overview).

## Getting started

Your plugin has been added to the example app in this repository, meaning you'll be able to access it by running `yarn start` in the root directory, and then navigating to [/kubernetes](http://localhost:3000/catalog/default/component/:component-name/kubernetes).

You can also serve the plugin in isolation by running `yarn start` in the plugin directory.
This method of serving the plugin provides quicker iteration speed and a faster startup and hot reloads.
It is only meant for local development, and the setup for it can be found inside the [/dev](./dev) directory.

### Integrating with `EntityPage` (New Frontend System)

Follow this section if you are using Backstage's [new frontend system](https://backstage.io/docs/frontend-system/).

1. Import `kubernetesPlugin` in your `App.tsx` and add it to your app's `features` array:

```typescript
import kubernetesPlugin from '@backstage/plugin-kubernetes/alpha';

// ...

export const app = createApp({
  features: [
    // ...
    kubernetesPlugin,
    // ...
  ],
});
```

2. Next, enable your desired extensions in `app-config.yaml`.

```yaml
app:
  extensions:
    - entity-content:kubernetes/kubernetes
```

Now, the extension appears on your entity page as one of the tabs, which is called `KUBERNETES`.
By default, the tab will only appear on entities that are Components or Resources. You can override
that behavior by providing a config block to the extension, like so:

```yaml
app:
  extensions:
    - entity-content:kubernetes/kubernetes:
        config:
          filter: kind:component,api,resource,system
```
