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
customize it to your own needs. Lets say you have your own search backend you
want to talk to. The purpose of this guide is to walk you through how to do that
in two steps.

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
