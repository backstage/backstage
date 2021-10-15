---
id: how-to-guides
title: Search "HOW TO" guides
sidebar_label: "HOW TO" guides
description: Search "HOW TO" guides 
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
provides a default collator ready to be used.

The purpose of this guide is to walk you through how to register the
[DefaultTechDocsCollator](https://github.com/backstage/backstage/blob/master/plugins/techdocs-backend/src/search/DefaultTechDocsCollator.ts)
in your App, so that you can get TechDocs documents indexed.

If you have been through the
[Getting Started with Search guide](https://backstage.io/docs/features/search/getting-started), you should have the `packages/backend/src/plugins/search.ts` file available. If so, you can go ahead and follow this guide - if not, start by going through the getting started guide.

1. Import the DefaultTechDocsCollator from `@backstage/plugin-techdocs-backend`.

```typescript
import { DefaultTechDocsCollator } from '@backstage/plugin-techdocs-backend';
```

2. Register the DefaultTechDocsCollator with the IndexBuilder.

```typescript
indexBuilder.addCollator({
  defaultRefreshIntervalSeconds: 600,
  collator: DefaultTechDocsCollator.fromConfig(config, {
    discovery,
    logger,
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
