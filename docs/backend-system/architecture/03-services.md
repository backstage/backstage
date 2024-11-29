---
id: services
title: Backend Services
sidebar_label: Services
# prettier-ignore
description: Services for backend plugins
---

Backend services provide shared functionality available to all backend plugins and modules. They are made available through service references that embed a type that represents the service interface, similar to how [Utility APIs](../../api/utility-apis.md) work in the Backstage frontend system. To use a service in your plugin or module you request an implementation of that service using the service reference.

The system surrounding services exists to provide a level of indirection between the service interfaces and their implementation. It is an implementation of dependency injection, where each backend instance is the dependency injection container. The implementation for each service is provided by a service factory, which encapsulates the logic for how each service instance is created.

## Service Interfaces

Service interfaces can be any TypeScript type, but it is best to make it an object interface with a number of methods. General guidelines for interface design apply: keep them simple and lean, with few but powerful methods. Take care to avoid locking down the ways in which individual methods can evolve. Often you want to stick to a method with an options object as its only parameter, and return a result object. If there is any reason for uncertainty about whether the method should be async or not, always make it async. For example, a minimal interface should often use the following pattern:

```ts
export interface FooService {
  foo(options: FooOptions): Promise<FooResult>;
}
```

## Service References

Once you have defined a service interface, you need to create a service reference using the `createServiceRef` function. This will create a `ServiceRef` instance, which is a reference that you export in order to allow users to interact with your service. Conceptually this is very similar to `ApiRef`s in the frontend system. For example:

```ts
import { createServiceRef } from '@backstage/backend-plugin-api';

export interface FooService {
  foo(options: FooOptions): Promise<FooResult>;
}

export const fooServiceRef = createServiceRef<FooService>({
  id: 'example.foo', // the owner of this service is in this case the 'example' plugin
});
```

The `fooServiceRef` that we create above should be exported, and can then be used to declare a dependency on the `FooService` interface and receive an implementation of it at runtime.

