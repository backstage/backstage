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
  createFrontendPlugin,
  createRouteRef,
  AppRootElementBlueprint,
  identityApiRef,
  storageApiRef,
  errorApiRef,
  ApiBlueprint,
  ExtensionBoundary,
  useApi,
  iconsApiRef,
} from '@backstage/frontend-plugin-api';
import { VisitListener } from './components/';
import { visitsApiRef, VisitsStorageApi, VisitsWebStorageApi } from './api';
import HomeIcon from '@material-ui/icons/Home';
import {
  homePageWidgetDataRef,
  homePageLayoutComponentDataRef,
  HomePageLayoutBlueprint,
  type HomePageLayoutProps,
  HomePageCardWidgetBlueprint,
} from '@backstage/plugin-home-react/alpha';

const rootRouteRef = createRouteRef();

const homePage = PageBlueprint.makeWithOverrides({
  inputs: {
    widgets: createExtensionInput([homePageWidgetDataRef]),
    layout: createExtensionInput([HomePageLayoutBlueprint.dataRefs.component], {
      singleton: true,
      optional: true,
      internal: true,
    }),
  },
  config: {
    schema: {
      layoutConfig: z =>
        z
          .array(
            z.object({
              component: z
                .string()
                .describe(
                  'Widget name or extension ID to position (e.g. HomePageToolkit, home-page-widget:home/toolkit, or home/toolkit)',
                ),
              x: z.number().nonnegative(),
              y: z.number().nonnegative(),
              width: z.number().positive(),
              height: z.number().positive(),
              movable: z.boolean().optional(),
              deletable: z.boolean().optional(),
              resizable: z.boolean().optional(),
            }),
          )
          .optional()
          .describe(
            'Default widget positions before the user customises the grid.',
          ),
    },
  },
  factory(originalFactory, { node, inputs, config }) {
    return originalFactory({
      path: '/home',
      noHeader: true,
      routeRef: rootRouteRef,
      title: 'Home',
      icon: <HomeIcon fontSize="inherit" />,
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

        const Layout =
          inputs.layout?.get(homePageLayoutComponentDataRef) ??
          DefaultLayoutComponent;

        const widgets = inputs.widgets.map(widget => ({
          ...widget.get(homePageWidgetDataRef),
          node: widget.node,
        }));

        return <Layout widgets={widgets} layoutConfig={config.layoutConfig} />;
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

const homePageToolkitWidget = HomePageCardWidgetBlueprint.makeWithOverrides({
  name: 'toolkit',
  config: {
    schema: {
      tools: z =>
        z
          .array(
            z.object({
              url: z.string(),
              label: z.string(),
              icon: z.string().optional(),
            }),
          )
          .optional(),
    },
  },
  factory(origFactory, { config }) {
    return origFactory({
      name: 'HomePageToolkit',
      title: 'Toolkit',
      components: () =>
        import('./homePageComponents/Toolkit').then(m => {
          const ToolkitContextProvider = (
            props: Parameters<typeof m.ContextProvider>[0],
          ) => {
            const icons = useApi(iconsApiRef);
            const tools = config.tools
              ? config.tools.map(tool => {
                  const Icon = tool.icon ? icons.icon(tool.icon) : undefined;
                  return { ...tool, icon: Icon ? Icon : undefined };
                })
              : props.tools;
            return <m.ContextProvider {...props} tools={tools} />;
          };
          return {
            Content: (props: any) => <m.Content {...props} />,
            ContextProvider: ToolkitContextProvider,
          };
        }),
      componentProps: {
        tools: [
          {
            url: 'https://backstage.io',
            label: 'Backstage Docs',
            icon: <HomeIcon />,
          },
        ],
      },
    });
  },
});

const homePageRandomJokeWidget = HomePageCardWidgetBlueprint.make({
  name: 'random-joke',
  params: {
    name: 'HomePageRandomJoke',
    title: 'Random Joke',
    description: 'Shows a random programming joke',
    components: () =>
      import('./homePageComponents/RandomJoke').then(m => ({
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

const homePageTopVisitedWidget = HomePageCardWidgetBlueprint.makeWithOverrides({
  name: 'top-visited',
  disabled: true,
  config: {
    schema: {
      numVisitsOpen: z => z.number().optional(),
      numVisitsTotal: z => z.number().optional(),
    },
  },
  factory(origFactory, { config }) {
    return origFactory({
      name: 'HomePageTopVisited',
      title: 'Top Visited',
      components: () =>
        import('./homePageComponents/VisitedByType/TopVisited').then(m => ({
          Content: m.Content,
          Actions: m.Actions,
          ContextProvider: m.ContextProvider,
        })),
      componentProps: {
        numVisitsOpen: config.numVisitsOpen,
        numVisitsTotal: config.numVisitsTotal,
      },
    });
  },
});

const homePageRecentlyVisitedWidget =
  HomePageCardWidgetBlueprint.makeWithOverrides({
    name: 'recently-visited',
    disabled: true,
    config: {
      schema: {
        numVisitsOpen: z => z.number().optional(),
        numVisitsTotal: z => z.number().optional(),
      },
    },
    factory(origFactory, { config }) {
      return origFactory({
        name: 'HomePageRecentlyVisited',
        title: 'Recently Visited',
        components: () =>
          import('./homePageComponents/VisitedByType/RecentlyVisited').then(
            m => ({
              Content: m.Content,
              Actions: m.Actions,
              ContextProvider: m.ContextProvider,
            }),
          ),
        componentProps: {
          numVisitsOpen: config.numVisitsOpen,
          numVisitsTotal: config.numVisitsTotal,
        },
      });
    },
  });

const homePageFeaturedDocsWidget =
  HomePageCardWidgetBlueprint.makeWithOverrides({
    name: 'featured-docs',
    config: {
      schema: {
        filter: z =>
          z
            .record(z.union([z.string(), z.array(z.string())]))
            .describe(
              'Catalog entity filter to select which docs are featured.',
            ),
        responseLimit: z => z.number().optional(),
        linkDestination: z => z.string().optional(),
        subLinkText: z => z.string().optional(),
      },
    },
    factory(origFactory, { config }) {
      return origFactory({
        name: 'FeaturedDocsCard',
        title: 'Featured Docs',
        components: () =>
          import('./homePageComponents/FeaturedDocsCard').then(m => ({
            Content: m.Content,
          })),
        componentProps: {
          filter: config.filter,
          responseLimit: config.responseLimit,
          linkDestination: config.linkDestination,
          subLinkText: config.subLinkText,
        },
      });
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
  title: 'Home',
  icon: <HomeIcon />,
  info: { packageJson: () => import('../package.json') },
  extensions: [
    homePage,
    visitsApi,
    visitListenerAppRootElement,
    homePageToolkitWidget,
    homePageRandomJokeWidget,
    homePageTopVisitedWidget,
    homePageRecentlyVisitedWidget,
    homePageFeaturedDocsWidget,
    // homePageQuickStartWidget,
  ],
  routes: {
    root: rootRouteRef,
  },
});

import { homeTranslationRef as _homeTranslationRef } from './translation';

/**
 * @alpha
 * @deprecated Import from `@backstage/plugin-home` instead.
 */
export const homeTranslationRef = _homeTranslationRef;
