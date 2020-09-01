---
id: software-catalog-configuration
title: Catalog Configuration
---

## Static Location Configuration

To enable declarative catalog setups, it is possible to add locations to the
catalog via [static configuration](../../conf/index.md). Locations are added to
the catalog under the `catalog.locations` key, for example:

```yaml
catalog:
  locations:
    - type: github
      target: https://github.com/spotify/backstage/blob/master/packages/catalog-model/examples/artist-lookup-component.yaml
```

The locations added through static configuration can not be removed through the
catalog locations API. To remove the locations, you have to remove them from the
configuration.

## Catalog Rules

By default the catalog will only allow ingestion of entities with the kind
`Component` and `API`. In order to allow entities of other kinds to be added,
you need to add rules to the catalog. Rules are added either in a separate
`catalog.rules` key, or added to statically configured locations.

For example, given the following configuration:

```yaml
catalog:
  rules:
    - allow: [Component, API, Template]

  locations:
    - type: github
      target: https://github.com/org/example/blob/master/org-data.yaml
      allow: [Group]
```

We are able to add entities of kind `Component`, `API`, or `Template` from any
location, and `Group` entities from the `org-data.yaml`, which will also be read
as statically configured location.

Note that if the `catalog.rules` key is present it will replace the default
value, meaning that you need to add rules for `Component` and `API` kinds if you
want those to be allowed.

The following configuration will reject any kind of entities from being added to
the catalog:

```yaml
catalog:
  rules: []
```
