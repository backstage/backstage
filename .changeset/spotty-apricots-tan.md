---
'@backstage/backend-plugin-api': patch
---

Deprecated the ability to define options for service factories through `createServiceFactory`. In the future all service factories will return a plain `ServiceFactory` object, rather than allowing users to pass options to the factory. To allow for customization of a service implementation one can instead export one or a few building blocks that allows for simple re-implementation of the service instead.

For example, instead of:

```ts
export const fooServiceFactory = createServiceFactory<FooService>(
  (options?: { bar: string }) => ({
    service: fooServiceRef,
    deps: { logger: coreServices.logger },
    factory({ logger }) {
      return {
        // Implementation of the foo service using the `bar` option.
      };
    },
  }),
);
```

We instead encourage service implementations to provide an easy to use API for re-implementing the service for advanced use-cases:

```ts
/** @public */
export class DefaultFooService implements FooService {
  static create(options: { bar: string; logger: LoggerService }) {
    return new DefaultFooService(options.logger, options.bar ?? 'default');
  }

  private constructor(
    private readonly logger: string,
    private readonly bar: string,
  ) {}

  // The rest of the implementation
}
```

A user that wishes to customize the service can then easily do so by defining their own factory:

```ts
export const customFooServiceFactory = createServiceFactory<FooService>({
  service: fooServiceRef,
  deps: { logger: coreServices.logger },
  factory({ logger }) {
    return DefaultFooService.create({ logger, bar: 'baz' });
  },
});
```

This is of course more verbose than the previous solution where the factory could be customized through `fooServiceFactory({ bar: 'baz' })`, but this is a simplified which in practice should be using static configuration instead.

In cases where the old options patterns significantly improves the usability of the service factory, the old pattern can still be implemented like this:

```ts
const fooServiceFactoryWithOptions = (options?: { bar: string }) =>
  createServiceFactory<FooService>({
    service: fooServiceRef,
    deps: { logger: coreServices.logger },
    factory({ logger }) {
      return {
        // Implementation of the foo service using the `bar` option.
      };
    },
  });

export const fooServiceFactory = Object.assign(
  fooServiceFactoryWithOptions,
  fooServiceFactoryWithOptions(),
);
```

This change is being made because the ability to define an options callback encourages bad design of services factories. When possible, a service should be configurable through static configuration, and the existence of options may discourage that. More importantly though, the existing options do not work well with the dependency injection system of services, which is a problem for callbacks an other more advanced options. This lead to a bad pattern where only a few explicit dependencies where made available in callbacks, rather than providing an API that allowed simple re-implementation of the service with full access to dependency injection.

A separate benefit of this change is that it simplifies the TypeScript types in a way that allows TypeScript to provide a much better error message when a service factory doesn't properly implement the service interface.
