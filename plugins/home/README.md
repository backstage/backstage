# Home

The Home plugin introduces a system for composing a Home Page for Backstage in order to surface relevant info and provide convenient shortcuts for common tasks. It's designed with composability in mind with an open ecosystem that allows anyone to contribute with any component, to be included in any Home Page.

For App Integrators, the system is designed to be composable to give total freedom in designing a Home Page that suits the needs of the organization. From the perspective of a Component Developer who wishes to contribute with building blocks to be included in Home Pages, there's a convenient interface for bundling the different parts and exporting them with both error boundary and lazy loading handled under the surface.

## Installation

If you have a standalone app (you didn't clone this repo), then do

```bash
# From your Backstage root directory
yarn --cwd packages/app add @backstage/plugin-home
```

## Getting started

The home plugin supports both the new frontend system and the legacy system.

### New Frontend System

If you're using Backstage's new frontend system, add the plugin to your app:

```ts
// packages/app/src/App.tsx
import homePlugin from '@backstage/plugin-home/alpha';

const app = createApp({
  features: [
    // ... other plugins
    homePlugin,
    // ... other plugins
  ],
});
```

The plugin will automatically provide:

- A homepage at `/home` with customizable widget grid
- A "Home" navigation item in the sidebar

#### Creating Custom Homepage Layouts

Use the `HomepageBlueprint` to create custom homepage layouts:

```ts
import { HomepageBlueprint } from '@backstage/plugin-home/alpha';
import { Content, Header, Page } from '@backstage/core-components';

const myHomePage = HomepageBlueprint.make({
  params: {
    title: 'My Custom Home',
    render: ({ grid }) => (
      <Page themeId="home">
        <Header title="Welcome" />
        <Content>{grid}</Content>
      </Page>
    ),
  },
});
```

#### Visit Tracking (Optional)

Visit tracking is an **optional feature** that must be explicitly enabled. When enabled, it provides intelligent storage fallbacks:

**Enabling Visit Tracking:**

Add the following to your `app-config.yaml`:

```yaml
app:
  extensions:
    # Enable visit tracking API (disabled by default)
    - api:home/visits: true
    # Enable visit listener (disabled by default)
    - app-root-element:home/visit-listener: true
```

**Storage Strategy (when enabled):**

1. **Custom Storage API**: If you have `storageApiRef` configured (like database-backed `UserSettingsStorage`), visit data uses your custom storage
2. **Browser Local Storage Fallback**: If no custom storage is configured, automatically falls back to browser local storage

**Note**: Visit tracking extensions are disabled by default to give users control over data collection and storage.

## Creating Homepage Widgets

Homepage widgets are React components that can be added to customizable home pages. The **key difference** between the new frontend system and legacy system is how these widget components are **registered and exported**:

- **New Frontend System**: Use `HomepageWidgetBlueprint` to register widgets as extensions
- **Legacy System**: Use `createCardExtension` to export widgets as card components

### New Frontend System

Create widgets using the `HomepageWidgetBlueprint`:

```ts
import { HomepageWidgetBlueprint } from '@backstage/plugin-home-react/alpha';

const myWidget = HomepageWidgetBlueprint.make({
  name: 'my-widget',
  params: {
    name: 'MyWidget',
    title: 'My Custom Widget',
    description: 'A custom widget for the homepage',
    components: () =>
      import('./MyWidgetComponent').then(m => ({
        Content: m.Content,
      })),
    layout: {
      height: { minRows: 4 },
      width: { minColumns: 3 },
    },
    settings: {
      schema: {
        title: 'Widget Settings',
        type: 'object',
        properties: {
          color: {
            title: 'Color',
            type: 'string',
            default: 'blue',
            enum: ['blue', 'red', 'green'],
          },
        },
      },
    },
  },
});
```

> **Example**: See [dev/index.tsx](dev/index.tsx) for a comprehensive example of creating multiple homepage widgets and layouts using the new frontend system.

### Legacy System - Widget Registration

In the legacy system, use the `createCardExtension` helper to create homepage widgets:

```tsx
import { createCardExtension } from '@backstage/plugin-home-react';

export const MyWidget = homePlugin.provide(
  createCardExtension<{ defaultCategory?: 'programming' | 'any' }>({
    title: 'My Custom Widget',
    components: () => import('./homePageComponents/MyWidget'),
  }),
);
```

The `createCardExtension` provides error boundary and lazy loading, and accepts generics for custom props that App Integrators can configure.

## Legacy System Setup

### Setting up the Home Page

1. Create a Home Page Component that will be used for composition.

`packages/app/src/components/home/HomePage.tsx`

```tsx
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

### Creating Components (Legacy)

In the legacy system, homepage components can be regular React components or wrapped with `createCardExtension` for additional features like error boundaries and lazy loading. Components created with `createCardExtension` are exported as card components that can be composed into homepage layouts.

### Composing a Home Page (Legacy)

In the legacy system, composing a Home Page is done by creating regular React components. Components created with `createCardExtension` are rendered like so:

```tsx
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

> [!NOTE]
> You can provide a title to the grid by passing it as a prop: `<CustomHomepageGrid title="Your Dashboard" />`. This will be displayed as a header above the grid layout.

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

These settings can also be defined for components that use `createReactExtension` instead of `createCardExtension` by using
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
must be `object`. As well, the `uiSchema` can be defined if a certain UI style needs to be applied for any of the defined
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

  // Or a local storage data implementation, relies on WebStorage implementation of storageApi
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

### Customizing the VisitList

If you want more control over the recent and top visited lists, you can write your own functions to transform the path names and determine which visits to save. You can also enrich each visit with other fields and customize the chip colors/labels in the visit lists.

#### Transform Pathname Function

Provide a `transformPathname` function to transform the pathname before it's processed for visit tracking. This can be used for transforming the pathname for the visit (before any other consideration). As an example, you can treat multiple sub-path visits to be counted as a singular path, e.g. `/entity-path/sub1` , `/entity-path/sub-2`, `/entity-path/sub-2/sub-sub-2` can all be mapped to `/entity-path` so visits to any of those routes are all counted as the same.

```tsx
import {
  AnyApiFactory,
  createApiFactory,
  identityApiRef,
  storageApiRef,
} from '@backstage/core-plugin-api';
import { VisitsStorageApi } from '@backstage/plugin-home';

const transformPathname = (pathname: string) => {
  const pathnameParts = pathname.split('/').filter(part => part !== '');
  const rootPathFromPathname = pathnameParts[0] ?? '';
  if (rootPathFromPathname === 'catalog' && pathnameParts.length >= 4) {
    return `/${pathnameParts.slice(0, 4).join('/')}`;
  }
  return pathname;
};

export const apis: AnyApiFactory[] = [
  createApiFactory({
    api: visitsApiRef,
    deps: {
      storageApi: storageApiRef,
      identityApi: identityApiRef,
    },
    factory: ({ storageApi, identityApi }) =>
      VisitsStorageApi.create({
        storageApi,
        identityApi,
        transformPathname,
      }),
  }),
];
```

#### Can Save Function

Provide a `canSave` function to determine which visits should be tracked and saved. This allows you to conditionally save visits to the list:

```tsx
import {
  AnyApiFactory,
  createApiFactory,
  identityApiRef,
  storageApiRef,
} from '@backstage/core-plugin-api';
import { VisitInput, VisitsStorageApi } from '@backstage/plugin-home';

const canSave = (visit: VisitInput) => {
  // Don't save visits to admin or settings pages
  return (
    !visit.pathname.startsWith('/admin') &&
    !visit.pathname.startsWith('/settings')
  );
};

export const apis: AnyApiFactory[] = [
  createApiFactory({
    api: visitsApiRef,
    deps: {
      storageApi: storageApiRef,
      identityApi: identityApiRef,
    },
    factory: ({ storageApi, identityApi }) =>
      VisitsStorageApi.create({
        storageApi,
        identityApi,
        canSave,
      }),
  }),
];
```

#### Enrich Visit Function

You can also add the `enrichVisit` function to put additional values on each `Visit`. The values could later be used to customize the chips in the `VisitList`. For example, you could add the entity `type` on the `Visit` so that `type` is used for labels instead of `kind`.

```tsx
import {
  AnyApiFactory,
  createApiFactory,
  identityApiRef,
  storageApiRef,
} from '@backstage/core-plugin-api';
import { CatalogApi, catalogApiRef } from '@backstage/plugin-catalog-react';
import { VisitsStorageApi } from '@backstage/plugin-home';

type EnrichedVisit = VisitInput & {
  type?: string;
};

const createEnrichVisit =
  (catalogApi: CatalogApi) =>
  async (visit: VisitInput): Promise<EnrichedVisit> => {
    if (!visit.entityRef) {
      return visit;
    }
    try {
      const entity = await catalogApi.getEntityByRef(visit.entityRef);
      const type = entity?.spec?.type?.toString();
      return { ...visit, type };
    } catch (error) {
      return visit;
    }
  };

export const apis: AnyApiFactory[] = [
  createApiFactory({
    api: visitsApiRef,
    deps: {
      storageApi: storageApiRef,
      identityApi: identityApiRef,
      catalogApi: catalogApiRef,
    },
    factory: ({ storageApi, identityApi, catalogApi }) =>
      VisitsStorageApi.create({
        storageApi,
        identityApi,
        enrichVisit: createEnrichVisit(catalogApi),
      }),
  }),
];
```

#### Custom Chip Colors and Labels

To provide your own chip colors and/or labels for the recent and top visited lists, wrap the components in `VisitDisplayProvider` with `getChipColor` and `getChipLabel` functions. The colors provided will be used instead of the hard coded [`colorVariants`](https://github.com/backstage/backstage/blob/2da352043425bcab4c4422e4d2820c26c0a83382/packages/theme/src/base/pageTheme.ts#L46) provided via `@backstage/theme`.

```tsx
import {
  CustomHomepageGrid,
  HomePageTopVisited,
  HomePageRecentlyVisited,
  VisitDisplayProvider,
} from '@backstage/plugin-home';

const getChipColor = (visit: any) => {
  const type = visit.type;
  switch (type) {
    case 'application':
      return '#b39ddb';
    case 'service':
      return '#90caf9';
    case 'account':
      return '#a5d6a7';
    case 'suite':
      return '#fff59d';
    default:
      return '#ef9a9a';
  }
};

const getChipLabel = (visit?: any) => {
  return visit?.type ? visit.type : 'Other';
};

export default function HomePage() {
  return (
    <VisitDisplayProvider getChipColor={getChipColor} getLabel={getChipLabel}>
      <CustomHomepageGrid title="Your Dashboard">
        <HomePageRecentlyVisited />
        <HomePageTopVisited />
      </CustomHomepageGrid>
    </VisitDisplayProvider>
  );
}
```

## Contributing

### Homepage Components

We believe that people have great ideas for what makes a useful Home Page, and we want to make it easy for everyone to benefit from the effort you put in to create something cool for the Home Page. Therefore, a great way of contributing is by simply creating more Home Page Components that can then be used by everyone when composing their own Home Page. If they are tightly coupled to an existing plugin, it is recommended to allow them to live within that plugin, for convenience and to limit complex dependencies. On the other hand, if there's no clear plugin that the component is based on, it's also fine to contribute them into the [home plugin](/plugins/home/src/homePageComponents)

Additionally, the API is at a very early state, so contributing additional use cases may expose weaknesses in the current solution that we may iterate on to provide more flexibility and ease of use for those who wish to develop components for the Home Page.

### Homepage Templates

We are hoping that we together can build up a collection of Homepage templates. We therefore put together a place where we can collect all the templates for the Home Plugin in the [storybook](https://backstage.io/storybook/?path=/story/plugins-home-templates).
If you would like to contribute with a template, start by taking a look at the [DefaultTemplate storybook example](/packages/app/src/components/home/templates/DefaultTemplate.stories.tsx) or [CustomizableTemplate storybook example](/packages/app/src/components/home/templates/CustomizableTemplate.stories.tsx) to create your own, and then open a PR with your suggestion.
