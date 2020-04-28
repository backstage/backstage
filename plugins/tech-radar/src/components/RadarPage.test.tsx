/*
 * Copyright 2020 Spotify AB
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
import { render, waitForElement } from '@testing-library/react';
import { ThemeProvider } from '@material-ui/core';
import { lightTheme } from '@backstage/theme';
import { ApiRegistry, ApiProvider, errorApiRef } from '@backstage/core';
import { withLogCollector } from '@backstage/test-utils-core';

import GetBBoxPolyfill from '../utils/polyfills/getBBox';
import { techRadarApiRef, TechRadar, loadSampleData } from '../index';
import RadarPage from './RadarPage';

describe('RadarPage', () => {
  beforeAll(() => {
    GetBBoxPolyfill.create(0, 0, 1000, 500);
  });

  afterAll(() => {
    GetBBoxPolyfill.remove();
  });

  it('should render a progress bar', async () => {
    const errorApi = { post: () => {} };
    const techRadarApi = new TechRadar(1200, 800, loadSampleData, {
      svgProps: { 'data-testid': 'tech-radar-svg' },
    });

    const { getByTestId, queryByTestId } = render(
      <ThemeProvider theme={lightTheme}>
        <ApiProvider
          apis={ApiRegistry.from([
            [errorApiRef, errorApi],
            [techRadarApiRef, techRadarApi],
          ])}
        >
          <RadarPage />
        </ApiProvider>
      </ThemeProvider>,
    );

    expect(getByTestId('progress')).toBeInTheDocument();

    await waitForElement(() => queryByTestId('tech-radar-svg'));
  });

  it('should render a header with a svg', async () => {
    const errorApi = { post: () => {} };
    const techRadarApi = new TechRadar(1200, 800, loadSampleData, {
      svgProps: { 'data-testid': 'tech-radar-svg' },
    });

    const { getByText, getByTestId } = render(
      <ThemeProvider theme={lightTheme}>
        <ApiProvider
          apis={ApiRegistry.from([
            [errorApiRef, errorApi],
            [techRadarApiRef, techRadarApi],
          ])}
        >
          <RadarPage />
        </ApiProvider>
      </ThemeProvider>,
    );

    await waitForElement(() => getByTestId('tech-radar-svg'));

    expect(getByText('Welcome to the Tech Radar!')).toBeInTheDocument();
    expect(getByTestId('tech-radar-svg')).toBeInTheDocument();
  });

  it('should call the errorApi if load fails', async () => {
    const errorApi = { post: jest.fn() };
    const techRadarLoadFail = () =>
      Promise.reject(new Error('404 Page Not Found'));
    const techRadarApi = new TechRadar(1200, 800, techRadarLoadFail, {
      svgProps: { 'data-testid': 'tech-radar-svg' },
    });

    const { queryByTestId } = render(
      <ThemeProvider theme={lightTheme}>
        <ApiProvider
          apis={ApiRegistry.from([
            [errorApiRef, errorApi],
            [techRadarApiRef, techRadarApi],
          ])}
        >
          <RadarPage />
        </ApiProvider>
      </ThemeProvider>,
    );

    await waitForElement(() => !queryByTestId('progress'));

    expect(errorApi.post).toHaveBeenCalledTimes(1);
    expect(errorApi.post).toHaveBeenCalledWith(new Error('404 Page Not Found'));
    expect(queryByTestId('tech-radar-svg')).not.toBeInTheDocument();
  });

  it('should not render without errorApiRef', () => {
    const techRadarApi = new TechRadar(1200, 800, loadSampleData);

    expect(
      withLogCollector(['error'], () => {
        expect(() => {
          render(
            <ThemeProvider theme={lightTheme}>
              <ApiProvider
                apis={ApiRegistry.from([[techRadarApiRef, techRadarApi]])}
              >
                <RadarPage />
              </ApiProvider>
            </ThemeProvider>,
          );
        }).toThrow();
      }).error[0],
    ).toMatch(
      /^Error: Uncaught \[Error: No implementation available for apiRef{core.error}\]/,
    );
  });

  it('should not render without techRadarApiRef', () => {
    const errorApi = { post: () => {} };

    expect(
      withLogCollector(['error'], () => {
        expect(() => {
          render(
            <ThemeProvider theme={lightTheme}>
              <ApiProvider apis={ApiRegistry.from([[errorApiRef, errorApi]])}>
                <RadarPage />
              </ApiProvider>
            </ThemeProvider>,
          );
        }).toThrow();
      }).error[0],
    ).toMatch(
      /^Error: Uncaught \[Error: No implementation available for apiRef{plugin.techradar}\]/,
    );
  });
});
