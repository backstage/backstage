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

import LibraryBooks from '@material-ui/icons/LibraryBooks';
import {
  createFrontendPlugin,
  ApiBlueprint,
  PageBlueprint,
  NavItemBlueprint,
  createExtensionInput,
  coreExtensionData,
  createExtension,
} from '@backstage/frontend-plugin-api';
import {
  configApiRef,
  discoveryApiRef,
  fetchApiRef,
} from '@backstage/core-plugin-api';
import {
  EntityContentBlueprint,
  EntityIconLinkBlueprint,
} from '@backstage/plugin-catalog-react/alpha';
import { SearchResultListItemBlueprint } from '@backstage/plugin-search-react/alpha';
import { AddonBlueprint } from '@backstage/plugin-techdocs-react/alpha';
import { TechDocsClient, TechDocsStorageClient } from '../client';
import {
  rootCatalogDocsRouteRef,
  rootDocsRouteRef,
  rootRouteRef,
} from '../routes';
import { TechDocsReaderLayout } from '../reader';
import { attachTechDocsAddonComponentData } from '@backstage/plugin-techdocs-react/alpha';
import {
  TechDocsAddons,
  techdocsApiRef,
  techdocsStorageApiRef,
} from '@backstage/plugin-techdocs-react';

import { useTechdocsReaderIconLinkProps } from './hooks/useTechdocsReaderIconLinkProps';
import { DocsIcon } from '@backstage/core-components';

/** @alpha */
const techdocsEntityIconLink = EntityIconLinkBlueprint.make({
  name: 'read-docs',
  params: {
    useProps: useTechdocsReaderIconLinkProps,
  },
});

/** @alpha */
const techDocsStorageApi = ApiBlueprint.make({
  name: 'storage',
  params: defineParams =>
    defineParams({
      api: techdocsStorageApiRef,
      deps: {
        configApi: configApiRef,
        discoveryApi: discoveryApiRef,
        fetchApi: fetchApiRef,
      },
      factory: ({ configApi, discoveryApi, fetchApi }) =>
        new TechDocsStorageClient({
          configApi,
          discoveryApi,
          fetchApi,
        }),
    }),
});

/** @alpha */
const techDocsClientApi = ApiBlueprint.make({
  params: defineParams =>
    defineParams({
      api: techdocsApiRef,
      deps: {
        configApi: configApiRef,
        discoveryApi: discoveryApiRef,
        fetchApi: fetchApiRef,
      },
      factory: ({ configApi, discoveryApi, fetchApi }) =>
        new TechDocsClient({
          configApi,
          discoveryApi,
          fetchApi,
        }),
    }),
});

/** @alpha */
export const techDocsSearchResultListItemExtension =
  SearchResultListItemBlueprint.makeWithOverrides({
    config: {
      schema: {
        title: z => z.string().optional(),
        lineClamp: z => z.number().default(5),
        asLink: z => z.boolean().default(true),
        asListItem: z => z.boolean().default(true),
      },
    },
    factory(originalFactory, { config }) {
      return originalFactory({
        icon: <DocsIcon />,
        predicate: result => result.type === 'techdocs',
        component: async () => {
          const { TechDocsSearchResultListItem } = await import(
            '../search/components/TechDocsSearchResultListItem'
          );
          return props => (
            <TechDocsSearchResultListItem {...props} {...config} />
          );
        },
      });
    },
  });

/**
 * Responsible for rendering the provided router element
 *
 * @alpha
 */
const techDocsPage = PageBlueprint.make({
  params: {
    path: '/docs',
    routeRef: rootRouteRef,
    loader: () =>
      import('../home/components/TechDocsIndexPage').then(m => (
        <m.TechDocsIndexPage />
      )),
  },
});

/**
 * Component responsible for composing a TechDocs reader page experience
 *
 * @alpha
 */
const techDocsReaderPage = PageBlueprint.makeWithOverrides({
  name: 'reader',
  inputs: {
    addons: createExtensionInput([AddonBlueprint.dataRefs.addon]),
  },
  factory(originalFactory, { inputs }) {
    const addons = inputs.addons.map(output => {
      const options = output.get(AddonBlueprint.dataRefs.addon);
      const Addon = options.component;
      attachTechDocsAddonComponentData(Addon, options);
      return <Addon key={options.name} />;
    });

    return originalFactory({
      path: '/docs/:namespace/:kind/:name',
      routeRef: rootDocsRouteRef,
      loader: async () =>
        await import('../Router').then(({ TechDocsReaderRouter }) => (
          <TechDocsReaderRouter>
            <TechDocsReaderLayout />
            <TechDocsAddons>{addons}</TechDocsAddons>
          </TechDocsReaderRouter>
        )),
    });
  },
});

/**
 * Component responsible for rendering techdocs on entity pages
 *
 * @alpha
 */
const techDocsEntityContent = EntityContentBlueprint.makeWithOverrides({
  inputs: {
    addons: createExtensionInput([AddonBlueprint.dataRefs.addon]),
    emptyState: createExtensionInput(
      [coreExtensionData.reactElement.optional()],
      {
        singleton: true,
        optional: true,
      },
    ),
  },
  factory(originalFactory, context) {
    return originalFactory(
      {
        path: 'docs',
        title: 'TechDocs',
        routeRef: rootCatalogDocsRouteRef,
        loader: () =>
          import('../Router').then(({ EmbeddedDocsRouter }) => {
            const addons = context.inputs.addons.map(output => {
              const options = output.get(AddonBlueprint.dataRefs.addon);
              const Addon = options.component;
              attachTechDocsAddonComponentData(Addon, options);
              return <Addon key={options.name} />;
            });
            return (
              <EmbeddedDocsRouter
                emptyState={context.inputs.emptyState?.get(
                  coreExtensionData.reactElement,
                )}
              >
                <TechDocsAddons>{addons}</TechDocsAddons>
              </EmbeddedDocsRouter>
            );
          }),
      },
      context,
    );
  },
});

const techDocsEntityContentEmptyState = createExtension({
  kind: 'empty-state',
  name: 'entity-content',
  attachTo: { id: 'entity-content:techdocs', input: 'emptyState' },
  output: [coreExtensionData.reactElement.optional()],
  factory: () => [],
});

/** @alpha */
const techDocsNavItem = NavItemBlueprint.make({
  params: {
    icon: LibraryBooks,
    title: 'Docs',
    routeRef: rootRouteRef,
  },
});

/** @alpha */
export default createFrontendPlugin({
  pluginId: 'techdocs',
  info: { packageJson: () => import('../../package.json') },
  extensions: [
    techDocsClientApi,
    techDocsStorageApi,
    techDocsNavItem,
    techDocsPage,
    techDocsReaderPage,
    techdocsEntityIconLink,
    techDocsEntityContent,
    techDocsEntityContentEmptyState,
    techDocsSearchResultListItemExtension,
  ],
  routes: {
    root: rootRouteRef,
    docRoot: rootDocsRouteRef,
    entityContent: rootCatalogDocsRouteRef,
  },
});
