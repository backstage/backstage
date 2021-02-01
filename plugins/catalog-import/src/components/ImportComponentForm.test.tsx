/*
 * Copyright 2021 Spotify AB
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
import { CatalogClient } from '@backstage/catalog-client';
import {
  ApiProvider,
  ApiRegistry,
  DiscoveryApi,
  errorApiRef,
} from '@backstage/core';
import { catalogApiRef } from '@backstage/plugin-catalog-react';
import { renderInTestApp } from '@backstage/test-utils';
import { fireEvent, screen, waitFor } from '@testing-library/react';
import React from 'react';
import { catalogImportApiRef, CatalogImportClient } from '../api';
import { RegisterComponentForm } from './ImportComponentForm';

describe('<RegisterComponentForm />', () => {
  let apis: ApiRegistry;

  const mockErrorApi: jest.Mocked<typeof errorApiRef.T> = {
    post: jest.fn(),
    error$: jest.fn(),
  };

  beforeEach(() => {
    apis = ApiRegistry.from([
      [catalogApiRef, new CatalogClient({ discoveryApi: {} as DiscoveryApi })],
      [
        catalogImportApiRef,
        new CatalogImportClient({
          discoveryApi: { getBaseUrl: () => Promise.resolve('base') },
          githubAuthApi: {
            getAccessToken: (_, __) => Promise.resolve('token'),
          },
          configApi: {} as any,
        }),
      ],
      [errorApiRef, mockErrorApi],
    ]);
  });

  async function renderSUT(
    nextStep: () => void = () => {},
    saveConfig: () => void = () => {},
  ) {
    return await renderInTestApp(
      <ApiProvider apis={apis}>
        <RegisterComponentForm
          nextStep={nextStep}
          saveConfig={saveConfig}
          repository="GitHub"
        />
      </ApiProvider>,
    );
  }

  it('Renders without exploding', async () => {
    await renderSUT();
    expect(
      screen.getByPlaceholderText('https://github.com/backstage/backstage'),
    ).toBeInTheDocument();
  });

  it('Should have basic URL validation for input', async () => {
    await renderSUT();
    await waitFor(() => {
      fireEvent.input(
        screen.getByPlaceholderText('https://github.com/backstage/backstage'),
        { target: { value: 'not a url' } },
      );
    });
    await waitFor(() => {
      fireEvent.click(screen.getByText('Next'));
    });
    expect(screen.getByText('Must start with https://.')).toBeInTheDocument();
  });
});
