# Catalog Client

Contains a frontend and backend compatible client for communicating with the
Backstage Catalog.

Backend code may import and use this package directly.

However, frontend code will not want to import this package directly - use the
`@backstage/plugin-catalog` package instead, which re-exports all of the types
and classes from this package. Thereby, you will also gain access to its
`catalogApiRef`.

## Links

- [Default frontend part of the catalog](https://github.com/spotify/backstage/tree/master/plugins/catalog)
- [Default backend part of the catalog](https://github.com/spotify/backstage/tree/master/plugins/catalog-backend)
- [The Backstage homepage](https://backstage.io)
