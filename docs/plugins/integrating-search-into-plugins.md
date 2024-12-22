---
id: integrating-search-into-plugins
title: Integrating Search into a plugin
description: How to integrate Search into a Backstage plugin
---

:::info
This documentation is written for [the new backend system](../backend-system/index.md) which is the default since Backstage [version 1.24](../releases/v1.24.0.md). If you are still on the old backend system, you may want to read [its own article](./integrating-search-into-plugins--old.md) instead, and [consider migrating](../backend-system/building-backends/08-migrating.md)!
:::

The Backstage Search Platform was designed to give plugin developers the APIs
and interfaces needed to offer search experiences within their plugins, while
abstracting away (and instead empowering application integrators to choose) the
specific underlying search technologies.

On this page, you'll find concepts and tutorials for leveraging the Backstage
Search Platform in your plugin.

## Providing data to the search platform

### Create a collator

> Knowing what a [collator](../features/search/concepts.md#collators) is will help you as you build it out.

Imagine you have a plugin that is responsible for storing FAQ snippets in a database. You want other engineers to be able to easily find your questions and answers. So that means you want them to be indexed by the search platform. Lets say the FAQ snippets can be viewed at a URL like `backstage.example.biz/faq-snippets`.

The search platform provides an interface (`DocumentCollatorFactory` from package `@backstage/plugin-search-common`) that allows you to do exactly that. It works by registering each of your entries as a "document" that later represents one search result each.

> You can always look at a working example, e.g. [StackOverflowQuestionsCollatorFactory](https://github.com/backstage/backstage/blob/master/plugins/search-backend-module-stack-overflow-collator/src/collators/StackOverflowQuestionsCollatorFactory.ts), if you are unsure or want to follow best practices.

#### 1. Create a collator module package

In order to add an FAQ collator to the Backstage index registry we have to create a [plugin module](https://backstage.io/docs/backend-system/building-plugins-and-modules/index#modules), and the best way to do this is to create it in a separate package, e.g., `plugins/search-backend-module-faq-snippets-collator`, using the `yarn new` command:

1. Access your Backstage project root directory and run `yarn new`;
2. When asked about what do you want to create, please select `backend-module` and hit enter;
3. Input `search` as the plugin ID and `faq-snippets-collator` as the module ID;
4. A `search-backend-module-faq-snippets-collator` folder should have been created in your project's "plugins" directory.

#### 2. Install the collator dependencies

We will use some libraries in the module, so let's add them to your plugin module dependencies:

```sh
# Create a new branch using Git command-line
git checkout -b tutorials/new-faq-snippets-collator

# Install the package containing the interface
yarn workspace @internal/backstage-plugin-search-backend-module-faq-snippets-collator add node-fetch @backstage/plugin-search-common @backstage/plugin-search-backend-node
```

#### 3. Use Backstage App configuration

Your new collator could benefit from using configuration directly from the Backstage `app-config.yaml` file which is located on the project's root folder:

```yaml
faq:
  baseUrl: https://backstage.example.biz/faq-snippets
```

It is optional to define a schedule for the collator to run, or else it defaults to the value in the collator factory code (See [5. Implement the collator factory](#5-implement-the-collator-factory)):

```yaml
faq:
  baseUrl: https://backstage.example.biz/faq-snippets
  /* highlight-add-start */
  schedule:
    # supports cron, ISO duration, "human duration" as used in code
    frequency: { minutes: 30 }
    # supports ISO duration, "human duration" as used in code
    timeout: { minutes: 3 }
  /* highlight-add-end */
```

#### 4. Define the collator document type

Before we can start generating documents from our FAQ entries, we first have to define a document type containing all necessary information we need to later display our entry as search result. The package `@backstage/plugin-search-common` we installed earlier contains a type `IndexableDocument` that we can extend.

Create a new file `plugins/search-backend-module-faq-snippets-collator/src/types.ts` and paste the following below:

```ts
import { IndexableDocument } from '@backstage/plugin-search-common';

export interface FaqSnippetDocument extends IndexableDocument {
  answered_by: string;
}
```

#### 5. Implement the collator factory

Imagine your FAQs can be retrieved at the URL `https://backstage.example.biz/faq-snippets` with following JSON response format:

```json
{
  "items": [
    {
      "id": 42,
      "question": "What is The Answer to the Ultimate Question of Life, the Universe, and Everything?",
      "answer": "Forty-two",
      "user": "Deep Thought"
    }
  ]
}
```

Below we provide an example implementation of how the FAQ collator factory could look like using our new document type, placed in the `plugins/search-backend-module-faq-snippets-collator/src/factory.ts` file:

```ts
import { Readable } from 'stream';
import {
  LoggerService,
  RootConfigService,
} from '@backstage/backend-plugin-api';
import { DocumentCollatorFactory } from '@backstage/plugin-search-common';
import { FaqSnippetDocument } from './types';

const DEFAULT_BASE_URL = 'https://backstage.example.biz/faq-snippets';

export class FaqSnippetsCollatorFactory implements DocumentCollatorFactory {
  public readonly type: string = 'faq-snippets';
  private readonly baseUrl: string;
  private readonly logger: LoggerService;

  private constructor(options: { logger: LoggerService; baseUrl: string }) {
    this.baseUrl = options.baseUrl;
    this.logger = options.logger;
  }

  static fromConfig(
    config: RootConfigService,
    options: {
      logger: LoggerService;
    },
  ) {
    const baseUrl = config.getOptionalString('faq.baseUrl') ?? DEFAULT_BASE_URL;
    return new FaqSnippetsCollatorFactory({ ...options, baseUrl });
  }

  async getCollator() {
    return Readable.from(this.execute());
  }

  async *execute(): AsyncGenerator<FaqSnippetDocument> {
    this.logger.info(`Fetching faq snippets from ${this.baseUrl}`);
    const response = await fetch(this.baseUrl);
    const data = await response.json();
    for (const faq of data.items) {
      yield {
        title: faq.question,
        location: `/faq-snippets/${faq.id}`,
        text: faq.answer,
        answered_by: faq.user,
      };
    }
  }
}
```

#### 6. Implement the collator plugin module

Now we have to connect the search backend plugin with our FAQ Snippets collator factory, so replace the `module.ts` file with the content below:

```ts title='plugins/search-backend-module-faq-snippets-collator/src/module.ts'
import {
  coreServices,
  createBackendModule,
  readSchedulerServiceTaskScheduleDefinitionFromConfig,
} from '@backstage/backend-plugin-api';
import { searchIndexRegistryExtensionPoint } from '@backstage/plugin-search-backend-node/alpha';
import { FaqSnippetsCollatorFactory } from './factory';

export const searchFaqSnippetsCollatorModule = createBackendModule({
  pluginId: 'search',
  moduleId: 'faq-snippets-collator',
  register(env) {
    env.registerInit({
      deps: {
        config: coreServices.rootConfig,
        logger: coreServices.logger,
        scheduler: coreServices.scheduler,
        indexRegistry: searchIndexRegistryExtensionPoint,
      },
      async init({ config, logger, scheduler, indexRegistry }) {
        const defaultSchedule = {
          frequency: { minutes: 10 },
          timeout: { minutes: 15 },
          initialDelay: { seconds: 3 },
        };

        const schedule = config.has('faq.schedule')
          ? readSchedulerServiceTaskScheduleDefinitionFromConfig(
              config.getConfig('faq.schedule'),
            )
          : defaultSchedule;

        indexRegistry.addCollator({
          schedule: scheduler.createScheduledTaskRunner(schedule),
          factory: FaqSnippetsCollatorFactory.fromConfig(config, { logger }),
        });
      },
    });
  },
});
```

In the fragment above, the module is registered, and when the Backstage backend initializes it, it adds the FAQ Snippets collator to the search index registry. Now let's export the module as default from the `index.ts` file:

```ts title='plugins/search-backend-module-faq-snippets-collator/src/index.ts'
export { searchFaqSnippetsCollatorModule as default } from './module';
```

#### 7. Install the collator module

The newly created module should be added to the backend package dependencies as follows:

```sh
yarn --cwd packages/backend add @internal/backstage-plugin-search-backend-module-faq-snippets-collator
```

After that, install the module on your Backstage backend instance:

```ts title='packages/backend/src/index.ts'
import { createBackend } from '@backstage/backend-defaults';
//...
const backend = createBackend();
// Installing the search backend plugin
backend.add(import('@backstage/plugin-search-backend'));
// Installing the newly created faq snippets collator module
backend.add(
  import(
    '@internal/backstage-plugin-search-backend-module-faq-snippets-collator'
  ),
);
//...
backend.start();
```

#### 8. Testing the collator code

To verify your implementation works as expected make sure to add tests for it. For your convenience, there is the [`TestPipeline`](https://backstage.io/docs/reference/plugin-search-backend-node.testpipeline) utility that emulates a pipeline into which you can integrate your custom collator.

Look at [DefaultTechDocsCollatorFactory test](https://github.com/backstage/backstage/blob/de294ce5c410c9eb56da6870a1fab795268f60e3/plugins/techdocs-backend/src/search/DefaultTechDocsCollatorFactory.test.ts), for an example.

You can also check out the documentation on [how to test Backstage plugin modules](../backend-system/building-plugins-and-modules/02-testing.md).

#### 9. Running the collator locally

Run `yarn dev` in the root folder of your Backstage project and look for logs like these:

```sh
[backend]: YYYY-MM-DDTHH:MM:SS.000Z search info Task worker starting: search_index_faq_snippets, {"version":2,"cadence":"PT10M","initialDelayDuration":"PT3S","timeoutAfterDuration":"PT15M"} task=search_index_faq_snippets
[backend]: YYYY-MM-DDTHH:MM:SS.000Z search info Collating documents for faq-snippets via FaqSnippetsCollatorFactory documentType=faq-snippets
[backend]: YYYY-MM-DDTHH:MM:SS.000Z search info Fetching faq snippets from https://backstage.example.biz/faq-snippets
[backend]: YYYY-MM-DDTHH:MM:SS.000Z search info Collating documents for faq-snippets succeeded documentType=faq-snippets
```

It means that the collator task was started and completed successfully. Visit http://localhost:3000, log in, select the 'All' tab, and type in one of your snippets title in the search box.

Results should appear for snippets.

#### 10. Make your plugins collator discoverable for others

If you want to make your collator discoverable for other adopters, add it to the list of [plugins integrated to search](https://backstage.io/docs/features/search/#plugins-integrated-with-backstage-search).

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

#### Custom search results

Search results throughout Backstage are rendered as lists so that list items can easily be customized; although a [default result list item](https://backstage.io/storybook/?path=/story/plugins-search-defaultresultlistitem--default) is available, plugins are in the best position to provide custom result list items that surface relevant information only known to the plugin.

The example below imagines `YourCustomSearchResult` as a type of search result that contains associated `tags` which could be rendered as chips below the title/text.

```tsx
import { Link } from '@backstage/core-components';
import { useAnalytics } from '@backstage/core-plugin-api';
import { ResultHighlight } from '@backstage/plugin-search-common';
import { HighlightedSearchResultText } from '@backstage/plugin-search-react';

type CustomSearchResultListItemProps = {
  result: YourCustomSearchResult;
  rank?: number;
  highlight?: ResultHighlight;
};

export const CustomSearchResultListItem = (
  props: CustomSearchResultListItemProps,
) => {
  const { title, text, location, tags } = props.result;

  const analytics = useAnalytics();
  const handleClick = () => {
    analytics.captureEvent('discover', title, {
      attributes: { to: location },
      value: props.rank,
    });
  };

  return (
    <Link noTrack to={location} onClick={handleClick}>
      <ListItem alignItems="center">
        <Box flexWrap="wrap">
          <ListItemText
            primaryTypographyProps={{ variant: 'h6' }}
            primary={
              highlight?.fields?.title ? (
                <HighlightedSearchResultText
                  text={highlight.fields.title}
                  preTag={highlight.preTag}
                  postTag={highlight.postTag}
                />
              ) : (
                title
              )
            }
            secondary={
              highlight?.fields?.text ? (
                <HighlightedSearchResultText
                  text={highlight.fields.text}
                  preTag={highlight.preTag}
                  postTag={highlight.postTag}
                />
              ) : (
                text
              )
            }
          />
          {tags &&
            tags.map((tag: string) => (
              <Chip key={tag} label={`Tag: ${tag}`} size="small" />
            ))}
        </Box>
      </ListItem>
      <Divider />
    </Link>
  );
};
```

The optional use of the `<HighlightedSearchResultText>` component makes it possible to highlight relevant parts of the result based on the user's search query.

**Note on Analytics**: In order for app integrators to track and improve search experiences across Backstage, it's important for them to understand when and what users search for, as well as what they click on after searching. When providing a custom result component, it's your responsibility as a plugin developer to instrument it according to search analytics conventions. In particular:

- You must use the `analytics.captureEvent` method, from the `useAnalytics()` hook (detailed [plugin analytics docs are here](./analytics.md)).
- You must ensure that the action of the event, representing a click on a search result item, is `discover`, and the subject is the `title` of the clicked result. In addition, the `to` attribute should be set to the result's `location`, and the `value` of the event must be set to the `rank` (passed in as a prop).
- You must ensure that the aforementioned `captureEvent` method is called when a user clicks the link; you should further ensure that the `noTrack` prop is added to the link (which disables default link click tracking, in favor of this custom instrumentation).

For other examples and inspiration on custom result list items, check out the [`<StackOverflowSearchResultListItem>`](https://github.com/backstage/backstage/blob/c981e83/plugins/stack-overflow/src/search/StackOverflowSearchResultListItem/StackOverflowSearchResultListItem.tsx) or [`<CatalogSearchResultListItem>`](https://github.com/backstage/backstage/blob/c981e83/plugins/catalog/src/components/CatalogSearchResultListItem/CatalogSearchResultListItem.tsx) components.
