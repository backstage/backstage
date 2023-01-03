# @frontside/backstage-plugin-graphql

> **Status: Alpha** - this plugin is in early stage of code maturity. It includes features that were battle tested on client's projects, but require some time in open source to settle. You should expect the schema provided by this plugin to change because we're missing a number of important features.

Backstage GraphQL Plugin adds a GraphQL API to a Backstage developer portal. The GraphQL API behaves like a gateway to provide a single API for accessing data from the Catalog and other plugins. Currently, it only supports the Backstage catalog.

It includes the following features,

1. **Graph schema** - easily query relationships between data in the catalog.
1. **Schema-based resolvers** - add field resolvers using directives without requiring JavaScript.
1. **Modular schema definition** - allows organizing related schema into [graphql-modules](https://www.graphql-modules.com/docs)
1. [**Connection**](https://relay.dev/docs/guides/graphql-server-specification/#connections) - based on [GraphQL Cursor Connections Specification](https://relay.dev/graphql/connections.htm). (see [#68](https://github.com/thefrontside/backstage/issues/68))
1. Strives to support - [GraphQL Server Specification]

Some key features are currently missing. These features may change the schema in backward-incompatible ways.

1. `viewer` query for retrieving data for the current user. (see [#67](https://github.com/thefrontside/backstage/issues/67))

We plan to add these over time. If you're interested in contributing to this plugin, feel free to message us in [`#graphql` channel in Backstage Discord](https://discord.gg/yXEYX2h7Ed).

- [@frontside/backstage-plugin-graphql](#frontsidebackstage-plugin-graphql)
  - [Getting started](#getting-started)
  - [Extending Schema](#extending-schema)
    - [In Backstage Backend](#in-backstage-backend)
    - [Directives API](#directives-api)
      - [`@field`](#field)
      - [`@relation`](#relation)
      - [`@extend`](#extend)
  - [Integrations](#integrations)
    - [Backstage GraphiQL Plugin](#backstage-graphiql-plugin)
    - [Backstage API Docs](#backstage-api-docs)

## Getting started

You can install the GraphQL Plugin using the same process that you would use to install other backend Backtstage plugins.

1. Run `yarn add @frontside/backstage-plugin-graphql` in `packages/backend`
2. Create `packages/backend/src/plugins/graphql.ts` file with the following content

    ```ts
    import { createRouter } from '@frontside/backstage-plugin-graphql';
    import { CatalogClient } from '@backstage/catalog-client';
    import { Router } from 'express';
    import { Logger } from 'winston';

    interface PluginEnvironment {
        logger: Logger;
        catalog: CatalogClient
    }

    export default async function createPlugin(
      env: PluginEnvironment,
    ): Promise<Router> {
      return await createRouter({
        logger: env.logger,
        catalog: env.catalog,
      });
    }
    ```

3. Add plugin's router to your backend API router in `packages/backend/src/index.ts`

    ```ts
    // import the graphql plugin
    import graphql from './plugins/graphql';

    // create the graphql plugin environment
    const graphqlEnv = useHotMemoize(module, () => createEnv('graphql'));

    // add `/graphql` route to your apiRouter
    apiRouter.use('/graphql', await graphql(graphqlEnv));
    ```

  See [packages/backend/src/index.ts](https://github.com/thefrontside/backstage/blob/main/packages/backend/src/index.ts) for an example.

## Extending Schema

Backstage GraphQL Plugin allows developers to extend the schema provided by the plugin. Extending the schema allows you to query additional information for existing types or add new types. GraphQL is often used as a gateway to many different APIs. It's reasonable and expected that you may want to add custom types and fields. This section will tell you what you need to know to extend the schema.

### In Backstage Backend

You can extend the schema from inside of Backstage Backend by creating a [GraphQL Module](https://www.graphql-modules.com) that you can pass to the GraphQL API plugin's router. Here are step-by-step instructions on how to set up your GraphQL API plugin to provide a custom GraphQL Module.

1. Add `graphql-modules` and `@graphql-tools/load-files` to your backend packages in `packages/backend` with `yarn add graphql-modules @graphql-tools/load-files`
1. Create `packages/backend/src/graphql` directory that will contain your modules
1. Create a file for your first GraphQL module called `packages/backend/src/graphql/my-module.ts` with the following content

  ```ts
  import { resolvePackagePath } from '@backstage/backend-common'
  import { loadFilesSync } from '@graphql-tools/load-files';
  import { createModule } from 'graphql-modules'

  export const myModule = createModule({
    id: 'my-module',
    dirname: resolvePackagePath('backend', 'src/graphql'),
    typeDefs: loadFilesSync(resolvePackagePath('backend', 'src/graphql/my-module.graphql')),
    resolvers: {
      Query: {
        hello: () => 'world'
      }
    }
  })
  ```
1. Create GraphQL module's schema called `packages/backend/src/graphql/my-module.graphql` with the following content

  ```graphql
  type Query {
    hello: String!
  }
  ```

1. Register your GraphQL module with the GraphQL API plugin by modifying `packages/backend/src/plugins/graphql.ts`.
  You must import your new module and pass it to the router using `modules: [myModule]`. Here is what the result
  should look like.

  ```ts
  import { createRouter } from '@frontside/backstage-plugin-graphql';
  import { Router } from 'express';
  import { Logger } from 'winston';
  import { DatabaseManager } from '@backstage/backend-common';
  import { myModule } from '../graphql/my-module';

  interface PluginEnvironment {
      logger: Logger;
      databaseManager: DatabaseManager;
  }

  export default async function createPlugin(
    env: PluginEnvironment,
  ): Promise<Router> {
    return await createRouter({
      modules: [myModule],
      logger: env.logger,
      database: env.databaseManager,
    });
  }
  ```

1. Start your backend and you should be able to query your API with `{ hello }` query to get `{ data: { hello: 'world' } }`

1. (Optional) You can also extend existing basic node types. For example, you can add a new field to the `Component` interface. Here is what the result should look like.

  ```ts
  // ./src/graphql/extensions.ts
  import { resolvePackagePath } from '@backstage/backend-common'
  import { loadFilesSync } from '@graphql-tools/load-files';
  import { createModule } from 'graphql-modules'

  export const extensionsModule = createModule({
    id: 'extensions',
    dirname: resolvePackagePath('backend', 'src/graphql'),
    typeDefs: loadFilesSync(resolvePackagePath('backend', 'src/graphql/extensions.graphql')),
  });
  ```

  ```graphql
  # ./src/graphql/extensions.graphql
  interface Component {
    type: String @field(at: "spec.type")
  }
  ```

1. (Optional) If you use TypeScript and generate types from your GraphQL modules you should create `packages/backend/src/schema.ts` file:
```ts
import { resolvePackagePath } from '@backstage/backend-common';
import { transformSchema } from '@frontside/backstage-plugin-graphql';
import { loadFilesSync } from '@graphql-tools/load-files';
import { printSchemaWithDirectives } from '@graphql-tools/utils';

export default printSchemaWithDirectives(
  transformSchema(
    loadFilesSync(
      resolvePackagePath('backend', 'src/graphql/*.graphql')
    )
  )
);
```

1. Then replace `schema` field in your `codegen.yml` file to use `schema.ts` as a input schema:
```yaml
  schema: "src/schema.ts"
```

### Directives API

Every GraphQL API consists of two things - a schema and resolvers. The schema describes relationships and fields that you can retrieve from the API. The resolvers describe how you retrieve the data described in the schema. The Backstage GraphQL Plugin provides several directives to help write a GraphQL schema and resolvers for Backstage. These directives take into account some specificities for Backstage APIs to make it easier to write schema and implement resolvers. This section will explain each directive and the assumptions they make about the developer's intention.

#### `@field`

`@field` directive allows you to access properties on the object using a given path. It allows you to specify a resolver for a field from the schema without actually writing a real resolver. Under the hood, it's creating the resolver for you. It's used extensively in the [`catalog.graphql`](https://github.com/thefrontside/backstage/blob/main/plugins/graphql/src/app/modules/catalog/catalog.graphql) module to retrieve properties like `namespace`, `title` and others. For example, here is how we define the resolver for the `Entity#name` field `name: String! @field(at: "metadata.name")`. It also accepts an array of strings, it useful when path tokens contain dots: `label: String! @field(at: ["spec", "data.label"])`. You can specify default value as a fallback if the field is not found: `label: String! @field(at: "spec.label", default: "N/A")`.

#### `@relation`

`@relation` directive allows you to resolve relationships between entities. Similar to `@field` directive, it provides the resolver from the schema so you do not have to write a resolver yourself. It assumes that relationships are defined as standard `Entity` relationships. The `type` argument allows you to specify the type of the relationship. It will automatically look up the entity in the catalog. For example, here is how we define `owner` of an Component - `owner: Owner @relation(type: "ownedBy")`. If you have more than one relationship of specific type you might want to use a [relay connection](https://relay.dev/graphql/connections.htm). In that case you specify the `Connection` type as a field type and use `interface` argument to specify which connection type you would like to resolve to. `contributors: Connection @relation(type: "contributedBy", interface: "User")`. Or you can just use an array of entities `contributors: [User] @relation(type: "contributedBy")`. If you have different kinds of relationships with the same type you can filter them by `kind` argument. For example, `resources: Connection @relation(type: "hasPart", interface: "Resource", kind: "resource")`.

#### `@extend`

`@extend` directive allows you to inherit fields from another entity. We created this directive to make it easier to implement interfaces that extend from `Entity` and other interfaces. It makes GraphQL types similar to extending types in TypeScript. In TypeScript, when a class extends another class, the child class automatically inherits properties and methods of the parent class. This functionality doesn't have an equivalent in GraphQL. Without this directive, the `Component` interface in GraphQL would need to reimplement many fields that are defined on Entity which leads to lots of duplication. Using this directive, you can easily create a new interface that includes all of the properties of the parent. For example, if you wanted to create a `Repository` interface, you can do the following,

```graphql
interface Repository @extends(interface: "Entity", when: "kind", is: "Repository") {
  languages: [String] @field(at: "spec.languages")
}
```

Your `Repository` interface will automatically get all of the properties from `Entity`. You might notice that we don't declare object types and `@extend` can be used only on interfaces. That's because you can't extend from object types, only interfaces can be used for implementations. But for making queries you must have object types, so we're creating object types for you automatically. And for `Repository` interface we're creating `RepositoryImpl`.

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
      ])
    ```

  Checkout this example [`packages/app/src/apis.ts`](https://github.com/thefrontside/backstage/blob/main/packages/app/src/apis.ts#L35).

### Backstage API Docs

You might want to show the schema from your GraphQL API in API definition section of an API entity in Backstage. You can use the `/api/graphql/schema` endpoint to read the schema provided by your GraphQL API. Here is how you can accomplish this.

1. Create API entity and reference `definition.$text: http://localhost:7007/api/graphql/schema`

    ```yaml
    apiVersion: backstage.io/v1alpha1
    kind: API
    metadata:
      name: backstage-graphql-api
      description: GraphQL API provided by GraphQL Plugin
    spec:
      type: graphql
      owner: engineering@frontside.com
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
