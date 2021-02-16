# Backstage Search

**This plugin is still under development.**

You can follow the progress and contribute at the Backstage [Search Project Board](https://github.com/backstage/backstage/projects/6) or reach out to us in the [`#search` Discord channel](https://discord.com/channels/687207715902193673/770283289327566848).

## Getting started

Run `yarn start` in the root directory, and then navigate to [/search](http://localhost:3000/search)to check out the plugin.

### Working on the search platform

Currently, the search experience available in Backstage is 100% on the front-end, and only looks at the Software Catalog. We are actively developing [a more complete search platform](https://backstage.io/docs/features/search/search-overview), which will replace the current experience when ready.

In order to work on the new search platform, you will need to be aware of the following:

- **The use-search-platform feature flag**: The new search platform will move the primary search page to the App-level, out of the search plugin. You'll need to enable this feature flag to work on the net platform.
- **App SearchPage Component**: You'll find a new search page under `/packages/app/src/components/search`. When ready, we'll add an equivalent page to the `@backstage/create-app` template.
- **Backend**: Don't forget, a lot of functionality will be made available in backend plugins:
  - `@backstage/plugin-search-indexer-backend`, which is responsible for the search index management
  - `@backstage/plugin-search-backend`, which is responsible for query processing

As you work, be sure not to break the existing, frontend-only search page.
