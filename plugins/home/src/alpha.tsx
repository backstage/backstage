/*
 * Copyright 2023 The Backstage Authors
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

/**
 * The home plugin for Backstage's new frontend system.
 *
 * @remarks
 * This package provides the new frontend system implementation of the home plugin,
 * which offers customizable home pages with widget support and optional visit tracking.
 *
 * @packageDocumentation
 */

import { lazy as reactLazy } from 'react';
import {
  createExtensionInput,
  PageBlueprint,
  NavItemBlueprint,
  createFrontendPlugin,
  createRouteRef,
  AppRootElementBlueprint,
  identityApiRef,
  storageApiRef,
  errorApiRef,
  ApiBlueprint,
  ExtensionBoundary,
} from '@backstage/frontend-plugin-api';
import { VisitListener } from './components/';
import { visitsApiRef, VisitsStorageApi, VisitsWebStorageApi } from './api';
import HomeIcon from '@material-ui/icons/Home';
import {
  homePageWidgetDataRef,
  homePageLayoutComponentDataRef,
  HomePageLayoutBlueprint,
  type HomePageLayoutProps,
} from '@backstage/plugin-home-react/alpha';

const rootRouteRef = createRouteRef();

const homePage = PageBlueprint.makeWithOverrides({
  inputs: {
    widgets: createExtensionInput([homePageWidgetDataRef]),
    layouts: createExtensionInput([HomePageLayoutBlueprint.dataRefs.component]),
  },
  factory(originalFactory, { node, inputs }) {
    return originalFactory({
      path: '/home',
      routeRef: rootRouteRef,
      loader: async () => {
        const LazyDefaultLayout = reactLazy(() =>
          import('./alpha/DefaultHomePageLayout').then(m => ({
            default: m.DefaultHomePageLayout,
          })),
        );

        const DefaultLayoutComponent = (props: HomePageLayoutProps) => (
          <ExtensionBoundary node={node}>
            <LazyDefaultLayout {...props} />
          </ExtensionBoundary>
        );

        const layouts = [
          ...inputs.layouts.map(layout => ({
            Component: layout.get(homePageLayoutComponentDataRef),
          })),
          {
            Component: DefaultLayoutComponent,
          },
        ];

        const widgets = inputs.widgets.map(widget =>
          widget.get(homePageWidgetDataRef),
        );

        // Use the first installed layout, or fall back to the default
        const layout = layouts[0];

        return <layout.Component widgets={widgets} />;
      },
    });
  },
});

const visitListenerAppRootElement = AppRootElementBlueprint.make({
  name: 'visit-listener',
  disabled: true,
  params: {
    element: <VisitListener />,
  },
});

const visitsApi = ApiBlueprint.make({
  name: 'visits',
  disabled: true,
  params: defineParams =>
    defineParams({
      api: visitsApiRef,
      deps: {
        storageApi: storageApiRef,
        identityApi: identityApiRef,
        errorApi: errorApiRef,
      },
      factory: ({ storageApi, identityApi, errorApi }) => {
        // Smart fallback: use custom storage API if available, otherwise localStorage
        if (storageApi) {
          return VisitsStorageApi.create({ storageApi, identityApi });
        }
        return VisitsWebStorageApi.create({ identityApi, errorApi });
      },
    }),
});

const homeNavItem = NavItemBlueprint.make({
  params: {
    title: 'Home',
    routeRef: rootRouteRef,
    icon: HomeIcon,
  },
});

/**
 * Home plugin for the new frontend system.
 *
 * Provides core homepage functionality with optional visit tracking extensions.
 * Visit tracking extensions are disabled by default and can be enabled via app-config.yaml.
 *
 * @alpha
 */
export default createFrontendPlugin({
  pluginId: 'home',
  info: { packageJson: () => import('../package.json') },
  extensions: [homePage, homeNavItem, visitsApi, visitListenerAppRootElement],
  routes: {
    root: rootRouteRef,
  },
});

export { homeTranslationRef } from './translation';
export {
  type LayoutConfiguration,
  type Breakpoint,
} from './components/CustomHomepage/types';
