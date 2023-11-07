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
import {
  discoveryApiRef,
  fetchApiRef,
  createApiFactory,
  createPlugin,
  createRoutableExtension,
  createComponentExtension,
} from '@backstage/core-plugin-api';
import React from 'react';
import { rootRouteRef } from './routes';
import { HcpConsulHttpApi, hcpConsulApiRef } from './api/api';

export const hcpConsulPlugin = createPlugin({
  id: 'hcp-consul',
  routes: {
    root: rootRouteRef,
  },
  apis: [
    createApiFactory({
      api: hcpConsulApiRef,
      deps: { discoveryApi: discoveryApiRef, fetchApi: fetchApiRef },
      factory: ({ discoveryApi, fetchApi }) =>
        HcpConsulHttpApi.create(discoveryApi, fetchApi),
    }),
  ],
});

type HcpConsulPluginPageProps = {
  projectID: string;
};

export const HcpConsulPluginPage: (
  props: HcpConsulPluginPageProps,
) => React.JSX.Element = hcpConsulPlugin.provide(
  createRoutableExtension({
    name: 'HcpConsulPluginPage',
    component: () =>
      import('./components/HcpConsul').then(({ HcpConsulOverview }) => {
        return props => {
          return <HcpConsulOverview projectID={props.projectID} />;
        };
      }),
    mountPoint: rootRouteRef,
  }),
);

export const EntityServiceInstancesTable = hcpConsulPlugin.provide(
  createComponentExtension({
    name: 'EntityServiceInstancesTable',
    component: {
      lazy: () =>
        import('./components/Service').then(m => m.EntityServiceInstancesTable),
    },
  }),
);
