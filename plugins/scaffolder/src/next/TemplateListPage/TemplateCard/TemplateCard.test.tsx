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
import { DefaultStarredEntitiesApi } from '@backstage/plugin-catalog';
import {
  entityRouteRef,
  starredEntitiesApiRef,
} from '@backstage/plugin-catalog-react';
import {
  MockStorageApi,
  renderInTestApp,
  TestApiProvider,
} from '@backstage/test-utils';
import { TemplateCard } from './TemplateCard';
import React from 'react';
import { rootRouteRef } from '../../../routes';
import { TemplateEntityV1beta3 } from '@backstage/plugin-scaffolder-common';
import { RELATION_OWNED_BY } from '@backstage/catalog-model';

describe('TemplateCard', () => {
  it('should render the card title', async () => {
    const mockTemplate: TemplateEntityV1beta3 = {
      apiVersion: 'scaffolder.backstage.io/v1beta3',
      kind: 'Template',
      metadata: { name: 'bob' },
      spec: {
        steps: [],
        type: 'service',
      },
    };

    const { getByText } = await renderInTestApp(
      <TestApiProvider
        apis={[
          [
            starredEntitiesApiRef,
            new DefaultStarredEntitiesApi({
              storageApi: MockStorageApi.create(),
            }),
          ],
        ]}
      >
        <TemplateCard template={mockTemplate} />
      </TestApiProvider>,
      { mountedRoutes: { '/': rootRouteRef } },
    );

    expect(getByText('bob')).toBeInTheDocument();
  });

  it('should render the description as markdown', async () => {
    const mockTemplate: TemplateEntityV1beta3 = {
      apiVersion: 'scaffolder.backstage.io/v1beta3',
      kind: 'Template',
      metadata: { name: 'bob', description: 'hello **test**' },
      spec: {
        steps: [],
        type: 'service',
      },
    };

    const { getByText } = await renderInTestApp(
      <TestApiProvider
        apis={[
          [
            starredEntitiesApiRef,
            new DefaultStarredEntitiesApi({
              storageApi: MockStorageApi.create(),
            }),
          ],
        ]}
      >
        <TemplateCard template={mockTemplate} />
      </TestApiProvider>,
      { mountedRoutes: { '/': rootRouteRef } },
    );

    const description = getByText('hello');
    expect(description.querySelector('strong')).toBeInTheDocument();
  });

  it('should render no descroption if none is provided through the template', async () => {
    const mockTemplate: TemplateEntityV1beta3 = {
      apiVersion: 'scaffolder.backstage.io/v1beta3',
      kind: 'Template',
      metadata: { name: 'bob' },
      spec: {
        steps: [],
        type: 'service',
      },
    };

    const { getByText } = await renderInTestApp(
      <TestApiProvider
        apis={[
          [
            starredEntitiesApiRef,
            new DefaultStarredEntitiesApi({
              storageApi: MockStorageApi.create(),
            }),
          ],
        ]}
      >
        <TemplateCard template={mockTemplate} />
      </TestApiProvider>,
      { mountedRoutes: { '/': rootRouteRef } },
    );

    expect(getByText('No description')).toBeInTheDocument();
  });

  it('should render the tags', async () => {
    const mockTemplate: TemplateEntityV1beta3 = {
      apiVersion: 'scaffolder.backstage.io/v1beta3',
      kind: 'Template',
      metadata: { name: 'bob', tags: ['cpp', 'react'] },
      spec: {
        steps: [],
        type: 'service',
      },
    };

    const { getByText } = await renderInTestApp(
      <TestApiProvider
        apis={[
          [
            starredEntitiesApiRef,
            new DefaultStarredEntitiesApi({
              storageApi: MockStorageApi.create(),
            }),
          ],
        ]}
      >
        <TemplateCard template={mockTemplate} />
      </TestApiProvider>,
      { mountedRoutes: { '/': rootRouteRef } },
    );

    for (const tag of mockTemplate.metadata.tags!) {
      expect(getByText(tag)).toBeInTheDocument();
    }
  });

  it('should render a link to the owner', async () => {
    const mockTemplate: TemplateEntityV1beta3 = {
      apiVersion: 'scaffolder.backstage.io/v1beta3',
      kind: 'Template',
      metadata: { name: 'bob', tags: ['cpp', 'react'] },
      spec: {
        steps: [],
        type: 'service',
      },
      relations: [
        {
          targetRef: 'group:default/my-test-user',
          type: RELATION_OWNED_BY,
        },
      ],
    };

    const { getByRole } = await renderInTestApp(
      <TestApiProvider
        apis={[
          [
            starredEntitiesApiRef,
            new DefaultStarredEntitiesApi({
              storageApi: MockStorageApi.create(),
            }),
          ],
        ]}
      >
        <TemplateCard template={mockTemplate} />
      </TestApiProvider>,
      {
        mountedRoutes: {
          '/': rootRouteRef,
          '/catalog/:kind/:namespace/:name': entityRouteRef,
        },
      },
    );

    expect(getByRole('link', { name: 'my-test-user' })).toBeInTheDocument();
    expect(getByRole('link', { name: 'my-test-user' })).toHaveAttribute(
      'href',
      '/catalog/group/default/my-test-user',
    );
  });

  it('should render the choose button to navigate to the selected template', async () => {
    const mockTemplate: TemplateEntityV1beta3 = {
      apiVersion: 'scaffolder.backstage.io/v1beta3',
      kind: 'Template',
      metadata: { name: 'bob', tags: ['cpp', 'react'] },
      spec: {
        steps: [],
        type: 'service',
      },
    };

    const { getByRole } = await renderInTestApp(
      <TestApiProvider
        apis={[
          [
            starredEntitiesApiRef,
            new DefaultStarredEntitiesApi({
              storageApi: MockStorageApi.create(),
            }),
          ],
        ]}
      >
        <TemplateCard template={mockTemplate} />
      </TestApiProvider>,
      {
        mountedRoutes: {
          '/': rootRouteRef,
          '/catalog/:kind/:namespace/:name': entityRouteRef,
        },
      },
    );

    expect(getByRole('button', { name: 'Choose' })).toBeInTheDocument();
    expect(getByRole('button', { name: 'Choose' })).toHaveAttribute(
      'href',
      '/templates/default/bob',
    );
  });
});
