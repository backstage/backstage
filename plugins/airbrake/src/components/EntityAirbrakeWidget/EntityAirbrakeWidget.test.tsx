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
import exampleData from '../../api/mock/airbrakeGroupsApiMock.json';
import {
  renderInTestApp,
  setupRequestMockHandlers,
  TestApiProvider,
} from '@backstage/test-utils';
import {
  airbrakeApiRef,
  createEntity,
  localDiscoveryApi,
  MockAirbrakeApi,
  ProductionAirbrakeApi,
} from '../../api';
import { rest } from 'msw';
import { setupServer } from 'msw/node';

describe('EntityAirbrakeWidget', () => {
  const worker = setupServer();
  setupRequestMockHandlers(worker);

  it('renders all errors sent from Airbrake', async () => {
    const widget = await renderInTestApp(
      <TestApiProvider apis={[[airbrakeApiRef, new MockAirbrakeApi()]]}>
        <EntityAirbrakeWidget entity={createEntity(123)} />
      </TestApiProvider>,
    );
    expect(exampleData.groups.length).toBeGreaterThan(0);
    for (const group of exampleData.groups) {
      expect(
        await widget.findByText(group.errors[0].message),
      ).toBeInTheDocument();
    }
  });

  it('states that the annotation is missing if no project ID annotation is provided but does not error', async () => {
    const widget = await renderInTestApp(
      <TestApiProvider
        apis={[[airbrakeApiRef, new ProductionAirbrakeApi(localDiscoveryApi)]]}
      >
        <EntityAirbrakeWidget entity={createEntity()} />
      </TestApiProvider>,
    );
    await expect(
      widget.findByText('Missing Annotation'),
    ).resolves.toBeInTheDocument();
    expect(
      widget.queryByText(/.*Failed fetching Airbrake groups.*/),
    ).not.toBeInTheDocument();
  });

  it('states that an error occurred if the API call fails', async () => {
    worker.use(
      rest.get(
        'http://localhost:7007/api/airbrake/api/v4/projects/123/groups',
        (_, res, ctx) => {
          return res(ctx.status(500));
        },
      ),
    );

    const widget = await renderInTestApp(
      <TestApiProvider
        apis={[[airbrakeApiRef, new ProductionAirbrakeApi(localDiscoveryApi)]]}
      >
        <EntityAirbrakeWidget entity={createEntity(123)} />
      </TestApiProvider>,
    );

    await expect(
      widget.findByText(/.*there was an issue communicating with Airbrake.*/),
    ).resolves.toBeInTheDocument();
    expect(
      widget.getByRole('heading', {
        name: /.*Failed fetching Airbrake groups.*/,
      }),
    ).toBeInTheDocument();
  });
});
