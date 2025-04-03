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

import React from 'react';
import { fireEvent } from '@testing-library/react';
import { CardHeader } from './CardHeader';
import { ThemeProvider } from '@material-ui/core/styles';
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

const mountedRoutes = {
  mountedRoutes: {
    '/catalog/:namespace/:kind/:name': entityRouteRef,
  },
};

describe('CardHeader', () => {
  it('should select the correct theme from the theme provider from the header', async () => {
    // Can't really test what we want here.
    // But we can check that we call the getPage theme with the right type of template at least.
    const mockTheme = {
      ...lightTheme,
      getPageTheme: jest.fn(lightTheme.getPageTheme),
    };

    await renderInTestApp(
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
        <ThemeProvider theme={mockTheme}>
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
        </ThemeProvider>
      </TestApiProvider>,
      mountedRoutes,
    );

    expect(mockTheme.getPageTheme).toHaveBeenCalledWith({ themeId: 'service' });
  });

  it('should render the type', async () => {
    const { getByText } = await renderInTestApp(
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
      </TestApiProvider>,
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
      <TestApiProvider apis={[[starredEntitiesApiRef, starredEntitiesApi]]}>
        <CardHeader template={mockTemplate} />
      </TestApiProvider>,
      mountedRoutes,
    );

    const favorite = getByRole('button', { name: 'Add to favorites' });

    await fireEvent.click(favorite);

    expect(starredEntitiesApi.toggleStarred).toHaveBeenCalledWith(
      stringifyEntityRef(mockTemplate),
    );
  });

  it('renders TemplateDetailButton with link to entity page', async () => {
    const { getByTitle } = await renderInTestApp(
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
      </TestApiProvider>,
      mountedRoutes,
    );

    const detailButton = getByTitle('Show template entity details');
    const link = detailButton.querySelector('a');
    expect(link).toBeInTheDocument();
  });

  it('should render the name of the entity', async () => {
    const { getByText } = await renderInTestApp(
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
      </TestApiProvider>,
      mountedRoutes,
    );

    expect(getByText('bob')).toBeInTheDocument();
  });

  it('should render the title of the entity in favor of the name if it is provided', async () => {
    const { getByText } = await renderInTestApp(
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
      </TestApiProvider>,
      mountedRoutes,
    );

    expect(getByText('Iamtitle')).toBeInTheDocument();
  });
});
