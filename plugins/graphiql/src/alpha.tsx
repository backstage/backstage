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
import {
  createApiExtension,
  createExtension,
  createExtensionDataRef,
  createPageExtension,
  createPlugin,
  createSchemaFromZod,
  PortableSchema,
} from '@backstage/frontend-plugin-api';
import {
  graphQlBrowseApiRef,
  GraphQLEndpoints,
  GraphQLEndpoint,
} from '@backstage/plugin-graphiql';
import { createApiFactory } from '@backstage/core-plugin-api';

/** @alpha */
export const GraphiqlPage = createPageExtension({
  id: 'plugin.graphiql.page',
  defaultPath: '/graphiql',
  component: () => import('./components').then(m => <m.GraphiQLPage />),
});

/** @internal */
const endpointDataRef = createExtensionDataRef<GraphQLEndpoint>(
  'plugin.graphiql.endpoint',
);

/** @alpha */
export const graphiqlBrowseApi = createApiExtension({
  api: graphQlBrowseApiRef, // apis.plugin.graphiql.browse
  inputs: {
    endpoints: {
      extensionData: {
        endpoint: endpointDataRef,
      },
    },
  },
  factory({ inputs }) {
    return createApiFactory(
      graphQlBrowseApiRef,
      GraphQLEndpoints.from(inputs.endpoints.map(i => i.endpoint)),
    );
  },
});

/** @alpha */
export function createEndpointExtension<TConfig extends {}>(options: {
  id: string;
  configSchema?: PortableSchema<TConfig>;
  factory: (options: { config: TConfig }) => { endpoint: GraphQLEndpoint };
}) {
  return createExtension({
    id: `apis.plugin.graphiql.browse.${options.id}`,
    at: 'apis.plugin.graphiql.browse/endpoints',
    configSchema: options.configSchema,
    disabled: true,
    output: {
      endpoint: endpointDataRef,
    },
    factory({ bind, config }) {
      bind({
        endpoint: options.factory({ config }).endpoint,
      });
    },
  });
}

/** @alpha */
const gitlabGraphiQLBrowseExtension = createEndpointExtension({
  id: 'gitlab',
  configSchema: createSchemaFromZod(z =>
    z
      .object({
        id: z.string().default('gitlab'),
        title: z.string().default('GitLab'),
        url: z.string().default('https://gitlab.com/api/graphql'),
      })
      .default({}),
  ),
  factory: ({ config }) => ({ endpoint: GraphQLEndpoints.create(config) }),
});

/** @alpha */
export default createPlugin({
  id: 'graphiql',
  extensions: [GraphiqlPage, graphiqlBrowseApi, gitlabGraphiQLBrowseExtension],
});
