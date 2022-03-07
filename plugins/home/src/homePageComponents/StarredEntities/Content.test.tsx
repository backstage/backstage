/*
 * Copyright 2022 The Backstage Authors
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
import { renderInTestApp, TestApiProvider } from '@backstage/test-utils';
import {
  starredEntitiesApiRef,
  MockStarredEntitiesApi,
  entityRouteRef,
} from '@backstage/plugin-catalog-react';
import React from 'react';
import { Content } from './Content';

describe('StarredEntitiesContent', () => {
  it('should render list of tools', async () => {
    const mockedApi = new MockStarredEntitiesApi();
    mockedApi.toggleStarred('component:default/mock-starred-entity');
    mockedApi.toggleStarred('component:default/mock-starred-entity-2');

    const { getByText } = await renderInTestApp(
      <TestApiProvider apis={[[starredEntitiesApiRef, mockedApi]]}>
        <Content />
      </TestApiProvider>,
      {
        mountedRoutes: {
          '/catalog/:namespace/:kind/:name': entityRouteRef,
        },
      },
    );

    expect(getByText('mock-starred-entity')).toBeInTheDocument();
    expect(getByText('mock-starred-entity-2')).toBeInTheDocument();
    expect(getByText('mock-starred-entity').closest('a')).toHaveAttribute(
      'href',
      '/catalog/default/component/mock-starred-entity',
    );
    expect(getByText('mock-starred-entity-2').closest('a')).toHaveAttribute(
      'href',
      '/catalog/default/component/mock-starred-entity-2',
    );
  });
});
