---
'@backstage/catalog-model': patch
---

Updated `parseEntityRef` to allow `:` and `/` in the entity name. For example, parsing `'component:default/foo:bar'` will result in the name `'foo:bar'`.

Note that only parsing `'foo:bar'` itself will result in the name `'bar'` and the entity kind `'foo'`, meaning this is a particularly nasty trap for user defined entity references. For this reason it is strongly discouraged to use names that contain these characters, and the catalog model does not allow it by default. However, this change now makes is possible to use these names if the default catalog validation is replaced, and in particular a high level of automation of the catalog population can limit issues that it might otherwise cause.
