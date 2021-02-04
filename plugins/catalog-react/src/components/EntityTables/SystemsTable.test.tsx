/*
 * Copyright 2020 Spotify AB
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
  RELATION_OWNED_BY,
  RELATION_PART_OF,
  SystemEntity,
} from '@backstage/catalog-model';
import { renderInTestApp } from '@backstage/test-utils';
import { waitFor } from '@testing-library/react';
import React from 'react';
import { SystemsTable } from './SystemsTable';

describe('<SystemsTable />', () => {
  it('shows empty table', async () => {
    const { getByText } = await renderInTestApp(
      <SystemsTable
        title="My Systems"
        entities={[]}
        emptyComponent={<div>EMPTY</div>}
      />,
    );

    expect(getByText('My Systems')).toBeInTheDocument();
    expect(getByText('EMPTY')).toBeInTheDocument();
  });

  it('shows systems', async () => {
    const entities: SystemEntity[] = [
      {
        apiVersion: 'backstage.io/v1alpha1',
        kind: 'System',
        metadata: {
          name: 'my-system',
          namespace: 'my-namespace',
          description: 'Some description',
        },
        spec: {
          owner: 'owner-data',
        },
        relations: [
          {
            type: RELATION_PART_OF,
            target: {
              kind: 'Domain',
              name: 'my-domain',
              namespace: 'my-namespace',
            },
          },
          {
            type: RELATION_OWNED_BY,
            target: {
              kind: 'Group',
              name: 'Test',
              namespace: 'default',
            },
          },
        ],
      },
    ];

    const { getByText } = await renderInTestApp(
      <SystemsTable
        title="My Systems"
        entities={entities}
        emptyComponent={<div>EMPTY</div>}
      />,
    );

    await waitFor(() => {
      expect(getByText('My Systems')).toBeInTheDocument();
      expect(getByText('my-namespace/my-system')).toBeInTheDocument();
      expect(getByText('my-namespace/my-domain')).toBeInTheDocument();
      expect(getByText('Test')).toBeInTheDocument();
      expect(getByText('Some description')).toBeInTheDocument();
    });
  });
});
