---
id: org
title: Keycloak Organizational Data
sidebar_label: Org Data
description: Ingesting organizational data from Keycloak into Backstage
---

The Backstage catalog can be set up to ingest organizational data — users and
groups — directly from Keycloak. The result is a hierarchy of
[`User`](../../features/software-catalog/descriptor-format.md#kind-user) and
[`Group`](../../features/software-catalog/descriptor-format.md#kind-group) kind
entities that mirror your Keycloak realm.

This integration is provided by the community-maintained
[`@backstage-community/plugin-catalog-backend-module-keycloak`](https://github.com/backstage/community-plugins/tree/main/workspaces/keycloak/plugins/catalog-backend-module-keycloak)
plugin.

Ingesting users and groups from Keycloak pairs well with Keycloak
authentication, where the imported User entities allow sign-in resolvers to
match the signed-in user. See the
[Keycloak authentication provider](../../auth/keycloak/provider.md)
documentation for how to set that up.

## Installation and configuration

For setup instructions, including Keycloak client permissions, schedule
configuration, and user and group transformers, see the
[plugin documentation](https://github.com/backstage/community-plugins/tree/main/workspaces/keycloak/plugins/catalog-backend-module-keycloak).
