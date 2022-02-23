---
'@backstage/catalog-model': minor
---

**BREAKING**: Added `EntityRelation.targetRef` (a string form entity ref), and
deprecated `EntityRelation.target` (a kind + namespace + name object). This
aligns the type with our goal of using string form entity refs more coherently.
There will be a period of time when both fields need to be present, which may in
particular affect your tests which now have to list both the string form and the
object form side by side.

```diff
 const mockEntity: Entity = {
   kind: 'Component',
   relations: [
     {
       type: RELATION_MEMBER_OF,
+      targetRef: 'component:default/foo',
       target: { kind: 'component', namespace: 'default', name: 'foo' }
     }
   ]
```

The `target` field will be entirely removed from this type in a future release.
