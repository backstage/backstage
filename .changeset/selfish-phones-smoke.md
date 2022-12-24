---
'@backstage/plugin-scaffolder': minor
'@backstage/plugin-scaffolder-backend-module-cookiecutter': patch
'@backstage/plugin-scaffolder-backend-module-rails': patch
'@backstage/plugin-scaffolder-backend-module-yeoman': patch
'@backstage/plugin-scaffolder-backend': patch
---

Added `catalogFilter` field to OwnerPicker and EntityPicker components to support filtering options by any field(s) of an entity.

The `allowedKinds` field has been deprecated. Use `catalogFilter` instead. This field allows users to specify a filter on the shape of [EntityFilterQuery](https://github.com/backstage/backstage/blob/774c42003782121d3d6b2aa5f2865d53370c160e/packages/catalog-client/src/types/api.ts#L74), which can be passed into the CatalogClient. See examples below:

- Get all entities of kind `Group`

  ```yaml
  owner:
    title: Owner
    type: string
    description: Owner of the component
    ui:field: OwnerPicker
    ui:options:
      catalogFilter:
        - kind: Group
  ```

- Get entities of kind `Group` and spec.type `team`
  ```yaml
  owner:
    title: Owner
    type: string
    description: Owner of the component
    ui:field: OwnerPicker
    ui:options:
      catalogFilter:
        - kind: Group
          spec.type: team
  ```
