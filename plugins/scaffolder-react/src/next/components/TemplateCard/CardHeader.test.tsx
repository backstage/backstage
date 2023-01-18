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
import { fireEvent, render } from '@testing-library/react';
import { CardHeader } from './CardHeader';
import { ThemeProvider } from '@material-ui/core';
import { lightTheme } from '@backstage/theme';
import {
  MockStorageApi,
  renderInTestApp,
  TestApiProvider,
} from '@backstage/test-utils';
import { starredEntitiesApiRef } from '@backstage/plugin-catalog-react';
import { DefaultStarredEntitiesApi } from '@backstage/plugin-catalog';
import Observable from 'zen-observable';
import { stringifyEntityRef } from '@backstage/catalog-model';
import { TemplateEntityV1beta3 } from '@backstage/plugin-scaffolder-common';

describe('CardHeader', () => {
  it('should select the correct theme from the theme provider from the header', () => {
    // Can't really test what we want here.
    // But we can check that we call the getPage theme with the right type of template at least.
    const mockTheme = {
      ...lightTheme,
      getPageTheme: jest.fn(lightTheme.getPageTheme),
    };

    render(
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
              storageApi: MockStorageApi.create(),
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
    );

    const favorite = getByRole('button', { name: 'favorite' });

    await fireEvent.click(favorite);

    expect(starredEntitiesApi.toggleStarred).toHaveBeenCalledWith(
      stringifyEntityRef(mockTemplate),
    );
  });

  it('should render the name of the entity', async () => {
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
              storageApi: MockStorageApi.create(),
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
    );

    expect(getByText('Iamtitle')).toBeInTheDocument();
  });
});
