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
import { EntityAirbrakeWidget } from './EntityAirbrakeWidget';
import exampleData from '../../api/mock/airbrake-groups-api-mock.json';
import { renderInTestApp, TestApiProvider } from '@backstage/test-utils';
import { createEntity } from '../../api/mock/mock-entity';
import {
  airbrakeApiRef,
  MockAirbrakeApi,
  ProductionAirbrakeApi,
} from '../../api';
import nock from 'nock';

describe('EntityAirbrakeContent', () => {
  it('renders all errors sent from Airbrake', async () => {
    const table = await renderInTestApp(
      <TestApiProvider apis={[[airbrakeApiRef, new MockAirbrakeApi()]]}>
        <EntityAirbrakeWidget entity={createEntity(123)} />
      </TestApiProvider>,
    );
    expect(exampleData.groups.length).toBeGreaterThan(0);
    for (const group of exampleData.groups) {
      expect(
        await table.getByText(group.errors[0].message),
      ).toBeInTheDocument();
    }
  });

  it('states that the annotation is missing if no project ID annotation is provided', async () => {
    const table = await renderInTestApp(
      <TestApiProvider apis={[[airbrakeApiRef, new MockAirbrakeApi()]]}>
        <EntityAirbrakeWidget entity={createEntity()} />
      </TestApiProvider>,
    );
    await expect(
      table.findByText('Missing Annotation'),
    ).resolves.toBeInTheDocument();
  });

  it('states that an error occurred if API call fails', async () => {
    const scope = nock('https://api.airbrake.io')
      .get('/api/v4/projects/123/groups?key=fakeApiKey')
      .reply(500);
    expect(scope.isDone()).toBe(false);

    const table = await renderInTestApp(
      <TestApiProvider
        apis={[[airbrakeApiRef, new ProductionAirbrakeApi('fakeApiKey')]]}
      >
        <EntityAirbrakeWidget entity={createEntity(123)} />
      </TestApiProvider>,
    );

    await expect(
      table.findByText('*there was an issue communicating with Airbrake*'),
    ).resolves.toBeInTheDocument();
    expect(scope.isDone()).toBe(true);
  });
});
