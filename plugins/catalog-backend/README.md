# Catalog Backend

This is the backend part of the default catalog plugin.

It comes with a builtin database backed implementation of the catalog, that can store
and serve your catalog for you.

It can also act as a bridge to your existing catalog solutions, either ingesting their
data to store in the database, or by effectively proxying calls to an external catalog
service.

## Getting Started

This backend plugin can be started in a standalone mode from directly in this package
with `yarn start`. However, it will have limited functionality and that process is
most convenient when developing the catalog backend plugin itself.

To evaluate the catalog and have a greater amount of functionality available, instead do

```bash
# in one terminal window, run this from from the very root of the Backstage project
cd packages/backend
yarn start

# open another terminal window, and run the following from the very root of the Backstage project
yarn lerna run mock-data
```

This will launch the full example backend and populate its catalog with some mock entities.

## Links

- (Frontend part of the plugin)[https://github.com/spotify/backstage/tree/master/plugins/catalog]
- (The Backstage homepage)[https://backstage.io]
