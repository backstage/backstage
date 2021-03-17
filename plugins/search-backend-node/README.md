# search-backend-node

This plugin is part of a suite of plugins that comprise the Backstage search
platform, which is still very much under development. This plugin specifically
is responsible for:

- Allowing other backend plugins to register the fact that they have documents
  that they'd like to be indexed by a search engine (known as `collators`)
- Allowing other backend plugins to register the fact that they have metadata
  that they'd like to augment existing documents in the search index with
  (known as `decorators`)
- A scheduler that, at configurable intervals, compiles documents to be indexed
  and passes them to a search engine for indexing
- Types for all of the above

Documentation on how to develop and improve the search platform is currently
centralized in the `search` plugin README.md.

For a better overview of how the search platform is put together, check the
[Backstage Search Architecture](https://backstage.io/docs/features/search/architecture)
documentation.
