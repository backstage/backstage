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

import GetBBoxPolyfill from '../utils/polyfills/getBBox';
import { RadarPage } from './RadarPage';
import { act } from 'react-dom/test-utils';
import { MockErrorApi, wrapInTestApp } from '@backstage/test-utils';

describe('RadarPage', () => {
  beforeAll(() => {
    GetBBoxPolyfill.create(0, 0, 1000, 500);
  });

  afterAll(() => {
    GetBBoxPolyfill.remove();
  });

  it('should render a progress bar', async () => {
    jest.useFakeTimers();

    const techRadarProps = {
      width: 1200,
      height: 800,
      svgProps: { 'data-testid': 'tech-radar-svg' },
    };

    const { getByTestId, queryByTestId } = render(
      wrapInTestApp(
        <ThemeProvider theme={lightTheme}>
          <RadarPage {...techRadarProps} />
        </ThemeProvider>,
      ),
    );

    act(() => {
      jest.advanceTimersByTime(250);
    });
    expect(getByTestId('progress')).toBeInTheDocument();

    await waitForElement(() => queryByTestId('tech-radar-svg'));
    jest.useRealTimers();
  });

  it('should render a header with a svg', async () => {
    const techRadarProps = {
      width: 1200,
      height: 800,
      svgProps: { 'data-testid': 'tech-radar-svg' },
    };

    const { getByText, getByTestId } = render(
      wrapInTestApp(
        <ThemeProvider theme={lightTheme}>
          <RadarPage {...techRadarProps} />
        </ThemeProvider>,
      ),
    );

    await waitForElement(() => getByTestId('tech-radar-svg'));

    expect(
      getByText('Pick the recommended technologies for your projects'),
    ).toBeInTheDocument();
    expect(getByTestId('tech-radar-svg')).toBeInTheDocument();
  });

  it('should call the errorApi if load fails', async () => {
    const errorApi = new MockErrorApi({ collect: true });
    const techRadarLoadFail = () =>
      Promise.reject(new Error('404 Page Not Found'));
    const techRadarProps = {
      width: 1200,
      height: 800,
      getData: techRadarLoadFail,
      svgProps: { 'data-testid': 'tech-radar-svg' },
    };

    const { queryByTestId } = render(
      <ThemeProvider theme={lightTheme}>
        <ApiProvider apis={ApiRegistry.with(errorApiRef, errorApi)}>
          <RadarPage {...techRadarProps} />
        </ApiProvider>
      </ThemeProvider>,
    );

    await waitForElement(() => !queryByTestId('progress'));

    expect(errorApi.getErrors()).toEqual([
      { error: new Error('404 Page Not Found'), context: undefined },
    ]);
    expect(queryByTestId('tech-radar-svg')).not.toBeInTheDocument();
  });
});
