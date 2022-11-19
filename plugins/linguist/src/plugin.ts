/*
 * Copyright 2022 The Backstage Authors
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
  createComponentExtension,
  createPlugin,
  discoveryApiRef,
  identityApiRef,
} from '@backstage/core-plugin-api';
import { linguistApiRef, LinguistClient } from './api';
import { LINGUIST_ANNOTATION } from '@backstage/plugin-linguist-common';
import { Entity } from '@backstage/catalog-model';

/** @public */
export const isLinguistAvailable = (entity: Entity) =>
  Boolean(entity.metadata.annotations?.[LINGUIST_ANNOTATION]);

/** @public */
export const linguistPlugin = createPlugin({
  id: 'linguist',
  apis: [
    createApiFactory({
      api: linguistApiRef,
      deps: { discoveryApi: discoveryApiRef, identityApi: identityApiRef },
      factory: ({ discoveryApi, identityApi }) =>
        new LinguistClient({ discoveryApi, identityApi }),
    }),
  ],
});

/** @public */
export const EntityLinguistCard = linguistPlugin.provide(
  createComponentExtension({
    name: 'EntityLinguistCard',
    component: {
      lazy: () => import('./components/LinguistCard').then(m => m.LinguistCard),
    },
  }),
);
