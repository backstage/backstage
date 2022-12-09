# `@backstage/plugin-catalog-backend-module-incremental-ingestion`

The Incremental Ingestion catalog backend module provides an Incremental Entity Provider that can be used to ingest data from sources using delta mutations, while retaining the orphan prevention mechanism provided by full mutations.

## Why did we create it?

Backstage provides an [Entity Provider mechanism that has two kinds of mutations](https://backstage.io/docs/features/software-catalog/external-integrations#provider-mutations): `delta` and `full`. `delta` mutations tell Backstage Catalog which entities should be added and removed from the catalog. `full` mutation accepts a list of entities and automatically computes which entities must be removed by comparing the provided entities against existing entities to create a diff between the two sets. These two kinds of mutations are convenient for different kinds of data sources. A `delta` mutation can be used with a data source that emits UPDATE and DELETE events for its data. A `full` mutation is useful for APIs that produce fewer entities than can fit in Backstage processes' memory.

Unfortunately, these two kinds of mutations are insufficient for very large data sources for the following reasons,

1. Even when the API provides DELETE events, we still need a way to create the initial list of entities. For example, if you ingest all repositories from GitHub into Backstage and you use webhooks, you still need the initial list of entities.
2. A `delta` mutation can not guarantee that mutations will not be missed. For example, if your Backstage portal is down while receiving a DELETE event, you might miss the event which leaves your catalog in an unclear state. How can you replay the missed events? Some data sources, like GitHub, provide an API for replaying missed events, but this increases complexity and is not available on all APIs.
3. Addressing the above two use case with `full` mutation is not an option on very large datasets because a `full` mutation requires that all entities are in memory to create a diff. If your data source has 100k+ records, this can easily cause your processes to run out of memory.
4. In cases when you can use `full` mutation, committing many entities into the processing pipeline fills up the processing queue and delays the processing of entities from other entity providers.

We created the Incremental Entity Provider to address all of the above issues. The Incremental Entity Provider addresses these issues with a combination of `delta` mutations and a mark-and-sweep mechanism. Instead of doing a single `full` mutation, it performs a series of bursts. At the end of each burst, the Incremental Entity Provider performs the following operations,

1. Marks each received entity in the database.
2. Commits all of the entities with a `delta` mutation.

Incremental Entity Providers will wait a configurable interval before proceeding to the next burst.

Once the source has no more results, Incremental Entity Provider compares all entities annotated with `@backstage/incremental-entity-provider: <entity-provider-id>` against all marked entities to determine which entities committed by same entity provider were not marked during the last ingestion cycle. All unmarked entities are deleted at the end of the cycle. The Incremental Entity Provider rests for a fixed internal before restarting the ingestion process.

![Diagram of execution of an Incremental Entity Provider](https://user-images.githubusercontent.com/74687/185822734-ee6279c7-64fa-46b9-9aa8-d4092ab73858.png)

This approach has the following benefits,

1. Reduced ingestion latency - each burst commits entities which are processed before the entire list is processed.
2. Stable pressure - each period between bursts provides an opportunity for the processing pipeline to settle without overwhelming the pipeline with a large number of unprocessed entities.
3. Built-in retry / back-off - Failed bursts are automatically retried with a built-in back-off interval providing an opportunity for the data source to reset its rate limits before retrying the burst.
4. Prevents orphan entities - Deleted entities are removed as with `full` mutation with a low memory footprint.

## Requirements

The Incremental Entity Provider backend is designed for data sources that provide paginated results. Each burst attempts to handle one or more pages of the query. The plugin will attempt to fetch as many pages as it can within a configurable burst length. At every iteration, it expects to receive the next cursor that will be used to query in the next iteration. Each iteration may happen on a different replica. This has several consequences:

1. The cursor must be serializable to JSON (not an issue for most RESTful or GraphQL based APIs).
2. The client must be stateless - a client is created from scratch for each iteration to allow distributing processing over multiple replicas.
3. There must be sufficient storage in Postgres to handle the additional data. (Presumably, this is also true of sqlite, but it has only been tested with Postgres.)

## Installation

1. Install `@backstage/plugin-catalog-backend-module-incremental-ingestion` with `yarn workspace backend add @backstage/plugin-catalog-backend-module-incremental-ingestion`
2. Import `IncrementalCatalogBuilder` from `@backstage/plugin-catalog-backend-module-incremental-ingestion` and instantiate it with `await IncrementalCatalogBuilder.create(env, builder)`. You have to pass `builder` into `IncrementalCatalogBuilder.create` function because `IncrementalCatalogBuilder` will convert an `IncrementalEntityProvider` into an `EntityProvider` and call `builder.addEntityProvider`.

   ```ts
   const builder = CatalogBuilder.create(env);
   // incremental builder receives builder because it'll register
   // incremental entity providers with the builder
   const incrementalBuilder = await IncrementalCatalogBuilder.create(
     env,
     builder,
   );
   ```

3. Last step, add `await incrementBuilder.build()` after `await builder.build()` to ensure that all `CatalogBuilder` migration run before running `incrementBuilder.build()` migrations.

   ```ts
   const { processingEngine, router } = await builder.build();

   // this has to run after `await builder.build()` to ensure that catalog migrations are completed
   // before incremental builder migrations are executed
   await incrementalBuilder.build();
   ```

   The result should look something like this,

   ```ts
   import { CatalogBuilder } from '@backstage/plugin-catalog-backend';
   import { ScaffolderEntitiesProcessor } from '@backstage/plugin-scaffolder-backend';
   import { IncrementalCatalogBuilder } from '@backstage/plugin-catalog-backend-module-incremental-ingestion';
   import { Router } from 'express';
   import { Duration } from 'luxon';
   import { PluginEnvironment } from '../types';

   export default async function createPlugin(
     env: PluginEnvironment,
   ): Promise<Router> {
     const builder = CatalogBuilder.create(env);
     // incremental builder receives builder because it'll register
     // incremental entity providers with the builder
     const incrementalBuilder = await IncrementalCatalogBuilder.create(
       env,
       builder,
     );

     builder.addProcessor(new ScaffolderEntitiesProcessor());

     const { processingEngine, router } = await builder.build();

     // this has to run after `await builder.build()` so ensure that catalog migrations are completed
     // before incremental builder migrations are executed
     const { incrementalAdminRouter } = await incrementalBuilder.build();

     router.use('/incremental', incrementalAdminRouter);

     await processingEngine.start();

     return router;
   }
   ```

## Writing an Incremental Entity Provider

To create an Incremental Entity Provider, you need to know how to retrieve a single page of the data that you wish to ingest into the Backstage catalog. If the API has pagination and you know how to make a paginated request to that API, you'll be able to implement an Incremental Entity Provider for this API. For more information about compatibility, checkout <a href="#compatible-data-source">Compatible data sources</a> section on this page.

Here is the type definition for an Incremental Entity Provider.

```ts
interface IncrementalEntityProvider<TCursor, TContext> {
  /**
   * This name must be unique between all of the entity providers
   * operating in the catalog.
   */
  getProviderName(): string;

  /**
   * Do any setup and teardown necessary in order to provide the
   * context for fetching pages. This should always invoke `burst` in
   * order to fetch the individual pages.
   *
   * @param burst - a function which performs a series of iterations
   */
  around(burst: (context: TContext) => Promise<void>): Promise<void>;

  /**
   * Return a single page of entities from a specific point in the
   * ingestion.
   *
   * @param context - anything needed in order to fetch a single page.
   * @param cursor - a unique value identifying the page to ingest.
   * @returns the entities to be ingested, as well as the cursor of
   * the the next page after this one.
   */
  next(
    context: TContext,
    cursor?: TCursor,
  ): Promise<EntityIteratorResult<TCursor>>;
}
```

For tutorial, we'll write an Incremental Entity Provider that will call an imaginary API. This imaginary API will return a list of imaginary services. This imaginary API has an imaginary API client with the following interface.

```ts
interface MyApiClient {
  getServices(page: number): MyPaginatedResults<Service>;
}

interface MyPaginatedResults<T> {
  items: T[];
  totalPages: number;
}

interface Service {
  name: string;
}
```

These are the only 3 methods that you need to implement. `getProviderName()` is pretty self explanatory and it's exactly same as on Entity Provider.

```ts
import {
  IncrementalEntityProvider,
  EntityIteratorResult,
} from '@backstage/plugin-catalog-backend-module-incremental-ingestion';

// this will include your pagination information, let's say our API accepts a `page` parameter.
// In this case, the cursor will include `page`
interface MyApiCursor {
  page: number;
}

// This interface describes the type of data that will be passed to your burst function.
interface MyContext {
  apiClient: MyApiClient;
}

export class MyIncrementalEntityProvider
  implements IncrementalEntityProvider<MyApiCursor, MyContext>
{
  getProviderName() {
    return `MyIncrementalEntityProvider`;
  }
}
```

`around` method is used for setup and tear-down. For example, if you need to create a client that will connect to the API, you would do that here.

```ts
export class MyIncrementalEntityProvider
  implements IncrementalEntityProvider<Cursor, Context>
{
  getProviderName() {
    return `MyIncrementalEntityProvider`;
  }

  async around(burst: (context: MyContext) => Promise<void>): Promise<void> {
    const apiClient = new MyApiClient();

    await burst({ apiClient });

    // if you need to do any teardown, you can do it here
  }
}
```

If you need to pass a token to your API, then you can create a constructor that will receive a token and use the token to setup the client.

```ts
export class MyIncrementalEntityProvider
  implements IncrementalEntityProvider<Cursor, Context>
{
  token: string;

  constructor(token: string) {
    this.token = token;
  }

  getProviderName() {
    return `MyIncrementalEntityProvider`;
  }

  async around(burst: (context: MyContext) => Promise<void>): Promise<void> {
    const apiClient = new MyApiClient(this.token);

    await burst({ apiClient });
  }
}
```

The last step is to implement the actual `next` method that will accept the cursor, call the API, process the result and return the result.

```ts
export class MyIncrementalEntityProvider implements IncrementalEntityProvider<MyApiCursor, MyContext> {

  token: string;

  constructor(token: string) {
    this.token = token;
  }

  getProviderName() {
    return `MyIncrementalEntityProvider`;
  }


  async around(burst: (context: MyContext) => Promise<void>): Promise<void> {

    const apiClient = new MyApiClient(this.token)

    await burst({ apiClient })
  }

  async next(context: MyContext, cursor?: MyApiCursor = { page: 1 }): Promise<EntityIteratorResult<MyApiCursor>> {
    const { apiClient } = context;

    // call your API with the current cursor
    const data = await apiClient.getServices(cursor);

    // calculate the next page
    const nextPage = page + 1;

    // figure out if there are any more pages to fetch
    const done = nextPage > data.totalPages;

    // convert returned items into entities
    const entities = data.items.map(item => ({
      entity: {
        apiVersion: 'backstage.io/v1beta1',
        kind: 'Component',
        metadata: {
          name: item.name,
          annotations: {
            // You need to define these, otherwise they'll fail validation
            [ANNOTATION_LOCATION]: this.getProviderName(),
            [ANNOTATION_ORIGIN_LOCATION]: this.getProviderName(),
          }
        }
        spec: {
          type: 'service'
        }
      }
    }));

    // create the next cursor
    const nextCursor = {
      page: nextPage
    };

    return {
      done,
      entities,
      cursor: nextCursor
    }
  }
}
```

Now that you have your new Incremental Entity Provider, we can connect it to the catalog.

## Adding an Incremental Entity Provider to the catalog

We'll assume you followed the <a href="#installation">Installation</a> instructions. After you create your `incrementalBuilder`, you can instantiate your Entity Provider and pass it to the `addIncrementalEntityProvider` method.

```ts
const incrementalBuilder = await IncrementalCatalogBuilder.create(env, builder);

// I'm assuming you're going to get your token from config
const token = config.getString('myApiClient.token');

const myEntityProvider = new MyIncrementalEntityProvider(token)

incrementalBuilder.addIncrementalEntityProvider(
  myEntityProvider,
  {
    // how long should it attempt to read pages from the API
    // keep this short. Incremental Entity Provider will attempt to
    // read as many pages as it can in this time
    burstLength: Duration.fromObject({ seconds: 3 }),
    // how long should it wait between bursts?
    burstInterval: Duration.fromObject({ seconds: 3 }),
    // how long should it rest before re-ingesting again?
    restLength: Duration.fromObject({ day: 1 })
    // optional back-off configuration - how long should it wait to retry?
    backoff: [
      Duration.fromObject({ seconds: 5 }),
      Duration.fromObject({ seconds: 30 }),
      Duration.fromObject({ minutes: 10 }),
      Duration.fromObject({ hours: 3 })
    ]
  }
)
```

That's it!!!

## Error handling

If `around` or `next` methods throw an error, the error will show up in logs and it'll trigger the Incremental Entity Provider to try again after a back-off period. It'll keep trying until it reaches the last back-off attempt, at which point it will cancel the current ingestion and start over. You don't need to do anything special to handle the retry logic.
