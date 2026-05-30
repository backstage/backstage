---
'@backstage/plugin-devtools': patch
---

Migrated the `InfoDependenciesTable` component from Material UI / `@backstage/core-components` `Table` to the new Backstage UI library. Behavior is preserved: name/versions columns, name-ascending initial sort, page sizes of 15/30/100, and substring filtering across both columns.
