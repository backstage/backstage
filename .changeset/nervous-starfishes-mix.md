---
'@backstage/plugin-cloud-carbon-footprint': minor
'@backstage/plugin-cloud-carbon-footprint-backend': minor
---

The plugin is built on the open source project [Cloud Carbon Footprint by ThoughtWorks](https://github.com/cloud-carbon-footprint/cloud-carbon-footprint)

**Cloud Carbon Footprint Plugin:** Add a frontend plugin to display a Cloud Carbon Footprint Plugin. This page relies heavily on components from the `@cloud-carbon-footprint/client` & will try to display the same information as the standalone application.

TODO: Quick "Get started" guide

**Cloud Carbon Footprint Backend Plugin:** Add a backend plugin for querying the emissions through the API. This plugin is just a small wrapper around the `@cloud-carbon-footprint/api`. It will create & use an instance of the `@cloud-carbon-footprint/api` express router by importing it from the project.
