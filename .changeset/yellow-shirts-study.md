---
'@backstage/catalog-model': minor
---

**BREAKING**: Removed the `target` property from `EntityRelation`, use `targetRef` instead.

This means `target: { name: 'team-a', kind: 'group', namespace: 'default' }` is now replaced with `targetRef: 'group:default/team-a'` in entity relations.
