# @backstage/plugin-graphiql

This plugin integrates [GraphiQL](https://github.com/graphql/graphiql) as a tool to browse GraphiQL endpoints inside Backstage.

The purpose of the plugin is to provide a convenient way for developers to try out GraphQL queries in their own environemnt.
By exposing GraphiQL as a plugin instead of a standalone app, it's possible to provide a preconfigured environment for engineers, and also tie into authentication providers already inside Backstage.

## Getting Started

### Installing the plugin

Start out by installing the plugin in your Backstage app:

```bash
yarn add @backstage/plugin-graphiql
```

Then add an entry to your App's `plugins.ts` to import the plugin.

The plugin registers a `/graphiql` route, which you can link to from the Sidebar if desired.

### Adding GraphQL endpoints

For the plugin to function, you need to supply GraphQL endpoints through the GraphQLBrowse API, which is done by implementing the `GraphQLBrowseApi` exported by this plugin.

If all you need is a static list of endpoints, the plugin exports a `GraphQLEndpoints` class that implements the `GraphQLBrowseApi` for you. Here's and example of how you could expose two GraphQL endpoints in your App:

```tsx
import {
  graphQlBrowseApiRef,
  GraphQLEndpoints,
} from '@backstage/plugin-graphiql';

// Implement the Graph QL browse API using a static list of endpoints
const graphQlBrowseApi = GraphQLEndpoints.from([
  // Use the .create function if all you need is a static URL and headers.
  GraphQLEndpoints.create({
    id: 'gitlab',
    title: 'GitLab',
    url: 'https://gitlab.com/api/graphql',
    // Optional extra headers
    headers: { Extra: 'Header' },
  }),
  {
    id: 'hooli-search',
    title: 'Hooli Search',
    // Custom fetch function, this one is equivalent to using GraphQLEndpoints.create()
    // with url set to https://internal.hooli.com/search
    fetcher: async (params: any) => {
      return fetch('https://internal.hooli.com/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(params),
      }).then(res => res.json());
    },
  },
]);

// ApiRegistry builder created somewhere in your App
const builder = ApiRegistry.builder();

// Add the instance to the API registry
builder.add(graphQlBrowseApiRef, graphQlBrowseApi);
```
