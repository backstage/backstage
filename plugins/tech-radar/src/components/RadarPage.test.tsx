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

import {
  MockErrorApi,
  TestApiProvider,
  renderInTestApp,
} from '@backstage/test-utils';
import { act, screen, waitFor } from '@testing-library/react';
import React from 'react';
import GetBBoxPolyfill from '../utils/polyfills/getBBox';
import { RadarPage } from './RadarPage';
import { TechRadarLoaderResponse, techRadarApiRef, TechRadarApi } from '../api';

import { errorApiRef } from '@backstage/core-plugin-api';

describe('RadarPage', () => {
  beforeAll(() => {
    GetBBoxPolyfill.create(0, 0, 1000, 500);
  });

  afterAll(() => {
    GetBBoxPolyfill.remove();
  });
  class MockClient implements TechRadarApi {
    async load(): Promise<TechRadarLoaderResponse> {
      return {
        entries: [],
        quadrants: [],
        rings: [],
      };
    }
  }

  const mockClient = new MockClient();

  it('should render a progress bar', async () => {
    class SlowClient implements TechRadarApi {
      async load(): Promise<TechRadarLoaderResponse> {
        await new Promise<void>(resolve => setTimeout(resolve, 1000));
        return {
          entries: [],
          quadrants: [],
          rings: [],
        };
      }
    }

    const techRadarProps = {
      width: 1200,
      height: 800,
      svgProps: { 'data-testid': 'tech-radar-svg' },
    };

    await renderInTestApp(
      <TestApiProvider apis={[[techRadarApiRef, new SlowClient()]]}>
        <RadarPage {...techRadarProps} />
      </TestApiProvider>,
    );

    await act(async () => {
      await new Promise<void>(resolve => setTimeout(resolve, 300));
    });

    expect(screen.getByTestId('progress')).toBeInTheDocument();

    await screen.findByTestId('tech-radar-svg');
  });

  it('should render a header with a svg', async () => {
    const techRadarProps = {
      width: 1200,
      height: 800,
      svgProps: { 'data-testid': 'tech-radar-svg' },
    };
    jest.spyOn(mockClient, 'load');

    await renderInTestApp(
      <TestApiProvider apis={[[techRadarApiRef, mockClient]]}>
        <RadarPage {...techRadarProps} />
      </TestApiProvider>,
    );

    await expect(
      screen.findByTestId('tech-radar-svg'),
    ).resolves.toBeInTheDocument();
    expect(
      screen.getByText('Pick the recommended technologies for your projects'),
    ).toBeInTheDocument();
    expect(mockClient.load).toHaveBeenCalledWith(undefined);
  });

  it('should call load with id', async () => {
    const techRadarProps = {
      width: 1200,
      height: 800,
      svgProps: { 'data-testid': 'tech-radar-svg' },
      id: 'myId',
    };
    jest.spyOn(mockClient, 'load');

    await renderInTestApp(
      <TestApiProvider apis={[[techRadarApiRef, mockClient]]}>
        <RadarPage {...techRadarProps} />
      </TestApiProvider>,
    );

    await expect(
      screen.findByTestId('tech-radar-svg'),
    ).resolves.toBeInTheDocument();
    expect(mockClient.load).toHaveBeenCalledWith('myId');
  });

  it('should call the errorApi if load fails', async () => {
    const errorApi = new MockErrorApi({ collect: true });

    jest
      .spyOn(mockClient, 'load')
      .mockRejectedValue(new Error('404 Page Not Found'));

    const techRadarProps = {
      width: 1200,
      height: 800,
      svgProps: { 'data-testid': 'tech-radar-svg' },
    };

    const { queryByTestId } = await renderInTestApp(
      <TestApiProvider
        apis={[
          [errorApiRef, errorApi],
          [techRadarApiRef, mockClient],
        ]}
      >
        <RadarPage {...techRadarProps} />
      </TestApiProvider>,
    );

    await waitFor(() => !queryByTestId('progress'));

    expect(errorApi.getErrors()).toEqual([
      { error: new Error('404 Page Not Found'), context: undefined },
    ]);
    expect(queryByTestId('tech-radar-svg')).not.toBeInTheDocument();
  });
});
