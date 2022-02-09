---
'@backstage/create-app': patch
---

**BREAKING:** Updated `knex` to major version 1, which also implies changing out
the underlying `sqlite` implementation.

The old `sqlite3` NPM library has been abandoned by its maintainers, which has
led to unhandled security reports and other issues. Therefore, in the `knex` 1.x
release line they have instead switched over to the [`@vscode/sqlite3`
library](https://github.com/microsoft/vscode-node-sqlite3) by default, which is
actively maintained by Microsoft.

This means that as you update to this version of Backstage, there are two
breaking changes that you will have to address in your own repository:

## Bumping `knex` itself

All `package.json` files of your repo that used to depend on a 0.x version of
`knex`, should now be updated to depend on the 1.x release line. This applies in
particular to `packages/backend`, but may also occur in backend plugins or
libraries.

```diff
-    "knex": "^0.95.1",
+    "knex": "^1.0.2",
```

Almost all existing database code will continue to function without modification
after this bump. The only significant difference that we discovered in the main
repo, is that the `alter()` function had a slightly different signature in
migration files. It now accepts an object with `alterType` and `alterNullable`
fields that clarify a previous grey area such that the intent of the alteration
is made explicit. This is caught by `tsc` and your editor if you are using the
`@ts-check` and `@param` syntax in your migration files
([example](https://github.com/backstage/backstage/blob/master/plugins/catalog-backend/migrations/20220116144621_remove_legacy.js#L17)),
which we strongly recommend.

See the [`knex` documentation](https://knexjs.org/#Schema-alter) for more
information about the `alter` syntax.

Also see the [`knex` changelog](https://knexjs.org/#changelog) for information
about breaking changes in the 1.x line; if you are using `RETURNING` you may
want to make some additional modifications in your code.

## Switching out `sqlite3`

All `package.json` files of your repo that used to depend on `sqlite3`, should
now be updated to depend on `@vscode/sqlite3`. This applies in particular to
`packages/backend`, but may also occur in backend plugins or libraries.

```diff
-    "sqlite3": "^5.0.1",
+    "@vscode/sqlite3": "^5.0.7",
```

These should be functionally equivalent, except that the new library will have
addressed some long standing problems with old transitive dependencies etc.
