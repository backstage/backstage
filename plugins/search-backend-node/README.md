# search-backend-node

This plugin is part of a suite of plugins that comprise the Backstage search
platform. This particular plugin is responsible for all aspects of the search
indexing process, including:

- Providing connections to search engines where actual document indices live
  and queries can be made.
- Defining a mechanism for plugins to expose documents that they'd like to be
  indexed (called `collators`).
- Defining a mechanism for plugins to add extra metadata to documents that the
  source plugin may not be aware of (known as `decorators`).
- A scheduler that, at configurable intervals, compiles documents to be indexed
  and passes them to a search engine for indexing.
- A builder class to wire up all of the above.
- Naturally, types for all of the above.

Documentation on how to develop and improve the search platform is currently
centralized in the `search` plugin README.md.

For a better overview of how the search platform is put together, check the
[Backstage Search Architecture](https://backstage.io/docs/features/search/architecture)
documentation.
