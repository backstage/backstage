---
'@backstage/catalog-model': minor
'@backstage/plugin-catalog-backend': minor
---

**BREAKING**: Removed the `target` property from `EntityRelation`. This field has been replaced by `targetRef`.
This means that `target: { name: 'team-a', kind: 'group', namespace: 'default' }` is now replaced with `targetRef: 'group:default/team-a'` in entity relations.
