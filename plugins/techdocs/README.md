# TechDocs Plugin

## Getting started

Set up Backstage and TechDocs by follow our guide on [Getting Started](../../docs/features/techdocs/getting-started.md).

## Configuration

### Custom Storage URL

TechDocs will try to read your documentation from the URL you have specified in the `techdocs storageUrl` in `app-config.yml`.

### TechDocs Storage Api

The default setup of TechDocs assumes your documentation is accessed by reading a page with the format of `<storageUrl>/<entity kind>/<entity namespace>/<entity name>`. If for some reason you want to change this it can be configured by implementing a new techdocs storage API. Do this by implementing TechDocsStorage found in `plugins/techdocs/src/api`. Add your new API to the application in `app/src/apis.ts` (or replace if it's already registered as an API).
