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

jest.mock('@backstage/plugin-catalog-react', () => ({
  useEntityList: jest.fn(),
}));

jest.mock('@backstage/plugin-scaffolder-react/alpha', () => ({
  TemplateGroup: jest.fn(() => null),
}));

import React from 'react';
import { useEntityList } from '@backstage/plugin-catalog-react';
import { TemplateGroups } from './TemplateGroups';
import { renderInTestApp, TestApiProvider } from '@backstage/test-utils';
import { errorApiRef } from '@backstage/core-plugin-api';
import { TemplateGroup } from '@backstage/plugin-scaffolder-react/alpha';
import { nextRouteRef } from '../routes';

describe('TemplateGroups', () => {
  beforeEach(() => jest.clearAllMocks());

  it('should return progress if the hook is loading', async () => {
    (useEntityList as jest.Mock).mockReturnValue({ loading: true });

    const { findByTestId } = await renderInTestApp(
      <TestApiProvider apis={[[errorApiRef, {}]]}>
        <TemplateGroups groups={[]} />
      </TestApiProvider>,
      {
        mountedRoutes: {
          '/next': nextRouteRef,
        },
      },
    );

    expect(await findByTestId('progress')).toBeInTheDocument();
  });

  it('should use the error api if there is an error with the retrieval of entitylist', async () => {
    const mockError = new Error('tings went poop');
    (useEntityList as jest.Mock).mockReturnValue({
      error: mockError,
    });
    const errorApi = {
      post: jest.fn(),
    };
    await renderInTestApp(
      <TestApiProvider apis={[[errorApiRef, errorApi]]}>
        <TemplateGroups groups={[]} />
      </TestApiProvider>,
      {
        mountedRoutes: {
          '/next': nextRouteRef,
        },
      },
    );

    expect(errorApi.post).toHaveBeenCalledWith(mockError);
  });

  it('should return a no templates message if entities is unset', async () => {
    (useEntityList as jest.Mock).mockReturnValue({
      entities: null,
      loading: false,
      error: null,
    });

    const { findByText } = await renderInTestApp(
      <TestApiProvider apis={[[errorApiRef, {}]]}>
        <TemplateGroups groups={[]} />
      </TestApiProvider>,
      {
        mountedRoutes: {
          '/next': nextRouteRef,
        },
      },
    );

    expect(await findByText(/No templates found/)).toBeInTheDocument();
  });

  it('should return a no templates message if entities has no values in it', async () => {
    (useEntityList as jest.Mock).mockReturnValue({
      entities: [],
      loading: false,
      error: null,
    });

    const { findByText } = await renderInTestApp(
      <TestApiProvider apis={[[errorApiRef, {}]]}>
        <TemplateGroups groups={[]} />
      </TestApiProvider>,
      {
        mountedRoutes: {
          '/next': nextRouteRef,
        },
      },
    );

    expect(await findByText(/No templates found/)).toBeInTheDocument();
  });

  it('should call the template group with the components', async () => {
    const mockEntities = [
      {
        apiVersion: 'scaffolder.backstage.io/v1beta3',
        kind: 'Template',
        metadata: {
          name: 't1',
        },
        spec: {},
      },
      {
        apiVersion: 'scaffolder.backstage.io/v1beta3',
        kind: 'Template',
        metadata: {
          name: 't2',
        },
        spec: {},
      },
    ];

    (useEntityList as jest.Mock).mockReturnValue({
      entities: mockEntities,
      loading: false,
      error: null,
    });

    await renderInTestApp(
      <TestApiProvider apis={[[errorApiRef, {}]]}>
        <TemplateGroups groups={[{ title: 'all', filter: () => true }]} />
      </TestApiProvider>,
      {
        mountedRoutes: {
          '/next': nextRouteRef,
        },
      },
    );

    expect(TemplateGroup).toHaveBeenCalledWith(
      expect.objectContaining({
        templates: mockEntities.map(template =>
          expect.objectContaining({ template }),
        ),
      }),
      {},
    );
  });

  it('should apply the filter for each group', async () => {
    const mockEntities = [
      {
        apiVersion: 'scaffolder.backstage.io/v1beta3',
        kind: 'Template',
        metadata: {
          name: 't1',
        },
        spec: {},
      },
      {
        apiVersion: 'scaffolder.backstage.io/v1beta3',
        kind: 'Template',
        metadata: {
          name: 't2',
        },
        spec: {},
      },
    ];

    (useEntityList as jest.Mock).mockReturnValue({
      entities: mockEntities,
      loading: false,
      error: null,
    });

    await renderInTestApp(
      <TestApiProvider apis={[[errorApiRef, {}]]}>
        <TemplateGroups
          groups={[{ title: 'all', filter: e => e.metadata.name === 't1' }]}
        />
      </TestApiProvider>,
      {
        mountedRoutes: {
          '/next': nextRouteRef,
        },
      },
    );

    expect(TemplateGroup).toHaveBeenCalledWith(
      expect.objectContaining({
        templates: [expect.objectContaining({ template: mockEntities[0] })],
      }),
      {},
    );
  });
});
