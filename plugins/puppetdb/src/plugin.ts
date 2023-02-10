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
  createApiFactory,
  createPlugin,
  createRoutableExtension,
  discoveryApiRef,
  fetchApiRef,
} from '@backstage/core-plugin-api';

import { rootRouteRef } from './routes';
import { Entity } from '@backstage/catalog-model';
import { ANNOTATION_PUPPET_CERTNAME } from './constants';
import { puppetDbApiRef, PuppetDbClient } from './api';

/**
 * Create the PuppetDB frontend plugin.
 * @public
 */
export const puppetdbPlugin = createPlugin({
  id: 'puppetdb',
  apis: [
    createApiFactory({
      api: puppetDbApiRef,
      deps: {
        discoveryApi: discoveryApiRef,
        fetchApi: fetchApiRef,
      },
      factory: ({ discoveryApi, fetchApi }) =>
        new PuppetDbClient({
          discoveryApi,
          fetchApi,
        }),
    }),
  ],
});

/**
 * Checks if the entity has a puppet certname annotation.
 * @public
 * @param entity - The entity to check for the puppet cername annotation.
 */
export const isPuppetDbAvailable = (entity: Entity) =>
  // TODO(tdabasinskas): Remove the `|| true` once testing is done.
  Boolean(entity.metadata.annotations?.[ANNOTATION_PUPPET_CERTNAME]) || true;

/**
 * Creates a routable extension for the PuppetDB plugin tab.
 * @public
 */
export const PuppetDbTab = puppetdbPlugin.provide(
  createRoutableExtension({
    name: 'PuppetdbPage',
    component: () =>
      import('./components/PuppetDbTab').then(m => m.PuppetDbTab),
    mountPoint: rootRouteRef,
  }),
);
