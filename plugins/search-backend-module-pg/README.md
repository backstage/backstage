# search-backend-module-pg

This plugin provides an easy to use `SearchEngine` implementation to use with the
`@backstage/plugin-search-backend` based on Postgres.
Therefore it targets setups that want to avoid maintaining another external
service like elastic search. The search provides decent results and performs
well with ten thousands of indexed documents.
The connection to postgres is established via the database manager also used by
other plugins.

> **Important**: The search plugin requires at least Postgres 11!

## Getting started

See [Backstage documentation](https://backstage.io/docs/features/search/search-engines#postgres)
for details on how to setup Postgres based search for your Backstage instance.
