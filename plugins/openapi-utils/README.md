# @backstage/openapi-utils

## Summary

This package is meant to provide a typed Express router for an OpenAPI spec. Based on the [oatx](https://github.com/varanauskas/oatx) library and adapted to override Express values.

## Getting Started

### Configuration

1. Run `yarn --cwd <package-dir> backstage-cli package schema:openapi:generate` to translate your `openapi.yaml` to a new Typescript file in `schema/openapi.ts`. In the case of projects that require linting + a license header, you will need to do this manually.

2. In your plugin's `src/service/createRouter.ts`,

```ts
import {ApiRouter} from `@backstage/backend-openapi-utils`;
import spec from '../../schema/openapi'
...

export function createRouter(){
    const router = Router() as ApiRouter<typeof spec>;
    ...
}
```

### Limitations

1. `as const` makes all fields `readonly`
   To ensure a good DX of using a simple imported JSON spec, we want to remove any type issues between `readonly` arrays and mutable arrays. Typescript does not allow them to be compared, so converting all imports from the `openapi3-ts` library to `readonly` is important. This is achieved through the `ImmutableObject` type in `types/immutable.ts`.

```ts
...
// We want an interface like this,
Router() as ApiRouter<typeof spec>

// Not an interface like this,
Router() as ApiRouter<DeepWriteable<typeof spec>>
...
```

## Future Work

### Runtime validation

Using a package like [`express-openapi-validator`](https://www.npmjs.com/package/express-openapi-validator), would allow us to remove [validation of request bodies with `AJV`](https://github.com/backstage/backstage/blob/master/plugins/catalog-backend/src/service/util.ts#L58). However, `AJV` currently doesn't have support for OpenAPI 3.1 and `express-openapi-validator` enforces full URL matching for paths, meaning it cannot be mounted at the router level.
