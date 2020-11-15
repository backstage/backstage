---
'@backstage/backend-common': minor
'@backstage/cli': minor
'@backstage/config-loader': minor
---

Added support for loading and validating configuration schema, as well as declaring config visibility through schema.

The new `loadConfigSchema` function exported by `@backstage/config-loader` allows for the collection and merging of configuration schemas from all nearby dependencies of the project.

Configuration schema is declared using the following JSONSchema meta schema, which is based on draft07: https://backstage.io/schema/config-v1. The only difference to the draft07 schema is the custom `visibility` keyword, which is used to indicate whether the given config value should be visible in the frontend or not. The possible values are `frontend`, `backend`, `secret`, where `backend` is the default. A visibility of `secret` has the same scope at runtime, but it will be treated with more care in certain contexts, and defining both `frontend` and `secret` for the same value in two different schemas will result in an error during schema merging.

Packages that wish to contribute configuration schema should declare it in a root "configSchema" field in `package.json`. The field can either contain an inlined JSON schema, or a relative path to a schema file. Schema files can be declared in either `.json` or `.d.ts`.

TypeScript configuration schema files should export a single `Config` type, for example:

```ts
export interface Config {
  app: {
    /**
     * Frontend root URL
     * @visibility frontend
     */
    baseUrl: string;
  };
}
```
