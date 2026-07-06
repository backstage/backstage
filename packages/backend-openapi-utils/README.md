# @backstage/backend-openapi-utils

## Summary

This package is meant to provide a typed Express router for an OpenAPI spec. Based on the [`oatx`](https://github.com/varanauskas/oatx) library and adapted to override Express values.

Only supports OpenAPI 3.1 specifications.

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

## Permissions

Operations can declare an authorization requirement directly in the spec using
the `x-backstage-permissions` extension. When the router is created with the
permissions services (see below), a middleware reads this extension and enforces
the permission before the route handler runs.

```yaml
paths:
  /locations/{id}:
    get:
      operationId: GetLocation
      x-backstage-permissions:
        # The name of the permission to enforce. This must be registered with
        # the permissions registry (see the note below).
        permission: catalog.location.read
        # Optional. When the permission is a resource permission, describes where
        # to read the resource reference from. Omit for basic permissions.
        resourceRef:
          from: path # or `query`
          param: id
        # Optional. Controls the response when authorization is denied. Defaults
        # to a 403. Use `{ statusCode: 404 }` to hide the resource, or provide a
        # custom `body` (with an optional `statusCode`) to return a fallback
        # response such as an empty list.
        onDeny:
          statusCode: 404
        # Optional. When true, the middleware only verifies that the permission
        # is registered and leaves the actual authorization to the route handler.
        validateManually: false
```

To enable enforcement, pass the permissions services when creating the router:

```ts
import { coreServices } from '@backstage/backend-plugin-api';
import { createOpenApiRouter } from '../schema/openapi.generated';
// ...
const router = await createOpenApiRouter(validatorOptions, {
  permissions,
  permissionsRegistry,
  httpAuth,
  logger,
});
```

If the services are omitted, the middleware is not wired up and the
`x-backstage-permissions` extensions are ignored.

> **Every permission referenced by an `x-backstage-permissions` extension must be
> registered with the `permissionsRegistry` service before the router is created**
> — use `permissionsRegistry.addPermissions(...)` for basic permissions and
> `permissionsRegistry.addResourceType(...)` for resource permissions. This is a
> stricter requirement than authorizing in code: basic permissions previously did
> not need to be registered to be enforced. The middleware reads the registered
> permissions once when the router is constructed, so registration must happen in
> your plugin's `registerInit` before `createOpenApiRouter` is called. If any
> referenced permission is not registered, the router throws when it is created —
> failing at startup rather than on the first request to the affected operation.

## FAQs

### Why am I getting `unknown` as the type for a response?

This can happen when you have a `charset` defined in your `response.content` section. Something like `response.content['application/json; charset=utf-8:']` will cause this issue.

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
