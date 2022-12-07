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
          description: 'service with an owner',
          tags: ['a-tag'],
          annotations: {
            'backstage.io/techdocs-ref': 'dir:.',
          },
        },
        kind: 'Component',
        spec: {
          type: 'service',
          lifecycle: 'test',
          owner: 'team-a',
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
          description: '',
          tags: [],
        },
        kind: 'Component',
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
        },
        kind: 'Component',
        spec: {
          type: 'service',
          lifecycle: 'test',
          owner: 'user:my-user',
        },
      },
      {
        apiVersion: 'backstage.io/v1beta1',
        metadata: {
          name: 'user-a',
        },
        kind: 'User',
        spec: {
          memberOf: 'group-a',
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
        <SelectedOwnedByFilter
          value={['user', 'component']}
          onChange={() => {}}
        />
      </ApiProvider>,
    );
    expect(baseElement).toBeInTheDocument();
  });

  it('should render current value', async () => {
    await renderWithEffects(
      <ApiProvider apis={apis}>
        <SelectedOwnedByFilter
          value={['user', 'component']}
          onChange={() => {}}
        />
      </ApiProvider>,
    );

    expect(screen.getByText('user')).toBeInTheDocument();
    expect(screen.getByText('component')).toBeInTheDocument();
  });
  it('should return undefined if all values are selected', async () => {
    const onChange = jest.fn();
    await renderWithEffects(
      <ApiProvider apis={apis}>
        <SelectedOwnedByFilter
          value={['user', 'component', 'system', 'domain']}
          onChange={onChange}
        />
      </ApiProvider>,
    );
    await userEvent.click(screen.getByLabelText('Open'));

    await waitFor(() =>
      expect(screen.getByText('Resource')).toBeInTheDocument(),
    );

    await userEvent.click(screen.getByText('Resource'));

    await waitFor(() => {
      expect(onChange).toHaveBeenCalledWith(undefined);
    });
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
