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

import userEvent from '@testing-library/user-event';
import { ApiProvider } from '@backstage/core-app-api';
import { catalogApiRef } from '@backstage/plugin-catalog-react';
import { GroupListPicker } from '../GroupListPicker';
import { GroupEntity } from '@backstage/catalog-model';
import { renderInTestApp, TestApiRegistry } from '@backstage/test-utils';
import { catalogApiMock } from '@backstage/plugin-catalog-react/testUtils';

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

const mockCatalogApi = catalogApiMock.mock({
  getEntities: jest.fn(() => Promise.resolve({ items: mockGroups })),
});

const apis = TestApiRegistry.from([catalogApiRef, mockCatalogApi]);

describe('<GroupListPicker />', () => {
  it('can choose a group', async () => {
    const user = userEvent.setup();

    const { findByText, getByTestId } = await renderInTestApp(
      <ApiProvider apis={apis}>
        <GroupListPicker
          placeholder="Search"
          groupTypes={['org', 'department']}
          onChange={() => {}}
        />
      </ApiProvider>,
    );

    await user.click(getByTestId('group-list-picker-button'));

    const input = getByTestId('group-list-picker-input').querySelector('input');
    await user.type(input as HTMLElement, 'GR');

    await user.click(await findByText('Group A'));

    await expect(findByText('Group A')).resolves.toBeInTheDocument();
  });
});
