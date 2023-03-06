# @backstage/plugin-openapi-router

## Purpose

This package is meant to provide a typed Express router for an OpenAPI spec. Specs must be converted to JSON and then copied to a Typescript file.

## Getting Started

### Configuration

In your plugin's `schema/openapi.ts`,

```ts
export default {
  // If your spec is in YAML, convert it to JSON, then paste it here.
  // If your spec is in JSON, just paste it here.
} as const;
```

In your plugin's `service/createRouter.ts`,

```ts
import {ApiRouter} from `@backstage/plugin-openapi-router`;
import spec from './schema/openapi'
...

export function createRouter(){
    const router = Router() as ApiRouter<typeof spec>
}
```

### Limitations

1. OpenAPI definitions must be converted to Typescript files
   From [#32063](https://github.com/microsoft/TypeScript/issues/32063), we cannot import JSON `as const`. If we could, this would allow us to force all specs to be JSON and then just import from a spec.
2. `as const` makes all fields `readonly`
   To ensure a good DX of using a simple imported JSON spec, we want to remove any type issues between `readonly` arrays and mutable arrays. Typescript does not allow them to be compared, so converting all imports from the `openapi3-ts` library to `readonly` is important.

```tsx
...
Router() as ApiRouter<typeof spec>
...
```

we need to type all internals of this package as `Immutable<T>`.

## Future Work

### Automatic generation of the `schema/openapi` file

Ideally, this would be automatically generated on `openapi.yaml` updates (like a Webpack plugin), but could also be a CLI command.

### Runtime validation

Using a package like [`express-openapi-validator`](https://www.npmjs.com/package/express-openapi-validator), would allow us to remove [validation of request bodies with `AJV`](https://github.com/backstage/backstage/blob/master/plugins/catalog-backend/src/service/util.ts#L58).

### PR-time verification.

1. Verify that Typescript file matches the spec file.
2. Verify that spec file matches the router input/output.
