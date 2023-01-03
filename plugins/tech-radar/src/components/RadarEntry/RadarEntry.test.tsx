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
import { screen } from '@testing-library/react';
import { renderInTestApp } from '@backstage/test-utils';
import userEvent from '@testing-library/user-event';
import GetBBoxPolyfill from '../../utils/polyfills/getBBox';

import RadarEntry, { Props } from './RadarEntry';

const minProps: Props = {
  x: 2,
  y: 2,
  value: 2,
  color: 'red',
};

const optionalProps: Props = {
  ...minProps,
  title: 'example-title',
  description: 'example-description',
};

describe('RadarEntry', () => {
  beforeAll(() => {
    GetBBoxPolyfill.create(0, 0, 1000, 500);
  });

  afterAll(() => {
    GetBBoxPolyfill.remove();
  });

  it('should render link only', async () => {
    await renderInTestApp(
      <svg>
        <RadarEntry {...minProps} />
      </svg>,
    );

    const radarEntry = screen.getByTestId('radar-entry');
    const { x, y } = minProps;
    expect(radarEntry).toBeInTheDocument();
    expect(radarEntry.getAttribute('transform')).toBe(`translate(${x}, ${y})`);
    expect(screen.getByText(String(minProps.value))).toBeInTheDocument();
  });

  it('should render with description', async () => {
    await renderInTestApp(
      <svg>
        <RadarEntry {...optionalProps} />
      </svg>,
    );

    await userEvent.click(screen.getByRole('button'));

    const radarEntry = screen.getByTestId('radar-entry');
    expect(radarEntry).toBeInTheDocument();

    const radarDescription = screen.getByTestId('radar-description');
    expect(radarDescription).toBeInTheDocument();
    expect(screen.getByText(String(minProps.value))).toBeInTheDocument();
  });

  it('should render blip with url equal to # if description present', async () => {
    const withUrl = {
      ...optionalProps,
      url: 'http://backstage.io',
    };
    await renderInTestApp(
      <svg>
        <RadarEntry {...withUrl} />
      </svg>,
    );

    expect(screen.getByRole('button')).toHaveAttribute('href', '#');
  });
});
