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

2. Register the `DefaultTechDocsCollatorFactory` with the IndexBuilder.

```typescript
indexBuilder.addCollator({
  defaultRefreshIntervalSeconds: 600,
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

## How to migrate from Search Alpha to Beta

For the purposes of this guide, Search Beta version is defined as:

- **Search Plugin**: At least `v0.7.2`
- **Search Backend Plugin**: At least `v0.4.6`
- **Search Backend Node**: At least `v0.5.0`
- **Search Common**: At least `v0.3.0`

In the Beta version, the Search Platform's indexing process has been rewritten
as a stream pipeline in order to improve efficiency and performance on large
sets of documents.

If you've not yet extended the Search Platform with custom code, and have
instead taken advantage of default collators, decorators, and search engines
provided by existing plugins, the migration process is fairly straightforward:

1. Upgrade to at least version `0.5.0` of
   `@backstage/plugin-search-backend-node`, as well as any backend plugins whose
   collators you are using (e.g. at least version `0.23.0` of
   `@backstage/plugin-catalog-backend` and/or version `0.14.1` of
   `@backstage/plugin-techdocs-backend`), as well as any search-engine specific
   plugin you are using (e.g. at least version `0.3.0` of
   `@backstage/plugin-search-backend-module-pg` or version `0.1.0` of
   `@backstage/plugin-search-backend-module-elasticsearch`).
2. Then, make the following changes to your
   `/packages/backend/src/plugins/search.ts` file:

   ```diff
   -import { DefaultCatalogCollator } from '@backstage/plugin-catalog-backend';
   -import { DefaultTechDocsCollator } from '@backstage/plugin-techdocs-backend';
   +import { DefaultCatalogCollatorFactory } from '@backstage/plugin-catalog-backend';
   +import { DefaultTechDocsCollatorFactory } from '@backstage/plugin-techdocs-backend';
   // ...
     const indexBuilder = new IndexBuilder({ logger: env.logger, searchEngine });
     indexBuilder.addCollator({
       defaultRefreshIntervalSeconds: 600,
   -    collator: DefaultCatalogCollator.fromConfig(env.config, {
          discovery: env.discovery,
        }),
   +    factory: DefaultCatalogCollatorFactory.fromConfig(env.config, {
          discovery: env.discovery,
        }),
     });
     indexBuilder.addCollator({
       defaultRefreshIntervalSeconds: 600,
   -     collator: DefaultTechDocsCollator.fromConfig(env.config, {
   +     factory: DefaultTechDocsCollatorFactory.fromConfig(env.config, {
           discovery: env.discovery,
           logger: env.logger,
       }),
     });
   ```

Any custom collators, decorators, or search engine implementations will require
minor refactoring. Continue on for details.

### Rewriting alpha-style collators for beta

In alpha versions of the Backstage Search Platform, collators were classes that
implemented an `execute` method which resolved an `IndexableDocument` array.

In beta versions, the logic encapsulated by the aforementioned `execute` method
is contained within an [object-mode][obj-mode] `Readable` stream where each
object pushed onto the stream is of type `IndexableDocument`. Instances of this
stream are instantiated by a factory class conforming to the
`DocumentCollatorFactory` interface.

The optimal conversion strategy will vary depending on the collator's logic, but
the simplest conversion can follow a process like this:

1. Rename your collator class to something like `YourCollatorFactory` and update
   it to implement `DocumentCollatorFactory` instead of `DocumentCollator`.
2. Update its `execute` method so that it resolves
   `AsyncGenerator<YourIndexableDocument>` instead of `YourIndexableDocument[]`.
3. Implement `DocumentCollatorFactory`'s `getCollator` method which resolves to
   `Readable.from(this.execute())` (which is a utility for creating [readable
   streams][read-stream] from [async generators][async-gen]).

```ts
import { DocumentCollatorFactory } from '@backstage/plugin-search-backend-node';
import { Readable } from 'stream';
export class YourCollatorFactory implements DocumentCollatorFactory {
  public readonly type: string = 'your-type';
  async *execute(): AsyncGenerator<YourIndexableDocument> {
    const widgets = await this.client.getWidgets();
    for (const widget of widgets) {
      yield {
        title: widget.name,
        location: widget.url,
        text: widget.description,
      };
    }
  }
  async getCollator() {
    return Readable.from(this.execute());
  }
}
```

Note: it may be possible to simplify your collator dramatically! If your custom
collator was previously using streams under the hood (for example, by reading
newline delimited JSON from a local or remote file), you could just expose the
stream directly via a simple factory class:

```ts
import { DocumentCollatorFactory } from '@backstage/plugin-search-backend-node';
import { createReadStream } from 'fs';
import { parse } from '@jsonlines/core';
export class YourCollatorFactory implements DocumentCollatorFactory {
  public readonly type: string = 'your-type';
  async getCollator() {
    const parseStream = parse();
    return createReadStream('./documents.ndjson').pipe(parseStream);
  }
}
```

### Rewriting alpha-style decorators for beta

In alpha versions of the Backstage Search Platform, decorators were classes that
implemented an `execute` method which took an `IndexableDocument` array as an
argument, and resolved a modified array of the same type.

In beta versions, the logic encapsulated by the aforementioned `execute` method
is contained within an object-mode `Transform` stream which reads objects of
type `IndexableDocument`, and writes objects of a conforming type. Similar to
collators, instances of this stream are instantiated by a factory class
conforming to the `DocumentDecoratorFactory` interface.

Although you can choose to implement a `Transform` stream from scratch, the
`@backstage/plugin-search-backend-node` package provides a `DecoratorBase` class
in order to simplify the developer experience. With this base class, all that's
needed is to transfer your old decorator class logic into the base class' three
methods (`initialize`, `decorate`, and `finalize`), and implement the factory
class that instantiates the stream:

```ts
import { DecoratorBase } from '@backstage/plugin-search-backend-node';
export class YourDecorator extends DecoratorBase {
  async initialize() {
    // Setup logic. Performed once before any documents are consumed.
  }
  async decorate(
    document: YourIndexableDocument,
  ): Promise<YourIndexableDocument | YourIndexableDocument[] | undefined> {
    // Perform transformation logic here.
    return document;
  }
  async finalize() {
    // Teardown logic. Performed once after all documents have been consumed.
  }
}
export class YourDecoratorFactory implements DocumentDecoratorFactory {
  async getDecorator() {
    return new YourDecorator();
  }
}
```

Note the return type of the `decorate` method and how each can be used to
different effect.

- By resolving a single `YourIndexableDocument` object, your decorator can be
  used to make simple transformations:

  ```ts
  class BooleanWidgetCoolnessDecorator extends DecoratorBase {
    async decorator(widget) {
      // Perform a simple, 1:1 transformation.
      widget.isCool = widget.isCool === 'true' ? true : false;
      return widget;
    }
  }
  ```

- By resolving `undefined`, your decorator can filter out documents which
  shouldn't be in the index:

  ```ts
  class OnlyCoolWidgetsDecorator extends DecoratorBase {
    async decorator(widget) {
      // Perform a simple filter operation.
      return widget.isCool ? widget : undefined;
    }
  }
  ```

- By resolving an array of `YourIndexableDocument` objects, you can generate
  multiple documents based on the content of one:

  ```ts
  class WidgetByVariantDecorator extends DecoratorBase {
    async decorator(widget) {
      // Generate one widget doc per widget variant.
      return widget.variants.map(variant => {
        // Each widget doc is the given widget plus a "variant" property
        // pulled from a widget.variants string array.
        return {
          ...widget,
          variant,
        };
      });
    }
  }
  ```

In alpha versions, a decorator had access to every `IndexableDocument`
simultaneously. This is no longer possible in beta versions (precisely to make
the indexing process more efficient and performant). You will need to modify
your decorator's logic so that it does not need access to every document at
once.

### Rewriting alpha-style search engines for beta

Search Engines are responsible for both querying and indexing documents to an
underlying search engine technology. While the search engine query interface
didn't change between alpha and beta versions, the indexing half of the
interface _did_ change.

In alpha versions of the Backstage Search Platform, a search engine implemented
an `index` method which took a `type` and an `IndexableDocument` array and was
responsible for writing these documents to the underlying search engine.

In beta versions, the logic encapsulated by the aforementioned `index` method is
contained within an object-mode `Writable` stream which expects objects of type
`IndexableDocument`. On the search engine class itself, the `index` method is
replaced with a `getIndexer` factory method which still takes the `type`, but
resolves an instance of the aforementioned `Writable` stream.

Although you can choose to implement a `Writable` stream from scratch, the
`@backstage/plugin-search-backend-node` package provides a
`BatchSearchEngineIndexer` class in order to simplify the developer experience.
With this base class, which collects documents in batches of a configurable size
on your behalf, all that's needed is to transfer your old `index` method logic
into the base class' three methods (`initialize`, `index`, and `finalize`), and
implement the factory method that instantiates the stream:

```ts
import { BatchSearchEngineIndexer } from '@backstage/plugin-search-backend-node';
import { SearchEngine } from '@backstage/plugin-search-common';
export class YourSearchEngineIndexer extends BatchSearchEngineIndexer {
  constructor({ type }: { type: string }) {
    // Customize the number of documents passed to the index method per batch.
    super({ batchSize: 500 });
    // An imaginary search engine indexing client.
    this.index = new SomeSearchEngineIndex({ indexName: type });
  }
  async initialize() {
    // Setup logic. Performed once before any documents are consumed.
  }
  async index(documents: IndexableDocument[]) {
    await this.index.batchOf(documents);
  }
  async finalize() {
    // Teardown logic. Performed once after all documents have been consumed.
  }
}
export class YourSearchEngine implements SearchEngine {
  async getIndexer(type: string) {
    return new YourSearchEngineIndexer({ type });
  }
}
```

[obj-mode]: https://nodejs.org/docs/latest-v14.x/api/stream.html#stream_object_mode
[read-stream]: https://nodejs.org/docs/latest-v14.x/api/stream.html#stream_readable_streams
[async-gen]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/for-await...of#iterating_over_async_generators
