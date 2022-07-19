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

import { catalogApiRef, EntityProvider } from '@backstage/plugin-catalog-react';

import { renderInTestApp, TestApiProvider } from '@backstage/test-utils';
import React from 'react';
import { rootRouteRef } from '../../routes';
import { EntityOrphanWarning } from './EntityOrphanWarning';

describe('<EntityOrphanWarning />', () => {
  it('renders EntityOrphanWarning if the entity is orphan', async () => {
    const entity = {
      apiVersion: 'v1',
      kind: 'Component',
      metadata: {
        name: 'software',
        description: 'This is the description',
        annotations: { 'backstage.io/orphan': 'true' },
      },

      spec: {
        owner: 'guest',
        type: 'service',
        lifecycle: 'production',
      },
    };

    const { getByText } = await renderInTestApp(
      <TestApiProvider
        apis={[
          [
            catalogApiRef,
            {
              removeEntityByUid: jest.fn(),
            },
          ],
        ]}
      >
        <EntityProvider entity={entity}>
          <EntityOrphanWarning />
        </EntityProvider>
      </TestApiProvider>,
      {
        mountedRoutes: {
          '/create': rootRouteRef,
        },
      },
    );
    expect(
      getByText(
        'This entity is not referenced by any location and is therefore not receiving updates. Click here to delete.',
      ),
    ).toBeInTheDocument();
  });
});
