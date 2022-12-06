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

import React from 'react';
import { render, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ApiProvider } from '@backstage/core-app-api';
import { catalogApiRef } from '@backstage/plugin-catalog-react';
import { CatalogApi } from '@backstage/catalog-client';
import { GroupListPicker } from '../GroupListPicker';
import { GroupEntity } from '@backstage/catalog-model';
import { TestApiRegistry } from '@backstage/test-utils';

const mockGroups: GroupEntity[] = [
  {
    apiVersion: 'backstage.io/v1alpha1',
    kind: 'Group',
    metadata: {
      namespace: 'default',
      name: 'group-a',
    },
    spec: {
      type: 'org',
      profile: {
        displayName: 'Group A',
      },
      children: [],
    },
  },
  {
    apiVersion: 'backstage.io/v1alpha1',
    kind: 'Group',
    metadata: {
      namespace: 'default',
      name: 'group-b',
    },
    spec: {
      type: 'department',
      profile: {
        displayName: 'Group B',
      },
      children: [],
    },
  },
];

const mockCatalogApi = {
  getEntities: () => Promise.resolve({ items: mockGroups }),
} as Partial<CatalogApi>;

const apis = TestApiRegistry.from([catalogApiRef, mockCatalogApi]);

describe('<GroupListPicker />', () => {
  it('can choose a group', async () => {
    const { getByText, getByTestId } = render(
      <ApiProvider apis={apis}>
        <GroupListPicker
          placeholder="Search"
          groupTypes={['org', 'department']}
          onChange={() => {}}
        />
      </ApiProvider>,
    );

    await userEvent.click(getByTestId('group-list-picker-button'));
    const input = getByTestId('group-list-picker-input').querySelector('input');
    await userEvent.type(input as HTMLElement, 'GR');

    await waitFor(async () => {
      expect(getByText('Group A')).toBeInTheDocument();
      await userEvent.click(getByText('Group A'));
      expect(getByText('Group A')).toBeInTheDocument();
    });
  });
});
