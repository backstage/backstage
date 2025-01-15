---
'@backstage/cli': minor
---

**BREAKING**: Add support for native ESM in Node.js code. This changes the behavior of dynamic import expressions in Node.js code. Typically this can be fixed by replacing `import(...)` with `require(...)`, with an `as typeof import(...)` cast if needed for types. This is because dynamic imports will no longer be transformed to `require(...)` calls, but instead be left as-is. This in turn allows you to load ESM modules from CommonJS code using `import(...)`.

This change adds support for the following in Node.js packages, across type checking, package builds, runtime transforms and Jest tests:

- Dynamic imports that load ESM modules from CommonJS code.
- Both `.mjs` and `.mts` files as explicit ESM files, as well as `.cjs` and `.cts` as explicit CommonJS files.
- Support for the `"type": "module"` field in `package.json` to indicate that the package is an ESM package.

There are a few caveats to be aware of:

- To enable support for native ESM in tests, you need to run the tests with the `--experimental-vm-modules` flag enabled, typically via `NODE_OPTIONS='--experimental-vm-modules'`.
- Declaring a package as `"type": "module"` in `package.json` is supported, but in tests it will cause all local transitive dependencies to also be treated as ESM, regardless of whether they declare `"type": "module"` or not.
- Node.js has an [ESM interoperability layer with CommonJS](https://nodejs.org/docs/latest-v22.x/api/esm.html#interoperability-with-commonjs) that allows for imports from ESM to identify named exports in CommonJS packages. This interoperability layer is **only** enabled when importing packages with a `.cts` or `.cjs` extension. This is because the interoperability layer is not fully compatible with the NPM ecosystem, and would break package if it was enabled for `.js` files.
- Dynamic imports of CommonJS packages will vary in shape depending on the runtime, i.e. test vs local development, etc. It is therefore recommended to avoid dynamic imports of CommonJS packages and instead use `require`, or to use the explicit CommonJS extensions as mentioned above. If you do need to dynamically import CommonJS packages, avoid using `default` exports, as the shape of them vary across different environments and you would otherwise need to manually unwrap the import based on the shape of the module object.
