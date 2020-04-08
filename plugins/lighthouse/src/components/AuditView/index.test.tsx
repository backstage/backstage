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

/* eslint-disable jest/no-disabled-tests */

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useParams: jest.fn(() => ({})),
}));

import React from 'react';
import mockFetch from 'jest-fetch-mock';
import { render } from '@testing-library/react';
import { wrapInThemedTestApp } from '@backstage/test-utils';
import { ApiRegistry, ApiProvider } from '@backstage/core';

import AuditView from '.';
import { lighthouseApiRef, LighthouseRestApi, Audit, Website } from '../../api';
import { formatTime } from '../../utils';
import * as data from '../../__fixtures__/website-response.json';

const { useParams }: { useParams: jest.Mock } = require.requireMock(
  'react-router-dom',
);
const websiteResponse = data as Website;

describe('AuditView', () => {
  let apis: ApiRegistry;
  let id: string;

  beforeEach(() => {
    mockFetch.mockResponse(JSON.stringify(websiteResponse));
    apis = ApiRegistry.from([
      [lighthouseApiRef, new LighthouseRestApi('https://lighthouse')],
    ]);
    id = websiteResponse.audits.find(a => a.status === 'COMPLETED')
      ?.id as string;
    useParams.mockReturnValue({ id });
  });

  it('renders the iframe for the selected audit', async () => {
    const rendered = render(
      wrapInThemedTestApp(
        <ApiProvider apis={apis}>
          <AuditView />
        </ApiProvider>,
      ),
    );

    const iframe = await rendered.findByTitle(
      'Lighthouse audit for https://spotify.com',
    );
    expect(iframe).toBeInTheDocument();
    expect(iframe).toHaveAttribute('src', `https://lighthouse/v1/audits/${id}`);
  });

  it('renders a link to create a new audit for this website', async () => {
    const rendered = render(
      wrapInThemedTestApp(
        <ApiProvider apis={apis}>
          <AuditView />
        </ApiProvider>,
      ),
    );

    const button = await rendered.findByText('Create Audit');
    expect(button).toBeInTheDocument();
    expect(button.parentElement).toHaveAttribute(
      'href',
      `/lighthouse/create-audit?url=${encodeURIComponent(
        'https://spotify.com',
      )}`,
    );
  });

  describe('sidebar', () => {
    it('renders a list of all audits for the website', async () => {
      const rendered = render(
        wrapInThemedTestApp(
          <ApiProvider apis={apis}>
            <AuditView />
          </ApiProvider>,
        ),
      );

      await rendered.findByTestId('audit-sidebar');

      websiteResponse.audits.forEach(a => {
        expect(
          rendered.queryByText(formatTime(a.timeCreated)),
        ).toBeInTheDocument();
      });
    });

    it('sets the current audit as active', async () => {
      const rendered = render(
        wrapInThemedTestApp(
          <ApiProvider apis={apis}>
            <AuditView />
          </ApiProvider>,
        ),
      );

      await rendered.findByTestId('audit-sidebar');

      const audit = websiteResponse.audits.find(a => a.id === id) as Audit;
      const auditElement = rendered.getByText(formatTime(audit.timeCreated));
      expect(auditElement.parentElement?.parentElement?.className).toContain(
        'selected',
      );

      const notSelectedAudit = websiteResponse.audits.find(
        a => a.id !== id,
      ) as Audit;
      const notSelectedAuditElement = rendered.getByText(
        formatTime(notSelectedAudit.timeCreated),
      );
      expect(
        notSelectedAuditElement.parentElement?.parentElement?.className,
      ).not.toContain('selected');
    });

    it('navigates to the next report when an audit is clicked', async () => {
      const rendered = render(
        wrapInThemedTestApp(
          <ApiProvider apis={apis}>
            <AuditView />
          </ApiProvider>,
        ),
      );

      await rendered.findByTestId('audit-sidebar');

      websiteResponse.audits.forEach(a => {
        expect(
          rendered.getByText(formatTime(a.timeCreated)).parentElement
            ?.parentElement,
        ).toHaveAttribute('href', `/lighthouse/audit/${a.id}`);
      });
    });
  });

  describe('when the request for the website by id is pending', () => {
    it('it shows the loading', async () => {
      mockFetch.mockImplementationOnce(() => new Promise(() => {}));
      const rendered = render(
        wrapInThemedTestApp(
          <ApiProvider apis={apis}>
            <AuditView />
          </ApiProvider>,
        ),
      );
      expect(await rendered.findByTestId('progress')).toBeInTheDocument();
    });
  });

  describe('when the request for the website by id fails', () => {
    it('it shows an error', async () => {
      mockFetch.mockRejectOnce(new Error('failed to fetch'));
      const rendered = render(
        wrapInThemedTestApp(
          <ApiProvider apis={apis}>
            <AuditView />
          </ApiProvider>,
        ),
      );
      expect(await rendered.findByText('failed to fetch')).toBeInTheDocument();
    });
  });

  describe.skip('when a loading audit is accessed', () => {
    it('shows a loading view', async () => {
      id = websiteResponse.audits.find(a => a.status === 'RUNNING')
        ?.id as string;
      useParams.mockReturnValueOnce({ id });

      const rendered = render(
        wrapInThemedTestApp(
          <ApiProvider apis={apis}>
            <AuditView />
          </ApiProvider>,
        ),
      );

      await rendered.findByTestId('audit-sidebar');

      expect(rendered.queryByTestId('progress')).toBeInTheDocument();
    });
  });

  describe.skip('when a failed audit is accessed', () => {
    it('shows an error message', async () => {
      id = websiteResponse.audits.find(a => a.status === 'FAILED')
        ?.id as string;
      useParams.mockReturnValueOnce({ id });

      const rendered = render(
        wrapInThemedTestApp(
          <ApiProvider apis={apis}>
            <AuditView />
          </ApiProvider>,
        ),
      );

      await rendered.findByTestId('audit-sidebar');

      expect(rendered.queryByText(/This audit failed/)).toBeInTheDocument();
    });
  });
});
