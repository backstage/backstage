---
'@backstage/plugin-catalog-backend': minor
---

Write relations directly as part of batch add / update of entities.

Slight change of the `CommonDatabase` contract:

## `addEntity` removed

This method was unused by the core, and rendered unnecessary when `addEntities`
exists.

If you were a user of `addEntity`, please call `addEntities` instead, with an
array of one element.

## `DbEntityRequest` has a new field `relations`

This is the structure that is passed to `addEntities` and `updateEntity`. It
used to be the case that you needed to call `setRelations` separately, but now
this instead happens directly when you call `addEntities` or `updateEntity`.

If you were using `addEntities` or `updateEntity` directly, please adapt your
code to add the `relations` array to each request. If you were calling
`setRelations` separately next to these methods, you no longer need to do so,
after adding the relations to the `DbEntityRequest`s.
