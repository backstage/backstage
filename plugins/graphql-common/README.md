# Common GraphQL Plugin

Welcome to the Common GraphQL plugin!

The plugin provides very basic functionality to simplify your routine work with GraphQL.

It includes the following features,

1. **Core schema** - good starting point for extending with your own types.
1. **Schema-based resolvers** - add field resolvers using directives without requiring JavaScript.
1. **Modular schema definition** - allows organizing related schema into [graphql-modules](https://www.graphql-modules.com/docs)
1. [**Connection**](https://relay.dev/docs/guides/graphql-server-specification/#connections) - based on [GraphQL Cursor Connections Specification](https://relay.dev/graphql/connections.htm).
1. **Strives to support** - [GraphQL Server Specification](http://spec.graphql.org)

- [Getting started](#getting-started)
- [Extending Schema](#extending-schema)
  - [Directives API](#directives-api)
    - [`@field`](#field)
    - [`@relation`](#relation)
    - [`@extend`](#extend)
- [Integrations](#integrations)
  - [Codegen/TypeScript](#codegen-typescript)
- [Questions](#questions)

## Getting started

The simplest way to start is use [`@backstage/plugin-graphql-backend`](https://github.com/backstage/backstage/tree/master/plugins/graphql-backend) instead.

Otherwise you'll need to create a router with GraphQL server. The minimal setup might be:

```ts
// packages/backend/src/plugins/graphql.ts
import * as graphql from 'graphql';
import DataLoader from 'dataloader';
import { graphqlHTTP } from 'express-graphql';
import { createGraphQLApp } from '@backstage/plugin-graphql-common';
import { envelop, useEngine } from '@envelop/core';
import { useDataLoader } from '@envelop/dataloader';
import { useGraphQLModules } from '@envelop/graphql-modules';
import { Module } from 'graphql-modules';
import { Router } from 'express';

interface PluginEnvironment {
  loader: () => DataLoader<any, any>;
  modules?: Module[];
}

export default function createRouter(env: PluginEnvironment): Router {
  const application = createGraphQLApp({ modules: env.modules });
  const run = envelop({
    plugins: [
      useEngine(graphql),
      useGraphQLModules(application),
      useDataLoader('loader', env.loader),
    ],
  });
  const { parse, validate, contextFactory, execute } = run();

  const router = Router();

  const server = graphqlHTTP({
    schema: application.schema,
    graphiql: true,
    customParseFn: parse,
    customValidateFn: validate,
    customExecuteFn: async args =>
      execute({
        ...args,
        contextValue: await contextFactory(),
      }),
  });

  router.use(server);

  return router;
}
```

Then add the router to your backend API router:

```ts
// packages/backend/src/index.ts
import graphql from './plugins/graphql';

/* ... */

const graphqlEnv = useHotMemoize(module, () => createEnv('graphql'));

/* ... */

apiRouter.use('/graphql', await graphql(graphqlEnv));
```

See [`packages/backend/src/index.ts`](https://github.com/backstage/backstage/blob/master/packages/backend/src/index.ts) for an example.

## Extending Schema

This plugin has minimal core schema which isn't useful. So you might be interested in installing [`@backstage/plugin-graphql-catalog`](https://github.com/backstage/backstage/tree/master/plugins/graphql-catalog) plugin that provides a GraphQL module with basic Backstage Catalog types. And you also can add your types/fields. This section will tell how to do it by writing custom GraphQL module.

1. Create modules directory where you'll store all your GraphQL modules, for example in `packages/backend/src/modules`
1. Create a module directory `my-module` there
1. Create a GraphQL schema file `my-module.graphql` in module's directory

```graphql
extend type Query {
  hello: String!
}
```

4. Create a GraphQL module file `my-module.ts` in module's directory

```ts
import { resolvePackagePath } from '@backstage/backend-common';
import { loadFilesSync } from '@graphql-tools/load-files';
import { createModule } from 'graphql-modules';

export const myModule = createModule({
  id: 'my-module',
  dirname: resolvePackagePath('backend', 'src/modules/my-module'),
  typeDefs: loadFilesSync(
    resolvePackagePath('backend', 'src/modules/my-module/my-module.graphql'),
  ),
  resolvers: {
    Query: {
      hello: () => 'world',
    },
  },
});
```

5. Pass your module to `createRouter` function of GraphQL backend plugin

```ts
// packages/backend/src/plugins/graphql.ts
import { createRouter } from '@backstage/plugin-graphql-backend';
import { Catalog } from '@backstage/plugin-graphql-catalog';
import { Router } from 'express';
import { PluginEnvironment } from '../types';
import { MyModule } from '../modules/my-module/my-module';

export default async function createPlugin(
  env: PluginEnvironment,
): Promise<Router> {
  return await createRouter({
    logger: env.logger,
    catalog: env.client,
    modules: [Catalog, MyModule],
  });
}
```

6. Start your backend and you should be able to query your API with `{ hello }` query to get `{ data: { hello: 'world' } }`

### Directives API

Every GraphQL API consists of two things - a schema and resolvers. The schema describes relationships and fields that you can retrieve from the API. The resolvers describe how you retrieve the data described in the schema. The Backstage GraphQL Plugin provides several directives to help write a GraphQL schema and resolvers for Backstage. These directives take into account some specificities for Backstage APIs to make it easier to write schema and implement resolvers. This section will explain each directive and the assumptions they make about the developer's intention.

#### `@field`

`@field` directive allows you to access properties on the object using a given path. It allows you to specify a resolver for a field from the schema without actually writing a real resolver. Under the hood, it's creating the resolver for you. It's used extensively in the [`catalog.graphql`](https://github.com/backstage/backstage/tree/master/plugins/graphql-catalog/src/catalog/catalog.graphql) module to retrieve properties like `namespace`, `title` and others.

1. Mapping `namespace.name` field from source data to `Entity#name` field:

```graphql
type Entity {
  name: String! @field(at: "namespace.name")
}
```

2. If source path's fields contain dots `{ spec: { "data.label": "..." } }`, you can use an array:

```graphql
type Entity {
  label: String @field(at: ["spec", "data.label"])
}
```

3. You can specify default value as a fallback if the field is not found:

```graphql
type Entity {
  tag: String! @field(at: "spec.tag", default: "N/A")
}
```

#### `@relation`

`@relation` directive allows you to resolve relationships between entities. Similar to `@field` directive, it provides the resolver from the schema so you do not have to write a resolver yourself. It assumes that relationships are defined as standard `Entity` relationships. The `name` argument allows you to specify the type of the relationship. It will automatically look up the entity in the catalog.

1. Defining an user owner of an Component:

```graphql
type Component {
  owner: User @relation(name: "ownedBy")
}
```

2. If you have more than one relationship of specific type you might want to use a [relay connection](https://relay.dev/graphql/connections.htm). In that case you specify the `Connection` type as a field type and use `nodeType` argument to specify which connection type you would like to resolve to.

```graphql
type Repository {
  contributors: Connection @relation(name: "contributedBy", nodeType: "User")

  # Or you can just use an array of entities
  contributors: [User] @relation(name: "contributedBy")
}
```

3. If you have different kinds of relationships with the same type you can filter them by `kind` argument:

```graphql
type System {
  components: Connection
    @relation(name: "hasPart", nodeType: "Component", kind: "component")
  resources: Connection
    @relation(name: "hasPart", nodeType: "Resource", kind: "resource")
}
```

#### `@extend`

`@extend` directive allows you to inherit fields from another entity. We created this directive to make it easier to implement interfaces that extend from other interfaces. It makes GraphQL types similar to extending types in TypeScript. In TypeScript, when a class extends another class, the child class automatically inherits properties and methods of the parent class. This functionality doesn't have an equivalent in GraphQL. Without this directive, the `IService` interface in GraphQL would need to reimplement many fields that are defined on implemented interfaces which leads to lots of duplication. Using this directive, you can easily create a new interface that includes all of the properties of the parent. To use the directive **your interface must be prefixed with `I` letter**, it's done to avoid naming collisions because for each interface we generate an object type,

```graphql
interface IService @extend(interface: "IComponent") {
  endpoint: String! @field(at: "spec.endpoint")
}
```

In output schema it becomes:

```graphql
interface IService implements IComponent & IEntity & Node {
  id: ID!
  name: String!
  kind: String!
  namespace: String!
  # ... rest `IEntity` and `IComponent` fields ...

  endpoint: String!
}

type Service implements IService & IComponent & IEntity & Node {
  # ... all fields from `IService` ...
}
```

2. For extending multiple interfaces from one you have to define a condition by using `when/is` arguments. Where `when` is the same as the `at` argument for the [`@field`](#field) directive and `is` is a value which is used to compare with a value from `when` path. So like in this example we are extending `IRepository` from the `IEntity` interface and we presume if an entity from a data source has the `kind` field which is equal to `Repository`, the entity will be `Repository` type

```graphql
interface IRepository
  @extend(interface: "IEntity", when: "kind", is: "Repository") {
  languages: [String] @field(at: "spec.languages")
}
```

## Integrations

### Codegen/TypeScript

If you use Codegen to generate an output schema to use it for validating frontend queries and/or TypeScript to have type checking in GraphQL modules resolvers. You'll need modify your codegen config.

1. First of all create a `schema.ts` file with `transformSchema` function and pass all your GraphQL files

```ts
import { resolvePackagePath } from '@backstage/backend-common';
import { transformSchema } from '@backstage/plugin-graphql-common';
import { printSchemaWithDirectives } from '@graphql-tools/utils';
import { loadFilesSync } from '@graphql-tools/load-files';

export default printSchemaWithDirectives(
  transformSchema(
    loadFilesSync(resolvePackagePath('backend', 'src/modules/**/*.graphql')),
  ),
);
```

2. Then you need to update `schema` option in your `codegen.ts`

```ts
import { CodegenConfig } from '@graphql-codegen/cli';

const config: CodegenConfig = {
  schema: 'src/schema.ts',
  generates: {
    /* ... */
  },
};

export default config;
```

## Questions

### Why my union type was transformed to an interface in output schema?

You might notice that if you have a union type which is used in `@relation` directive with `Connection` type, like this:

```graphql
union Owner = IUser | IGroup

interface IResource
  @extend(interface: "IEntity", when: "kind", is: "Resource") {
  owners: Connection! @relation(name: "ownedBy", nodeType: "Owner")
}
```

In output schema you'll get:

```graphql
interface Owner implements Node {
  id: ID!
}

type OwnerConnection implements Connection {
  pageInfo: PageInfo!
  edges: [OwnerEdge!]!
  count: Int
}

type OwnerEdge implements Edge {
  cursor: String!
  node: Owner!
}

interface IUser implements IEntity & Node & Owner {
  # ...
}

interface IGroup implements IEntity & Node & Owner {
  # ...
}
```

The reason why we do that, is because `Edge` interface has a `node` field with `Node` type. So it forces that any object types that implement `Edge` interface must have the `node` field with the type that implements `Node` interface. And unions can't implement interfaces yet ([graphql-spec#518](https://github.com/graphql/graphql-spec/issues/518)) So you just simply can't use unions in such case. As a workaround we change a union to an interface that implements `Node` and each type that was used in the union, now implements the new interface. To an end user there is no difference between a union and interface approach, both variants work similar.
