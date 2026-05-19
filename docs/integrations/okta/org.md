---
id: org
title: Okta Organizational Data
sidebar_label: Org Data
description: Ingesting organizational data from Okta into Backstage
---

The Backstage catalog can be set up to ingest organizational data — users and
groups — directly from Okta. The result is a hierarchy of
[`User`](../../features/software-catalog/descriptor-format.md#kind-user) and
[`Group`](../../features/software-catalog/descriptor-format.md#kind-group) kind
entities that mirror your Okta organization.

This integration is provided by the community-maintained
[`@roadiehq/catalog-backend-module-okta`](https://github.com/RoadieHQ/roadie-backstage-plugins/tree/main/plugins/backend/catalog-backend-module-okta)
plugin, owned and maintained by [Roadie](https://roadie.io/).

## Installation and configuration

For setup instructions, including authentication options (API token and OAuth
2.0), user/group filtering, custom naming strategies, and entity transformers,
see the
[plugin documentation maintained by Roadie](https://github.com/RoadieHQ/roadie-backstage-plugins/tree/main/plugins/backend/catalog-backend-module-okta).
