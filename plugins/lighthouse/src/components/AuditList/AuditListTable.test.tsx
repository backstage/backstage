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
import { screen } from '@testing-library/react';
import {
  renderInTestApp,
  setupRequestMockHandlers,
  TestApiRegistry,
} from '@backstage/test-utils';
import AuditListTable from './AuditListTable';

import {
  WebsiteListResponse,
  LighthouseRestApi,
} from '@backstage/plugin-lighthouse-common';
import { lighthouseApiRef } from '../../api';
import { formatTime } from '../../utils';
import { setupServer } from 'msw/node';
import * as data from '../../__fixtures__/website-list-response.json';

import { ApiProvider } from '@backstage/core-app-api';

const websiteListResponse = data as WebsiteListResponse;

describe('AuditListTable', () => {
  let apis: TestApiRegistry;

  const server = setupServer();
  setupRequestMockHandlers(server);

  beforeEach(() => {
    apis = TestApiRegistry.from([
      lighthouseApiRef,
      new LighthouseRestApi('http://lighthouse'),
    ]);
  });

  const auditList = (websiteList: WebsiteListResponse) => {
    return (
      <ApiProvider apis={apis}>
        <AuditListTable items={websiteList.items} />
      </ApiProvider>
    );
  };
  it('renders the link to each website', async () => {
    await renderInTestApp(auditList(websiteListResponse));
    const link = screen.queryByText('https://anchor.fm');
    const website = websiteListResponse.items.find(
      w => w.url === 'https://anchor.fm',
    );
    if (!website)
      throw new Error('https://anchor.fm must be present in fixture');
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute('href', `/audit/${website.lastAudit.id}`);
  });

  it('renders the dates that are available for a given row', async () => {
    await renderInTestApp(auditList(websiteListResponse));
    const website = websiteListResponse.items.find(
      w => w.url === 'https://anchor.fm',
    );
    if (!website)
      throw new Error('https://anchor.fm must be present in fixture');
    expect(
      screen.getByText(formatTime(website.lastAudit.timeCreated)),
    ).toBeInTheDocument();
  });

  it('renders the status for a given row', async () => {
    await renderInTestApp(auditList(websiteListResponse));

    const completed = await screen.findAllByText('COMPLETED');
    expect(completed).toHaveLength(
      websiteListResponse.items.filter(w => w.lastAudit.status === 'COMPLETED')
        .length,
    );

    const failed = await screen.findAllByText('FAILED');
    expect(failed).toHaveLength(
      websiteListResponse.items.filter(w => w.lastAudit.status === 'FAILED')
        .length,
    );

    const running = await screen.findAllByText('FAILED');
    expect(running).toHaveLength(
      websiteListResponse.items.filter(w => w.lastAudit.status === 'RUNNING')
        .length,
    );
  });

  describe('sparklines', () => {
    it('correctly maps the data from the website payload', async () => {
      await renderInTestApp(auditList(websiteListResponse));
      const backstageSEO = screen.getByTitle(
        'trendline for SEO category of https://backstage.io',
      );
      expect(backstageSEO).toBeInTheDocument();
    });

    it('does not break when no data is available', async () => {
      await renderInTestApp(auditList(websiteListResponse));
      const anchorSEO = screen.queryByTitle(
        'trendline for SEO category of https://anchor.fm',
      );
      expect(anchorSEO).not.toBeInTheDocument();
    });
  });
});
