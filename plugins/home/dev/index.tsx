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

import {
  ApiBlueprint,
  createFrontendModule,
} from '@backstage/frontend-plugin-api';
import {
  HomepageWidgetBlueprint,
  HomePageLayoutBlueprint,
} from '@backstage/plugin-home-react/alpha';
import { HeaderWorldClock, WelcomeTitle, type ClockConfig } from '../src';
import homePlugin from '../src/alpha';
import { CustomHomepageGrid } from '../src/components';
import type { LayoutConfiguration } from '../src/components/CustomHomepage/types';

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
    component: 'HomePageToolkit',
    x: 0,
    y: 0,
    width: 12,
    height: 4,
    movable: false,
    resizable: false,
  },
  {
    component: 'HomePageStarredEntities',
    x: 0,
    y: 4,
    width: 6,
    height: 5,
  },
  {
    component: 'HomePageRandomJoke',
    x: 6,
    y: 4,
    width: 6,
    height: 5,
  },
];

const homePageLayout = HomePageLayoutBlueprint.make({
  params: {
    loader: async () =>
      function CustomHomePageLayout({ widgets }) {
        return (
          <Page themeId="home">
            <Header title={<WelcomeTitle />} pageTitleOverride="Home">
              <HeaderWorldClock
                clockConfigs={clockConfigs}
                customTimeFormat={timeFormat}
              />
            </Header>
            <Content>
              <CustomHomepageGrid config={defaultGridConfig}>
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

const homePageToolkitWidget = HomepageWidgetBlueprint.make({
  name: 'home-toolkit',
  params: {
    name: 'HomePageToolkit',
    title: 'Toolkit',
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

const homePageStarredEntitiesWidget = HomepageWidgetBlueprint.make({
  name: 'home-starred-entities',
  params: {
    name: 'HomePageStarredEntities',
    title: 'Your Starred Entities',
    components: () =>
      import('../src/homePageComponents/StarredEntities').then(m => ({
        Content: m.Content,
      })),
  },
});

const homePageRandomJokeWidget = HomepageWidgetBlueprint.make({
  name: 'home-random-joke',
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
  extensions: [
    homePageLayout,
    homePageToolkitWidget,
    homePageStarredEntitiesWidget,
    homePageRandomJokeWidget,
  ],
});

const entities = [
  {
    apiVersion: 'backstage.io/v1alpha1',
    kind: 'Component',
    metadata: {
      name: 'example',
      annotations: {
        'backstage.io/managed-by-location': 'file:/path/to/catalog-info.yaml',
      },
    },
    spec: {
      type: 'service',
      lifecycle: 'production',
      owner: 'guest',
    },
  },
];

const catalogApi = catalogApiMock({ entities });

const catalogPluginOverrides = createFrontendModule({
  pluginId: 'catalog',
  extensions: [
    ApiBlueprint.make({
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
  ],
});

const root = app.createRoot();
ReactDOM.createRoot(document.getElementById('root')!).render(root);
