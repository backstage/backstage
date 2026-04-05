/*
 * Copyright 2024 The Backstage Authors
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

import { screen } from '@testing-library/react';
import { renderInTestApp, TestApiProvider } from '@backstage/test-utils';
import { operationalZoneApiRef } from '../../api';
import { Content } from './OperationalZonesCard';

describe('OperationalZonesCard Content', () => {
  it('renders all zones with their badges', async () => {
    const mockApi = {
      getZones: jest.fn().mockResolvedValue({
        zones: [
          {
            id: 'deploy-gate',
            level: 'red',
            label: 'Operations blocked',
          },
          {
            id: 'batch-jobs',
            level: 'green',
            label: 'No active restrictions',
          },
        ],
      }),
      getZone: jest.fn(),
      createZone: jest.fn(),
    };

    await renderInTestApp(
      <TestApiProvider apis={[[operationalZoneApiRef, mockApi]]}>
        <Content />
      </TestApiProvider>,
    );

    expect(await screen.findByText('deploy-gate')).toBeInTheDocument();
    expect(screen.getByText('Operations blocked')).toBeInTheDocument();
    expect(screen.getByText('RED')).toBeInTheDocument();
    expect(screen.getByText('batch-jobs')).toBeInTheDocument();
    expect(screen.getByText('GREEN')).toBeInTheDocument();
  });

  it('renders empty state when no zones exist', async () => {
    const mockApi = {
      getZones: jest.fn().mockResolvedValue({ zones: [] }),
      getZone: jest.fn(),
      createZone: jest.fn(),
    };

    await renderInTestApp(
      <TestApiProvider apis={[[operationalZoneApiRef, mockApi]]}>
        <Content />
      </TestApiProvider>,
    );

    expect(
      await screen.findByText('No operational zones configured'),
    ).toBeInTheDocument();
  });
});
