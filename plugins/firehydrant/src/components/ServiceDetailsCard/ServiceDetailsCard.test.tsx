/*
 * Copyright 2021 The Backstage Authors
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
import { ApiProvider, ApiRegistry } from '@backstage/core-app-api';
import { fireHydrantApiRef } from '../../api';
import { screen } from '@testing-library/react';
import { ServiceDetailsCard } from './ServiceDetailsCard';
import { Service, Incident } from '../types';
import { renderInTestApp } from '@backstage/test-utils';

const mockFireHydrantApi = {
  getServiceDetails: () => {},
  getServiceAnalytics: () => {},
};

const apis = ApiRegistry.from([[fireHydrantApiRef, mockFireHydrantApi]]);

jest.mock('@backstage/plugin-catalog-react', () => ({
  useEntity: () => {
    return { entity: { metadata: { name: 'service-example' } } };
  },
}));

describe('ServiceDetailsCard', () => {
  it('renders service incidents', async () => {
    mockFireHydrantApi.getServiceDetails = jest.fn().mockImplementationOnce(
      async () =>
        [
          {
            service: {
              id: '12345',
              name: 'service-example',
              description: 'This is a sample description',
              active_incidents: ['654321'],
            } as Service,
            incidents: [
              {
                id: '654321',
                active: true,
                description: 'test incident',
                name: 'incident name here',
                incident_url: 'http://example.com',
              } as Incident,
            ],
          },
        ][0],
    );

    mockFireHydrantApi.getServiceAnalytics = jest.fn().mockImplementationOnce(
      async () =>
        [
          {
            buckets: [
              {
                metrics: {
                  12345: {
                    count: 0,
                    mtta: null,
                    mttd: null,
                    mttm: null,
                    mttr: null,
                    total_time: null,
                  },
                },
              },
            ],
          },
        ][0],
    );

    await renderInTestApp(
      <ApiProvider apis={apis}>
        <ServiceDetailsCard />
      </ApiProvider>,
    );

    expect(
      await screen.findByText(/View service incidents/),
    ).toBeInTheDocument();
    expect(
      await screen.findByText(/There is 1 active incident/),
    ).toBeInTheDocument();
    expect(await screen.findByText(/incident name here/)).toBeInTheDocument();
  });

  it('handles empty response', async () => {
    mockFireHydrantApi.getServiceDetails = jest
      .fn()
      .mockImplementationOnce(async () => []);

    mockFireHydrantApi.getServiceAnalytics = jest
      .fn()
      .mockImplementationOnce(async () => []);

    await renderInTestApp(
      <ApiProvider apis={apis}>
        <ServiceDetailsCard />
      </ApiProvider>,
    );

    expect(
      await screen.findByText(/This service does not exist in FireHydrant/),
    ).toBeInTheDocument();
  });
});
