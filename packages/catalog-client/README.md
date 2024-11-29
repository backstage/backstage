# Catalog Client

Contains a frontend and backend compatible client for communicating with the
Backstage Catalog.

Backend code may import and use this package directly.

However, frontend code will not want to instantiate a catalog client directly -
use the `@backstage/plugin-catalog-react` package instead, which exports a
`catalogApiRef` that can be leveraged like other frontend utility APIs.

## Links

- [Default frontend part of the catalog](https://github.com/spotify/backstage/tree/master/plugins/catalog)
- [Default backend part of the catalog](https://github.com/spotify/backstage/tree/master/plugins/catalog-backend)
- [The Backstage homepage](https://backstage.io)
