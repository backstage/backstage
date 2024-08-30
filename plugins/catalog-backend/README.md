# Catalog Backend

This is the backend for the default Backstage [software catalog](http://backstage.io/docs/features/software-catalog/).
This provides an API for consumers such as the frontend [catalog plugin](https://github.com/backstage/backstage/tree/master/plugins/catalog).

It comes with a builtin database-backed implementation of the catalog that can
store and serve your catalog for you.

It can also act as a bridge to your existing catalog solutions, either ingesting
data to store in the database, or by effectively proxying calls to an
external catalog service.

## Installation

This `@backstage/plugin-catalog-backend` package comes installed by default in
any Backstage application created with `npx @backstage/create-app`, so
installation is not usually required.

To check if you already have the package, look under
`packages/backend/package.json`, in the `dependencies` block, for
`@backstage/plugin-catalog-backend`. The instructions below walk through
restoring the plugin, if you previously removed it.

### Install the package

```bash
# From your Backstage root directory
yarn --cwd packages/backend add @backstage/plugin-catalog-backend
```

Then add the plugin to your backend, typically in `packages/backend/src/index.ts`:

```ts
const backend = createBackend();
// ...
backend.add(import('@backstage/plugin-catalog-backend'));
```

#### Old backend system

In the old backend system there's a bit more wiring required. You'll need to
create a file called `packages/backend/src/plugins/catalog.ts` with contents
matching [catalog.ts in the create-app template](https://github.com/backstage/backstage/blob/ad9314d3a7e0405719ba93badf96e97adde8ef83/packages/create-app/templates/default-app/packages/backend/src/plugins/catalog.ts).

With the `catalog.ts` router setup in place, add the router to
`packages/backend/src/index.ts`:

```diff
+import catalog from './plugins/catalog';

async function main() {
  ...
  const createEnv = makeCreateEnv(config);

+  const catalogEnv = useHotMemoize(module, () => createEnv('catalog'));
  const scaffolderEnv = useHotMemoize(module, () => createEnv('scaffolder'));

  const apiRouter = Router();
+  apiRouter.use('/catalog', await catalog(catalogEnv));
  ...
  apiRouter.use(notFoundHandler());

```

### Adding catalog entities

At this point the `catalog-backend` is installed in your backend package, but
you will not have any catalog entities loaded. See [Catalog Configuration](https://backstage.io/docs/features/software-catalog/configuration)
for how to add locations, or copy the catalog locations from the [create-app template](https://github.com/backstage/backstage/blob/master/packages/create-app/templates/default-app/app-config.yaml.hbs)
to get up and running quickly.

## Development

This backend plugin can be started in a standalone mode from directly in this
package with `yarn start`. However, it will have limited functionality and that
process is most convenient when developing the catalog backend plugin itself.

To evaluate the catalog and have a greater amount of functionality available,
run the entire Backstage example application from the root folder:

```bash
# in one terminal window, run this from from the very root of the Backstage project
cd packages/backend
yarn start
```

This will launch both frontend and backend in the same window, populated with
some example entities.

## Audit Events

- **`ancestry-fetch`**: Tracks `GET` requests to the `/entities/by-name/:kind/:namespace/:name/ancestry` endpoint which return the ancestry of an entity.
- **`batch-fetch`**: Tracks `POST` requests to the `/entities/by-refs` endpoint which return a batch of entities.
- **`delete`**: Tracks `DELETE` requests to the `/entities/by-uid/:uid` endpoint which delete an entity. Note: this will not be a permanent deletion and the entity will be restored if the parent location is still present in the catalog.
- **`facet-fetch`**: Tracks `GET` requests to the `/entity-facets` endpoint which return the facets of an entity.
- **`fetch`**: Tracks `GET` requests to the `/entities` endpoint which returns a list of entities.
- **`fetch-by-name`**: Tracks `GET` requests to the `/entities/by-name/:kind/:namespace/:name` endpoint which return an entity matching the specified entity ref.
- **`fetch-by-uid`**: Tracks `GET` requests to the `/entities/by-uid/:uid` endpoint which return an entity matching the specified entity uid.
- **`fetch-by-query`**: Tracks `GET` requests to the `/entities/by-query` endpoint which returns a list of entities matching the specified query.
- **`refresh`**: Tracks `POST` requests to the `/entities/refresh` endpoint which schedules the specified entity to be refreshed.
- **`validate`**: Tracks `POST` requests to the `/entities/validate` endpoint which validates the specified entity.
- **`location-analyze`**: Tracks `POST` requests to the `/locations/analyze` endpoint which analyzes the specified location.
- **`location-create`**: Tracks `POST` requests to the `/locations` endpoint which creates a location.
- **`location-delete`**: Tracks `DELETE` requests to the `/locations/:id` endpoint which deletes a location as well as all child entities associated with it.
- **`location-fetch`**: Tracks `GET` requests to the `/locations` endpoint which returns a list of locations.
- **`location-fetch-by-entity-ref`**: Tracks `GET` requests to the `/locations/by-entity` endpoint which returns a list of locations associated with the specified entity ref.
- **`location-fetch-by-id`**: Tracks `GET` requests to the `/locations/:id` endpoint which returns a location matching the specified location id.

## Links

- [catalog](https://github.com/backstage/backstage/tree/master/plugins/catalog)
  is the frontend interface for this plugin.
