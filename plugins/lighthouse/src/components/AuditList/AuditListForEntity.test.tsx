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

import { Entity } from '@backstage/catalog-model';
import { EntityProvider } from '@backstage/plugin-catalog-react';
import { renderInTestApp, TestApiProvider } from '@backstage/test-utils';
import React from 'react';
import {
  lighthouseApiRef,
  LighthouseRestApi,
  WebsiteListResponse,
} from '../../api';
import { useWebsiteForEntity } from '../../hooks/useWebsiteForEntity';
import * as data from '../../__fixtures__/website-list-response.json';
import { AuditListForEntity } from './AuditListForEntity';

jest.mock('../../hooks/useWebsiteForEntity', () => ({
  useWebsiteForEntity: jest.fn(),
}));

const useWebsiteForEntityMock = useWebsiteForEntity as jest.Mock;

const websiteListResponse = data as WebsiteListResponse;
const entityWebsite = websiteListResponse.items[0];

describe('<AuditListTableForEntity />', () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  const entity: Entity = {
    apiVersion: 'v1',
    kind: 'Component',
    metadata: {
      name: 'software',
      annotations: {
        'lighthouse.com/website-url': entityWebsite.url,
      },
    },
    spec: {
      owner: 'guest',
      type: 'Website',
      lifecycle: 'development',
    },
  };

  const subject = () => (
    <TestApiProvider
      apis={[[lighthouseApiRef, new LighthouseRestApi('http://lighthouse')]]}
    >
      <EntityProvider entity={entity}>
        <AuditListForEntity />
      </EntityProvider>
    </TestApiProvider>
  );

  it('renders the audit list for the entity', async () => {
    useWebsiteForEntityMock.mockReturnValue({
      value: entityWebsite,
      loading: false,
      error: null,
    });
    const { findByText } = await renderInTestApp(subject());
    expect(await findByText(entityWebsite.url)).toBeInTheDocument();
  });

  it('renders a Progress element where the data is loading', async () => {
    useWebsiteForEntityMock.mockReturnValue({
      value: null,
      loading: true,
      error: null,
    });

    const { findByTestId } = await renderInTestApp(subject());
    expect(await findByTestId('progress')).toBeInTheDocument();
  });

  it('renders nothing where there is an error loading data', async () => {
    useWebsiteForEntityMock.mockReturnValue({
      value: null,
      loading: false,
      error: 'error',
    });
    const { queryByTestId } = await renderInTestApp(subject());
    expect(queryByTestId('AuditListTable')).toBeNull();
  });

  it('renders nothing where there is not data', async () => {
    useWebsiteForEntityMock.mockReturnValue({
      value: null,
      loading: false,
      error: null,
    });

    const { queryByTestId } = await renderInTestApp(subject());
    expect(queryByTestId('AuditListTable')).toBeNull();
  });
});
