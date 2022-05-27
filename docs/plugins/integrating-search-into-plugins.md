---
id: integrating-search-into-plugins
title: Integrating Search into a plugin
description: How to integrate Search into a Backstage plugin
---

The Backstage Search Platform was designed to give plugin developers the APIs
and interfaces needed to offer search experiences within their plugins, while
abstracting away (and instead empowering application integrators to choose) the
specific underlying search technologies.

On this page, you'll find concepts and tutorials for leveraging the Backstage
Search Platform in your plugin.

## Providing data to the search platform

> A guide on how to create collators is coming soon!

## Building a search experience into your plugin

While the core Search plugin offers components and extensions that empower app
integrators to compose a global search experience, you may find that you want a
narrower search experience just within your plugin. This could be as literal as
an autocomplete-style search bar focused on documents provided by your plugin
(for example, the [TechDocsSearch](https://github.com/backstage/backstage/blob/master/plugins/techdocs/src/search/components/TechDocsSearch.tsx)
component), or as abstract as a widget that presents a list of links that
are contextually related to something else on the page.

### Search Experience Concepts

Knowing these high-level concepts will help you as you craft your in-plugin
search experience.

- All search experiences must be wrapped in a `<SearchContextProvider>`, which
  is provided by `@backstage/plugin-search-react`. This context keeps track
  of state necessary to perform search queries and display any results. As
  inputs to the query are updated (e.g. a `term` or `filter` values), the
  updated query is executed and `results` are refreshed. Check out the
  [SearchContextValue](https://backstage.io/docs/reference/plugin-search-react.searchcontextvalue)
  for details.
- The aforementioned state can be modified and/or consumed via the
  `useSearch()` hook, also exported by `@backstage/plugin-search-react`.
- For more literal search experiences, reusable components are available
  to import and compose into a cohesive experience in your plugin (e.g.
  `<SearchBar />` or `<SearchFilter.Checkbox />`). You can see all such
  components in [Backstage's storybook](https://backstage.io/storybook/?path=/story/plugins-search-searchbar--default).

### Search Experience Tutorials

The following tutorials make use of packages and plugins that you may not yet
have as dependencies for your plugin; be sure to add them before you use them!

- [`@backstage/plugin-search-react`](https://www.npmjs.com/package/@backstage/plugin-search-react) - A
  package containing components, hooks, and types that are shared across all
  frontend plugins, including plugins like yours!
- [`@backstage/plugin-search`](https://www.npmjs.com/package/@backstage/plugin-search) - The
  main search plugin, used by app integrators to compose global search
  experiences. <!-- todo(@backstage/techdocs-core): remove all references to @backstage/plugin-search once #11676 is resolved -->
- [`@backstage/core-components`](https://www.npmjs.com/package/@backstage/core-components) - A
  package containing generic components useful for a variety of experiences
  built in Backstage.

#### Improved "404" page experience

Imagine you have a plugin that allows users to manage _widgets_. Perhaps they
can be viewed at a URL like `backstage.example.biz/widgets/{widgetName}`.
At some point, a widget is renamed, and links to that widget's page from
chat systems, wikis, or browser bookmarks become stale, resulting in errors or
404s.

What if instead of showing a broken page or the generic "looks like someone
dropped the mic" 404 page, you showed a list of possibly related widgets?

```javascript
import { Link } from '@backstage/core-components';
import { SearchResult } from '@backstage/plugin-search';
import { SearchContextProvider } from '@backstage/plugin-search-react';

export const Widget404Page = ({ widgetName }) => {
  // Supplying this to <SearchContextProvider> runs a pre-filtered search with
  // the given widgetName as the search term, focused on search result of type
  // "widget" with no other filters.
  const preFiltered = {
    term: widgetName,
    types: ['widget'],
    filters: {},
  };

  return (
    <SearchContextProvider initialState={preFiltered}>
      {/* The <SearchResult> component allows us to iterate through results and
          display them in whatever way fits best! */}
      <SearchResult>
        {({ results }) => (
          {results.map(({ document }) => (
            <Link to={document.location} key={document.location}>
              {document.title}
            </Link>
          ))}
        )}
      <SearchResult>
    </SearchContextProvider>
  );
);
```

Not all search experiences require user input! As you can see, it's possible to
leverage the Backstage Search Platform's frontend framework without necessarily
giving users input controls.

#### Simple search page

Of course, it's also possible to provide a more fully featured search
experience in your plugin. The simplest way is to leverage reusable components
provided by the `@backstage/plugin-search` package, like this:

```javascript
import { useProfile } from '@internal/api';
import {
  Content,
  ContentHeader,
  PageWithHeader,
} from '@backstage/core-components';
import { SearchBar, SearchResult } from '@backstage/plugin-search';
import { SearchContextProvider } from '@backstage/plugin-search-react';

export const ManageMyWidgets = () => {
  const { primaryTeam } = useProfile();
  // In this example, note how we are pre-filtering results down to a specific
  // owner field value (the currently logged-in user's team), but allowing the
  // search term to be controlled by the user via the <SearchBar /> component.
  const preFiltered = {
    types: ['widget'],
    term: '',
    filters: {
      owner: primaryTeam,
    },
  };

  return (
    <PageWithHeader title="Widgets Home">
      <Content>
        <ContentHeader title="All your Widgets and More" />
        <SearchContextProvider initialState={preFiltered}>
          <SearchBar />
          <SearchResult>
            {/* Render results here, just like above */}
          </SearchResult>
        </SearchContextProvider>
      </Content>
    </PageWithHeader>
  );
};
```

#### Custom search control surfaces

If the reusable search components provided by `@backstage/plugin-search` aren't
adequate, no problem! There's an API in place that you can use to author your
own components to control the various parts of the search context.

```javascript
import { useSearch } from '@backstage/plugin-search-react';
import ChipInput from 'material-ui-chip-input';

export const CustomChipFilter = ({ name }) => {
  const { filters, setFilters } = useSearch();
  const chipValues = filters[name] || [];

  // When a chip value is changed, update the filters value by calling the
  // setFilters function from the search context.
  const handleChipChange = (chip, index) => {
    // There may be filters set for other fields. Be sure to maintain them.
    setFilters(prevState => {
      const { [name]: filter = [], ...others } = prevState;

      if (index === undefined) {
        filter.push(chip);
      } else {
        filter.splice(index, 1);
      }

      return { ...others, [name]: filter };
    });
  };

  return (
    <ChipInput
      value={chipValues}
      onAdd={handleChipChange}
      onDelete={handleChipChange}
    />
  );
};
```

Check out the [SearchContextValue type](https://github.com/backstage/backstage/blob/master/plugins/search-react/src/context/SearchContext.tsx)
for more details on what methods and values are available for manipulating and
reading the search context.

If you produce something generic and reusable, consider contributing your
component upstream so that all users of the Backstage Search Platform can
benefit. Issues and pull requests welcome.
