---
id: linking-local-packages
title: Linking in Local Packages
description: How to link in other local packages into your Backstage monorepo
---

## Why?

If you are looking to make changes within the core Backstage repository and test
those changes within your Backstage application, you will need to link the two
together:

```text
~/backstage                // cloned from Github
~/my-backstage-application // generated using npx
```

For example, you might want to make modifications to `@backstage/core-plugin-api` and try them out in your company's
instance of Backstage.

## Linking in Backstage NPM Packages

To link in external packages, add them to your root `package.json` and `lerna.json`
`"workspace"` paths. These can be either relative or absolute paths with or without
globs.

For example:

```json title="/lerna.json"
...
"packages": [
  "packages/*",
  "plugins/*",
  "../backstage/packages/core-plugin-api", // New path added to work on @backstage/core-plugin-api
],
...
```

```json title="/package.json"
...
"workspaces": {
  "packages": [
    "packages/*",
    "plugins/*",
    "../backstage/packages/core-plugin-api", // New path added to work on @backstage/core-plugin-api
  ],
}
...
```

Now reinstall all packages from the root to make yarn set up symlinks from your application to the core Backstage clone:

```bash
yarn install
```

## Making Backstage Changes

With this in place you can now modify the `@backstage/core-plugin-api` package
within the main repo, and have those changes be reflected and tested in your
app. Simply run your app using `yarn dev` (or `yarn start` for just frontend) as
normal.

## Common Problems

### Backend Issues

For backend packages you need to make sure that linked packages are
not dependencies of any non-linked package. If you for example want to work on
`@backstage/backend-common`, you need to also link in other backend plugins and
packages that depend on `@backstage/backend-common`, or temporarily disable
those plugins in your backend. This is because the transformation of backend
module tree stops whenever a non-local package is encountered, and from that
point node will `require` packages directly for that entire module subtree.

### Typescript Issues

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

### Version Issues

While `yarn install` might not error, it does not mean that the linking worked properly.
You will know that linking worked properly when:

1. Your Backstage application root `/node_modules/@backstage/[some package]` is a symlink
2. Your Backstage application `/packages/app/node_modules` and `/packages/backend/node_modules` does
   not contain the package you are attempting to link!

If you see Yarn continuing to download the package you are trying to link from NPM, you might need to be
explicit in your `package.json` version so that it exactly matches what you have in the cloned Backstage
repository on your machine. For example, if you have cloned `/plugins/catalog` with version
`"version": "1.19.1-next.1"` you will need to be explicit in your application to point to `"1.19.1-next.1"`.
