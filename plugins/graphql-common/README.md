# Common GraphQL Plugin

By itself, the [graphql-backend][] plugin does nothing more than
provide an empty Schema. The way to add functionality to it, however,
is to augment it with [GraphQL modules][graphql-modules] defining new
types and how to resolve them.

- [Extending Schema](#extending-your-schema-with-a-custom-module)
  - [Directives API](#directives-api)
    - [`@field`](#field)
    - [`@implements`](#implements)
    - [`@discriminates`](#discriminates)
    - [`@discriminationAlias`](#discriminationalias)
    - [`@resolve`](#resolve)
    - [`@relation`](../graphql-backend-module-catalog/README.md#relation-directive)
- [Integrations](#integrations)
  - [@graphql-codegen/TypeScript](#graphql-codegentypescript)
- [Questions](#questions)

## Extending your schema with a custom module

> 💡If you have not already, you should start by installing the
> [`@backstage/plugin-graphql-backend-module-catalog`](../graphql-backend-module-catalog/README.md).
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

5. Now we can pass your GraphQL module to GraphQL Application backend
   module

```ts
// packages/backend/src/modules/graphqlApplication.ts
import { createBackendModule } from '@backstage/backend-plugin-api';
import { graphqlApplicationExtensionPoint } from '@backstage/plugin-graphql-backend';
import { MyModule } from '../modules/my-module/my-module';

export const graphqlModuleApplication = createBackendModule({
  pluginId: 'graphql',
  moduleId: 'application',
  register(env) {
    env.registerInit({
      deps: { application: graphqlApplicationExtensionPoint },
      async init({ application }) {
        await application.addModule(MyModule);
      },
    });
  },
});
```

6. And then add it to your backend

```ts
// packages/backend/src/index.ts
import { graphqlModuleApplication } from './modules/graphqlApplication';

const backend = createBackend();

// GraphQL
backend.use(graphqlPlugin());
backend.use(graphqlModuleApplication());
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
[`catalog.graphql`](../graphql-backend-module-catalog/src/catalog/catalog.graphql)
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

#### `@implements`

The `@implements` directive allows you to inherit fields from another
interface. We created this directive to make it easier to implement
interfaces that inherit from other interfaces. It makes GraphQL types
similar to extending types in TypeScript. In TypeScript, when a class
inherits another class, the child class automatically inherits
properties and methods of the parent class. This functionality doesn't
have an equivalent in GraphQL. Without this directive, the `Service`
interface in GraphQL would need to re-implement many fields that are
defined on implemented interfaces which leads to lots of duplication.

1. Use this directive to define a new type that
   includes all of the properties of the parent interface.

```graphql
type Service @implements(interface: "Component") {
  endpoint: String! @field(at: "spec.endpoint")
}
```

In the output schema it is transformed into:

```graphql
type Service implements Component & Entity & Node {
  id: ID!
  name: String!
  kind: String!
  namespace: String!
  # ... rest `Entity` and `Component` fields ...

  endpoint: String!
}
```

#### `@discriminates`

The `@discriminates` directive tells the GraphQL App that an interface
be discriminated by a given value to another interface or a type.
The value by path from `with` argument is used to determine to which
type the interface should be resolved.

```graphql
interface Entity
  @implements(interface: "Node")
  @discriminates(with: "kind") {
    # ...
  }

type Component @implements(interface: "Entity") {
  # ...
}
type Service @implements(interface: "Entity") {
  # ...
}
```

There is a special case when your runtime data doesn't have a value
that can be used to discriminate the interface or there is no type
that matches the value. In this case, you can define `opaqueType` argument

```graphql
interface Entity
  @implements(interface: "Node")
  @discriminates(with: "kind", opaqueType: "OpaqueEntity") {
    # ...
  }
```

In this case, if the value of `kind` field doesn't match with any schema type,
the `OpaqueEntity` type will be used. You don't need to define this type, the GraphQL
plugin will generate it for you.

There is another way to define opaque types for all interfaces by using `generateOpaqueTypes`
option for GraphQL plugin.

#### `@discriminationAlias`

By default value from `with` argument is used to find a type as-is or converted to PascalCase.
And it's fairly enough for most cases. But sometimes you need to match the value with a type
that has a different name. In this case, you can use `@discriminationAlias` directive.

```graphql
interface API
  @implements(interface: "Node")
  @discriminates(with: "spec.type")
  @discriminationAlias(from: "openapi", to: "OpenAPI") {
    # ...
  }

type OpenAPI @implements(interface: "API") {
  # ...
}
```

This means, when `spec.type` equals to `openapi`, the `API` interface will be resolved to `OpenAPI` type.

#### `@resolve`

The `@resolve` directive is similar to the `@field` directive, but instead of
resolving a field from the source data, it resolves a field from a 3rd party
API. This is useful when you want to add fields to your schema that are not
available in the source data, but are available from another API.

1. You need to add a loader for your API to the GraphQL plugin config. Check
   [Custom Data loaders](../graphql-backend/README.md#custom-data-loaders-advanced)
   for details.

2. Then you can use the `@resolve` directive with specifying the loader name of your API:

```graphql
type Project {
  tasks: [Task!] @resolve(at: "spec.projectId", from: "MyAPI")
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
import { CoreSync, transformSchema } from '@backstage/plugin-graphql-common';
import { CatalogSync } from '@backstage/plugin-graphql-backend-module-catalog';
import { printSchemaWithDirectives } from '@graphql-tools/utils';
import { MyModule } from '../modules/my-module/my-module';

export const schema = printSchemaWithDirectives(
  transformSchema([CoreSync(), CatalogSync(), MyModule]),
);
```

2. Then you need to update `schema` option in your `codegen.ts`

```ts
import { CodegenConfig } from '@graphql-codegen/cli';

const config: CodegenConfig = {
  schema: './src/schema.ts',
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
union Owner = User | Group

type Resource @implements(interface: "Entity") {
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

type User implements Entity & Node & Owner {
  # ...
}

type Group implements Entity & Node & Owner {
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
