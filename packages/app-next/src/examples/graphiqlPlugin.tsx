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

import React from 'react';
import { CatalogClient } from '@backstage/catalog-client';
import {
  AnyApiRef,
  createApiFactory,
  createApiRef,
  discoveryApiRef,
  fetchApiRef,
} from '@backstage/core-plugin-api';
import {
  createExtension,
  createPlugin,
  coreExtensionData,
  createSchemaFromZod,
  PortableSchema,
} from '@backstage/frontend-plugin-api';
import { catalogApiRef } from '@backstage/plugin-catalog-react';
import { Router as GraphiQLPage } from '@backstage/plugin-graphiql';

export const GraphiqlPageExtension = createExtension({
  output: {
    component: coreExtensionData.reactComponent,
    path: coreExtensionData.routePath,
  },
  configSchema: createSchemaFromZod(z =>
    z.object({ path: z.string().default('/graphiql') }),
  ),
  factory({ bind, config }) {
    bind.component(GraphiQLPage);
    bind.path(config.path);
  },
});

// @backstage/plugin-graphiql#GraphiqlPage
// graphiql#GraphiqlPage

export const x = createExtension({
  output: {
    component: coreExtensionData.reactComponent,
    path: coreExtensionData.routePath,
  },
  configSchema: createSchemaFromZod(z =>
    z.object({ path: z.string().default('/graphiql') }),
  ),
  factory({ bind, config }) {
    bind.component(GraphiQLPage);
    bind.path(config.path);
  },
});

// console.log(GraphiqlPageExtension.plugin);
// instance.plugin <---

export const graphiqlPlugin = createPlugin({
  id: 'graphiql',
  // defaultExtensionInstances: [
  //   {
  //     id: 'graphiql.page',
  //     at: 'core.router/routes',
  //     extension: GraphiqlPageExtension,
  //   },
  // ],
});

export const catalogPlugin = createPlugin({
  id: 'catalog',
  defaultExtensionInstances: [
    { extension: catalogApi },
    { extension: CatalogPage },
  ],
});

export const CatalogPage = createPageExtension({
  // plugin: catalogPlugin, // { $$type: '@backstage/Plugin' }
  component: () => import('./CatalogPage'),
});

catalogPlugin.addDefaultInstance({
  id: 'catalog.page',
  extension: CatalogPage,
});

export const CatalogPage = catalogPlugin.addDefaultInstance({
  id: 'catalog.page',
  extension: createPageExtension({
    // plugin: catalogPlugin, // { $$type: '@backstage/Plugin' }
    component: () => import('./CatalogPage'),
  }),
});

/**
 * ```yaml
 * app:
 *   extensions:
 *     - plugin.catalog.page:
 *         at: 'core.router/routes'
 *     - plugin.catalog.page:
 *         at: 'other.router/routes'
 *         extension: '@internal/custom-catalog#CatalogPage'
 *     - '@internal/custom-catalog#CatalogPage'
 *
 *     - entity.page.cards.about:
 *         at: 'entity.page/cards'
 *         copy: '@backstage/plugin-catalog#AboutCard'
 *         config:
 *           title: 'About 1'
 *     - 'entity.page/cards':
 *         extension: '@backstage/plugin-catalog#AboutCard'
 *         config:
 *           title: 'About 2'
 * ```
 */
function derp() {}

// - plugin.graphiql:
//     config:
//       refreshFrequency: { minutes: 1 }
// - core.api-holder/apis: '@backstage/catalog-client#CatalogClient'
// - plugin.catalog.service
// - core.pluginManager/wrappers: '@internal/MyExtraContext'
export const graphiqlPluginAsExtension = createPlugin({
  id: 'graphiql',
  output: {
    providedExtensions: coreExtensionData.extension,
  },
  inputs: {
    addons: {
      extensionData: graphiqlAddonExtensionDataRef,
    },
  },
  // configSchema: {},
  factory({ bind, config, inputs }) {
    const { addons } = inputs;

    bind.providedExtensions([
      {
        id: 'grapiql.page',
        extension: () => <GraphiqlPageExtension addons={inputs.addons} />,
        enabled: true,
      },
    ]);
  },
});

export const GraphiQLPage = graphiqlPlugin.provide(x, {
  id: 'grapiql.page',
  at: 'core.router/routes',
  config: { title: 'boop' },
  enabled: false,
});

function provide(extension, plugin) {
  return {
    ...extension,
    outputs: {
      ...extension.outputs,
      plugin: plugin,
      reactComponent: () => {
        return (
          <PluginContext plugin={plugin}>
            {extension.outputs.reactComponent()}
          </PluginContext>
        );
      },
    },
  };
}

// default at: 'core.api-holder/apis'
// - plugin.catalog.service:
//     config:
//       port: 3000
//
// - core/apis: @backstage/catalog-react#catalogApi
// - @backstage/catalog-react#catalogApi
// createApiExtension(apiRef, ...) -> copies the 'id' (maybe with a prefix), and a hard coded 'at'
export const catalogApi = createExtension({
  defaultInstanceParameters: {
    id: 'plugin.catalog.service',
    at: 'core.api-holder/apis',
  },
  output: {
    factory: coreExtensionData.apiFactory,
  },
  configSchema: createSchemaFromZod(z =>
    z.object({ port: z.number().default(7007) }),
  ),
  factory({ bind, config }) {
    // Question: What about @frontend app-config? We will need access to app-config for things like tokens
    // eslint-disable-next-line no-console
    console.log('catalogApi port', config.port);
    const factory = createApiFactory({
      api: catalogApiRef,
      deps: {
        discoveryApi: discoveryApiRef,
        fetchApi: fetchApiRef,
      },
      factory: ({ discoveryApi, fetchApi }) =>
        new CatalogClient({ discoveryApi, fetchApi }),
    });

    bind.factory(factory);
  },
});

/*
function createUtilityApiExtension<T>(options: {
  api: ApiRef<T>,
  configSchema,
  factory: ...,
}) {
  return createExtension({
    defaultInstanceParameters: {
      id: 'plugin.catalog.service',
      at: 'core.api-holder/apis',
    },
    output: {
      factory: coreExtensionData.apiFactory,
    },
  })
}
*/

// Create higher level APIs for creating a few standard extensions, along with a higher-order helper for creating those

// mountPoint -> at
// name -> id
function createPageExtension<TConfig>(options: {
  defaultPath: string;
  component: () => Promise<React.ComponentType<{}>>;
  configSchema?: PortableSchema<TConfig>;
}) {
  const { defaultPath, component, configSchema } = options;
  return createExtension({
    output: {
      component: coreExtensionData.reactComponent,
      path: coreExtensionData.routePath,
    },
    configSchema:
      configSchema ||
      createSchemaFromZod(z =>
        z.object({ path: z.string().default(defaultPath) }),
      ),
    factory({ bind, config }) {
      bind.component(component());
      bind.path(config.path);
    },
  });
}

export const GraphiqlPage = createPageExtension({
  configSchema: createSchemaFromZod(z =>
    z.object({ path: z.string().default('/graphiql') }),
  ),
  defaultPath: '/graphiql',
  component: () => import('./GraphiqlPage').then(m => m.GraphiqlPage),
});
