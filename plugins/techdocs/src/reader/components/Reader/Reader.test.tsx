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

import React from 'react';
import { render, waitFor } from '@testing-library/react';

import {
  ScmIntegrationsApi,
  scmIntegrationsApiRef,
} from '@backstage/integration-react';
import { ConfigReader } from '@backstage/config';
import { ApiProvider } from '@backstage/core-app-api';
import { searchApiRef } from '@backstage/plugin-search';
import { TestApiRegistry, wrapInTestApp } from '@backstage/test-utils';

import { TechDocsStorageApi, techdocsStorageApiRef } from '../../../api';
import { Reader } from './Reader';

jest.mock('react-router-dom', () => {
  const actual = jest.requireActual('react-router-dom');
  return {
    ...actual,
    useParams: jest.fn().mockReturnValue({
      entityRef: 'Component::backstage',
    }),
  };
});

const searchApi = {
  query: jest.fn().mockResolvedValue({ results: [] }),
};

const scmIntegrationsApi = ScmIntegrationsApi.fromConfig(
  new ConfigReader({
    integrations: {},
  }),
);

const techdocsStorageApi: Partial<TechDocsStorageApi> = {
  getEntityDocs: jest.fn().mockResolvedValue('<html />'),
  syncEntityDocs: jest.fn().mockResolvedValue('cached'),
};

const apiRegistry = TestApiRegistry.from(
  [searchApiRef, searchApi],
  [scmIntegrationsApiRef, scmIntegrationsApi],
  [techdocsStorageApiRef, techdocsStorageApi],
);

describe('<Reader />', () => {
  it('should render Reader content', async () => {
    const id = 'techdocs-content-shadowroot';

    const rendered = render(
      wrapInTestApp(
        <ApiProvider apis={apiRegistry}>
          <Reader
            entityRef={{
              kind: 'Component',
              namespace: 'default',
              name: 'example',
            }}
          >
            <div data-testid={id} />
          </Reader>
        </ApiProvider>,
      ),
    );

    await waitFor(() => {
      expect(rendered.getByTestId(id)).toBeInTheDocument();
    });
  });
});
