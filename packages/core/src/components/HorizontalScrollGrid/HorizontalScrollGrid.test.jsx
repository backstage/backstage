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
import { render, fireEvent } from '@testing-library/react';
import { renderWithEffects, wrapInThemedTestApp } from '@backstage/test-utils';
import HorizontalScrollGrid from './HorizontalScrollGrid';
import { Grid } from '@material-ui/core';

describe('<HorizontalScrollGrid />', () => {
  beforeEach(() => {
    jest.spyOn(window.performance, 'now').mockReturnValue(5);
    jest
      .spyOn(window, 'requestAnimationFrame')
      .mockImplementation(cb => cb(20));
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('renders without exploding', () => {
    const rendered = render(
      wrapInThemedTestApp(
        <HorizontalScrollGrid>
          <Grid item>item1</Grid>
          <Grid item>item2</Grid>
        </HorizontalScrollGrid>,
      ),
    );
    rendered.getByText('item1');
    rendered.getByText('item2');
    expect(rendered.queryByLabelText('Scroll Left')).toBeNull();
    expect(rendered.queryByLabelText('Scroll Right')).toBeNull();
  });

  it('should show scroll buttons', async () => {
    Object.defineProperties(HTMLElement.prototype, {
      scrollLeft: {
        configurable: true,
        value: 5,
      },
      offsetWidth: {
        configurable: true,
        value: 10,
      },
      scrollWidth: {
        configurable: true,
        value: 20,
      },
    });

    let lastScroll = 0;
    HTMLElement.prototype.scrollBy = ({ left }) => {
      lastScroll = left;
    };

    const rendered = await renderWithEffects(
      wrapInThemedTestApp(
        <HorizontalScrollGrid style={{ maxWidth: 300 }}>
          <Grid item style={{ minWidth: 200 }}>
            item1
          </Grid>
          <Grid item style={{ minWidth: 200 }}>
            item2
          </Grid>
        </HorizontalScrollGrid>,
      ),
    );

    rendered.getByTitle('Scroll Left');
    rendered.getByTitle('Scroll Right');
    expect(lastScroll).toBe(0);
    fireEvent.click(rendered.getByTitle('Scroll Right'));
    expect(lastScroll).toBeGreaterThan(0);
    fireEvent.click(rendered.getByTitle('Scroll Left'));
    expect(lastScroll).toBeLessThan(0);

    delete HTMLElement.prototype.scrollLeft;
    delete HTMLElement.prototype.offsetWidth;
    delete HTMLElement.prototype.scrollWidth;
    delete HTMLElement.prototype.scrollBy;
  });
});
