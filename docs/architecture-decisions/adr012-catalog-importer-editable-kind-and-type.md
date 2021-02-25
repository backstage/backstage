---
id: adrs-adr012
title: ADR012: Catalog importer editable kind and type
description: Architecture Decision Record (ADR) log on which fields are to be made chosable by the catalog importer on repositories
---

## Background

Through the catalog importer plugin, users are able to register new entities by
providing the URL of a git repository. If the repository does not yet contain a
`catalog-info.yaml` file, the plugin allows the user to fill a form on Backstage
to open a new Pull Request which will add a generated `catalog-info.yaml` file.

In this Architecture Decision Record, we choose how the user can influence
through the form the `kind` as well as the `type` field in the generated
`catalog-info.yaml` file.

## Decision

### Kind

For the `kind` field, there are four options:

- Not making this editable and hard code the fact that all created entities are
  components
- Allowing only certain types of kinds which make sense in the use-case of
  registering a git repository : components and templates
- Allowing all core kinds (component, API, domain, user...)
- Suggesting all core kinds but allowing the user to type anything in the field

We recommend "Option 1". Indeed, other types of entities would require providing
additional required fields in the `catalog-info.yaml` file (for instance,
templates require the templater as well as the schema information). This would
require adding features to the catalog importer which already exist in the
scaffolder.

However, we rename the usage of the "component" term on the page to refer to the
more generic term, "entity" in order to plan for future evolutions.

### Type

For the `type` field, we recommend allowing the selection of either `website`,
`service`, `library`, `documentation` and `other` which make sense both for
components and templates and are all present in the catalog tabs. By default,
`other` will be selected.
