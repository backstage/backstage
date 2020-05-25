# Utility APIs

## Introduction

Backstage Plugins strive to be self-contained, with as much functionality
as possible residing within the plugin itself and its backend APIs. There will however
always be a need for plugins to communicate outside of its boundaries, both with other
plugins and the app itself.

Backstage provides two primary methods for plugins to communication across
their boundaries in client-side code. The first one being the `createPlugin` API and the registration hooks
passed to the `register` method, and the second one being Utility APIs.
While the `createPlugin` API is focused on the initialization plugins and the app,
the Utility APIs provide ways for plugins to communicate during their entire life cycle.

## Usage

Each Utility API is tied to an `ApiRef` instance, which is a global singleton object
without any additional state or functionality, its only purpose is to reference Utility APIs.
`ApiRef`s are create using `createApiRef`, which is exported by `@backstage/core`.
There are many predefined Utility APIs defined in `@backstage/core`, and they're all exported with a name of the pattern `*ApiRef`, for example `errorApiRef`.

To access one of the Utility APIs inside a React component, use the `useApi` hook exported by
`@backstage/core`, or the `withApis` HOC if you prefer class components. For example, the `ErrorApi` can be accessed like this:

```tsx
import React, { FC } from 'react';
import { useApi, errorApiRef } from '@backstage/core';

export const MyComponent: FC<{}> = () => {
  const errorApi = useApi(errorApiRef);

  // Signal to the app that something went wrong, and display the error to the user.
  const handleError = error => {
    errorApi.post(error);
  };

  // the rest of the component ...
};
```

Note that there is no explicit type given for `ErrorApi`. This is because the `errorApiRef` has the type embedded, and `useApi` is able to infer the type.

Also note that consuming Utility APIs is not limited to plugins, it can be done from any component inside Backstage, including the ones in `@backstage/core`. The only requirement is that they are beneath the `AppProvider` in the react tree.

## Registering Utility API Implementations

The Backstage App is responsible for providing implementations for all Utility APIs required by plugins. The example app in this repo registers its APIs inside [src/apis.ts](/packages/app/src/apis.ts). Here's an example of how to wire up the `ErrorApi` inside an app:

```ts
import {
  ApiRegistry,
  createApp,
  alertApiRef,
  errorApiRef,
  AlertApiForwarder,
  ErrorApiForwarder,
} from '@backstage/core';

const builder = ApiRegistry.builder();

// The alert API is a self-contained implementation that shows alerts to the user.
builder.add(alertApiRef, new AlertApiForwarder());

// The error API uses the alert API to send error notifications to the user.
builder.add(errorApiRef, new ErrorApiForwarder(alertApiForwarder));

const app = createApp({
  apis: apiBuilder.build(),
  // ... other config
});
```

The `ApiRegistry` is used to register all Utility APIs in the app and associate them with `ApiRef`s. It implements the `ApiHolder` interface, which enables it to provide an API implementation given an `ApiRef`.

Note that our `ErrorApi` implementation depends on another Utility API, the `AlertApi`. This is the method with which APIs can depend on other APIs, using manual dependency injection at the initialization of the app. In general, if you want
to depend on another Utility API in an implementation of an API, you import the type for that API and make it a
constructor parameter.

## Custom implementations of Utility APIs

Defining a custom implementation of a utility API is easy, you simply need to export a class
that `implements` the target API, for example:

```ts
export class IgnoringErrorApi implements ErrorApi {
  post(error: Error, context?: ErrorContext) {
    // ignore error
  }
}
```

The `IgnoringErrorApi` would then be imported in the app, and wired up like this:

```ts
builder.add(errorApiRef, new IgnoringErrorApi());
```

Note that the above line will cause an error if `IgnoreErrorApi` does not fully
implement the `ErrorApi`, as it is checked by the type embedded in the `errorApiRef` at compile time.

## Defining custom Utility APIs

The pattern for plugins defining their own Utility APIs is not fully established yet. The current way is for the plugin to export its own `ApiRef` and type for the API, along with one or more implementations. It is then up to the app to import, and register those APIs. See for example the [lighthouse](/plugins/lighthouse/src/api.ts) or [graphiql](/plugins/graphiql/src/lib/api/types.ts) plugins for examples of this.

The goal is to make this process a bit smoother, but that requires work in other parts of Backstage, like configuration management. So it remains as a TODO. If you have more questions regarding this, or have an idea for an API that you want to share outside your plugin, hit us up in [GitHub issues](https://github.com/spotify/backstage/issues/new/choose) or the [Backstage Discord server](https://discord.gg/EBHEGzX).

## Architecture

The `ApiRef` instances mentioned above provide a point of indirection between consumers and producers of
Utility APIs. It allows for plugins and components to depend on APIs in a type-safe way, without
having a direct reference to a concrete implementation of the APIs. The Apps are also given a lot
of flexibility in what implementations to provide. As long as they adhere to the contract established
by an `ApiRef`, they are free to choose any implementation they want.

The figure below shows the relationship between <span style="color: #82b366">different Apps</span>, that
provide <span style="color: #6c8ebf">different implementations</span> of the
<span style="color: #9673a6">FooApi</span>. <span style="color: #d6b656">Components</span> within Plugins
then access the <span style="color: #9673a6">FooApi</span> via the <span style="color: #b85450">fooApiRef</span>.

<div style="text-align:center">
<img src="utility-apis-fig1.svg" alt="Figure showing the relationship between utility APIs, the apps that provide them, and the plugins that consume them">
</div>

The current method for connecting Utility API providers and consumers is via the React tree using
an `ApiProvider`, which is added to the `AppProvider` of the `App`. In the future there may potentially
be more ways to do this, in ways that are not tied to react. A design goal of the Utility APIs was to
not have them directly tied to React.

The indirection provided by Utility APIs also makes it straightforward to test components that depend
on APIs, and to provide a standard common development environment for plugins. A proper test wrapper
with mocked API implementations is not yet ready, but it will provided as a part of
`@backstage/test-utils`. It will provide mocked variants of APIs, with additional methods for asserting
a component's interaction with the API.

The common development environment for plugins is included in `@backstage/dev-utils`, where the exported
`createDevApp` function creates an application with implementations for all core APIs already present.
Contrary to the method for wiring up Utility API implementations in an app created with `createApp`, `createDevApp`
uses automatic dependency injection. This is to make it possible to replace any API implementation, and
having that be reflected in dependents of that API.
