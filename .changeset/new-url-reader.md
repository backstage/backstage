---
'@backstage/backend-common': patch
---

Added new UrlReader interface for reading opaque data from URLs with different providers.

This new URL reading system is intended as a replacement for the various integrations towards
external systems in the catalog, scaffolder, and techdocs. It is configured via a new top-level
config section called 'integrations'.

Along with the UrlReader interface is a new UrlReaders class, which exposes static factory
methods for instantiating readers that can read from many different integrations simultaneously.
