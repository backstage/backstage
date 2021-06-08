---
'@backstage/create-app': patch
---

Updated the `@gitbeaker/node` dependency past the broken one without a `dist` folder.

See [this issue](https://github.com/jdalrymple/gitbeaker/issues/1861) for more details.

If you get build errors that look like the following in your Backstage instance, you may want to also bump all of your `@gitbeaker/*` dependencies to at least `^30.2.0`.

```
node:internal/modules/cjs/loader:356
      throw err;
      ^

Error: Cannot find module '/path/to/project/node_modules/@gitbeaker/node/dist/index.js'. Please verify that the package.json has a valid "main" entry
    at tryPackage (node:internal/modules/cjs/loader:348:19)
    at Function.Module._findPath (node:internal/modules/cjs/loader:561:18)
    at Function.Module._resolveFilename (node:internal/modules/cjs/loader:926:27)
    at Function.Module._load (node:internal/modules/cjs/loader:773:27)
    at Module.require (node:internal/modules/cjs/loader:1012:19)
    at require (node:internal/modules/cjs/helpers:93:18)
    at Object.<anonymous> (/path/to/project/test.js:4:18)
    at Module._compile (node:internal/modules/cjs/loader:1108:14)
    at Object.Module._extensions..js (node:internal/modules/cjs/loader:1137:10)
    at Module.load (node:internal/modules/cjs/loader:988:32) {
  code: 'MODULE_NOT_FOUND',
  path: '/path/to/project/node_modules/@gitbeaker/node/package.json',
  requestPath: '@gitbeaker/node'
}
```

you could also consider pinning the version to an older one in your `package.json` either root or `packages/backend/package.json`, before the breakage occurred.

```json
"resolutions": {
    "**/@gitbeaker/node": "29.2.4",
    "**/@gitbeaker/core": "29.2.4",
    "**/@gitbeaker/requester-utils": "29.2.4"
}
```

Be aware that this is only required short term until we can release our updated versions of `@backstage/plugin-scaffolder-backend`.
