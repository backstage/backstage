# search-backend-module-pg

This plugin provides an easy to use `SearchEngine` implementation to use with the
`@backstage/plugin-search-backend` based on Postgres.
Therefore it targets setups that want to avoid maintaining another external
service like elastic search. The search provides decent results and performs
well with ten thousands of indexed documents.
The connection to postgres is established via the database manager also used by
other plugins.

> **Important**: The search plugin requires at least Postgres 11!

## Setup

To use the `SearchEngine`, make sure that you have a Postgres database
configured and make the following changes to your backend:

1. Add a dependency on `@backstage/plugin-search-backend-module-pg` to your backend's `package.json`.
2. Initialize the search engine. It is recommended to initialize it with a fallback to the lunr search engine if you are running Backstage for development locally with SQLite:

```typescript
// In packages/backend/src/plugins/search.ts

// Initialize a connection to a search engine.
const searchEngine = (await PgSearchEngine.supported(database))
  ? await PgSearchEngine.from({ database })
  : new LunrSearchEngine({ logger });
```
