# TechDocs Plugin

## Getting started

Set up Backstage and TechDocs by following our guide on [Getting Started](../../docs/features/techdocs/getting-started.md).

## Configuration

Refer to our [configuration reference](../../docs/features/techdocs/configuration.md) for a complete listing of configuration options.

### TechDocs Storage API

The default setup of TechDocs assumes that your documentation is accessed by reading a page with the format of `<storageUrl>/<entity kind>/<entity namespace>/<entity name>`. This can be configured by [implementing a new techdocs storage API](https://backstage.io/docs/features/techdocs/how-to-guides#how-to-implement-your-own-techdocs-apis).
