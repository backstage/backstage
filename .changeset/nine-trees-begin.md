---
'@backstage/cli': patch
---

Introduced a new `--experimental-type-build` option to the various package build commands. This option switches the type definition build to be executed using API Extractor rather than a `rollup` plugin. In order for this experimental switch to work, you must also have `@microsoft/api-extractor` installed within your project, as it is an optional peer dependency.

The biggest difference between the existing mode and the experimental one is that rather than just building a single `dist/index.d.ts` file, API Extractor will output `index.d.ts`, `index.beta.d.ts`, and `index.alpha.d.ts`, all in the `dist` directory. Each of these files will have exports from more unstable release stages stripped, meaning that `index.d.ts` will omit all exports marked with `@alpha` or `@beta`, while `index.beta.d.ts` will omit all exports marked with `@alpha`.

In addition, the `prepack` command now has support for `alphaTypes` and `betaTypes` fields in the `publishConfig` of `package.json`. These optional fields can be pointed to `dist/types.alpha.d.ts` and `dist/types.beta.d.ts` respectively, which will cause `<name>/alpha` and `<name>/beta` entry points to be generated for the package. See the [`@backstage/catalog-model`](https://github.com/backstage/backstage/blob/master/packages/catalog-model/package.json) package for an example of how this can be used in practice.
