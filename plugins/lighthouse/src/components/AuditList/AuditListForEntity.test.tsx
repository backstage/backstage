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
  LighthouseRestApi,
  WebsiteListResponse,
} from '@backstage/plugin-lighthouse-common';
import { lighthouseApiRef } from '../../api';
import { useWebsiteForEntity } from '../../hooks/useWebsiteForEntity';
import * as data from '../../__fixtures__/website-list-response.json';
import { AuditListForEntity } from './AuditListForEntity';
import { rootRouteRef } from '../../plugin';
import { fireEvent, screen } from '@testing-library/react';

jest.mock('../../hooks/useWebsiteForEntity', () => ({
  useWebsiteForEntity: jest.fn(),
}));

jest.mock('react-router-dom', () => {
  const actual = jest.requireActual('react-router-dom');
  const mockNavigation = jest.fn();
  return {
    ...actual,
    useNavigate: jest.fn(() => mockNavigation),
  };
});

const useWebsiteForEntityMock = useWebsiteForEntity as jest.Mock;

const websiteListResponse = data as WebsiteListResponse;
const entityWebsite = websiteListResponse.items[0];

const testAppOptions = {
  mountedRoutes: { '/': rootRouteRef },
};

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
    const rendered = await renderInTestApp(subject(), testAppOptions);
    const create_audit_button = await rendered.findByText('Create New Audit');
    const support_button = await rendered.findByText('Support');
    expect(await rendered.findByText(entityWebsite.url)).toBeInTheDocument();
    expect(await rendered.findByText('Latest Audit')).toBeInTheDocument();
    expect(create_audit_button).toBeInTheDocument();
    expect(support_button).toBeInTheDocument();
  });

  it('renders a Progress element when the data is loading', async () => {
    useWebsiteForEntityMock.mockReturnValue({
      value: null,
      loading: true,
      error: null,
    });

    const { findByTestId } = await renderInTestApp(subject(), testAppOptions);
    expect(await findByTestId('progress')).toBeInTheDocument();
  });

  it('renders a WarningPanel when there is an error loading data', async () => {
    useWebsiteForEntityMock.mockReturnValue({
      value: null,
      loading: false,
      error: { name: 'error', message: 'error loading data' },
    });
    await renderInTestApp(subject(), testAppOptions);
    const expandIcon = screen.getByText('Error: Could not load audit list.');
    fireEvent.click(expandIcon);
    expect(
      screen.getByText('Error: Could not load audit list.'),
    ).toBeInTheDocument();
    expect(screen.getByText('error loading data')).toBeInTheDocument();
  });

  it('renders an empty table when there is no data', async () => {
    useWebsiteForEntityMock.mockReturnValue({
      value: null,
      loading: false,
      error: null,
    });

    const rendered = await renderInTestApp(subject(), testAppOptions);
    const create_audit_button = await rendered.findByText('Create New Audit');
    const support_button = await rendered.findByText('Support');
    expect(
      await rendered.findByText('No records to display'),
    ).toBeInTheDocument();
    expect(await rendered.findByText('Latest Audit')).toBeInTheDocument();
    expect(create_audit_button).toBeInTheDocument();
    expect(support_button).toBeInTheDocument();
  });

  it('renders an empty table when there is no data and error loading data due to empty database query result', async () => {
    useWebsiteForEntityMock.mockReturnValue({
      value: null,
      loading: false,
      error: {
        name: 'error',
        message: 'no audited website found for url unit-test-url',
      },
    });

    const rendered = await renderInTestApp(subject(), testAppOptions);
    const create_audit_button = await rendered.findByText('Create New Audit');
    const support_button = await rendered.findByText('Support');
    expect(
      await rendered.findByText('No records to display'),
    ).toBeInTheDocument();
    expect(await rendered.findByText('Latest Audit')).toBeInTheDocument();
    expect(create_audit_button).toBeInTheDocument();
    expect(support_button).toBeInTheDocument();
  });
});
