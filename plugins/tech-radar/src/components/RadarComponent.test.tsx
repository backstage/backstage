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
import { renderInTestApp, TestApiProvider } from '@backstage/test-utils';

import GetBBoxPolyfill from '../utils/polyfills/getBBox';
import { RadarComponent } from './RadarComponent';
import { TechRadarLoaderResponse, techRadarApiRef, TechRadarApi } from '../api';

import { errorApiRef } from '@backstage/core-plugin-api';

describe('RadarComponent', () => {
  beforeAll(() => {
    GetBBoxPolyfill.create(0, 0, 1000, 500);
  });

  afterAll(() => {
    GetBBoxPolyfill.remove();
  });

  class MockClient implements TechRadarApi {
    constructor(private delay = 0) {}
    async load(): Promise<TechRadarLoaderResponse> {
      await new Promise(resolve => setTimeout(resolve, this.delay));
      return {
        entries: [],
        quadrants: [],
        rings: [],
      };
    }
  }

  it('should render a progress bar', async () => {
    jest.useFakeTimers();

    const { findByTestId } = await renderInTestApp(
      <TestApiProvider apis={[[techRadarApiRef, new MockClient(500)]]}>
        <RadarComponent
          width={1200}
          height={800}
          svgProps={{ 'data-testid': 'tech-radar-svg' }}
        />
      </TestApiProvider>,
    );

    jest.advanceTimersByTime(250);
    await expect(findByTestId('progress')).resolves.toBeInTheDocument();

    jest.advanceTimersByTime(250);
    await expect(findByTestId('tech-radar-svg')).resolves.toBeInTheDocument();

    jest.useRealTimers();
  });

  it('should call the errorApi if load fails', async () => {
    const errorApi = { post: jest.fn() };
    const mockClient = new MockClient();
    jest
      .spyOn(mockClient, 'load')
      .mockRejectedValue(new Error('404 Page Not Found'));

    const { queryByTestId } = await renderInTestApp(
      <TestApiProvider
        apis={[
          [errorApiRef, errorApi],
          [techRadarApiRef, mockClient],
        ]}
      >
        <RadarComponent
          width={1200}
          height={800}
          svgProps={{ 'data-testid': 'tech-radar-svg' }}
        />
      </TestApiProvider>,
    );

    expect(errorApi.post).toHaveBeenCalledTimes(1);
    expect(errorApi.post).toHaveBeenCalledWith(new Error('404 Page Not Found'));
    expect(queryByTestId('tech-radar-svg')).not.toBeInTheDocument();
  });
});
