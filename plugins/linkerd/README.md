# kubernetes

Welcome to the kubernetes plugin!

_This plugin was created through the Backstage CLI_

## Getting started

Your plugin has been added to the example app in this repository, meaning you'll be able to access it by running `yarn start` in the root directory, and then navigating to [/kubernetes](http://localhost:3000/kubernetes).

You can also serve the plugin in isolation by running `yarn start` in the plugin directory.
This method of serving the plugin provides quicker iteration speed and a faster startup and hot reloads.
It is only meant for local development, and the setup for it can be found inside the [/dev](./dev) directory.

## Surfacing your Kubernetes components as part of an entity

### Adding the entity annotation

In order for Backstage to detect that an entity has Kubernetes components,
the following annotation should be added to the entity.

```yaml
annotations:
  'backstage.io/kubernetes-id': dice-roller
```

### Labeling Kubernetes components

In order for Kubernetes components to show up in the service catalog
as a part of an entity, Kubernetes components must be labeled with the following label:

```yaml
'backstage.io/kubernetes-id': <ENTITY_NAME>
```
