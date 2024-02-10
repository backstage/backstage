# Home

The Home plugin introduces a system for composing a Home Page for Backstage in order to surface relevant info and provide convenient shortcuts for common tasks. It's designed with composability in mind with an open ecosystem that allows anyone to contribute with any component, to be included in any Home Page.

For App Integrators, the system is designed to be composable to give total freedom in designing a Home Page that suits the needs of the organization. From the perspective of a Component Developer who wishes to contribute with building blocks to be included in Home Pages, there's a convenient interface for bundling the different parts and exporting them with both error boundary and lazy loading handled under the surface.

## Getting started

If you have a standalone app (you didn't clone this repo), then do

```bash
# From your Backstage root directory
yarn --cwd packages/app add @backstage/plugin-home
```

### Setting up the Home Page

1. Create a Home Page Component that will be used for composition.

`packages/app/src/components/home/HomePage.tsx`

```tsx
import React from 'react';

export const homePage = (
  /* TODO: Compose a Home Page here */
);
```

2. Add a route where the homepage will live, presumably `/`.

`packages/app/src/App.tsx`

```tsx
import { HomepageCompositionRoot } from '@backstage/plugin-home';
import { homePage } from './components/home/HomePage';

// ...
<Route path="/" element={<HomepageCompositionRoot />}>
  {homePage}
</Route>;
// ...
```

### Creating Components

The Home Page can be composed with regular React components, so there's no magic in creating components to be used for composition 🪄 🎩 . However, in order to assure that your component fits into a diverse set of Home Pages, there's an extension creator for this purpose, that creates a Card-based layout, for consistency between components (read more about extensions [here](https://backstage.io/docs/plugins/composability#extensions)). The extension creator requires two fields: `title` and `components`. The `components` field is expected to be an asynchronous import that should at least contain a `Content` field. Additionally, you can optionally provide `settings`, `actions` and `contextProvider` as well. These parts will be combined to create a card, where the `content`, `actions` and `settings` will be wrapped within the `contextProvider` in order to be able to access to context and effectively communicate with one another.

Finally, the `createCardExtension` also accepts a generic, such that Component Developers can indicate to App Integrators what custom props their component will accept, such as the example below where the default category of the random jokes can be set.

```tsx
import { createCardExtension } from '@backstage/plugin-home-react';

export const RandomJokeHomePageComponent = homePlugin.provide(
  createCardExtension<{ defaultCategory?: 'programming' | 'any' }>({
    title: 'Random Joke',
    components: () => import('./homePageComponents/RandomJoke'),
  }),
);
```

In summary: it is not necessary to use the `createCardExtension` extension creator to register a home page component, although it is convenient since it provides error boundary and lazy loading, and it also may hook into other functionality in the future.

### Composing a Home Page

Composing a Home Page is no different from creating a regular React Component, i.e. the App Integrator is free to include whatever content they like. However, there are components developed with the Home Page in mind, as described in the previous section. If created by the `createCardExtension` extension creator, they are rendered like so

```tsx
import React from 'react';
import Grid from '@material-ui/core/Grid';
import { RandomJokeHomePageComponent } from '@backstage/plugin-home';

export const homePage = (
  <Grid container spacing={3}>
    <Grid item xs={12} md={4}>
      <RandomJokeHomePageComponent />
    </Grid>
  </Grid>
);
```

Additionally, the App Integrator is provided an escape hatch in case the way the card is rendered does not fit their requirements. They may optionally pass the `Renderer`-prop, which will receive the `title`, `content` and optionally `actions`, `settings` and `contextProvider`, if they exist for the component. This allows the App Integrator to render the content in any way they want.

## Customizable home page

If you want to allow users to customize the components that are shown in the home page, you can use CustomHomePageGrid component.
By adding the allowed components inside the grid, the user can add, configure, remove and move the components around in their
home page. The user configuration is also saved and restored in the process for later use.

```tsx
import {
  HomePageRandomJoke,
  HomePageStarredEntities,
  CustomHomepageGrid,
} from '@backstage/plugin-home';
import { Content, Header, Page } from '@backstage/core-components';
import { HomePageSearchBar } from '@backstage/plugin-search';
import { HomePageCalendar } from '@backstage/plugin-gcalendar';
import { MicrosoftCalendarCard } from '@backstage/plugin-microsoft-calendar';

export const homePage = (
  <CustomHomepageGrid>
    // Insert the allowed widgets inside the grid
    <HomePageSearchBar />
    <HomePageRandomJoke />
    <HomePageCalendar />
    <MicrosoftCalendarCard />
    <HomePageStarredEntities />
  </CustomHomepageGrid>
);
```

### Creating Customizable Components

The custom home page can use the default components created by using the default `createCardExtension` method but if you
want to add additional configuration like component size or settings, you can define those in the `layout`
property:

```tsx
import { createCardExtension } from '@backstage/plugin-home-react';

export const RandomJokeHomePageComponent = homePlugin.provide(
  createCardExtension<{ defaultCategory?: 'any' | 'programming' }>({
    name: 'HomePageRandomJoke',
    title: 'Random Joke',
    components: () => import('./homePageComponents/RandomJoke'),
    layout: {
      height: { minRows: 7 },
      width: { minColumns: 3 },
    },
  }),
);
```

These settings can also be defined for components that use `createReactExtension` instead `createCardExtension` by using
the data property:

```tsx
export const HomePageSearchBar = searchPlugin.provide(
  createReactExtension({
    name: 'HomePageSearchBar',
    component: {
      lazy: () =>
        import('./components/HomePageComponent').then(m => m.HomePageSearchBar),
    },
    data: {
      'home.widget.config': {
        layout: {
          height: { maxRows: 1 },
        },
      },
    },
  }),
);
```

Available home page properties that are used for homepage widgets are:

| Key                           | Type    | Description                                                  |
| ----------------------------- | ------- | ------------------------------------------------------------ |
| `title`                       | string  | User friend title. Shown when user adds widgets to homepage  |
| `description`                 | string  | Widget description. Shown when user adds widgets to homepage |
| `layout.width.defaultColumns` | integer | Default width of the widget (1-12)                           |
| `layout.width.minColumns`     | integer | Minimum width of the widget (1-12)                           |
| `layout.width.maxColumns`     | integer | Maximum width of the widget (1-12)                           |
| `layout.height.defaultRows`   | integer | Default height of the widget (1-12)                          |
| `layout.height.minRows`       | integer | Minimum height of the widget (1-12)                          |
| `layout.height.maxRows`       | integer | Maximum height of the widget (1-12)                          |
| `settings.schema`             | object  | Customization settings of the widget, see below              |

#### Widget Specific Settings

To define settings that the users can change for your component, you should define the `layout` and `settings`
properties. The `settings.schema` object should follow
[react-jsonschema-form](https://rjsf-team.github.io/react-jsonschema-form/docs/) definition and the type of the schema
must be `object`. As well, the `uiSchema` can be defined if a certain UI style needs to be applied fo any of the defined
properties. More documentation [here](https://rjsf-team.github.io/react-jsonschema-form/docs/api-reference/uiSchema).

If you want to hide the card title, you can do it by setting a `name` and leaving the `title` empty.

```tsx
import { createCardExtension } from '@backstage/plugin-home-react';

export const HomePageRandomJoke = homePlugin.provide(
  createCardExtension<{ defaultCategory?: 'any' | 'programming' }>({
    name: 'HomePageRandomJoke',
    title: 'Random Joke',
    components: () => import('./homePageComponents/RandomJoke'),
    description: 'Shows a random joke about optional category',
    layout: {
      height: { minRows: 4 },
      width: { minColumns: 3 },
    },
    settings: {
      schema: {
        title: 'Random Joke settings',
        type: 'object',
        properties: {
          defaultCategory: {
            title: 'Category',
            type: 'string',
            enum: ['any', 'programming', 'dad'],
            default: 'any',
          },
        },
      },
      uiSchema: {
        defaultCategory: {
          'ui:widget': 'radio', // Instead of the default 'select'
        },
      },
    },
  }),
);
```

This allows the user to select `defaultCategory` for the RandomJoke widgets that are added to the homepage.
Each widget has its own settings and the setting values are passed to the underlying React component in props.

In case your `CardExtension` had `Settings` component defined, it will automatically disappear when you add the
`settingsSchema` to the component data structure.

### Adding Default Layout

You can set the default layout of the customizable home page by passing configuration to the `CustomHomepageGrid`
component:

```tsx
const defaultConfig = [
  {
    component: <HomePageSearchBar />, // Or 'HomePageSearchBar' as a string if you know the component name
    x: 0,
    y: 0,
    width: 12,
    height: 1,
    movable: true,
    resizable: false,
    deletable: false,
  },
];

<CustomHomepageGrid config={defaultConfig}>
```

## Page visit homepage component (HomePageTopVisited / HomePageRecentlyVisited)

This component shows the homepage user a view for "Recently visited" or "Top visited".
Being provided by the `<HomePageTopVisited/>` and `<HomePageRecentlyVisited/>` component, see it in use on a homepage example below:

```tsx
// packages/app/src/components/home/HomePage.tsx
import React from 'react';
import Grid from '@material-ui/core/Grid';
import {
  HomePageTopVisited,
  HomePageRecentlyVisited,
} from '@backstage/plugin-home';

export const homePage = (
  <Grid container spacing={3}>
    <Grid item xs={12} md={4}>
      <HomePageTopVisited />
    </Grid>
    <Grid item xs={12} md={4}>
      <HomePageRecentlyVisited />
    </Grid>
  </Grid>
);
```

There are some requirements to provide its functionality, so please ensure the following:

These components need an API to handle visit data, please refer to the [utility-apis](../../docs/api/utility-apis.md)
documentation for more information. Bellow you can see an example for two options:

```ts
// packages/app/src/apis.ts
// ...
import {
  VisitsStorageApi,
  VisitsWebStorageApi,
  visitsApiRef,
} from '@backstage/plugin-home';
// ...
export const apis: AnyApiFactory[] = [
  // Implementation that relies on a provided storageApi
  createApiFactory({
    api: visitsApiRef,
    deps: {
      storageApi: storageApiRef,
      identityApi: identityApiRef,
    },
    factory: ({ storageApi, identityApi }) =>
      VisitsStorageApi.create({ storageApi, identityApi }),
  }),

  // Or a localStorage data implementation, relies on WebStorage implementation of storageApi
  createApiFactory({
    api: visitsApiRef,
    deps: {
      identityApi: identityApiRef,
      errorApi: errorApiRef
    },
    factory: ({ identityApi, errorApi }) => VisitsWebStorageApi.create({ identityApi, errorApi }),
  }),
  // ...
```

To monitor page visit activity and save it on behalf of the user a component is provided, please add it to your app.
See the example usage:

```ts
// packages/app/src/App.tsx
import { VisitListener } from '@backstage/plugin-home';
// ...
export default app.createRoot(
  <>
    <AlertDisplay />
    <OAuthRequestDialog />
    <AppRouter>
      <VisitListener />
      <Root>{routes}</Root>
    </AppRouter>
  </>,
);
```

You can filter the items that are shown in the component.
this can be done by using the config file.
Filtering is done by using 3 parameters:

- `field` - define which field to filter. can be one of the following
  - `id`: string
  - `name`: string
  - `pathname`: string
  - `hits`: number
  - `timestamp`: number
  - `entityRef`: string
- `operator` - can be one of the following `'<' | '<=' | '==' | '!=' | '>' | '>=' | 'contains'`
- `value` - the value of the filter

```yaml
home:
  recentVisits:
    filterBy:
      - field:
        operator:
        value:
  topVisits:
    filterBy:
      - field:
        operator:
        value:
```

`filterBy` configs that are not defined in the above format will be ignored.

In order to validate the config you can use `backstage/cli config:check`

## Contributing

### Homepage Components

We believe that people have great ideas for what makes a useful Home Page, and we want to make it easy for every to benefit from the effort you put in to create something cool for the Home Page. Therefore, a great way of contributing is by simply creating more Home Page Components, than can then be used by everyone when composing their own Home Page. If they are tightly coupled to an existing plugin, it is recommended to allow them to live within that plugin, for convenience and to limit complex dependencies. On the other hand, if there's no clear plugin that the component is based on, it's also fine to contribute them into the [home plugin](/plugins/home/src/homePageComponents)

Additionally, the API is at a very early state, so contributing with additional use cases may expose weaknesses in the current solution that we may iterate on, to provide more flexibility and ease of use for those who wish to develop components for the Home Page.

### Homepage Templates

We are hoping that we together can build up a collection of Homepage templates. We therefore put together a place where we can collect all the templates for the Home Plugin in the [storybook](https://backstage.io/storybook/?path=/story/plugins-home-templates).
If you would like to contribute with a template, start by taking a look at the [DefaultTemplate storybook example](/packages/app/src/components/home/templates/DefaultTemplate.stories.tsx) or [CustomizableTemplate storybook example](/packages/app/src/components/home/templates/CustomizableTemplate.stories.tsx) to create your own, and then open a PR with your suggestion.
