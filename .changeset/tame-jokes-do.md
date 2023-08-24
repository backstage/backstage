---
'@backstage/plugin-scaffolder-backend': minor
---

Improved the `parseEntityRef` Scaffolder filter by introducing the ability for users to provide default kind and namespace values. The filter now takes
3 arguments:

1. Entity reference
2. (Optional) Default kind
3. (Optional) Default namespace

So you can now provide default `kind` and/or `namespace`. Check out the following examples:

- Without default values: `${{ parameters.entity | parseEntityRef | pick('name') }}`
- With default kind: `${{ parameters.entity | parseEntityRef('group') | pick('name') }}`
- With default kind and namespace: `${{ parameters.entity | parseEntityRef('group', 'another-namespace') | pick('name') }}`
- With default namespace:
  - `${{ parameters.entity | parseEntityRef(null, 'another-namespace') | pick('name') }}`
  - `${{ parameters.entity | parseEntityRef(undefined, 'another-namespace') | pick('name') }}`
  - `${{ parameters.entity | parseEntityRef('', 'another-namespace') | pick('name') }}`
