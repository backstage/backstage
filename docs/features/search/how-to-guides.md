---
id: how-to-guides
title: Search How-To guides
sidebar_label: How-To guides
description: Search How To guides
---

::::info
This documentation is written for the new frontend system, which is the default
in new Backstage apps. If your Backstage app still uses the old frontend system,
read the [old frontend system version of this guide](./how-to-guides--old.md)
instead.
::::

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

2. Override the default API extension by creating a custom API extension using
   `createApiExtension` from `@backstage/frontend-plugin-api`, and install it
   in your app. See the [Utility APIs](../../frontend-system/utility-apis/01-index.md) documentation for details on how to create and install custom API extensions.

## How to customize fields in the Software Catalog or TechDocs index

Sometimes, you might want to have the ability to control which data passes into the search index
in the catalog collator or customize data for a specific kind. You can easily achieve this
by passing an `entityTransformer` callback to the `DefaultCatalogCollatorFactory`. This behavior
is also possible for the `DefaultTechDocsCollatorFactory`. You can either simply amend the default behavior
or even write an entirely new document (which should still follow some required basic structure).

> `authorization` and `location` cannot be modified via a `entityTransformer`, `location` can be modified only through `locationTemplate`.

```ts title="packages/backend/src/plugins/search.ts"
const catalogEntityTransformer: CatalogCollatorEntityTransformer = (
  entity: Entity,
) => {
  if (entity.kind === 'SomeKind') {
    return {
      // customize here output for 'SomeKind' kind
    };
  }

  return {
    // and customize default output
    ...defaultCatalogCollatorEntityTransformer(entity),
    text: 'my super cool text',
  };
};

indexBuilder.addCollator({
  collator: DefaultCatalogCollatorFactory.fromConfig(env.config, {
    discovery: env.discovery,
    tokenManager: env.tokenManager,
    /* highlight-add-next-line */
    entityTransformer: catalogEntityTransformer,
  }),
});

const techDocsEntityTransformer: TechDocsCollatorEntityTransformer = (
  entity: Entity,
) => {
  return {
    // add more fields to the index
    tags: entity.metadata.tags,
  };
};

const techDocsDocumentTransformer: TechDocsCollatorDocumentTransformer = (
  doc: MkSearchIndexDoc,
) => {
  return {
    // add more fields to the index
    bost: doc.boost,
  };
};

indexBuilder.addCollator({
  collator: DefaultTechDocsCollatorFactory.fromConfig(env.config, {
    discovery: env.discovery,
    tokenManager: env.tokenManager,
    /* highlight-add-next-line */
    entityTransformer: techDocsEntityTransformer,
    /* highlight-add-next-line */
    documentTransformer: techDocsDocumentTransformer,
  }),
});
```

## How to customize search results highlighting styling

The default highlighting styling for matched terms in search results is your
browsers default styles for the `<mark>` HTML tag. If you want to customize
how highlighted terms look you can follow Backstage's guide on how to
[Customizing Your App's UI](https://backstage.io/docs/conf/user-interface)
to create an override with your preferred styling.

For example, using the unified theming method, the following will result
in highlighted words to be bold & underlined:

```typescript jsx title=packages/app/src/theme/theme.ts
import {
  createBaseThemeOptions,
  createUnifiedTheme,
  palettes,
  UnifiedTheme,
} from '@backstage/theme';

export const myLightTheme: UnifiedTheme = createUnifiedTheme({
  ...createBaseThemeOptions({
    palette: palettes.light,
  }),
  defaultPageTheme: 'home',
  components: {
    /** @ts-ignore This is temporarily necessary until MUI V5 transition is completed. */
    BackstageHighlightedSearchResultText: {
      styleOverrides: {
        highlight: {
          color: 'inherit',
          backgroundColor: 'inherit',
          fontWeight: 'bold',
          textDecoration: 'underline',
        },
      },
    },
  },
});
```

Custom themes are installed as extensions in the new frontend system. See the
[theming documentation](../../frontend-system/building-apps/02-configuring-extensions.md)
for details on how to install custom themes.

## How to render search results using extensions

Extensions for search results let you customize components used to render
search result items. It is possible to provide your own search result item
extensions or use the ones provided by plugin packages.

### Providing a search result list item extension

In the new frontend system, search result list item extensions are created
using the `SearchResultListItemBlueprint` from
`@backstage/plugin-search-react/alpha`:

```tsx title="plugins/your-plugin/src/extensions.ts"
import { SearchResultListItemBlueprint } from '@backstage/plugin-search-react/alpha';

export const YourSearchResultListItem = SearchResultListItemBlueprint.make({
  name: 'your-result-item',
  params: {
    predicate: result => result.type === 'YOUR_RESULT_TYPE',
    component: async () => {
      const { YourSearchResultListItem } = await import('./components');
      return YourSearchResultListItem;
    },
  },
});
```

The extension is then exported from your plugin's alpha entry point and
automatically discovered when the plugin is installed.

If you need to provide a search result list item extension from your app
rather than a plugin, wrap it in a frontend module and pass it to `createApp`:

```tsx title="packages/app/src/search/searchModule.ts"
import { createFrontendModule } from '@backstage/frontend-plugin-api';
import { YourSearchResultListItem } from './YourSearchResultListItem';

export const searchCustomizations = createFrontendModule({
  pluginId: 'search',
  extensions: [YourSearchResultListItem],
});
```

```tsx title="packages/app/src/App.tsx"
import { createApp } from '@backstage/frontend-defaults';
import { searchCustomizations } from './search/searchModule';

const app = createApp({
  features: [searchCustomizations],
});

export default app.createRoot();
```

### Search result item ordering

When multiple search result list item extensions are installed, the search page
uses them to render results based on their predicate functions. The first
extension whose predicate matches a given result is used to render it. Extensions
without a predicate act as fallback renderers and should be ordered last.

There are other more specific search results layout components that also accept result item extensions, check their documentation: [SearchResultList](https://backstage.io/storybook/?path=/story/plugins-search-searchresultlist--with-result-item-extensions) and [SearchResultGroup](https://backstage.io/storybook/?path=/story/plugins-search-searchresultgroup--with-result-item-extensions).
