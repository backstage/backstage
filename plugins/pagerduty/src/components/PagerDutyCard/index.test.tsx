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
import { render, waitFor, fireEvent, act } from '@testing-library/react';
import { PagerDutyCard } from '../PagerDutyCard';
import { NotFoundError } from '@backstage/errors';
import { TestApiRegistry, wrapInTestApp } from '@backstage/test-utils';
import { pagerDutyApiRef, UnauthorizedError, PagerDutyClient } from '../../api';
import { PagerDutyService, PagerDutyUser } from '../types';

import { alertApiRef } from '@backstage/core-plugin-api';
import { ApiProvider } from '@backstage/core-app-api';

const user: PagerDutyUser = {
  name: 'person1',
  id: 'p1',
  summary: 'person1',
  email: 'person1@example.com',
  html_url: 'http://a.com/id1',
};

const service: PagerDutyService = {
  id: 'def456',
  name: 'pagerduty-name',
  html_url: 'www.example.com',
  escalation_policy: {
    id: 'def',
    user: user,
    html_url: 'http://a.com/id1',
  },
  integrationKey: 'abc123',
};

const mockPagerDutyApi: Partial<PagerDutyClient> = {
  getServiceByEntity: async () => ({ service }),
  getOnCallByPolicyId: async () => ({ oncalls: [] }),
  getIncidentsByServiceId: async () => ({ incidents: [] }),
};

const apis = TestApiRegistry.from(
  [pagerDutyApiRef, mockPagerDutyApi],
  [alertApiRef, {}],
);

