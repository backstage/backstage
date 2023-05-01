# GraphQL Backend

The `graphql-backend` plugin adds a [GraphQL][] endpoint
(`/api/graphql`) to your Backstage instances, and provides a mechanism
to customize it without having to write any bespoke TypeScript.

It uses [GraphQL Modules][graphql-modules] and [Envelop][] plugins so you can
compose pieces of schema and middleware from many different places
(including other plugins) into a single, complete GraphQL server.

At a minimum, you should install the [graphql-catalog][] which adds basic
schema elements to access the [Backstage Catalog][backstage-catalog] via GraphQL

- [Getting started](#getting-started)
- [GraphQL Modules](#graphql-modules)
- [Extending Schema](../graphql-common/README.md#extending-your-schema-with-a-custom-module)
- [Envelop Plugins](#envelop-plugins)
- [GraphQL Context](#graphql-context)
- [Custom Data loaders](#custom-data-loaders-advanced)
- [Integrations](#integrations)
  - [Backstage GraphiQL Plugin](#backstage-graphiql-plugin)
  - [Backstage API Docs](#backstage-api-docs)

## Getting Started

To install the GraphQL Backend onto your server:

1. Add GraphQL plugin and Application backend module in `packages/backend/src/index.ts`:

```ts
import { graphqlPlugin } from '@backstage/plugin-graphql-backend';

const backend = createBackend();

// GraphQL
backend.use(graphqlPlugin());
```

2. Start the backend

```bash
yarn workspace example-backend start
```

This will launch the full example backend. However, without any modules
installed, you won't be able to do much with it.

## GraphQL Modules

The way to add new types and new resolvers to your GraphQL backend is
with [GraphQL Modules][graphql-modules]. These are portable little
bundles of schema that you can drop into place and have them extend
your GraphQL server. The most important of these that is maintained by
the Backstage team is the [graphql-catalog][] plugin that makes your
Catalog accessible via GraphQL. To add this module to your GraphQL server,
declare GraphQL Application backend module:

```ts
// packages/backend/src/modules/graphqlApplication.ts
import { createBackendModule } from '@backstage/backend-plugin-api';
import { graphqlApplicationExtensionPoint } from '@backstage/plugin-graphql-backend';
import { Catalog } from '@backstage/plugin-graphql-catalog';

export const graphqlModuleApplication = createBackendModule({
  pluginId: 'graphql',
  moduleId: 'application',
  register(env) {
    env.registerInit({
      deps: { application: graphqlApplicationExtensionPoint },
      async init({ application }) {
        await application.addModule(Catalog);
      },
    });
  },
});
```

Then add module to your backend:

```ts
// packages/backend/src/index.ts
import { graphqlModuleApplication } from './modules/graphqlApplication';

const backend = createBackend();

// GraphQL
backend.use(graphqlPlugin());
backend.use(graphqlModuleApplication());
```

To learn more about adding your own modules, see the [graphql-common][] package.

## Envelop Plugins

Whereas [Graphql Modules][graphql-modules] are used to extend the
schema and resolvers of your GraphQL server, [Envelop][] plugins are
used to extend its GraphQL stack with tracing, error handling, context
extensions, and other middlewares.

Plugins are be added via declaring GraphQL Yoga backend module.
For example, to prevent potentially sensitive error messages from
leaking to your client in production, add the [`useMaskedErrors`][usemaskederrors]
package.

```ts
// packages/backend/src/modules/graphqlYoga.ts
import { createBackendModule } from '@backstage/backend-plugin-api';
import { graphqlYogaExtensionPoint } from '@backstage/plugin-graphql-backend';
import { useMaskedErrors } from '@envelop/core';

export const graphqlModuleYoga = createBackendModule({
  pluginId: 'graphql',
  moduleId: 'yoga',
  register(env) {
    env.registerInit({
      deps: { yoga: graphqlYogaExtensionPoint },
      async init({ yoga }) {
        yoga.addPlugin(useMaskedErrors());
      },
    });
  },
});
```

Then add module to your backend:

```ts
// packages/backend/src/index.ts
import { graphqlModuleYoga } from './modules/graphqlYoga';

const backend = createBackend();

// GraphQL
backend.use(graphqlPlugin());
backend.use(graphqlModuleYoga());
```

## GraphQL Context

The GraphQL context is an object that is passed to every resolver
function. It is a convenient place to store data that is needed by
multiple resolvers, such as a database connection or a logger.

You can add additional data to the context to GraphQL Yoga backend module:

```ts
// packages/backend/src/modules/graphqlYoga.ts
import { createBackendModule } from '@backstage/backend-plugin-api';
import { graphqlYogaExtensionPoint } from '@backstage/plugin-graphql-backend';

export const graphqlModuleYoga = createBackendModule({
  pluginId: 'graphql',
  moduleId: 'yoga',
  register(env) {
    env.registerInit({
      deps: { yoga: graphqlYogaExtensionPoint },
      async init({ yoga }) {
        yoga.setContext({ myContext: 'Hello World' });
      },
    });
  },
});
```

## Custom Data Loaders (Advanced)

By default, your graphql context will contain a `Dataloader` for retrieving
records from the Catalog by their GraphQL ID. Most of the time this is all you
will need. However, sometimes you will need to load data not just from the
Backstage catalog, but from a different data source entirely. To do this, you
will need to pass batch load functions for each data source.

> ⚠️Caution! If you find yourself wanting to load data directly from a
> source other than the catalog, first consider the idea of instead
> just ingesting that data into the catalog, and then using the
> default data loader. After consideration, If you still want to load
> data directly from a source other than the Backstage catalog, then
> proceed with care.

Load functions are to GraphQL Yoga backend module. Each load function
is stored under a unique key which is encoded inside node's id as a data
source name

```ts
// packages/backend/src/modules/graphqlYoga.ts
import { createBackendModule } from '@backstage/backend-plugin-api';
import { graphqlYogaExtensionPoint } from '@backstage/plugin-graphql-backend';

export const graphqlModuleYoga = createBackendModule({
  pluginId: 'graphql',
  moduleId: 'yoga',
  register(env) {
    env.registerInit({
      deps: { yoga: graphqlYogaExtensionPoint },
      async init({ yoga }) {
        yoga.addLoader(
          'MyAPI',
          async (keys: readonly string[], context: GraphQLContext) => {
            /* Fetch */
          },
        );
      },
    });
  },
});
```

## Integrations

### Backstage GraphiQL Plugin

It's convenient to be able to query the Backstage GraphQL API from inside of Backstage App. You can accomplish this by installing the [Backstage GraphiQL Plugin](https://roadie.io/backstage/plugins/graphiQL/) and adding the GraphQL API endpoint to the GraphiQL Plugin API factory.

1. Once you installed `@backstage/plugin-graphiql` plugin [with these instructions](https://roadie.io/backstage/plugins/graphiQL/)
2. Modify `packages/app/src/apis.ts` to add your GraphQL API as an endpoint

```ts
factory: ({ errorApi, githubAuthApi, discovery }) =>
  GraphQLEndpoints.from([
    {
      id: 'backstage-backend',
      title: 'Backstage GraphQL API',
      // we use the lower level object with a fetcher function
      // as we need to `await` the backend url for the graphql plugin
      fetcher: async (params: any) => {
        const graphqlURL = await discovery.getBaseUrl('graphql');
        return fetch(graphqlURL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(params),
        }).then(res => res.json());
      },
    },
  ]);
```

Checkout this example [`packages/app/src/apis.ts`](../../packages/app/src/apis.ts).

### Backstage API Docs

You might want to show the schema from your GraphQL API in the API definition section of an API entity in Backstage. You can use the `/api/graphql/schema` endpoint to read the schema provided by your GraphQL API. Here's how:

1. Create the API entity and reference `definition.$text: http://localhost:7007/api/graphql/schema`

   ```yaml
   apiVersion: backstage.io/v1alpha1
   kind: API
   metadata:
     name: backstage-graphql-api
     description: GraphQL API provided by GraphQL Plugin
   spec:
     type: graphql
     owner: engineering@backstage.io
     lifecycle: production
     definition:
       $text: http://localhost:7007/api/graphql/schema
   ```

2. Modify `app-config.yaml` to allow reading urls from `localhost:7007`

```yaml
backend:
  ...
  reading:
    allow:
      - host: localhost:7007
```

[graphql]: https://graphql.org
[envelop]: https://the-guild.dev/graphql/envelop
[graphql-modules]: https://the-guild.dev/graphql/modules
[graphql-catalog]: ../graphql-catalog/README.md
[graphql-common]: ../graphql-common/README.md
[backstage-catalog]: https://backstage.io/docs/features/software-catalog/software-catalog-overview
[usemaskederrors]: https://the-guild.dev/graphql/envelop/plugins/use-masked-errors
