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

import React, { ComponentType } from 'react';
import { EntityRefLink, EntityRefLinkProps } from './EntityRefLink';
import { TestApiProvider, wrapInTestApp } from '@backstage/test-utils';
import { entityRouteRef } from '../../routes';
import { catalogApiRef } from '../../api';
import { CatalogApi } from '@backstage/catalog-client';

const mockCatalogApi = {
  getEntityByRef: async (entityRef: string) => {
    if (entityRef === 'component:default/playback') {
      return {
        kind: 'Component',
        metadata: {
          name: 'playback',
          namespace: 'default',
          description: 'Details about the playback service',
        },
      };
    }

    return undefined;
  },
};
const defaultArgs = {
  entityRef: 'component:default/playback',
};

export default {
  title: 'Catalog /EntityRefLink',
  decorators: [
    (Story: ComponentType<{}>) =>
      wrapInTestApp(
        <TestApiProvider
          apis={[[catalogApiRef, mockCatalogApi as any as CatalogApi]]}
        >
          <Story />
        </TestApiProvider>,
        {
          mountedRoutes: {
            '/catalog/:namespace/:kind/:name': entityRouteRef,
          },
        },
      ),
  ],
};

export const Default = (args: EntityRefLinkProps) => (
  <EntityRefLink {...args} />
);
Default.args = defaultArgs;

export const WithPeekAheadPopover = (args: EntityRefLinkProps) => (
  <EntityRefLink {...args} />
);

WithPeekAheadPopover.args = {
  entityRef: 'component:default/playback',
  usePeekAheadPopover: true,
};
