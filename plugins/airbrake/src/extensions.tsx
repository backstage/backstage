/*
 * Copyright 2020 The Backstage Authors
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

import { useEntity } from '@backstage/plugin-catalog-react';
import React from 'react';
import { airbrakePlugin } from './plugin';
import { createRoutableExtension } from '@backstage/core-plugin-api';
import { rootRouteRef } from './routes';

/**
 * This is the widget that shows up on a component page
 *
 * @public
 */
export const EntityAirbrakeContent = airbrakePlugin.provide(
  createRoutableExtension({
    name: 'EntityAirbrakeContent',
    mountPoint: rootRouteRef,
    component: () =>
      import('./components/EntityAirbrakeWidget').then(
        ({ EntityAirbrakeWidget }) => {
          return () => {
            const { entity } = useEntity();
            return <EntityAirbrakeWidget entity={entity} />;
          };
        },
      ),
  }),
);