describe('PagerDutyCard', () => {
  it('Render pagerduty', async () => {
    mockPagerDutyApi.getServiceByPagerDutyEntity = jest
      .fn()
      .mockImplementationOnce(async () => ({ service }));

    const { getByText, queryByTestId } = render(
      wrapInTestApp(
        <ApiProvider apis={apis}>
          <PagerDutyCard name="blah" integrationKey="abc123" />
        </ApiProvider>,
      ),
    );
    await waitFor(() => !queryByTestId('progress'));
    expect(getByText('Service Directory')).toBeInTheDocument();
    expect(getByText('Create Incident')).toBeInTheDocument();
    expect(getByText('Nice! No incidents found!')).toBeInTheDocument();
    expect(getByText('Empty escalation policy')).toBeInTheDocument();
  });

  it('Handles custom error for missing token', async () => {
    mockPagerDutyApi.getServiceByPagerDutyEntity = jest
      .fn()
      .mockRejectedValueOnce(new UnauthorizedError());

    const { getByText, queryByTestId } = render(
      wrapInTestApp(
        <ApiProvider apis={apis}>
          <PagerDutyCard name="blah" integrationKey="abc123" />
        </ApiProvider>,
      ),
    );
    await waitFor(() => !queryByTestId('progress'));
    expect(getByText('Missing or invalid PagerDuty Token')).toBeInTheDocument();
  });

  it('Handles custom NotFoundError', async () => {
    mockPagerDutyApi.getServiceByPagerDutyEntity = jest
      .fn()
      .mockRejectedValueOnce(new NotFoundError());

    const { getByText, queryByTestId } = render(
      wrapInTestApp(
        <ApiProvider apis={apis}>
          <PagerDutyCard name="blah" integrationKey="abc123" />
        </ApiProvider>,
      ),
    );
    await waitFor(() => !queryByTestId('progress'));
    expect(getByText('PagerDuty Service Not Found')).toBeInTheDocument();
  });

  it('handles general error', async () => {
    mockPagerDutyApi.getServiceByPagerDutyEntity = jest
      .fn()
      .mockRejectedValueOnce(new Error('An error occurred'));
    const { getByText, queryByTestId } = render(
      wrapInTestApp(
        <ApiProvider apis={apis}>
          <PagerDutyCard name="blah" integrationKey="abc123" />
        </ApiProvider>,
      ),
    );
    await waitFor(() => !queryByTestId('progress'));

    expect(
      getByText(
        'Error encountered while fetching information. An error occurred',
      ),
    ).toBeInTheDocument();
  });

  it('opens the dialog when trigger button is clicked', async () => {
    mockPagerDutyApi.getServiceByPagerDutyEntity = jest
      .fn()
      .mockImplementationOnce(async () => ({ service }));

    const { getByText, queryByTestId, getByRole } = render(
      wrapInTestApp(
        <ApiProvider apis={apis}>
          <PagerDutyCard name="blah" integrationKey="abc123" />
        </ApiProvider>,
      ),
    );
    await waitFor(() => !queryByTestId('progress'));
    expect(getByText('Service Directory')).toBeInTheDocument();

    const triggerLink = getByText('Create Incident');
    await act(async () => {
      fireEvent.click(triggerLink);
    });
    expect(getByRole('dialog')).toBeInTheDocument();
  });

  describe('when entity has the pagerduty.com/service-id annotation', () => {
    it('Renders PagerDuty service information', async () => {
      mockPagerDutyApi.getServiceByPagerDutyEntity = jest
        .fn()
        .mockImplementationOnce(async () => ({ service }));

      const { getByText, queryByTestId } = render(
        wrapInTestApp(
          <ApiProvider apis={apis}>
            <PagerDutyCard name="blah" integrationKey="abc123" />
          </ApiProvider>,
        ),
      );
      await waitFor(() => !queryByTestId('progress'));
      expect(getByText('Service Directory')).toBeInTheDocument();
      expect(getByText('Create Incident')).toBeInTheDocument();
      expect(getByText('Nice! No incidents found!')).toBeInTheDocument();
      expect(getByText('Empty escalation policy')).toBeInTheDocument();
    });

    it('Handles custom error for missing token', async () => {
      mockPagerDutyApi.getServiceByPagerDutyEntity = jest
        .fn()
        .mockRejectedValueOnce(new UnauthorizedError());

      const { getByText, queryByTestId } = render(
        wrapInTestApp(
          <ApiProvider apis={apis}>
            <PagerDutyCard
              name="blah"
              integrationKey="abc123"
              serviceId="def123"
            />
          </ApiProvider>,
        ),
      );
      await waitFor(() => !queryByTestId('progress'));
      expect(
        getByText('Missing or invalid PagerDuty Token'),
      ).toBeInTheDocument();
    });

    it('Handles custom NotFoundError', async () => {
      mockPagerDutyApi.getServiceByPagerDutyEntity = jest
        .fn()
        .mockRejectedValueOnce(new NotFoundError());

      const { getByText, queryByTestId } = render(
        wrapInTestApp(
          <ApiProvider apis={apis}>
            <PagerDutyCard
              name="blah"
              integrationKey="abc123"
              serviceId="def123"
            />
          </ApiProvider>,
        ),
      );
      await waitFor(() => !queryByTestId('progress'));
      expect(getByText('PagerDuty Service Not Found')).toBeInTheDocument();
    });

    it('handles general error', async () => {
      mockPagerDutyApi.getServiceByPagerDutyEntity = jest
        .fn()
        .mockRejectedValueOnce(new Error('An error occurred'));
      const { getByText, queryByTestId } = render(
        wrapInTestApp(
          <ApiProvider apis={apis}>
            <PagerDutyCard
              name="blah"
              integrationKey="abc123"
              serviceId="def123"
            />
          </ApiProvider>,
        ),
      );
      await waitFor(() => !queryByTestId('progress'));

      expect(
        getByText(
          'Error encountered while fetching information. An error occurred',
        ),
      ).toBeInTheDocument();
    });

    it('disables the Create Incident button', async () => {
      mockPagerDutyApi.getServiceByPagerDutyEntity = jest
        .fn()
        .mockImplementationOnce(async () => ({ service }));

      const { queryByTestId, getByTitle } = render(
        wrapInTestApp(
          <ApiProvider apis={apis}>
            <PagerDutyCard name="blah" serviceId="def123" />
          </ApiProvider>,
        ),
      );
      await waitFor(() => !queryByTestId('progress'));
      expect(
        getByTitle('Must provide an integration-key to create incidents')
          .className,
      ).toMatch('disabled');
    });
  });

  describe('when entity has all annotations', () => {
    it('queries by integration key', async () => {
      mockPagerDutyApi.getServiceByPagerDutyEntity = jest
        .fn()
        .mockImplementationOnce(async () => ({ service }));

      const { getByText, queryByTestId } = render(
        wrapInTestApp(
          <ApiProvider apis={apis}>
            <PagerDutyCard
              name="blah"
              integrationKey="abc123"
              serviceId="def123"
            />
          </ApiProvider>,
        ),
      );
      await waitFor(() => !queryByTestId('progress'));
      expect(getByText('Service Directory')).toBeInTheDocument();
      expect(getByText('Create Incident')).toBeInTheDocument();
      expect(getByText('Nice! No incidents found!')).toBeInTheDocument();
      expect(getByText('Empty escalation policy')).toBeInTheDocument();
    });
  });

  describe('when entity has all annotations but the plugin has been configured to be "read only"', () => {
    it('queries by integration key but does not render the "Create Incident" button', async () => {
      mockPagerDutyApi.getServiceByPagerDutyEntity = jest
        .fn()
        .mockImplementationOnce(async () => ({ service }));

      const { getByText, queryByTestId } = render(
        wrapInTestApp(
          <ApiProvider apis={apis}>
            <PagerDutyCard
              name="blah"
              integrationKey="abc123"
              serviceId="def123"
              readOnly
            />
          </ApiProvider>,
        ),
      );
      await waitFor(() => !queryByTestId('progress'));
      expect(getByText('Service Directory')).toBeInTheDocument();
      expect(getByText('Nice! No incidents found!')).toBeInTheDocument();
      expect(getByText('Empty escalation policy')).toBeInTheDocument();
      expect(() => getByText('Create Incident')).toThrow();
    });
  });
});
