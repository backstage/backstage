---
id: linking-local-packages
title: Linking in Local Packages
description: How to link in other local packages into your Backstage monorepo
---

It can often be useful to try out changes to the packages in the main Backstage
repo within your own app. For example if you want to make modifications to
`@backstage/core-plugin-api` and try them out in your app.

To link in external packages, add them to your `package.json` and `lerna.json`
workspace paths. These can be either relative or absolute paths with or without
globs. For example:

```json
"packages": [
  "packages/*",
  "plugins/*",
  "../backstage/packages/core-plugin-api", // New path added to work on @backstage/core-plugin-api
],
```

Then reinstall packages to make yarn set up symlinks:

```bash
yarn install
```

With this in place you can now modify the `@backstage/core-plugin-api` package
within the main repo, and have those changes be reflected and tested in your
app. Simply run your app using `yarn dev` (or `yarn start` for just frontend) as
normal.

Note that for backend packages you need to make sure that linked packages are
not dependencies of any non-linked package. If you for example want to work on
`@backstage/backend-common`, you need to also link in other backend plugins and
packages that depend on `@backstage/backend-common`, or temporarily disable
those plugins in your backend. This is because the transformation of backend
module tree stops whenever a non-local package is encountered, and from that
point node will `require` packages directly for that entire module subtree.

Type checking can also have issues when linking in external packages, since the
linked in packages will use the types in the external project and dependency
version mismatches between the two projects may cause errors. To fix any of
those errors you need to sync versions of the dependencies in the two projects.
A simple way to do this can be to copy over `yarn.lock` from the external
project and run `yarn install`, although this is quite intrusive and can cause
other issues in existing projects, so use this method with care. It can often be
best to simply ignore the type errors, as app serving will work just fine
anyway.

Another issue with type checking is that the incremental type cache doesn't
invalidate correctly for the linked in packages, causing type checking to not
reflect changes made to types. You can work around this by either setting
`compilerOptions.incremental = false` in `tsconfig.json`, or by deleting the
types cache folder `dist-types` before running `yarn tsc`.
