# @backstage/openapi-utils

## Summary

This package is meant to provide a typed Express router for an OpenAPI spec. Based on the [`oatx`](https://github.com/varanauskas/oatx) library and adapted to override Express values.

## Getting Started

### Configuration

1. Run `yarn --cwd <package-dir> backstage-cli package schema openapi generate` to translate your `src/schema/openapi.yaml` to a new Typescript file in `src/schema/openapi.generated.ts`. The command will try to execute both a lint and prettier step on the generated file, where applicable.

2. In your plugin's `src/service/createRouter.ts`,

```ts
import { createOpenApiRouter } from '../schema/openapi.generated';
// ...
export function createRouter() {
  const router = createOpenApiRouter();
  // add routes to router, it's just an express router.
  return router;
}
```

3. Add `@backstage/backend-openapi-utils` to your `package.json`'s `dependencies`.

Why do I need to add this to `dependencies`? If you check the `src/schema/openapi.generated.ts` file, we're creating a router stub for you with the `@backstage/backend-openapi-utils` package.

### Customization

If the out of the box `router` doesn't work, you can do the following,

```ts
import { createOpenApiRouter } from '../schema/openapi.generated';
// ...
export function createRouter() {
  // See https://github.com/cdimascio/express-openapi-validator/wiki/Documentation for available options.
  const router = createOpenApiRouter(validatorOptions);
  // add routes to router, it's just an express router.
  return router;
}
```

If you need even more control -- say for example you wanted to update the spec at runtime -- you can do the following,

```ts
import { spec } from '../schema/openapi.generated';
import { createValidatedOpenApiRouter } from '@backstage/backend-openapi-utils';
// ...
export function createRouter() {
  // Update the spec here.
  const newSpec = { ...spec, myproperty123: 123 };

  // See https://github.com/cdimascio/express-openapi-validator/wiki/Documentation for available options.
  const router = createValidatedOpenApiRouter<typeof newSpec>(
    newSpec,
    validatorOptions,
  );
  // add routes to router, it's just an express router.
  return router;
}
```

## INTERNAL

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

### Response Validation

This is a murky ground and something that will take a while to gain adoption. For now, keep responses in the spec and at the type level, but will need to work to drive adoption of response validation.

### Common Error Format

With the new `createRouter` method, we can start to control error response formats for input and coercion errors.
