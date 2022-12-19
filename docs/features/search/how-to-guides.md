---
id: how-to-guides
title: Search How-To guides
sidebar_label: How-To guides
description: Search How To guides
---

## How to implement your own Search API

The Search plugin provides implementation of one primary API by default: the
[SearchApi](https://github.com/backstage/backstage/blob/db2666b980853c281b8fe77905d7639c5d255f13/plugins/search/src/apis.ts#L35),
which is responsible for talking to the search-backend to query search results.

There may be occasions where you need to implement this API yourself, to
customize it to your own needs - for example if you have your own search backend
that you want to talk to. The purpose of this guide is to walk you through how
to do that in two steps.

1. Implement the `SearchApi`
   [interface](https://github.com/backstage/backstage/blob/db2666b980853c281b8fe77905d7639c5d255f13/plugins/search/src/apis.ts#L31)
   according to your needs.

```typescript
export class SearchClient implements SearchApi {
  // your implementation
}
```

2. Override the API ref `searchApiRef` with your new implemented API in the
   `App.tsx` using `ApiFactories`.
   [Read more about App APIs](https://backstage.io/docs/api/utility-apis#app-apis).

```typescript
const app = createApp({
  apis: [
    // SearchApi
    createApiFactory({
      api: searchApiRef,
      deps: { discovery: discoveryApiRef },
      factory({ discovery }) {
        return new SearchClient({ discoveryApi: discovery });
      },
    }),
  ],
});
```

## How to index TechDocs documents

The TechDocs plugin has supported integrations to Search, meaning that it
provides a default collator factory ready to be used.

The purpose of this guide is to walk you through how to register the
[DefaultTechDocsCollatorFactory](https://github.com/backstage/backstage/blob/master/plugins/techdocs-backend/src/search/DefaultTechDocsCollatorFactory.ts)
in your App, so that you can get TechDocs documents indexed.

If you have been through the
[Getting Started with Search guide](https://backstage.io/docs/features/search/getting-started),
you should have the `packages/backend/src/plugins/search.ts` file available. If
so, you can go ahead and follow this guide - if not, start by going through the
getting started guide.

1. Import the `DefaultTechDocsCollatorFactory` from
   `@backstage/plugin-techdocs-backend`.

```typescript
import { DefaultTechDocsCollatorFactory } from '@backstage/plugin-techdocs-backend';
```

2. If there isn't an existing schedule you'd like to run the collator on, be
   sure to create it first. Something like...

```typescript
import { Duration } from 'luxon';

const every10MinutesSchedule = env.scheduler.createScheduledTaskRunner({
  frequency: Duration.fromObject({ seconds: 600 }),
  timeout: Duration.fromObject({ seconds: 900 }),
  initialDelay: Duration.fromObject({ seconds: 3 }),
});
```

3. Register the `DefaultTechDocsCollatorFactory` with the IndexBuilder.

```typescript
indexBuilder.addCollator({
  schedule: every10MinutesSchedule,
  factory: DefaultTechDocsCollatorFactory.fromConfig(env.config, {
    discovery: env.discovery,
    logger: env.logger,
    tokenManager: env.tokenManager,
  }),
});
```

You should now have your TechDocs documents indexed to your search engine of
choice!

If you want your users to be able to filter down to the techdocs type when
searching, you can update your `SearchPage.tsx` file in
`packages/app/src/components/search` by adding `techdocs` to the list of values
of the `SearchType` component.

```tsx
<Paper className={classes.filters}>
  <SearchType
    values={['techdocs', 'software-catalog']}
    name="type"
    defaultValue="software-catalog"
  />
  ...
</Paper>
```

> Check out the documentation around [integrating search into plugins](../../plugins/integrating-search-into-plugins.md#create-a-collator) for how to create your own collator.

## How to limit what can be searched in the Software Catalog

The Software Catalog includes a wealth of information about the components,
systems, groups, users, and other aspects of your software ecosystem. However,
you may not always want _every_ aspect to appear when a user searches the
catalog. Examples include:

- Entities of kind `Location`, which are often not useful to Backstage users.
- Entities of kind `User` or `Group`, if you'd prefer that users and groups be
  exposed to search in a different way (or not at all).

It's possible to write your own [Collator](./concepts.md#collators) to control
exactly what's available to search, (or a [Decorator](./concepts.md#decorators)
to filter things out here and there), but the `DefaultCatalogCollator` that's
provided by `@backstage/plugin-catalog-backend` offers some configuration too!

```diff
// packages/backend/src/plugins/search.ts

indexBuilder.addCollator({
  defaultRefreshIntervalSeconds: 600,
  collator: DefaultCatalogCollator.fromConfig(env.config, {
    discovery: env.discovery,
    tokenManager: env.tokenManager,
+   filter: {
+      kind: ['API', 'Component', 'Domain', 'Group', 'System', 'User'],
+   },
  }),
});
```

As shown above, you can add a catalog entity filter to narrow down what catalog
entities are indexed by the search engine.

## How to customize search results highlighting styling

The default highlighting styling for matched terms in search results is your
browsers default styles for the `<mark>` HTML tag. If you want to customize
how highlighted terms look you can follow Backstage's guide on how to
[Customize the look-and-feel of your App](https://backstage.io/docs/getting-started/app-custom-theme)
to create an override with your preferred styling.

For example, the following will result in highlighted terms to be bold & underlined:

```jsx
const highlightOverride = {
  BackstageHighlightedSearchResultText: {
    highlight: {
      color: 'inherit',
      backgroundColor: 'inherit',
      fontWeight: 'bold',
      textDecoration: 'underline',
    },
  },
};
```

[obj-mode]: https://nodejs.org/dist/latest-v16.x/docs/api/stream.html#stream_object_mode
[read-stream]: https://nodejs.org/dist/latest-v16.x/docs/api/stream.html#readable-streams
[async-gen]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/for-await...of#iterating_over_async_generators
