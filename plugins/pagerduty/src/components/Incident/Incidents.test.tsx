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
import { render, screen, waitFor } from '@testing-library/react';
import { Incidents } from './Incidents';
import { TestApiRegistry, wrapInTestApp } from '@backstage/test-utils';
import { pagerDutyApiRef } from '../../api';
import { PagerDutyIncident } from '../types';
import { ApiProvider } from '@backstage/core-app-api';

const mockPagerDutyApi = {
  getIncidentsByServiceId: jest.fn(),
};
const apis = TestApiRegistry.from([pagerDutyApiRef, mockPagerDutyApi]);

describe('Incidents', () => {
  it('Renders an empty state when there are no incidents', async () => {
    mockPagerDutyApi.getIncidentsByServiceId = jest
      .fn()
      .mockImplementationOnce(async () => ({ incidents: [] }));

    render(
      wrapInTestApp(
        <ApiProvider apis={apis}>
          <Incidents serviceId="abc" refreshIncidents={false} />
        </ApiProvider>,
      ),
    );
    await waitFor(() => !screen.queryByTestId('progress'));
    expect(screen.getByText('Nice! No incidents found!')).toBeInTheDocument();
  });

  it('Renders all incidents', async () => {
    mockPagerDutyApi.getIncidentsByServiceId = jest
      .fn()
      .mockImplementationOnce(async () => ({
        incidents: [
          {
            id: 'id1',
            status: 'triggered',
            title: 'title1',
            created_at: '2020-11-06T00:00:00Z',
            assignments: [
              {
                assignee: {
                  id: 'p1',
                  summary: 'person1',
                  html_url: 'http://a.com/id1',
                },
              },
            ],
            html_url: 'http://a.com/id1',
            serviceId: 'sId1',
          },
          {
            id: 'id2',
            status: 'acknowledged',
            title: 'title2',
            created_at: '2020-11-07T00:00:00Z',
            assignments: [
              {
                assignee: {
                  id: 'p2',
                  summary: 'person2',

                  html_url: 'http://a.com/id2',
                },
              },
            ],
            html_url: 'http://a.com/id2',
            serviceId: 'sId2',
          },
        ] as PagerDutyIncident[],
      }));
    render(
      wrapInTestApp(
        <ApiProvider apis={apis}>
          <Incidents serviceId="abc" refreshIncidents={false} />
        </ApiProvider>,
      ),
    );
    await waitFor(() => !screen.queryByTestId('progress'));
    expect(screen.getByText('title1')).toBeInTheDocument();
    expect(screen.getByText('title2')).toBeInTheDocument();
    expect(screen.getByText('person1')).toBeInTheDocument();
    expect(screen.getByText('person2')).toBeInTheDocument();
    expect(screen.getByText('triggered')).toBeInTheDocument();
    expect(screen.getByText('acknowledged')).toBeInTheDocument();
    expect(screen.getByTestId('chip-triggered')).toBeInTheDocument();
    expect(screen.getByTestId('chip-acknowledged')).toBeInTheDocument();

    // assert links, mailto and hrefs, date calculation
    expect(screen.getAllByTitle('View in PagerDuty').length).toEqual(2);
  });

  it('Handle errors', async () => {
    mockPagerDutyApi.getIncidentsByServiceId = jest
      .fn()
      .mockRejectedValueOnce(new Error('Error occurred'));

    render(
      wrapInTestApp(
        <ApiProvider apis={apis}>
          <Incidents serviceId="abc" refreshIncidents={false} />
        </ApiProvider>,
      ),
    );
    await waitFor(() => !screen.queryByTestId('progress'));
    expect(
      screen.getByText(
        'Error encountered while fetching information. Error occurred',
      ),
    ).toBeInTheDocument();
  });
});
