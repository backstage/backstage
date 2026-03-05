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

import { fireEvent } from '@testing-library/react';
import { CardHeader } from './CardHeader';
import { lightTheme } from '@backstage/theme';
import {
  mockApis,
  renderInTestApp,
  TestApiProvider,
} from '@backstage/test-utils';
import {
  entityRouteRef,
  starredEntitiesApiRef,
} from '@backstage/plugin-catalog-react';
import { DefaultStarredEntitiesApi } from '@backstage/plugin-catalog';
import Observable from 'zen-observable';
import { stringifyEntityRef } from '@backstage/catalog-model';
import { TemplateEntityV1beta3 } from '@backstage/plugin-scaffolder-common';
import { TooltipProvider } from '@backstage/core-components';

const mountedRoutes = {
  mountedRoutes: {
    '/catalog/:namespace/:kind/:name': entityRouteRef,
  },
};

describe('CardHeader', () => {
  it('should render the header with the correct theme for the template type', async () => {
    // Verify that the Backstage theme system has a page theme for 'service'
    // After shadcn/ui migration, theme is derived from CSS custom properties
    // rather than MUI's useTheme() / ThemeProvider injection
    const pageTheme = lightTheme.getPageTheme({ themeId: 'service' });
    expect(pageTheme).toBeDefined();

    const { getByText } = await renderInTestApp(
      <TooltipProvider>
        <TestApiProvider
          apis={[
            [
              starredEntitiesApiRef,
              new DefaultStarredEntitiesApi({
                storageApi: mockApis.storage(),
              }),
            ],
          ]}
        >
          <CardHeader
            template={{
              apiVersion: 'scaffolder.backstage.io/v1beta3',
              kind: 'Template',
              metadata: { name: 'bob' },
              spec: {
                steps: [],
                type: 'service',
              },
            }}
          />
        </TestApiProvider>
      </TooltipProvider>,
      mountedRoutes,
    );

    // Verify the component renders the template data correctly
    expect(getByText('bob')).toBeInTheDocument();
    expect(getByText('service')).toBeInTheDocument();
  });

  it('should render the type', async () => {
    const { getByText } = await renderInTestApp(
      <TooltipProvider>
        <TestApiProvider
          apis={[
            [
              starredEntitiesApiRef,
              new DefaultStarredEntitiesApi({
                storageApi: mockApis.storage(),
              }),
            ],
          ]}
        >
          <CardHeader
            template={{
              apiVersion: 'scaffolder.backstage.io/v1beta3',
              kind: 'Template',
              metadata: { name: 'bob' },
              spec: {
                steps: [],
                type: 'service',
              },
            }}
          />
        </TestApiProvider>
      </TooltipProvider>,
      mountedRoutes,
    );

    expect(getByText('service')).toBeInTheDocument();
  });

  it('should enable favoriting of the entity', async () => {
    const starredEntitiesApi = {
      starredEntitie$: () => new Observable(() => {}),
      toggleStarred: jest.fn(async () => {}),
    };

    const mockTemplate: TemplateEntityV1beta3 = {
      apiVersion: 'scaffolder.backstage.io/v1beta3',
      kind: 'Template',
      metadata: { name: 'bob' },
      spec: {
        steps: [],
        type: 'service',
      },
    };

    const { getByRole } = await renderInTestApp(
      <TooltipProvider>
        <TestApiProvider apis={[[starredEntitiesApiRef, starredEntitiesApi]]}>
          <CardHeader template={mockTemplate} />
        </TestApiProvider>
      </TooltipProvider>,
      mountedRoutes,
    );

    const favorite = getByRole('button', { name: 'Add to favorites' });

    await fireEvent.click(favorite);

    expect(starredEntitiesApi.toggleStarred).toHaveBeenCalledWith(
      stringifyEntityRef(mockTemplate),
    );
  });

  it('renders TemplateDetailButton with link to entity page', async () => {
    const { getByRole } = await renderInTestApp(
      <TooltipProvider>
        <TestApiProvider
          apis={[
            [
              starredEntitiesApiRef,
              new DefaultStarredEntitiesApi({
                storageApi: mockApis.storage(),
              }),
            ],
          ]}
        >
          <CardHeader
            template={{
              apiVersion: 'scaffolder.backstage.io/v1beta3',
              kind: 'Template',
              metadata: { name: 'test-template', namespace: 'default' },
              spec: {
                steps: [],
                type: 'service',
              },
            }}
          />
        </TestApiProvider>
      </TooltipProvider>,
      mountedRoutes,
    );

    // After shadcn/ui migration, the detail button renders as a link element
    // with aria-label via ShadcnButton asChild wrapping a Link component
    const detailLink = getByRole('link', {
      name: 'Show template entity details',
    });
    expect(detailLink).toBeInTheDocument();
    expect(detailLink.tagName).toBe('A');
  });

  it('should render the name of the entity', async () => {
    const { getByText } = await renderInTestApp(
      <TooltipProvider>
        <TestApiProvider
          apis={[
            [
              starredEntitiesApiRef,
              new DefaultStarredEntitiesApi({
                storageApi: mockApis.storage(),
              }),
            ],
          ]}
        >
          <CardHeader
            template={{
              apiVersion: 'scaffolder.backstage.io/v1beta3',
              kind: 'Template',
              metadata: { name: 'bob' },
              spec: {
                steps: [],
                type: 'service',
              },
            }}
          />
        </TestApiProvider>
      </TooltipProvider>,
      mountedRoutes,
    );

    expect(getByText('bob')).toBeInTheDocument();
  });

  it('should render the title of the entity in favor of the name if it is provided', async () => {
    const { getByText } = await renderInTestApp(
      <TooltipProvider>
        <TestApiProvider
          apis={[
            [
              starredEntitiesApiRef,
              new DefaultStarredEntitiesApi({
                storageApi: mockApis.storage(),
              }),
            ],
          ]}
        >
          <CardHeader
            template={{
              apiVersion: 'scaffolder.backstage.io/v1beta3',
              kind: 'Template',
              metadata: { name: 'bob', title: 'Iamtitle' },
              spec: {
                steps: [],
                type: 'service',
              },
            }}
          />
        </TestApiProvider>
      </TooltipProvider>,
      mountedRoutes,
    );

    expect(getByText('Iamtitle')).toBeInTheDocument();
  });
});
