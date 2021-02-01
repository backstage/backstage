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

import { DomainEntity } from '@backstage/catalog-model';
import { ApiProvider, ApiRegistry } from '@backstage/core';
import { catalogApiRef } from '@backstage/plugin-catalog-react';
import { render, waitFor } from '@testing-library/react';
import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { DomainExplorerContent } from './DomainExplorerContent';

describe('<DomainExplorerContent />', () => {
  const catalogApi: jest.Mocked<typeof catalogApiRef.T> = {
    addLocation: jest.fn(_a => new Promise(() => {})),
    getEntities: jest.fn(),
    getLocationByEntity: jest.fn(),
    getLocationById: jest.fn(),
    removeEntityByUid: jest.fn(),
    getEntityByName: jest.fn(),
  };

  const Wrapper = ({ children }: { children?: React.ReactNode }) => (
    <MemoryRouter>
      <ApiProvider apis={ApiRegistry.with(catalogApiRef, catalogApi)}>
        {children}
      </ApiProvider>
    </MemoryRouter>
  );

  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('renders a grid of domains', async () => {
    const entities: DomainEntity[] = [
      {
        apiVersion: 'backstage.io/v1alpha1',
        kind: 'Domain',
        metadata: {
          name: 'playback',
        },
        spec: {
          owner: 'guest',
        },
      },
      {
        apiVersion: 'backstage.io/v1alpha1',
        kind: 'Domain',
        metadata: {
          name: 'artists',
        },
        spec: {
          owner: 'guest',
        },
      },
    ];
    catalogApi.getEntities.mockResolvedValue({ items: entities });

    const { getByText } = render(<DomainExplorerContent />, {
      wrapper: Wrapper,
    });

    await waitFor(() => {
      expect(getByText('artists')).toBeInTheDocument();
      expect(getByText('playback')).toBeInTheDocument();
    });
  });

  it('renders empty state', async () => {
    catalogApi.getEntities.mockResolvedValue({ items: [] });

    const { getByText } = render(<DomainExplorerContent />, {
      wrapper: Wrapper,
    });

    await waitFor(() =>
      expect(getByText('No domains to display')).toBeInTheDocument(),
    );
  });
});