When creating a service reference you need to give it an ID. This ID needs to be globally unique, and should generally be of the format `'<pluginId>.<serviceName>'`. For more naming patterns surrounding services, see the [naming patterns](./08-naming-patterns.md#services) page.

A note on naming: the frontend and backend systems intentionally use the separate names "APIs" and "Services" for concepts that are quite similar. This is to avoid confusion between the two, both in documentation and discussion, but also in code. While the two systems are quite similar, they are not identical, and they can't be used interchangeably.

## Service Factories

In order to be able to depend on a service interface through a service reference, we of course also need to have some way of creating the concrete implementation of it. To encapsulate that logic we use service factories, which define both how service instances are created, as well as what other services they depend on for their implementation.

Service factories can come from many different sources. There are built-in service factories, external ones that you can import from other packages, and you can also create your own. Specific service factories are installed within each backend instance, which acts as the dependency injection container. For any given backend instance there can only be a single designated service factory for each service.

To define a service factory, we use `createServiceFactory`:

```ts
import { createServiceFactory } from '@backstage/backend-plugin-api';

class DefaultFooService implements FooService {
  async foo(options: FooOptions): Promise<FooResult> {
    // ...
  }
}

export const fooServiceFactory = createServiceFactory({
  service: fooServiceRef,
  deps: { bar: barServiceRef },
  factory({ bar }) {
    return new DefaultFooService(bar);
  },
});
```

To create a service factory we need to provide a reference to the `service` for which the factory will create instances, a `deps` object which lists the other services that the factory depends on, and a `factory` function which will be called to create the service instance. The backend system will call the `factory` function with an object that contains the service instances for each of the dependencies listed in the `deps` object. If a service implementation does not depend on any other services, the `deps` are left as an empty object (`{}`). The `factory` function must return a value that implements the service interface.

If you need the creation of the service instance to be asynchronous, you can make the `factory` function async. For example:

```ts
export const fooServiceFactory = createServiceFactory({
  service: fooServiceRef,
  deps: {},
  async factory() {
    const foo = new DefaultFooService();
    await foo.init();
    return foo;
  },
});
```

Note that circular dependencies among service factories are not allowed. This is verified at runtime, and your backend instance will refuse to start up if it detects any conflicts. Likewise, the backend will also fail to start up if a service factory depends on a service that is not provided by any registered service factory.

## Core Services

The backend system provides a number of core service definitions that both help implement the main functionality of the backend, but also provide a set of utilities for common concerns, such as logging, database access, job scheduling, and so on. These core services will always be present in a backend instance created with `createBackend`, and they can all be overridden with custom implementations if needed.

The service references for all core services are exported via their own `coreServices` object, available from the `@backstage/backend-plugin-api` package. For example, the logging service is accessible via `coreServices.logger`.

You can read more about what core services there are and how to use them in the [core services](../core-services/01-index.md) section.

## Service Scope

By default services are scoped to individual plugins, meaning that separate instances of the service will be created for each plugin. For example, in our `fooFactory` above, a separate instance of `DefaultFooService` will be created for every plugin that depends on the service. This both makes it possible to tailor the service implementations for the individual plugins, and also ensures some level of separation between plugins.

The service scope is defined during the call to `createServiceRef`, with plugin scope being the default. Our above definition of the `fooServiceRef` is therefore equivalent to the following:

```ts
export const fooServiceRef = createServiceRef<FooService>({
  scope: 'plugin',
  id: 'example.foo',
});
```

There are only two possible scopes for services, `'plugin'` and `'root'`.

## Root Scoped Services

If a service is defined as a root scoped service, the implementation created by the factory will be shared across all plugins and services. One other differentiating factor for root scoped services is that they are always initialized, regardless of whether any plugins depend on them or not. This makes them suitable for implementing backend-wide concerns that are not specific to any individual plugin.

There is a limitation in the usage of root scoped services, which is that their implementation can only depend on other root scoped services. Plugin scoped services on the other hand can depend on both root and plugin scoped services. Because of this limitation, one of the main reasons to define a root scoped services is to make it possible for other root scoped services to depend on it.

Because of these limitations and particular use-cases for root scoped services, they tend to be more rare than plugin scoped services. In general, you should prefer defining a service as plugin scoped, unless you are implementing either of the two mentioned use-cases.

Some services come in pairs of a plugin and a root scoped service definition. For example, the `rootLogger` service is a root scoped service, while the `logger` service is a plugin scoped service. The `rootLogger` service houses the main logging implementation, while the `logger` service simply builds upon the `rootLogger` to add plugin specific labels. This division exists so that other root scoped services also have access to a logging service, but it is always preferable if the split can be avoided. If you do end up implementing this pattern, the root scoped service should be prefixed with `root`, this is to encourage use of the plugin scoped service instead.

## Plugin Metadata

Plugin scoped services have access to a plugin metadata service, which is a special service provided by the backend system that is not possible to override. The plugin metadata service provides information about the plugin that a service instance is being created for. It is itself a plugin scoped service, and can be depended on like any other service through the `coreServices.pluginMetadata` reference.

The plugin metadata service is the base for all plugin specific customizations for services. For example, the default implementation of the plugin scoped logger service uses the plugin metadata service to attach the plugin ID as a field in all log messages:

```ts
export const loggerServiceFactory = createServiceFactory({
  service: coreServices.logger,
  deps: {
    rootLogger: coreServices.rootLogger,
    pluginMetadata: coreServices.pluginMetadata,
  },
  factory({ rootLogger, pluginMetadata }) {
    return rootLogger.child({ plugin: pluginMetadata.getId() });
  },
});
```

## Root Context for Service Factories

Some services may benefit from having a context that is shared across all instances of a service. This of course only applies to plugin scoped services, as root scoped services only ever have a single instance. The root context could for example be used for sharing a common connection pool for database access, generated secrets for development, or any other kind of shared facility. Note that you should not use this to share state between plugins in production, as that would be a violation of the [plugin isolation rule](./04-plugins.md#rules-of-plugins).

The root context is defined as part of the service factory by passing the `createRootContext` option:

```ts
export const fooServiceFactory = createServiceFactory({
  service: fooServiceRef,
  deps: { rootLogger: coreServices.rootLogger, bar: barServiceRef },
  createRootContext({ rootLogger }) {
    return new FooRootContext(rootLogger);
  }
  factory({ bar }, ctx) {
    return ctx.forPlugin(bar)
  },
});
```

Whatever value is returned by the `createRootContext` function will be shared and passed as the second argument to each invocation of the `factory` function. That way you can create a shared context that is used in the creation of each plugin instance. Unlike the `factory` function, the `createRootContext` function will only receive root scoped services as its dependencies, but just like the `factory` function, it can also be `async`.

## Default Service Factories

There are a lot of services that are installed in any standard Backstage backend instance by default. You can expect these services to always exist, and do not need to take any additional steps to make them available. This is not necessarily true for services that you import from external packages, as the user of your plugin or module might not have installed a factory for that service in their backend. In order to avoid having to ask integrators of your plugin to install a service factory for a service that you depend on, it is possible to define a default factory for a service.

Default service factories are defined as part of the service reference by passing the `defaultFactory` option to `createServiceRef`:

```ts
import {
  createServiceFactory,
  createServiceRef,
} from '@backstage/backend-plugin-api';

export const fooServiceRef = createServiceRef<FooService>({
  id: 'example.foo',
  defaultFactory: async service =>
    createServiceFactory({
      service,
      deps: {},
      factory() {
        return new DefaultFooService();
      },
    }),
});
```

Note that we don't use the `fooServiceRef` when creating our service factory, but instead use the `service` parameter in the default factory callback. This is because attempting to use `fooServiceRef` directly would result in a circular reference.

If a service defines a default factory, that factory will be used if there is no explicit factory registered in the backend for that service. This allows users of your service to directly import and use a service, without worrying about whether it is installed or not. It is recommended to always define a default factory for any service that you are exporting for use in other plugins or modules.

When defining a default factory for a service, it is possible for it to end up with duplicate implementations at runtime. This applies both to any shared root context in your factory, as well as plugin specific instances of your service. This is because package dependency version ranges may not line up perfectly, causing duplicate installations of the same package. This can happen both for two different plugins using the same service, but also across a plugin and its modules. If your service would break in this scenario, you should not define a default factory for it, but instead require that users of your service explicitly install a factory in their backend instance.

## Service Factory Customization

When declaring a service factory you may also want to make the export the building blocks of the implementation itself. This is to allow for further customization of the service implementation through code, beyond what is possible with static configuration, without the need to re-implement the entire service from scratch. For example, we might export our example `DefaultFooService` class, while moving construction to a static `create` factory method to make it easier to evolve:

```ts
export class DefaultFooService {
  static create(options: { transform: (foo: string) => string }) {
    return new DefaultFooService(options.transform ?? ((foo) => foo);
  }

  private constructor(private readonly transform: (foo: string) => string) {}

  foo(foo: string): string {
    return this.transform(foo);
  }
}
```

By exporting `DefaultFooService` we now make it relatively simple for advanced users of our service to customize the implementation. To do so, they can define their own service factory that uses our provided implementation:

```ts
export const customFooServiceFactory = createServiceFactory({
  service: fooServiceRef,
  deps: {},
  factory() {
    return DefaultFooService.create({
      transform: foo => foo.toUpperCase(),
    });
  },
});
```

This allows you to provide more advanced options for the service implementation that couldn't be expressed through static configuration. It also gives users of the service implementation access to other services through dependency injection, which can be useful for their customizations.

## Service Factory Options Pattern

:::note Note

This pattern is discouraged, only use it when necessary. If possible you should prefer to make services configurable via static configuration or re-implementation instead.

:::

In some cases it might be beneficial to allow users of your service factory to pass options to the factory itself, rather than to the service implementation. This can be enabled by also defining the service factory as a function that returns a reconfigured factory. For example:

```ts
const fooServiceFactoryWithOptions = (options?: {
  transform: (foo: string) => string;
}) =>
  createServiceFactory<FooService>({
    service: fooServiceRef,
    deps: {},
    factory() {
      return DefaultFooService.create({
        transform: options?.transform,
      });
    },
  });

export const fooServiceFactory = Object.assign(
  fooServiceFactoryWithOptions,
  fooServiceFactoryWithOptions(),
);
```

This makes it possible to use the `fooServiceFactory` directly, as well passing additional options to create a customized factory:

```ts
backend.add(fooServiceFactory);
// OR
backend.add(fooServiceFactory({ transform: foo => foo.toLowerCase() }));
```

This pattern is discouraged due to the inability to access other services through dependency injection. It is however used in a few places in the Backstage framework where the ability to directly pass options without re-implementing the service is very convenient, such as the `mockServices` from `@backstage/backend-test-utils`.
