# search-backend

This plugin is part of a suite of plugins that comprise the Backstage search
platform. This particular plugin responsible for exposing a JSON API for
querying a search engine.

Documentation on how to develop and improve the search platform is currently
centralized in the `search` plugin README.md.

For a better overview of how the search platform is put together, check the
[Backstage Search Architecture](https://backstage.io/docs/features/search/architecture)
documentation.

### Optional Settings

Configure the search query values via `app-config.yaml` to define how it behaves by default.

```yaml
# app-config.yaml
search:
  query:
    pageLimit: 50
```

Acceptable values for `pageLimit` are `10`, `25`, `50` or `100`.

**NOTE**: Currently this configuration only reflects the initial state of the Search React components. This means that
it defines how it behaves when it is first loaded or reset.
