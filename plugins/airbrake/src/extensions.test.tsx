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
import { EntityAirbrakeContent } from './extensions';
import { Route } from 'react-router';
import { renderInTestApp, TestApiProvider } from '@backstage/test-utils';
import { airbrakeApiRef, MockAirbrakeApi } from './api';
import { createEntity } from './api';
import { EntityProvider } from '@backstage/plugin-catalog-react';

describe('The Airbrake entity', () => {
  it('should render the content properly', async () => {
    const rendered = await renderInTestApp(
      <TestApiProvider apis={[[airbrakeApiRef, new MockAirbrakeApi()]]}>
        <EntityProvider entity={createEntity(123)}>
          <Route path="/" element={<EntityAirbrakeContent />} />
        </EntityProvider>
      </TestApiProvider>,
    );
    await expect(
      rendered.findByText('ChunkLoadError'),
    ).resolves.toBeInTheDocument();
  });
});
