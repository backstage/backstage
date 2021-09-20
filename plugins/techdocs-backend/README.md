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
```

## What techdocs-backend does

This plugin is the backend part of the techdocs plugin. It provides serving and building of documentation for any entity.
To configure various storage providers and building options, see http://backstage.io/docs/features/techdocs/configuration

The techdocs-backend re-exports the [techdocs-common](https://github.com/backstage/backstage/tree/master/packages/techdocs-common) package which has the features to prepare, generate and publish docs.
The Publishers are also used to fetch the static documentation files and render them in TechDocs.

## Links

- [Frontend part of the plugin](https://github.com/backstage/backstage/tree/master/plugins/techdocs)
- [Backstage homepage](https://backstage.io)
