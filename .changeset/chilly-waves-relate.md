---
'@backstage/cli': minor
---

Switched the default module resolution to `bundler` and the `module` setting to `ES2020`.

You may need to bump some dependencies as part of this change and fix imports in code. The most common source of this is that type checking will now consider the `exports` field in `package.json` when resolving imports. This in turn can break older versions of packages that had incompatible `exports` fields. Generally these issues will have already been fixed in the upstream packages.

You might be tempted to use `--skipLibCheck` to hide issues due to this change, but it will weaken the type safety of your project. If you run into a large number of issues and want to keep the old behavior, you can reset the `moduleResolution` and `module` settings your own `tsconfig.json` file to `node` and `ESNext` respectively. But keep in mind that the `node` option will be removed in future versions of TypeScript.

A future version of Backstage will make these new settings mandatory, as we move to rely on the `exports` field for type resolution in packages, rather than the `typesVersions` field.
