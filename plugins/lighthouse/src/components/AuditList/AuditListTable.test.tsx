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

import React from 'react';
import fs from 'fs';
import path from 'path';
import { render } from '@testing-library/react';
import { wrapInThemedTestApp } from '@backstage/test-utils';

import AuditListTable from './AuditListTable';
import { WebsiteListResponse } from '../../api';
import { formatTime } from '../../utils';

const websiteListResponseJson = fs
  .readFileSync(
    path.join(__dirname, '../../__fixtures__/website-list-response.json'),
  )
  .toString();

const websiteListResponse: WebsiteListResponse = JSON.parse(
  websiteListResponseJson,
);

describe('AuditListTable', () => {
  it('renders the link to each website', () => {
    const rendered = render(
      wrapInThemedTestApp(<AuditListTable items={websiteListResponse.items} />),
    );
    const link = rendered.queryByText('https://anchor.fm');
    const website = websiteListResponse.items.find(
      w => w.url === 'https://anchor.fm',
    );
    if (!website)
      throw new Error('https://anchor.fm must be present in fixture');
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute(
      'href',
      `/lighthouse/audit/${website.lastAudit.id}`,
    );
  });

  it('renders the dates that are available for a given row', () => {
    const rendered = render(
      wrapInThemedTestApp(<AuditListTable items={websiteListResponse.items} />),
    );
    const website = websiteListResponse.items.find(
      w => w.url === 'https://anchor.fm',
    );
    if (!website)
      throw new Error('https://anchor.fm must be present in fixture');
    expect(
      rendered.queryByText(formatTime(website.lastAudit.timeCreated)),
    ).toBeInTheDocument();
  });

  it('renders the status for a given row', async () => {
    const rendered = render(
      wrapInThemedTestApp(<AuditListTable items={websiteListResponse.items} />),
    );

    const completed = await rendered.findAllByText('completed');
    expect(completed).toHaveLength(
      websiteListResponse.items.filter(w => w.lastAudit.status === 'COMPLETED')
        .length,
    );

    const failed = await rendered.findAllByText('failed');
    expect(failed).toHaveLength(
      websiteListResponse.items.filter(w => w.lastAudit.status === 'FAILED')
        .length,
    );

    const running = await rendered.findAllByText('failed');
    expect(running).toHaveLength(
      websiteListResponse.items.filter(w => w.lastAudit.status === 'RUNNING')
        .length,
    );
  });

  describe('sparklines', () => {
    it('correctly maps the data from the website payload', () => {
      const rendered = render(
        wrapInThemedTestApp(
          <AuditListTable items={websiteListResponse.items} />,
        ),
      );
      const backstageSEO = rendered.getByTitle(
        'trendline for SEO category of https://backstage.io',
      );
      expect(backstageSEO).toBeInTheDocument();
    });

    it('does not break when no data is available', () => {
      const rendered = render(
        wrapInThemedTestApp(
          <AuditListTable items={websiteListResponse.items} />,
        ),
      );
      const anchorSEO = rendered.queryByTitle(
        'trendline for SEO category of https://anchor.fm',
      );
      expect(anchorSEO).not.toBeInTheDocument();
    });
  });
});
