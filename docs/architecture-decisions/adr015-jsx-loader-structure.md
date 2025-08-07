---
id: adrs-adr015
title: 'ADR015: Types and naming for element and component options'
description: Architecture Decision Record (ADR) for the proper types and naming for element and component options
---

## Context

Until now there hasn't been a clear standard for how to define options that are intended to provide JSX elements or components. This led to a mix of different patterns in public APIs, which this ADR aims to standardize.

## Decision

We will use one of the following option property names and types when defining options that are intended to provide JSX elements or components:

### Simple element

This option is used when a simple synchronous JSX element is provided. It must only be used in areas where lazy-loading is not needed.

```tsx
{
  element: JSX.Element;
}
```

### Simple component

This option is used when a simple synchronous component is provided. It must only be used in areas where lazy-loading is not needed.

```tsx
{
  component: (props: { ... }) => JSX.Element | null
}
```

### Async element loader

This option is used when a simple asynchronous JSX element is provided. It is the preferred option when only producing a single instance and there is no need to pass properties to the component. This format simplifies the creation of closures for passing additional properties in the loader implementation.

```tsx
{
  loader: () => Promise<JSX.Element>;
}
```

### Async component loader

This option is used when a simple asynchronous component is provided. It is the preferred option when properties need to be passed to the component or multiple instance are needed, and lazy-loading is required.

```tsx
{
  loader: () => Promise<(props: { ... }) => JSX.Element | null>
}
```

### Any component loader

This option is used in the same cases as the async component loader, but when the option of synchronous loading is also needed. The structure of always having the outer loader function, even in the synchronous case, makes it possible to determine the type of the loader at runtime.

```tsx
{
  loader: (() => props => JSX.Element | null) | (() => Promise<props => JSX.Element | null>)
}
```

Note that when consuming this loader we'll need to unconditionally wrap it with `React.lazy`. This is because you can't delay the call to `React.lazy` until rendering, because you're not allowed to call it within a render function. This means that we can't first call the loader to check whether the returned value is a promise or not, and we must instead unconditionally wrap it with `React.lazy`. Therefore the implementation of accepting one of these loaders as an option needs to look something like this:

```tsx
const LazyComponent = React.lazy(() =>
  Promise.resolve(options.loader()).then(loaded => ({ default: loaded })),
);
```

## Consequences

We will update all APIs for the new frontend system in the `@backstage/frontend-*` packages.

We will not update any of the existing APIs for the old frontend system in the `@backstage/core-*` packages.
