---
id: explore-app
sidebar_label: 003 - Explore the portal
title: 003 - Explore the portal
description: Explore the features and example data in a generated Backstage app
---

Audience: Developers and administrators

In this step, you will explore the stock portal without changing its
configuration. Keep the app running with `yarn start` while you follow the
steps.

## Explore the Software Catalog

1. Open [http://localhost:3000](http://localhost:3000). The generated app opens
   the [Software Catalog](../../features/software-catalog/index.md) as its home
   page.

1. Find these [entity kinds](../../features/software-catalog/system-model.md) in
   the catalog:

   - **example-website**, a Component.
   - **examples**, a System.
   - **example-grpc-api**, an API.

1. Open **example-website** and inspect its relationships. The component belongs
   to the **examples** system and provides **example-grpc-api**.

These entities are loaded from `examples/entities.yaml`. They demonstrate the
[catalog descriptor format](../../features/software-catalog/descriptor-format.md)
for ownership, lifecycle, APIs, and relationships.

## Search the catalog

1. Open **Search** in the sidebar.
1. Search for `example-website`.
1. Open the matching catalog result.

The generated backend includes the [Search plugin](../../features/search/getting-started.md)
and a [catalog search collator](../../features/search/collators.md), so the
example entities are searchable without additional configuration.

## Inspect the software template

1. Open **Create** in the sidebar.
1. Find **Example Node.js Template**.
1. Open the template and review its input fields, but do not run it.

The [software template](../../features/software-templates/index.md) is loaded
from `examples/template/template.yaml`. Running it publishes a repository to
GitHub, which requires a configured
[GitHub integration](../../integrations/github/locations.md). You will configure
integrations when adapting Backstage for your organization, not during this
stock-app tutorial.

## Check your local identity and preferences

Open **Settings** in the sidebar. The profile identifies you as the guest user
because the generated app uses the
[guest authentication provider](../../auth/guest/provider.md) for local
development. You can also switch between the built-in light and dark themes.

Production deployments must replace guest authentication with an appropriate
[identity provider](../../auth/index.md). The
[Deployment Golden Path](../deployment/index.md) covers that requirement.

## Verify your understanding

Before continuing, confirm that you can:

- Find the example component, system, and API in the catalog.
- Follow the relationships between those entities.
- Find a catalog entity through Search.
- Locate the example software template.
- Identify the current guest user in Settings.

## Next step

Continue to [understand the generated project](./004-understand-project.md).
