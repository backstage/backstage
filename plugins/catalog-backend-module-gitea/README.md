# Catalog Backend Module for Gitea

This is an extension module to the plugin-catalog-backend plugin, providing extensions targeted at Gitea integrations.

## Getting started

See [Backstage documentation](https://backstage.io/docs/integrations/gitea/discovery)
for details on how to install and configure the plugin.

## Event support

This module subscribes to Gitea webhook events on the `gitea` topic
and translates them into generic catalog SCM events:

- `push` events targeting the default branch translate file-level changes to
  `.yaml`/`.yml` files into fine-grained location events.
- `repository` events for created, deleted, and renamed repositories translate
  into the corresponding repository events.

To receive Gitea webhook events, install and configure
[`@backstage/plugin-events-backend-module-gitea`](https://github.com/backstage/backstage/tree/master/plugins/events-backend-module-gitea),
which registers a signature-validated HTTP ingress for the `gitea` topic.
