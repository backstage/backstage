# Backstage Search

**This plugin is still under development.**

You can follow the progress and contribute at the Backstage [Search Project Board](https://github.com/backstage/backstage/projects/6) or reach out to us in the [`#search` Discord channel](https://discord.com/channels/687207715902193673/770283289327566848).

## Getting started

Run `yarn start` in the root directory, and then navigate to [/search](http://localhost:3000/search) to check out the plugin.

### Working on the search platform

The above search experience is 100% client-side and only looks at the Software Catalog. We are actively developing [a more complete search platform](https://backstage.io/docs/features/search/search-overview), which will replace the current experience when ready.

In order to work on this new search platform, you will need to be aware of the following:

- **In-development app search route**: The new search platform will move the primary search page to the App-level, out of the search plugin. For now, to ensure the old experience is still easy to test, you can work on the new platform at `/search-next` instead of `/search`.
- **App SearchPage Component**: You'll find a new search page in this plugin `SearchPageNext`. When sufficiently stable, we'll replace `SearchPage` with `SearchPageNext`
- **Backend**: Don't forget, a lot of functionality will be made available in backend plugins:
  - `@backstage/plugin-search-backend-node`, which is responsible for the search index management
  - `@backstage/plugin-search-backend`, which is responsible for query processing

As you work, be sure not to break the existing, frontend-only search page.
