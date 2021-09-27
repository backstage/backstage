# TechDocs Plugin

## Getting started

Set up Backstage and TechDocs by following our guide on [Getting Started](../../docs/features/techdocs/getting-started.md).

## Configuration

Refer to our [configuration reference](../../docs/features/techdocs/configuration.md) for a complete listing of configuration options.

### TechDocs Storage API

The default setup of TechDocs assumes that your documentation is accessed by reading a page with the format `<storageUrl>/<entity kind>/<entity namespace>/<entity name>`. This is configurable by implementing a new TechDocs storage API. To do this, implement TechDocsStorage found in `plugins/techdocs/src/api` and add your new API to the application in `app/src/apis.ts` (or replace it if it's already registered as an API).
