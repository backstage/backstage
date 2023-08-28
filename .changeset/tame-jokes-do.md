---
'@backstage/plugin-scaffolder-backend': minor
---

Improved the `parseEntityRef` Scaffolder filter by introducing the ability for users to provide default kind and/or namespace values. The filter now takes
2 arguments, similarly to the original [parseEntityRef](<(https://github.com/backstage/backstage/blob/v1.17.2/packages/catalog-model/src/entity/ref.ts#L77)>):

1. Entity reference
2. [Context optional object](https://github.com/backstage/backstage/blob/v1.17.2/packages/catalog-model/src/entity/ref.ts#L77)

Check out the following examples:

- `${{ parameters.entityRef | parseEntityRef | pick('name') }}`
- `${{ parameters.entityRef | parseEntityRef({ defaultKind:"group", defaultNamespace:"default" }) | pick('name') }}`
- `${{ parameters.entityRef | parseEntityRef({ defaultKind:"group" }) | pick('name') }}`
