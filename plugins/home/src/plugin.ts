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
  createComponentExtension,
  createPlugin,
  createRoutableExtension,
} from '@backstage/core-plugin-api';
import { createCardExtension } from './extensions';
import { ToolkitContentProps } from './homePageComponents';
import { rootRouteRef } from './routes';

/** @public */
export const homePlugin = createPlugin({
  id: 'home',
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
  createCardExtension({
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
