# Backstage Search

A flexible, extensible search across your whole Backstage ecosystem.

Development is ongoing. You can follow the progress and contribute at the Backstage [Search Project Board](https://github.com/backstage/backstage/projects/6) or reach out to us in the [`#search` Discord channel](https://discord.com/channels/687207715902193673/770283289327566848).

## Getting started

Run `yarn dev` in the root directory, and then navigate to [/search](http://localhost:3000/search) to check out the plugin.

### Areas of Responsibility

This search plugin is primarily responsible for the following:

- Providing a `<SearchPage />` routable extension.
- Exposing various search-related components (like `<SearchBar />`,
  `<SearchFilter />`, etc), which can be composed by a Backstage App or by
  other Backstage Plugins to power search experiences of all kinds.
- Exposing a `<SearchContextProvider />`, which manages search state and API
  communication with the Backstage backend.

Don't forget, a lot of functionality is available in backend plugins:

- `@backstage/plugin-search-backend-node`, which is responsible for the search
  index management
- `@backstage/plugin-search-backend`, which is responsible for query processing
