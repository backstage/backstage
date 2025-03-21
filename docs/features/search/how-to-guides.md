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
[Customize the look-and-feel of your App](https://backstage.io/docs/getting-started/app-custom-theme)
to create an override with your preferred styling.

For example, using the new MUI V4+V5 unified theming method, the following will result
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

```typescript jsx title= packages/app/src/App.tsx

const app : BackstageApp = createApp({
  ...
  themes: [{
    id: 'my-light-theme',
    title: 'Light Theme',
    variant: 'light',
    icon: <LightIcon />,
    Provider: ({ children }) => (<UnifiedThemeProvider theme={myLightTheme} children={children } />)
  }]
});
```

Obviously if you wanted a dark theme, you would need to provide that as well.

## How to render search results using extensions

Extensions for search results let you customize components used to render search result items, It is possible to provide your own search result item extensions or use the ones provided by plugin packages.

### 1. Providing an extension in your plugin package

> Note: You must use the `plugin.provide()` function to make a search item renderer available. Unlike rendering a list in a standard MUI Table or similar, you cannot simply provide
> a rendering function to the `<SearchResult />` component.

Using the example below, you can provide an extension to be used as a search result item:

```tsx title="plugins/your-plugin/src/plugin.ts"
import { createPlugin } from '@backstage/core-plugin-api';
import { createSearchResultListItemExtension } from '@backstage/plugin-search-react';

const plugin = createPlugin({ id: 'YOUR_PLUGIN_ID' });

export const YourSearchResultListItemExtension = plugin.provide(
  createSearchResultListItemExtension({
    name: 'YourSearchResultListItem',
    component: () =>
      import('./components').then(m => m.YourSearchResultListItem),
  }),
);
```

If your list item accept props, you can extend the `SearchResultListItemExtensionProps` with your component specific props:

```tsx
export const YourSearchResultListItemExtension: (
  props: SearchResultListItemExtensionProps<YourSearchResultListItemProps>,
) => JSX.Element | null = plugin.provide(
  createSearchResultListItemExtension({
    name: 'YourSearchResultListItem',
    component: () =>
      import('./components').then(m => m.YourSearchResultListItem),
  }),
);
```

Additionally, you can define a predicate function that receives a result and returns whether your extension should be used to render it or not:

```tsx title="plugins/your-plugin/src/plugin.ts"
import { createPlugin } from '@backstage/core-plugin-api';
import { createSearchResultListItemExtension } from '@backstage/plugin-search-react';

const plugin = createPlugin({ id: 'YOUR_PLUGIN_ID' });

export const YourSearchResultListItemExtension = plugin.provide(
  createSearchResultListItemExtension({
    name: 'YourSearchResultListItem',
    component: () =>
      import('./components').then(m => m.YourSearchResultListItem),
    // Only results matching your type will be rendered by this extension
    predicate: result => result.type === 'YOUR_RESULT_TYPE',
  }),
);
```

Remember to export your new extension via your plugin's `index.ts` so that it is available from within your app:

```tsx title="plugins/your-plugin/src/index.ts"
export { YourSearchResultListItem } from './plugin.ts';
```

For more details, see the [createSearchResultListItemExtension](https://backstage.io/docs/reference/plugin-search-react.createsearchresultlistitemextension) API reference.

### 2. Custom search result extension in the SearchPage

Once you have exposed your item renderer via the `plugin.provide()` function, you can now override the default search item renderers and tell the `<SearchResult>` component
which renderers to use. Note that the order of the renderers matters! The first one that matches via its predicate function will be used.

Here is an example of customizing your `SearchPage`:

```tsx title="packages/app/src/components/searchPage.tsx"
import React from 'react';

import { Grid, Paper } from '@material-ui/core';
import BuildIcon from '@material-ui/icons/Build';

import {
  Page,
  Header,
  Content,
  DocsIcon,
  CatalogIcon,
} from '@backstage/core-components';
import { SearchBar, SearchResult } from '@backstage/plugin-search-react';

// Your search result item extension
import { YourSearchResultListItem } from '@backstage/your-plugin';

// Extensions provided by other plugin developers
import { ToolSearchResultListItem } from '@backstage/plugin-explore';
import { TechDocsSearchResultListItem } from '@backstage/plugin-techdocs';
import { CatalogSearchResultListItem } from '@internal/plugin-catalog-customized';

// This example omits other components, like filter and pagination
const SearchPage = () => (
  <Page themeId="home">
    <Header title="Search" />
    <Content>
      <Grid container direction="row">
        <Grid item xs={12}>
          <Paper>
            <SearchBar />
          </Paper>
        </Grid>
        <Grid item xs={12}>
          <SearchResult>
            <YourSearchResultListItem />
            <CatalogSearchResultListItem icon={<CatalogIcon />} />
            <TechDocsSearchResultListItem icon={<DocsIcon />} />
            <ToolSearchResultListItem icon={<BuildIcon />} />
          </SearchResult>
        </Grid>
      </Grid>
    </Content>
  </Page>
);

export const searchPage = <SearchPage />;
```

> **Important**: A default result item extension (one that does not have a predicate) should be placed as the last child, so it can be used only when no other extensions match the result being rendered.
> If a non-default extension is specified, the `DefaultResultListItem` component will be used.

### 2. Custom search result extension in the SidebarSearchModal

You may be using the SidebarSearchModal component. In this case, you can customize the search items in this component as follows:

```tsx title="packages/app/src/components/Root/Root.tsx"
import { SidebarSearchModal } from '@backstage/plugin-search';
...
export const Root = ({ children }: PropsWithChildren<{}>) => {
  const styles = useStyles();

  return <SidebarPage>
    <Sidebar>
      ...
      <SidebarSearchModal resultItemComponents={[
        /* Provide a custom Extension search item renderer */
        <CustomSearchResultListItem icon={<CatalogIcon />} />,
        /* Provide an existing search item renderer */
        <TechDocsSearchResultListItem icon={<DocsIcon />} />
      ]} />
      ...
    </Sidebar>
    {children}
  </SidebarPage>;
};
```

### 3. Custom search result extension in a custom SearchModal

Assuming you have completely customized your SearchModal, here's an example that renders results with extensions:

```tsx title="packages/app/src/components/searchModal.tsx"
import React from 'react';

import { DialogContent, DialogTitle, Paper } from '@material-ui/core';
import BuildIcon from '@material-ui/icons/Build';

import { DocsIcon, CatalogIcon } from '@backstage/core-components';
import { SearchBar, SearchResult } from '@backstage/plugin-search-react';

// Your search result item extension
import { YourSearchResultListItem } from '@backstage/your-plugin';

// Extensions provided by other plugin developers
import { ToolSearchResultListItem } from '@backstage/plugin-explore';
import { TechDocsSearchResultListItem } from '@backstage/plugin-techdocs';
import { CatalogSearchResultListItem } from '@internal/plugin-catalog-customized';

export const SearchModal = ({ toggleModal }: { toggleModal: () => void }) => (
  <>
    <DialogTitle>
      <Paper>
        <SearchBar />
      </Paper>
    </DialogTitle>
    <DialogContent>
      <SearchResult onClick={toggleModal}>
        <CatalogSearchResultListItem icon={<CatalogIcon />} />
        <TechDocsSearchResultListItem icon={<DocsIcon />} />
        <ToolSearchResultListItem icon={<BuildIcon />} />
        {/* As a "default" extension, it does not define a predicate function,
        so it must be the last child to render results that do not match the above extensions */}
        <YourSearchResultListItem />
      </SearchResult>
    </DialogContent>
  </>
);
```

There are other more specific search results layout components that also accept result item extensions, check their documentation: [SearchResultList](https://backstage.io/storybook/?path=/story/plugins-search-searchresultlist--with-result-item-extensions) and [SearchResultGroup](https://backstage.io/storybook/?path=/story/plugins-search-searchresultgroup--with-result-item-extensions).
