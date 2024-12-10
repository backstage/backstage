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

The Catalog backend emits audit events for various operations. Events are grouped logically by `eventId`, with `subEventId` providing further distinction within an operation group.

**Entity Events:**

- **`entity-fetch`**: Retrieves entities.

  Filter on `queryType`.

  - **`all`**: Fetching all entities. (GET `/entities`)
  - **`by-id`**: Fetching a single entity using its UID. (GET `/entities/by-uid/:uid`)
  - **`by-name`**: Fetching a single entity using its kind, namespace, and name. (GET `/entities/by-name/:kind/:namespace/:name`)
  - **`by-query`**: Fetching multiple entities using a filter query. (GET `/entities/by-query`)
  - **`by-refs`**: Fetching a batch of entities by their entity refs. (POST `/entities/by-refs`)
  - **`ancestry`**: Fetching the ancestry of an entity. (GET `/entities/by-name/:kind/:namespace/:name/ancestry`)

- **`entity-mutate`**: Modifies entities.

  Filter on `actionType`.

  - **`delete`**: Deleting a single entity. Note: this will not be a permanent deletion and the entity will be restored if the parent location is still present in the catalog. (DELETE `/entities/by-uid/:uid`)
  - **`refresh`**: Scheduling an entity refresh. (POST `/entities/refresh`)

- **`entity-validate`**: Validates an entity. (POST `/entities/validate`)

- **`entity-facets`**: Retrieves entity facets. (GET `/entity-facets`)

**Location Events:**

- **`location-fetch`**: Retrieves locations.

  Filter on `actionType`.

  - **`all`**: Fetching all locations. (GET `/locations`)
  - **`by-id`**: Fetching a single location by ID. (GET `/locations/:id`)
  - **`by-entity`**: Fetching locations associated with an entity ref. (GET `/locations/by-entity`)

- **`location-mutate`**: Modifies locations.

  - **`create`**: Creating a new location. (POST `/locations`)
  - **`delete`**: Deleting a location and its associated entities. (DELETE `/locations/:id`)

- **`location-analyze`**: Analyzes a location. (POST `/locations/analyze`)

## Links

- [catalog](https://github.com/backstage/backstage/tree/master/plugins/catalog)
  is the frontend interface for this plugin.
