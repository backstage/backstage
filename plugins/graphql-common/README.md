# Common GraphQL Plugin

By itself, the [graphql-backend][] plugin does nothing more than
provide an empty Schema. The way to add functionality to it, however,
is to augment it with [GraphQL modules][graphql-modules] defining new
types and how to resolve them.

- [Extending Schema](#extending-your-schema-with-a-custom-module)
  - [Directives API](#directives-api)
    - [`@field`](#field)
    - [`@inherit`](#inherit)
    - [`@relation`](#../graphql-catalog/README.md#relation-directive)
- [Integrations](#integrations)
  - [@graphql-codegen/TypeScript](#graphql-codegentypescript)
- [Questions](#questions)

## Extending your schema with a custom module

> 💡If you have not already, you should start by installing the
> [`@backstage/plugin-graphql-catalog`](../graphql-catalog/README.md).
> This plugin provide as GraphQL module that allows you to access the
> software catalog over GraphQL.

To extend your schema, you will define it using the GraphQL Schema Definition
Language, and then (optionally) write resolvers to handle the various types
which you defined.

1. Create modules directory where you'll store all your GraphQL modules, for example in `packages/backend/src/modules`
1. Create a module directory `my-module` there
1. Create a GraphQL schema file `my-module.graphql` in the module directory

```graphql
extend type Query {
  hello: String!
}
```

This code adds a `hello` field to the global `Query` type. Next, we are going to
write a module containing this schema and its resolvers.

4. Create a GraphQL module file `my-module.ts` in the module directory

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

5. Now we can Pass your the module to `createRouter` function of GraphQL backend
   plugin

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
    config: env.config,
    modules: [Catalog, MyModule],
  });
}
```

### Directives API

The above example shows how to write a resolver using TypeScript code. However,
one of the most important advantages of the GraphQL backend is that most of the
time you don't need to write any TypeScript at all. Instead, you can tell
GraphQL what it should do just by adding hints directly to the Schema about
which fields map to what. These hints are called `directives`.

The following directives will tell Backstage how to write resolvers
automatically, so that you don't have to.

#### `@field`

The @field directive allows you to access properties on an object
using a given path. It allows you to specify a resolver for a field
from the schema without actually writing a real resolver at all. Under
the hood, it's creating the resolver for you. To see this in action,
check out the
[`catalog.graphql`](../graphql-catalog/src/catalog/catalog.graphql)
which uses the `@field` directive extensively module to retrieve
properties like `namespace`, `title` and others.

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

3. You can specify a default value as a fallback if the field is not found:

```graphql
type Entity {
  tag: String! @field(at: "spec.tag", default: "N/A")
}
```

#### `@inherit`

The `@inherit` directive allows you to inherit fields from another
entity. We created this directive to make it easier to implement
interfaces that inherit from other interfaces. It makes GraphQL types
similar to extending types in TypeScript. In TypeScript, when a class
inherits another class, the child class automatically inherits
properties and methods of the parent class. This functionality doesn't
have an equivalent in GraphQL. Without this directive, the `IService`
interface in GraphQL would need to re-implement many fields that are
defined on implemented interfaces which leads to lots of duplication.

> 💡Heads up! your interface must be prefixed with `I` letter\*\*. This is done to
> avoid naming collisions because for each interface we generate an
> object type.

1. Use this directive to define a new interface that
   includes all of the properties of the parent.

```graphql
interface IService @inherit(interface: "IComponent") {
  endpoint: String! @field(at: "spec.endpoint")
}
```

In the output schema it is transformed into:

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

2. In order to inherit multiple levels of inheritance, you must define
   a discriminator by using `when/is` arguments. The structure of
   `when` is the same as the `at` argument for the [`@field`](#field)
   directive. The `is` argument is a value which is used to compare
   with the value found at the `when` path. So in this example we are
   inheriting `IRepository` from the `IEntity` interface and we presume
   if an entity from a data source has the `kind` field which is equal
   to `Repository`, the entity will be `Repository` type.

```graphql
interface IRepository
  @inherit(interface: "IEntity", when: "kind", is: "Repository") {
  languages: [String] @field(at: "spec.languages")
}
```

## Integrations

### `@graphql-codegen`/TypeScript

If you use `@graphql-codegen` to generate an output schema to use it for
validating frontend queries and/or TypeScript to have type checking in
GraphQL modules resolvers, you'll need modify your `@graphql-codegen` config.

1. First of all create a `schema.ts` file with `transformSchema`
   function and pass all your GraphQL files

```ts
import { resolvePackagePath } from '@backstage/backend-common';
import { transformSchema } from '@backstage/plugin-graphql-common';
import { printSchemaWithDirectives } from '@graphql-tools/utils';
import { loadFilesSync } from '@graphql-tools/load-files';

export default printSchemaWithDirectives(
  transformSchema([
    // Add Catalog GraphQL schema if you use Catalog GraphQL module
    loadFilesSync(
      require.resolve('@backstage/plugin-catalog-backend/catalog.graphql'),
    ),
    loadFilesSync(resolvePackagePath('backend', 'src/modules/**/*.graphql')),
  ]),
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

### Why was my `union` type transformed to an interface in output schema?

You might notice that if you have a `union` type which is used in
`@relation` directive with `Connection` type, like this:

```graphql
union Owner = IUser | IGroup

interface IResource
  @inherit(interface: "IEntity", when: "kind", is: "Resource") {
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

The reason why we do that, is because `Edge` interface has a `node`
field with `Node` type. So it forces that any object types that
implement `Edge` interface must have the `node` field with the type
that implements `Node` interface. And unions can't implement
interfaces yet
([graphql/graphql-spec#518](https://github.com/graphql/graphql-spec/issues/518))
So you just simply can't use unions in such case. As a workaround we
change a union to an interface that implements `Node` and each type
that was used in the union, now implements the new interface. To an
end user there is no difference between a union and interface
approach, both variants work similar.

[graphql-backend]: ../graphql-backend/README.md
[graphql-modules]: https://the-guild.dev/graphql/modules
[relay connection]: https://relay.dev/docs/guides/graphql-server-specification/#connections
