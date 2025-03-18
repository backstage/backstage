/*
 * Copyright 2021 The Backstage Authors
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

import {
  createApiFactory,
  createComponentExtension,
  createPlugin,
  createRoutableExtension,
  identityApiRef,
  storageApiRef,
} from '@backstage/core-plugin-api';
import { createCardExtension } from '@backstage/plugin-home-react';
import {
  ToolkitContentProps,
  VisitedByTypeProps,
  FeaturedDocsCardProps,
  QuickStartCardProps,
} from './homePageComponents';
import { rootRouteRef } from './routes';
import { VisitsStorageApi, visitsApiRef } from './api';
import { StarredEntitiesProps } from './homePageComponents/StarredEntities/Content';

/** @public */
export const homePlugin = createPlugin({
  id: 'home',
  apis: [
    createApiFactory({
      api: visitsApiRef,
      deps: {
        storageApi: storageApiRef,
        identityApi: identityApiRef,
      },
      factory: ({ storageApi, identityApi }) =>
        VisitsStorageApi.create({ storageApi, identityApi }),
    }),
  ],
  routes: {
    root: rootRouteRef,
  },
});

/** @public */
export const HomepageCompositionRoot = homePlugin.provide(
  createRoutableExtension({
    name: 'HomepageCompositionRoot',
    component: () =>
      import('./components').then(m => m.HomepageCompositionRoot),
    mountPoint: rootRouteRef,
  }),
);

/** @public */
export const ComponentAccordion = homePlugin.provide(
  createComponentExtension({
    name: 'ComponentAccordion',
    component: {
      lazy: () =>
        import('./componentRenderers').then(m => m.ComponentAccordion),
    },
  }),
);

/** @public */
export const ComponentTabs = homePlugin.provide(
  createComponentExtension({
    name: 'ComponentTabs',
    component: {
      lazy: () => import('./componentRenderers').then(m => m.ComponentTabs),
    },
  }),
);

/** @public */
export const ComponentTab = homePlugin.provide(
  createComponentExtension({
    name: 'ComponentTab',
    component: {
      lazy: () => import('./componentRenderers').then(m => m.ComponentTab),
    },
  }),
);

/**
 * A component to display a playful greeting for the user.
 *
 * @public
 */
export const WelcomeTitle = homePlugin.provide(
  createComponentExtension({
    name: 'WelcomeTitle',
    component: {
      lazy: () =>
        import('./homePageComponents/WelcomeTitle').then(m => m.WelcomeTitle),
    },
  }),
);

/**
 * A component to display a company logo for the user.
 *
 * @public
 */
export const HomePageCompanyLogo = homePlugin.provide(
  createComponentExtension({
    name: 'CompanyLogo',
    component: {
      lazy: () =>
        import('./homePageComponents/CompanyLogo').then(m => m.CompanyLogo),
    },
  }),
);

/** @public */
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
    },
  }),
);

/**
 * A component to display a list of tools for the user.
 *
 * @public
 */
export const HomePageToolkit = homePlugin.provide(
  createCardExtension<ToolkitContentProps>({
    name: 'HomePageToolkit',
    title: 'Toolkit',
    components: () => import('./homePageComponents/Toolkit'),
  }),
);

/**
 * A component to display a list of starred entities for the user.
 *
 * @public
 */
export const HomePageStarredEntities = homePlugin.provide(
  createCardExtension<Partial<StarredEntitiesProps>>({
    name: 'HomePageStarredEntities',
    title: 'Your Starred Entities',
    components: () => import('./homePageComponents/StarredEntities'),
  }),
);

/**
 * A component to display a configurable list of clocks for various time zones.
 *
 * @public
 */
export const HeaderWorldClock = homePlugin.provide(
  createComponentExtension({
    name: 'HeaderWorldClock',
    component: {
      lazy: () =>
        import('./homePageComponents/HeaderWorldClock').then(
          m => m.HeaderWorldClock,
        ),
    },
  }),
);

/**
 * Display top visited pages for the homepage
 * @public
 */
export const HomePageTopVisited = homePlugin.provide(
  createCardExtension<Partial<VisitedByTypeProps>>({
    name: 'HomePageTopVisited',
    title: 'Top Visited',
    components: () => import('./homePageComponents/VisitedByType/TopVisited'),
  }),
);

/**
 * Display recently visited pages for the homepage
 * @public
 */
export const HomePageRecentlyVisited = homePlugin.provide(
  createCardExtension<Partial<VisitedByTypeProps>>({
    name: 'HomePageRecentlyVisited',
    title: 'Recently Visited',
    components: () =>
      import('./homePageComponents/VisitedByType/RecentlyVisited'),
  }),
);

/**
 * A component to display specific Featured Docs.
 *
 * @public
 */
export const FeaturedDocsCard = homePlugin.provide(
  createCardExtension<FeaturedDocsCardProps>({
    name: 'FeaturedDocsCard',
    title: 'Featured Docs',
    components: () => import('./homePageComponents/FeaturedDocsCard'),
  }),
);

/**
 * A component to display Quick Start information.
 *
 * @public
 */
export const QuickStartCard = homePlugin.provide(
  createCardExtension<QuickStartCardProps>({
    name: 'QuickStartCard',
    title: 'Quick Start',
    components: () => import('./homePageComponents/QuickStart'),
  }),
);
