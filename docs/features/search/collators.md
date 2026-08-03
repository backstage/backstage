---
id: collators
title: Collators
description: Indexing your Backstage content with collators
---

Backstage includes 2 [collators](./concepts.md#collators) out of the box for the [Catalog](#catalog) and [TechDocs](#techdocs). There's also some from the [Backstage Community](#community-collators) too!

## Catalog

The Catalog collator will index all the Entities in your Catalog. It is installed by default but if you need to add it manually here's how.

First we add the plugin into your backend app:

```bash title="From your Backstage root directory"
yarn --cwd packages/backend add @backstage/plugin-search-backend-module-catalog
```

Then add the following line:

```ts title="packages/backend/src/index.ts"
const backend = createBackend();

// Other plugins...

// search plugin
backend.add(import('@backstage/plugin-search-backend'));

/* highlight-add-start */
backend.add(import('@backstage/plugin-search-backend-module-catalog'));
/* highlight-add-end */

backend.start();
```

### Configuring the Catalog Collator

The following sections outlines the available configurations for this collator.

#### Scheduling

The default schedule for the Catalog Collator is to run every 10 minutes, you can provide your own schedule by adding it to your config:

```yaml title="app-config.yaml
search:
  collators:
    catalog:
      schedule: # same options as in SchedulerServiceTaskScheduleDefinition
        # supports cron, ISO duration, "human duration" as used in code
        initialDelay: { seconds: 90 }
        # supports cron, ISO duration, "human duration" as used in code
        frequency: { hours: 6 }
        # supports ISO duration, "human duration" as used in code
        timeout: { minutes: 3 }
```

#### Filtering

You may wish to collate specific subsets of entities in your Catalog, this can be accomplished using the `filter` configuration option. Here's a basic example:

```yaml title"app-config.yaml"
search:
  collators:
    catalog:
      filter:
        kind: ['component', 'api']
        spec.lifecycle: production
```

The above example will only collate entities that are `kind` equal to `component` or `api` AND have a `spec.lifecycle` set to `production`

You can also apply a more advanced filter like this:

```yaml title"app-config.yaml"
search:
  collators:
    catalog:
      filter:
        - kind: ['API']
          spec.type: openapi
        - kind: ['Component']
          spec.lifecycle: experimental
```

Now with this example it will collate all entities that are `kind` equal to `api` with a `spec.type` equal to `openapi` OR all entities that are `kind` equal to `component` AND have a `spec.lifecycle` set to `experimental`

:::tip

The filter configuration is implemented using the `EntityFilterQuery` syntax. The [reference documentation on `EntityFilterQuery`](https://backstage.io/api/stable/types/_backstage_catalog-client.index.EntityFilterQuery.html) provides more details.

:::

## TechDocs

The TechDocs collator will index all the TechDocs in your Catalog. It is installed by default but if you need to add it manually here's how.

First we add the plugin into your backend app:

```bash title="From your Backstage root directory"
yarn --cwd packages/backend add @backstage/plugin-search-backend-module-techdocs
```

Then add the following line:

```ts title="packages/backend/src/index.ts"
const backend = createBackend();

// Other plugins...

// search plugin
backend.add(import('@backstage/plugin-search-backend'));

/* highlight-add-start */
backend.add(import('@backstage/plugin-search-backend-module-techdocs'));
/* highlight-add-end */

backend.start();
```

### Configuring the TechDocs Collator

The default schedule for the TechDocs Collator is to run every 10 minutes, you can provide your own schedule by adding it to your config:

```yaml title="app-config.yaml
search:
  collators:
    techdocs:
      schedule: # same options as in SchedulerServiceTaskScheduleDefinition
        # supports cron, ISO duration, "human duration" as used in code
        initialDelay: { seconds: 90 }
        # supports cron, ISO duration, "human duration" as used in code
        frequency: { hours: 6 }
        # supports ISO duration, "human duration" as used in code
        timeout: { minutes: 3 }
```

### Filtering through the catalog collator

The TechDocs collator by default filters through catalog entities where the annotation `metadata.annotations.backstage.io/techdocs-ref` exists. If you wish to further filter out entities, there are two ways to do so through the `techDocsCollatorEntityFilterExtensionPoint`.

```typescript
export const exampleCustomCatalogFiltering = createBackendModule({
  pluginId: 'search',
  moduleId: 'search-techdocs-collator-entity-filter',
  register(reg) {
    reg.registerInit({
      deps: {
        customCollatorFilter: techDocsCollatorEntityFilterExtensionPoint,
      },
      async init({ customCollatorFilter }) {
        /* filtering by catalog params */
        customCollatorFilter.setCustomCatalogApiFilters([
          { kind: ['API', 'Component', ...] },
          { metadata: ['...more filters'] },
        ]);

        /* filtering by a custom function */
        customCollatorFilter.setEntityFilterFunction((entities: Entity[]) =>
          entities.filter(
            entity => entity.metadata?.annotations?.abc === 'xyz',
          ),
        );
      },
    });
  },
});
```

## Community Collators

Here are some of the known Search Collators available in from the Backstage Community:

- [`@backstage-community/plugin-search-backend-module-explore`](https://github.com/backstage/community-plugins/tree/main/workspaces/explore/plugins/search-backend-module-explore): will index content from the [Explore plugin](https://github.com/backstage/community-plugins/tree/main/workspaces/explore/plugins/explore).
- [`@backstage/plugin-search-backend-module-stack-overflow-collator`](https://github.com/backstage/backstage/tree/master/plugins/search-backend-module-stack-overflow-collator): will index content from Stack Overflow.
- [`@backstage-community/search-backend-module-adr`](https://github.com/backstage/community-plugins/tree/main/workspaces/adr/plugins/search-backend-module-adr): will index content from the [ADR plugin](https://github.com/backstage/community-plugins/tree/main/workspaces/adr/plugins/adr).

## Custom collators

You can create your own collator to index any data source and make it
searchable in Backstage. The recommended approach is to use the built-in
template to scaffold a collator module, then implement your data fetching
logic.

### Scaffolding a collator module

Run the following command from your Backstage root directory:

```bash title="From your Backstage root directory"
yarn new --select search-collator-module
```

You are prompted for a module ID, which is used to name the package and the
generated collator class. For this example, enter `blog-posts`.

The template creates a new package at
`plugins/search-backend-module-blog-posts/` with the following structure and
automatically adds the module to your backend:

```ts title="packages/backend/src/index.ts"
backend.add(import('@internal/plugin-search-backend-module-blog-posts'));
```

The generated package contains these files:

```text
plugins/search-backend-module-blog-posts/
├── config.d.ts
├── package.json
└── src/
    ├── collator/
    │   ├── BlogPostsCollatorFactory.test.ts
    │   └── BlogPostsCollatorFactory.ts
    ├── index.ts
    └── module.ts
```

### Understanding the generated code

The template generates two files worth noting: the backend module that wires the
collator into the search system, and the collator factory that fetches and
yields documents.

#### The backend module

The `src/module.ts` file creates a backend module that registers the collator
with the search index. It reads an optional schedule from configuration and
falls back to a default schedule of every 10 minutes:

```ts title="plugins/search-backend-module-blog-posts/src/module.ts"
import {
  coreServices,
  createBackendModule,
  readSchedulerServiceTaskScheduleDefinitionFromConfig,
} from '@backstage/backend-plugin-api';
import { searchIndexRegistryExtensionPoint } from '@backstage/plugin-search-backend-node/alpha';
import { BlogPostsCollatorFactory } from './collator/BlogPostsCollatorFactory';

const DEFAULT_SCHEDULE = {
  frequency: { minutes: 10 },
  timeout: { minutes: 15 },
  initialDelay: { seconds: 3 },
};

export const searchModuleBlogPosts = createBackendModule({
  pluginId: 'search',
  moduleId: 'blog-posts-collator',
  register({ registerInit }) {
    registerInit({
      deps: {
        config: coreServices.rootConfig,
        logger: coreServices.logger,
        scheduler: coreServices.scheduler,
        indexRegistry: searchIndexRegistryExtensionPoint,
      },
      async init({ config, logger, scheduler, indexRegistry }) {
        const scheduleConfig = config
          .getOptionalConfig('search.collators.blogPosts')
          ?.getOptionalConfig('schedule');

        const schedule = scheduleConfig
          ? readSchedulerServiceTaskScheduleDefinitionFromConfig(scheduleConfig)
          : DEFAULT_SCHEDULE;

        indexRegistry.addCollator({
          schedule: scheduler.createScheduledTaskRunner(schedule),
          factory: BlogPostsCollatorFactory.fromConfig(config, { logger }),
        });
      },
    });
  },
});
```

#### The collator factory

The `src/collator/BlogPostsCollatorFactory.ts` file implements the
`DocumentCollatorFactory` interface. The `execute()` method is an async
generator that yields `IndexableDocument` objects. Each document must include
`title`, `text`, and `location` fields:

```ts title="plugins/search-backend-module-blog-posts/src/collator/BlogPostsCollatorFactory.ts"
import { LoggerService } from '@backstage/backend-plugin-api';
import { Config } from '@backstage/config';
import {
  DocumentCollatorFactory,
  IndexableDocument,
} from '@backstage/plugin-search-common';
import { Readable } from 'node:stream';

export type BlogPostsCollatorFactoryOptions = {
  logger: LoggerService;
};

export class BlogPostsCollatorFactory implements DocumentCollatorFactory {
  public readonly type = 'blog-posts';

  private readonly logger: LoggerService;

  static fromConfig(
    _config: Config,
    options: BlogPostsCollatorFactoryOptions,
  ): BlogPostsCollatorFactory {
    return new BlogPostsCollatorFactory(options);
  }

  private constructor(options: BlogPostsCollatorFactoryOptions) {
    this.logger = options.logger;
  }

  async getCollator(): Promise<Readable> {
    return Readable.from(this.execute());
  }

  private async *execute(): AsyncGenerator<IndexableDocument> {
    this.logger.info('Collating documents for blog-posts');

    // TODO: Replace with your data fetching logic
    yield* [];
  }
}
```

### Implementing the collator

To make the collator useful, replace the placeholder `execute()` method with
your data fetching logic. Each yielded object must include at minimum a
`title`, `text`, and `location`.

The following example fetches blog posts from an internal API:

```ts title="plugins/search-backend-module-blog-posts/src/collator/BlogPostsCollatorFactory.ts"
import { LoggerService } from '@backstage/backend-plugin-api';
import { Config } from '@backstage/config';
import {
  DocumentCollatorFactory,
  IndexableDocument,
} from '@backstage/plugin-search-common';
import { Readable } from 'node:stream';

type BlogPost = {
  id: string;
  title: string;
  body: string;
  author: string;
};

export type BlogPostsCollatorFactoryOptions = {
  logger: LoggerService;
};

export class BlogPostsCollatorFactory implements DocumentCollatorFactory {
  public readonly type = 'blog-posts';

  private readonly baseUrl: string;
  private readonly logger: LoggerService;

  static fromConfig(
    config: Config,
    options: BlogPostsCollatorFactoryOptions,
  ): BlogPostsCollatorFactory {
    const baseUrl = config.getString('blogPosts.baseUrl');
    return new BlogPostsCollatorFactory(baseUrl, options);
  }

  private constructor(
    baseUrl: string,
    options: BlogPostsCollatorFactoryOptions,
  ) {
    this.baseUrl = baseUrl;
    this.logger = options.logger;
  }

  async getCollator(): Promise<Readable> {
    return Readable.from(this.execute());
  }

  private async *execute(): AsyncGenerator<IndexableDocument> {
    this.logger.info('Collating documents for blog-posts');

    const response = await fetch(`${this.baseUrl}/blog-posts`);
    const posts: BlogPost[] = await response.json();

    for (const post of posts) {
      yield {
        title: post.title,
        text: post.body,
        location: `/blog-posts/${post.id}`,
      };
    }
  }
}
```

:::tip

For large data sets, use cursor-based pagination in the `execute()` method to
avoid loading all records into memory at once:

```ts
private async *execute(): AsyncGenerator<IndexableDocument> {
  let cursor: string | undefined = undefined;

  do {
    const url = cursor
      ? `${this.baseUrl}/blog-posts?cursor=${cursor}`
      : `${this.baseUrl}/blog-posts`;
    const response = await fetch(url);
    const { items, nextCursor } = await response.json();

    for (const item of items) {
      yield {
        title: item.title,
        text: item.body,
        location: `/blog-posts/${item.id}`,
      };
    }

    cursor = nextCursor;
  } while (cursor);
}
```

:::

### Testing the collator

The generated test file at
`src/collator/BlogPostsCollatorFactory.test.ts` uses `TestPipeline` from
`@backstage/plugin-search-backend-node` to run the collator and verify its
output. Update the tests to match your implementation:

```ts title="plugins/search-backend-module-blog-posts/src/collator/BlogPostsCollatorFactory.test.ts"
import { BlogPostsCollatorFactory } from './BlogPostsCollatorFactory';
import { mockServices } from '@backstage/backend-test-utils';
import { TestPipeline } from '@backstage/plugin-search-backend-node';

const mockPosts = [
  {
    id: '1',
    title: 'Getting Started',
    body: 'Welcome to our engineering blog',
    author: 'Alice',
  },
  {
    id: '2',
    title: 'Best Practices',
    body: 'Tips for writing great code',
    author: 'Bob',
  },
];

describe('BlogPostsCollatorFactory', () => {
  beforeEach(() => {
    global.fetch = jest.fn().mockResolvedValue({
      json: async () => mockPosts,
    });
  });

  it('returns a collator with the correct type', async () => {
    const factory = BlogPostsCollatorFactory.fromConfig(
      mockServices.rootConfig({
        data: { blogPosts: { baseUrl: 'http://localhost' } },
      }),
      { logger: mockServices.logger.mock() },
    );

    expect(factory.type).toBe('blog-posts');
  });

  it('runs the collator and returns documents', async () => {
    const factory = BlogPostsCollatorFactory.fromConfig(
      mockServices.rootConfig({
        data: { blogPosts: { baseUrl: 'http://localhost' } },
      }),
      { logger: mockServices.logger.mock() },
    );

    const collator = await factory.getCollator();
    const { error, documents } = await TestPipeline.fromCollator(
      collator,
    ).execute();

    expect(error).toBeUndefined();
    expect(documents).toHaveLength(2);
    expect(documents[0]).toMatchObject({
      title: 'Getting Started',
      text: 'Welcome to our engineering blog',
      location: '/blog-posts/1',
    });
  });
});
```

### Configuring the schedule

The generated module reads an optional schedule from `app-config.yaml`.
Without configuration, the collator runs every 10 minutes. To customize the
schedule:

```yaml title="app-config.yaml"
search:
  collators:
    blogPosts:
      schedule: # same options as in SchedulerServiceTaskScheduleDefinition
        # supports cron, ISO duration, "human duration" as used in code
        initialDelay: { seconds: 90 }
        # supports cron, ISO duration, "human duration" as used in code
        frequency: { hours: 6 }
        # supports ISO duration, "human duration" as used in code
        timeout: { minutes: 3 }
```

### Customizing search result presentation

Search results from a custom collator appear automatically using the default
result list item. To customize how results are presented, create a frontend
module that extends the search plugin with a custom result list item.

#### Scaffolding a frontend module

Run the following command from your Backstage root directory:

```bash title="From your Backstage root directory"
yarn new --select frontend-plugin-module
```

When prompted, enter `search` for the plugin ID and `blog-posts` for the
module ID. The template creates a new package at
`plugins/search-module-blog-posts/` and adds it as a dependency in
`packages/app/package.json`. The new frontend system auto-discovers the
module from there.

#### Creating the result list item component

Add a component that renders a single search result. Each result includes
`title`, `text`, and `location` fields from the collator:

```tsx title="plugins/search-module-blog-posts/src/components/BlogPostSearchResultListItem.tsx"
import { Link } from '@backstage/core-components';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import { IndexableDocument } from '@backstage/plugin-search-common';
import { ReactNode } from 'react';

export interface BlogPostSearchResultListItemProps {
  icon?: ReactNode;
  result?: IndexableDocument;
  rank?: number;
}

export function BlogPostSearchResultListItem(
  props: BlogPostSearchResultListItemProps,
) {
  const { icon, result } = props;

  if (!result) return null;

  return (
    <>
      {icon && <ListItemIcon>{icon}</ListItemIcon>}
      <ListItemText
        primaryTypographyProps={{ variant: 'h6' }}
        primary={<Link to={result.location}>{result.title}</Link>}
        secondary={result.text}
      />
    </>
  );
}
```

#### Registering the result list item

Update the generated `src/module.tsx` to register a
`SearchResultListItemBlueprint` with a `predicate` that matches results from
your collator. The `predicate` checks the result `type` field, which must
match the `type` property set in your collator factory — in this example,
`blog-posts`:

```tsx title="plugins/search-module-blog-posts/src/module.tsx"
import { createFrontendModule } from '@backstage/frontend-plugin-api';
import { SearchResultListItemBlueprint } from '@backstage/plugin-search-react/alpha';

const blogPostSearchResultListItem = SearchResultListItemBlueprint.make({
  name: 'blog-posts',
  params: {
    predicate: result => result.type === 'blog-posts',
    component: () =>
      import('./components/BlogPostSearchResultListItem').then(
        m => m.BlogPostSearchResultListItem,
      ),
  },
});

export const searchModuleBlogPosts = createFrontendModule({
  pluginId: 'search',
  extensions: [blogPostSearchResultListItem],
});
```
