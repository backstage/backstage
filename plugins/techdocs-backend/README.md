# techdocs-backend

This is the backend part of the techdocs plugin.

## Getting Started

This backend plugin can be started in a standalone mode from directly in this package
with `yarn start`. However, it will have limited functionality and that process is
most convenient when developing the techdocs backend plugin itself.

To evaluate TechDocs and have a greater amount of functionality available, instead do

```bash
# in one terminal window, run this from from the very root of the Backstage project
cd packages/backend
yarn start

# open another terminal window, and run the following from the very root of the Backstage project
yarn lerna run mock-data
```

## What techdocs-backend does

This plugin is the backend part of the techdocs plugin. It provides building and serving of your docs without having to use another service and hosting provider. To use it set your techdocs storageUrl in your `app-config.yml` to `http://localhost:7000/techdocs/static/docs`.

```yaml
techdocs:
  storageUrl: http://localhost:7000/techdocs/static/docs
```

## Extending techdocs-backend

Currently the build process of techdocs-backend is split up in these three stages.

- Preparers
- Generators
- Publishers

Preparers read your entity data and creates a working directory with your documentation source code. For example if you have set your `backstage.io/techdocs-ref` to `github:https://github.com/spotify/backstage.git` it will clone that repository to a temp folder and pass that on to the generator.

Generators takes the prepared source and runs the `techdocs-container` on it. It then passes on the output folder of that build to the publisher.

Publishers gets a folder path from the generator and publish it to your storage solution. Currently the only built in storage solution is a folder called `static/docs` inside the techdocs-backend plugin.

Any of these can be extended. If we want to publish to a external static file server using rsync for example that can be done by creating a rsync publisher. _(Keep in mind that if you want techdocs-backend to initiate a build this would also require techdocs-backend to act as a proxy, which is not yet implemented.)_

## Links

- [Frontend part of the plugin](https://github.com/spotify/backstage/tree/master/plugins/techdocs)
- [The Backstage homepage](https://backstage.io)
