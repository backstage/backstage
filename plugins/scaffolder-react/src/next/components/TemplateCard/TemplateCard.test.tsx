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
import { TemplateEntityV1beta3 } from '@backstage/plugin-scaffolder-common';
import { RELATION_OWNED_BY } from '@backstage/catalog-model';
import { fireEvent } from '@testing-library/react';

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

    const { getByText, getByTestId } = await renderInTestApp(
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
    );

    const description = getByText('hello');
    expect(description.querySelector('strong')).toBeInTheDocument();
    expect(getByTestId('template-card-separator')).toBeInTheDocument();
  });

  it('should render no description if none is provided through the template', async () => {
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
    );

    expect(getByText('No description')).toBeInTheDocument();
  });

  it('should not render extra separators when tags or links are not present', async () => {
    const mockTemplate: TemplateEntityV1beta3 = {
      apiVersion: 'scaffolder.backstage.io/v1beta3',
      kind: 'Template',
      metadata: { name: 'bob' },
      spec: {
        steps: [],
        type: 'service',
      },
    };

    const { queryByTestId } = await renderInTestApp(
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
    );

    expect(queryByTestId('template-card-separator')).toBeInTheDocument();
    expect(
      queryByTestId('template-card-separator--tags'),
    ).not.toBeInTheDocument();
    expect(
      queryByTestId('template-card-separator--links'),
    ).not.toBeInTheDocument();
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

    const { getByText, queryByTestId } = await renderInTestApp(
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
    );

    for (const tag of mockTemplate.metadata.tags!) {
      expect(getByText(tag)).toBeInTheDocument();
    }
    expect(queryByTestId('template-card-separator')).not.toBeInTheDocument();
    expect(queryByTestId('template-card-separator--tags')).toBeInTheDocument();
  });

  it('should not render links section when empty links are defined', async () => {
    const mockTemplate: TemplateEntityV1beta3 = {
      apiVersion: 'scaffolder.backstage.io/v1beta3',
      kind: 'Template',
      metadata: { name: 'bob', tags: [], links: [] },
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

    const { queryByTestId, queryByText } = await renderInTestApp(
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
          '/catalog/:kind/:namespace/:name': entityRouteRef,
        },
      },
    );

    expect(queryByTestId('template-card-separator')).toBeInTheDocument();
    expect(
      queryByTestId('template-card-separator--links'),
    ).not.toBeInTheDocument();
    expect(queryByText('0')).not.toBeInTheDocument();
  });

  it('should not render links section when empty additional links are defined', async () => {
    const mockTemplate: TemplateEntityV1beta3 = {
      apiVersion: 'scaffolder.backstage.io/v1beta3',
      kind: 'Template',
      metadata: { name: 'bob', tags: [], links: [] },
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

    const { queryByTestId, queryByText } = await renderInTestApp(
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
        <TemplateCard template={mockTemplate} additionalLinks={[]} />
      </TestApiProvider>,
      {
        mountedRoutes: {
          '/catalog/:kind/:namespace/:name': entityRouteRef,
        },
      },
    );

    expect(queryByTestId('template-card-separator')).toBeInTheDocument();
    expect(
      queryByTestId('template-card-separator--links'),
    ).not.toBeInTheDocument();
    expect(queryByText('0')).not.toBeInTheDocument();
  });

  it('should render links section when links are defined', async () => {
    const mockTemplate: TemplateEntityV1beta3 = {
      apiVersion: 'scaffolder.backstage.io/v1beta3',
      kind: 'Template',
      metadata: {
        name: 'bob',
        tags: [],
        links: [{ url: '/some/url', title: 'Learn More' }],
      },
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

    const { queryByTestId, getByRole } = await renderInTestApp(
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
        <TemplateCard template={mockTemplate} additionalLinks={[]} />
      </TestApiProvider>,
      {
        mountedRoutes: {
          '/catalog/:kind/:namespace/:name': entityRouteRef,
        },
      },
    );

    expect(queryByTestId('template-card-separator')).not.toBeInTheDocument();
    expect(queryByTestId('template-card-separator--links')).toBeInTheDocument();
    expect(getByRole('link', { name: 'Learn More' })).toBeInTheDocument();
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
          '/catalog/:kind/:namespace/:name': entityRouteRef,
        },
      },
    );

    expect(getByRole('link', { name: /.*my-test-user$/ })).toBeInTheDocument();
    expect(getByRole('link', { name: /.*my-test-user$/ })).toHaveAttribute(
      'href',
      '/catalog/group/default/my-test-user',
    );
  });

  it('should call the onSelected handler when clicking the choose button', async () => {
    const mockTemplate: TemplateEntityV1beta3 = {
      apiVersion: 'scaffolder.backstage.io/v1beta3',
      kind: 'Template',
      metadata: { name: 'bob', tags: ['cpp', 'react'] },
      spec: {
        steps: [],
        type: 'service',
      },
    };
    const mockOnSelected = jest.fn();

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
        <TemplateCard template={mockTemplate} onSelected={mockOnSelected} />
      </TestApiProvider>,
      {
        mountedRoutes: {
          '/catalog/:kind/:namespace/:name': entityRouteRef,
        },
      },
    );

    expect(getByRole('button', { name: 'Choose' })).toBeInTheDocument();

    fireEvent.click(getByRole('button', { name: 'Choose' }));

    expect(mockOnSelected).toHaveBeenCalledWith(mockTemplate);
  });
});
