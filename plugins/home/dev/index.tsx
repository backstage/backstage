/*
 * Copyright 2025 The Backstage Authors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { Content, Header, Page } from '@backstage/core-components';
import { createApp } from '@backstage/frontend-defaults';
import { catalogApiRef } from '@backstage/plugin-catalog-react';
import { catalogApiMock } from '@backstage/plugin-catalog-react/testUtils';
import catalogPlugin from '@backstage/plugin-catalog/alpha';
import HomeIcon from '@material-ui/icons/Home';
import ReactDOM from 'react-dom/client';
import { Fragment } from 'react';
// eslint-disable-next-line @backstage/no-ui-css-imports-in-non-frontend
import '@backstage/ui/css/styles.css';

import { createFrontendModule } from '@backstage/frontend-plugin-api';
import {
  HomePageLayoutBlueprint,
  HomePageCardWidgetBlueprint,
} from '@backstage/plugin-home-react/alpha';
import { HeaderWorldClock, WelcomeTitle, type ClockConfig } from '../src';
import homePlugin from '../src/alpha';
import { CustomHomepageGrid } from '../src/components';
import type { LayoutConfiguration } from '../src/components/CustomHomepage/types';

import searchPlugin from '@backstage/plugin-search/alpha'; // For reference in the SearchBarWidget loader test
import { Entity } from '@backstage/catalog-model';

const clockConfigs: ClockConfig[] = [
  { label: 'NYC', timeZone: 'America/New_York' },
  { label: 'UTC', timeZone: 'UTC' },
  { label: 'STO', timeZone: 'Europe/Stockholm' },
  { label: 'TYO', timeZone: 'Asia/Tokyo' },
];

const timeFormat: Intl.DateTimeFormatOptions = {
  hour: '2-digit',
  minute: '2-digit',
  hour12: false,
};

const defaultGridConfig: LayoutConfiguration[] = [
  {
    component: 'HomePageSearchBar', // this is added from the Search plugin
    x: 1,
    y: 0,
    width: 10,
    height: 2,
    movable: true,
    resizable: true,
  },
  {
    component: 'HomePageToolkit',
    x: 0,
    y: 1,
    width: 12,
    height: 4,
    movable: false,
    resizable: false,
  },
  {
    component: 'HomePageStarredEntities',
    x: 0,
    y: 6,
    width: 6,
    height: 5,
  },
  {
    component: 'HomePageRandomJoke',
    x: 6,
    y: 6,
    width: 6,
    height: 5,
  },
];

const homePageLayout = HomePageLayoutBlueprint.make({
  params: {
    loader: async () =>
      function CustomHomePageLayout({ widgets, layoutConfig }) {
        return (
          <Page themeId="home">
            <Header title={<WelcomeTitle />} pageTitleOverride="Home">
              <HeaderWorldClock
                clockConfigs={clockConfigs}
                customTimeFormat={timeFormat}
              />
            </Header>
            <Content>
              <CustomHomepageGrid config={layoutConfig ?? defaultGridConfig}>
                {widgets.map((widget, index) => (
                  <Fragment key={widget.name ?? index}>
                    {widget.component}
                  </Fragment>
                ))}
              </CustomHomepageGrid>
            </Content>
          </Page>
        );
      },
  },
});

const homePageToolkitWidget = HomePageCardWidgetBlueprint.make({
  name: 'custom-toolkit',
  params: {
    name: 'HomePageToolkit',
    title: 'My Toolkit',
    components: () =>
      import('../src/homePageComponents/Toolkit').then(m => ({
        Content: m.Content,
        ContextProvider: m.ContextProvider,
      })),
    componentProps: {
      tools: [
        {
          url: 'https://backstage.io',
          label: 'Backstage Homepage',
          icon: <HomeIcon />,
        },
      ],
    },
  },
});

const homePageRandomJokeWidget = HomePageCardWidgetBlueprint.make({
  name: 'random-joke', // overrides the widget coming from the plugin
  params: {
    name: 'HomePageRandomJoke',
    title: 'Random Joke',
    description: 'Shows a random programming joke',
    components: () =>
      import('../src/homePageComponents/RandomJoke').then(m => ({
        Content: m.Content,
        Settings: m.Settings,
        Actions: m.Actions,
        ContextProvider: m.ContextProvider,
      })),
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
    },
  },
});

const homeDevModule = createFrontendModule({
  pluginId: 'home',
  extensions: [homePageLayout, homePageToolkitWidget, homePageRandomJokeWidget],
});

const entities: Entity[] = [
  {
    apiVersion: 'backstage.io/v1alpha1',
    kind: 'Component',
    metadata: {
      name: 'example-service',
      description: 'An example backend service',
      annotations: {
        'backstage.io/managed-by-location': 'file:/path/to/catalog-info.yaml',
        'backstage.io/techdocs-ref': 'dir:.',
      },
    },
    spec: {
      type: 'service',
      lifecycle: 'production',
      owner: 'guest',
    },
  },
  {
    apiVersion: 'backstage.io/v1alpha1',
    kind: 'Component',
    metadata: {
      name: 'example-website',
      description: 'An example frontend website',
      annotations: {
        'backstage.io/managed-by-location': 'file:/path/to/catalog-info.yaml',
        'backstage.io/techdocs-ref': 'dir:.',
      },
    },
    spec: {
      type: 'website',
      lifecycle: 'production',
      owner: 'guest',
    },
  },
  {
    apiVersion: 'backstage.io/v1alpha1',
    kind: 'Component',
    metadata: {
      name: 'example-library',
      description: 'A shared utility library',
      annotations: {
        'backstage.io/managed-by-location': 'file:/path/to/catalog-info.yaml',
        'backstage.io/techdocs-ref': 'dir:.',
      },
    },
    spec: {
      type: 'library',
      lifecycle: 'experimental',
      owner: 'guest',
    },
  },
  {
    apiVersion: 'backstage.io/v1alpha1',
    kind: 'API',
    metadata: {
      name: 'example-api',
      description: 'An example REST API',
      annotations: {
        'backstage.io/managed-by-location': 'file:/path/to/catalog-info.yaml',
      },
    },
    spec: {
      type: 'openapi',
      lifecycle: 'production',
      owner: 'guest',
      definition: '{}',
    },
  },
  {
    apiVersion: 'backstage.io/v1alpha1',
    kind: 'Group',
    metadata: {
      name: 'guest-team',
      description: 'The guest team',
      annotations: {
        'backstage.io/managed-by-location': 'file:/path/to/catalog-info.yaml',
      },
    },
    spec: {
      type: 'team',
      children: [],
      members: ['guest'],
    },
  },
  {
    apiVersion: 'backstage.io/v1alpha1',
    kind: 'User',
    metadata: {
      name: 'guest',
      annotations: {
        'backstage.io/managed-by-location': 'file:/path/to/catalog-info.yaml',
      },
    },
    spec: {
      memberOf: ['guest-team'],
    },
  },
];

const catalogApi = catalogApiMock({ entities });

const catalogPluginOverrides = createFrontendModule({
  pluginId: 'catalog',
  extensions: [
    catalogPlugin.getExtension('api:catalog').override({
      params: defineParams =>
        defineParams({
          api: catalogApiRef,
          deps: {},
          factory: () => catalogApi,
        }),
    }),
  ],
});

const app = createApp({
  features: [
    catalogPlugin,
    catalogPluginOverrides,
    homePlugin, // Load the home plugin
    homeDevModule, // Load the widgets and homepage content
    searchPlugin,
  ],
});

const root = app.createRoot();
ReactDOM.createRoot(document.getElementById('root')!).render(root);
