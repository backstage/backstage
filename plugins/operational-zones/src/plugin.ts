/*
 * Copyright 2024 The Backstage Authors
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
  discoveryApiRef,
  fetchApiRef,
} from '@backstage/core-plugin-api';
import { createCardExtension } from '@backstage/plugin-home-react';
import { operationalZoneApiRef } from './api/OperationalZoneApi';
import { OperationalZoneClient } from './api/OperationalZoneClient';

/** @public */
export const operationalZonesPlugin = createPlugin({
  id: 'operational-zones',
  apis: [
    createApiFactory({
      api: operationalZoneApiRef,
      deps: { discoveryApi: discoveryApiRef, fetchApi: fetchApiRef },
      factory: ({ discoveryApi, fetchApi }) =>
        new OperationalZoneClient({ discoveryApi, fetchApi }),
    }),
  ],
});

/** @public */
export const HomePageOperationalZonesCard = operationalZonesPlugin.provide(
  createCardExtension({
    name: 'HomePageOperationalZonesCard',
    title: 'Operational Zones',
    components: () =>
      import('./components/OperationalZonesCard/OperationalZonesCard'),
    layout: {
      height: { minRows: 4 },
      width: { minColumns: 4 },
    },
  }),
);
