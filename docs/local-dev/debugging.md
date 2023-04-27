---
id: debugging
title: Debugging Backstage
description: How logging works and how to configure it
---

When configuring Backstage for the first time locally, or contributing new code changes,
it can be helpful to change the logging levels to better understand how the system is functioning.

Backstage uses the [Winston logging library](https://github.com/winstonjs/winston) and supports
[the `npm` logging levels](https://github.com/winstonjs/winston#logging-levels) such as
`warn`, `info` (the default), or `debug`.

The logging instance is also passed to plugins for them to expose information about
their processing as well.

Changing the level can be done by setting the `LOG_LEVEL` environment variable.

For example, to turn on debug logs when running the app locally, you can run:

```shell
LOG_LEVEL=debug yarn dev
```

The resulting log should now have more information available for debugging:

```text
[1] 2023-04-12T00:51:42.468Z catalog debug Skipped stitching of domain:default/artists, no changes type=plugin
[1] 2023-04-12T00:51:42.469Z catalog debug Skipped stitching of domain:default/playback, no changes type=plugin
[1] 2023-04-12T00:51:42.470Z catalog debug Processing system:default/podcast type=plugin
[1] 2023-04-12T00:51:42.470Z catalog debug Processing group:default/infrastructure type=plugin
[1] 2023-04-12T00:51:42.470Z catalog debug Processing group:default/boxoffice type=plugin
[1] 2023-04-12T00:51:42.470Z catalog debug Processing group:default/backstage type=plugin
[1] 2023-04-12T00:51:42.470Z catalog debug Processing group:default/team-a type=plugin
[1] 2023-04-12T00:51:42.519Z catalog debug Skipped stitching of group:default/acme-corp, no changes type=plugin
[1] 2023-04-12T00:51:42.520Z catalog debug Skipped stitching of group:default/backstage, no changes type=plugin
[1] 2023-04-12T00:51:42.521Z catalog debug Skipped stitching of group:default/boxoffice, no changes type=plugin
[1] 2023-04-12T00:51:42.523Z catalog debug Processing user:default/breanna.davison type=plugin
[1] 2023-04-12T00:51:42.524Z catalog debug Processing user:default/janelle.dawe type=plugin
[1] 2023-04-12T00:51:42.524Z catalog debug Processing user:default/nigel.manning type=plugin
[1] 2023-04-12T00:51:42.524Z catalog debug Processing user:default/guest type=plugin
[1] 2023-04-12T00:51:42.525Z catalog debug Processing group:default/team-b type=plugin
[1] 2023-04-12T00:51:44.057Z search info Starting collation of explore tools type=plugin
[1] 2023-04-12T00:51:44.095Z backstage info ::1 - - [12/Apr/2023:00:51:44 +0000] "GET /api/explore/tools HTTP/1.1" 200 - "-" "node-fetch/1.0 (+https://github.com/bitinn/node-fetch)" type=incomingRequest
[1] 2023-04-12T00:51:44.100Z backstage info ::1 - - [12/Apr/2023:00:51:44 +0000] "GET /api/catalog/entities?filter=metadata.annotations.backstage.io%2Ftechdocs-ref&fields=kind,namespace,metadata.annotations,metadata.name,metadata.title,metadata.namespace,spec.type,spec.lifecycle,relations&offset=0&limit=500 HTTP/1.1" 200 - "-" "node-fetch/1.0 (+https://github.com/bitinn/node-fetch)" type=incomingRequest
[1] 2023-04-12T00:51:44.104Z search info Finished collation of explore tools type=plugin
[1] 2023-04-12T00:51:44.118Z search info Collating documents for tools succeeded type=plugin documentType=tools
[1] 2023-04-12T00:51:44.119Z backstage debug task: search_index_tools will next occur around 2023-04-11T21:01:44.118-04:00 type=taskManager task=search_index_tools
```
