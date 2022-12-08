/*
 * Copyright 2021 The Backstage Authors
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

import { GetEntitiesResponse } from '@backstage/catalog-client';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithEffects, TestApiRegistry } from '@backstage/test-utils';
import { AlertApi, alertApiRef } from '@backstage/core-plugin-api';
import { catalogApiRef } from '@backstage/plugin-catalog-react';
import React from 'react';
import { ApiProvider } from '@backstage/core-app-api';
import { SelectedOwnedByFilter } from './SelectedOwnedByFilter';
import { RELATION_OWNED_BY } from '@backstage/catalog-model';

const getEntitiesMock = jest.fn();
jest.mock('@backstage/catalog-client', () => {
  return {
    CatalogClient: jest
      .fn()
      .mockImplementation(() => ({ getEntities: getEntitiesMock })),
  };
});

const catalogApi = {
  getEntities: jest.fn().mockResolvedValue({
    items: [
      {
        apiVersion: 'backstage.io/v1beta1',
        metadata: {
          name: 'service-with-owner',
          namespace: 'service-with-owner',
          description: 'service with an owner',
          tags: ['a-tag'],
          annotations: {
            'backstage.io/techdocs-ref': 'dir:.',
          },
        },
        kind: 'Group',
        spec: {
          type: 'service',
          lifecycle: 'test',
          owner: 'group:default/my-team',
        },
        relations: [
          {
            type: RELATION_OWNED_BY,
            targetRef: 'group:default/my-team',
          },
        ],
      },
      {
        apiVersion: 'backstage.io/v1beta1',
        metadata: {
          name: 'service-with-incomplete-data',
          namespace: 'service-with-incomplete-data',
          description: '',
          tags: [],
        },
        kind: 'Group',
        spec: {
          type: 'service',
          lifecycle: 'test',
          owner: '',
        },
      },
      {
        apiVersion: 'backstage.io/v1beta1',
        metadata: {
          name: 'service-with-user-owner',
          namespace: 'service-with-user-owner',
        },
        kind: 'User',
        spec: {
          type: 'service',
          lifecycle: 'test',
          owner: 'user:my-user',
        },
      },
    ],
  } as GetEntitiesResponse),
};
const apis = TestApiRegistry.from(
  [catalogApiRef, catalogApi],
  [alertApiRef, {} as AlertApi],
);

describe('<SelectedOwnedByFilter/>', () => {
  beforeEach(() => {
    getEntitiesMock.mockResolvedValue(catalogApi);
  });
  afterEach(() => {
    getEntitiesMock.mockClear();
  });
  it('should not explode while loading', async () => {
    const { baseElement } = await renderWithEffects(
      <ApiProvider apis={apis}>
        <SelectedOwnedByFilter value={['user', 'group']} onChange={() => {}} />
      </ApiProvider>,
    );
    expect(baseElement).toBeInTheDocument();
  });

  it('should render current value', async () => {
    await renderWithEffects(
      <ApiProvider apis={apis}>
        <SelectedOwnedByFilter value={['user', 'group']} onChange={() => {}} />
      </ApiProvider>,
    );

    expect(screen.getByText('user')).toBeInTheDocument();
    expect(screen.getByText('group')).toBeInTheDocument();
  });

  it('should return all values when cleared', async () => {
    const onChange = jest.fn();
    await renderWithEffects(
      <ApiProvider apis={apis}>
        <SelectedOwnedByFilter value={[]} onChange={onChange} />
      </ApiProvider>,
    );

    await userEvent.click(screen.getByRole('combobox'));
    await userEvent.tab();

    await waitFor(() => {
      expect(onChange).toHaveBeenCalledWith(undefined);
    });
  });
});
