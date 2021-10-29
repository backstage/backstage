# Tech Insights Backend

This is the backend for the default Backstage Tech Insights feature.
This provides the API for the frontend tech insights, scorecards and fact visualization functionality,
as well as a framework to run fact retrievers and store fact values in to a data store.

## Installation

### Install the package

```bash
# From your Backstage root directory
cd packages/backend
yarn add @backstage/plugin-tech-insights-backend
```

### Adding the plugin to your `packages/backend`

You'll need to add the plugin to the router in your `backend` package. You can
do this by creating a file called `packages/backend/src/plugins/techInsights.ts`. An example content for `techInsights.ts` could be something like this.

```ts
import {
  createRouter,
  DefaultTechInsightsBuilder,
} from '@backstage/plugin-tech-insights-backend';
import { Router } from 'express';
import { PluginEnvironment } from '../types';

export default async function createPlugin({
  logger,
  config,
  discovery,
  database,
}: PluginEnvironment): Promise<Router> {
  const builder = new DefaultTechInsightsBuilder({
    logger,
    config,
    database,
    discovery,
    factRetrievers: [], // Fact retrievers registrations you want tech insights to use
  });

  return await createRouter({
    ...(await builder.build()),
    logger,
    config,
  });
}
```

With the `techInsights.ts` router setup in place, add the router to
`packages/backend/src/index.ts`:

```diff
+ import techInsights from './plugins/techInsights';

  async function main() {
    ...
    const createEnv = makeCreateEnv(config);

    const catalogEnv = useHotMemoize(module, () => createEnv('catalog'));
+   const techInsightsEnv = useHotMemoize(module, () => createEnv('tech_insights'));

    const apiRouter = Router();
+   apiRouter.use('/tech-insights', await techInsights(techInsightsEnv));
    ...
    apiRouter.use(notFoundHandler());
  }
```

### Adding fact retrievers

At this point the Tech Insights backend is installed in your backend package, but
you will not have any fact retrievers present in your application. To have the implemented FactRetrieverEngine within this package to be able to retrieve and store fact data into the database, you need to add these.

To create factRetrieverRegistration you need to implement `FactRetriever` interface defined in `@backstage/plugin-tech-insights-common` package. After you have implemented this interface you can wrap that into a registration object like follows:

```ts
import { createFactRetrieverRegistration } from './createFactRetriever';

const myFactRetriever = {
  /**
   * snip
   */
};

const myFactRetrieverRegistration = createFactRetrieverRegistration(
  '1 * 3 * * ', // On the first minute of the third day of the month
  myFactRetriever,
);
```

Then you can modify the example `techInsights.ts` file shown above like this:

```diff
const builder = new DefaultTechInsightsBuilder({
  logger,
  config,
  database,
  discovery,
- factRetrievers: [],
+ factRetrievers: [myFactRetrieverRegistration],
});
```

### Creating Fact Retrievers

A Fact Retriever consist of four parts:

1. `id` - unique identifier of a fact retriever
2. `version`: A semver string indicating the current version of the schema and the handler
3. `schema` - A versioned schema defining the shape of data a fact retriever returns
4. `handler` - An asynchronous function handling the logic of retrieving and returning facts for an entity

An example implementation of a FactRetriever could for example be as follows:

```ts
const myFactRetriever: FactRetriever = {
  id: 'documentation-number-factretriever', // unique identifier of the fact retriever
  version: '0.1.1', // SemVer version number of this fact retriever schema. This should be incremented if the implementation changes
  entityFilter: [{ kind: 'component' }], // EntityFilter to be used in the future (creating checks, graphs etc.) to figure out which entities this fact retrieves data for.
  schema: {
    // Name/identifier of an individual fact that this retriever returns
    examplenumberfact: {
      type: 'integer', // Type of the fact
      description: 'A fact of a number', // Description of the fact
    },
  },
  handler: async ctx => {
    // Handler function that retrieves the fact
    const { discovery, config, logger } = ctx;
    const catalogClient = new CatalogClient({
      discoveryApi: discovery,
    });
    const entities = await catalogClient.getEntities({
      filter: [{ kind: 'component' }],
    });
    /**
     * snip: Do complex logic to retrieve facts from external system or calculate fact values
     */

    // Respond with an array of entity/fact values
    return entities.items.map(it => {
      return {
        // Entity information that this fact relates to
        entity: {
          namespace: it.metadata.namespace,
          kind: it.kind,
          name: it.metadata.name,
        },

        // All facts that this retriever returns
        facts: {
          examplenumberfact: 2, //
        },
        // (optional) timestamp to use as a Luxon DateTime object
      };
    });
  },
};
```

### Adding a fact checker

This module comes with a possibility to additionally add a fact checker and expose fact checking endpoints from the API. To be able to enable this feature you need to add a FactCheckerFactory implementation to be part of the `DefaultTechInsightsBuilder` constructor call.

There is a default FactChecker implementation provided in module `@backstage/plugin-tech-insights-backend-module-jsonfc`. This implementation uses `json-rules-engine` as the underlying functionality to run checks. If you want to implement your own FactChecker, for example to be able to handle other than `boolean` result types, you can do so by implementing `FactCheckerFactory` and `FactChecker` interfaces from `@backstage/plugin-tech-insights-common` package.

To add the default FactChecker into your Tech Insights you need to install the module into your backend application:

```bash
# From your Backstage root directory
cd packages/backend
yarn add @backstage/plugin-tech-insights-backend-module-jsonfc
```

and modify the `techInsights.ts` file to contain a reference to the FactChecker implementation.

```diff
+ import { JsonRulesEngineFactCheckerFactory } from '@backstage/plugin-tech-insights-backend-module-jsonfc';

+ const myFactCheckerFactory = new JsonRulesEngineFactCheckerFactory({
+    checks: [],
+    logger,
+  }),

  const builder = new DefaultTechInsightsBuilder({
    logger,
    config,
    database,
    discovery,
    factRetrievers: [myFactRetrieverRegistration],
+   factCheckerFactory: myFactCheckerFactory
  });
```

To be able to run checks, you need to additionally add individual checks into your FactChecker implementation. For examples how to add these, you can check the documentation of the individual implementation of the FactChecker

#### Modifying check persistence

The default FactChecker implementation comes with an in-memory storage to store checks. You can inject an additional data store by adding an implementation of `TechInsightCheckRegistry` into the constructor options when creating a `JsonRulesEngineFactCheckerFactory`. That can be done as follows:

```diff
const myTechInsightCheckRegistry: TechInsightCheckRegistry<MyCheckType> = // snip
const myFactCheckerFactory = new JsonRulesEngineFactCheckerFactory({
  checks: [],
  logger,
+ checkRegistry: myTechInsightCheckRegistry
}),

```
