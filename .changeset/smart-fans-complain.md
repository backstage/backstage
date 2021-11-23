---
'@backstage/plugin-catalog-backend': minor
---

**BREAKING** EntitiesSearchFilter fields have changed.

EntitiesSearchFilter now has only two fields: `key` and `value`. The `matchValueIn` and `matchValueExists` fields are no longer are supported. Previous filters written using the `matchValueIn` and `matchValueExists` fields can be rewritten as follows:

Filtering by existence of key only:

```diff
  filter: {
    {
      key: 'abc',
-     matchValueExists: true,
    },
  }
```

Filtering by key and values:

```diff
  filter: {
    {
      key: 'abc',
-     matchValueExists: true,
-     matchValueIn: ['xyz'],
+     values: ['xyz'],
    },
  }
```

Negation of filters can now be achieved through a `not` object:

```
filter: {
  not: {
    key: 'abc',
    values: ['xyz'],
  },
}
```
