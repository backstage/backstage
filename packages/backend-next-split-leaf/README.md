# example-backend-next-leaf

This is an example backend for [the new Backstage backend system](https://backstage.io/docs/backend-system/).

Do not use this in your own projects.

This backend specifically is an example leaf node backend, that is a backend that communicates with a gateway node through the `@backstage/plugin-dynamic-discovery-backend` plugin for discovery information.

To run this, use the following command,

```
yarn --cwd packages/backend-next-split-leaf start app-config.yaml app-config.split.yaml
```
