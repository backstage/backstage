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
import { render } from '@testing-library/react';
import { wrapInThemedTestApp } from '../testUtils';
import CircleProgress, { getProgressColor } from './CircleProgress';
import { COLORS } from '../theme/BackstageTheme';

describe('<CircleProgress />', () => {
  it('renders without exploding', () => {
    const { getByText } = render(
      wrapInThemedTestApp(<CircleProgress value={10} fractional={false} />),
    );
    getByText('10%');
  });
  it('handles fractional prop', () => {
    const { getByText } = render(
      wrapInThemedTestApp(<CircleProgress value={0.1} fractional />),
    );
    getByText('10%');
  });

  it('handles max prop', () => {
    const { getByText } = render(
      wrapInThemedTestApp(
        <CircleProgress value={1} max={10} fractional={false} />,
      ),
    );
    getByText('1%');
  });

  it('handles unit prop', () => {
    const { getByText } = render(
      wrapInThemedTestApp(
        <CircleProgress value={10} fractional={false} unit="m" />,
      ),
    );
    getByText('10m');
  });

  it('colors the progress correctly', () => {
    expect(getProgressColor()).toBe('#ddd');
    expect(getProgressColor(10)).toBe(COLORS.STATUS.ERROR);
    expect(getProgressColor(50)).toBe(COLORS.STATUS.WARNING);
    expect(getProgressColor(90)).toBe(COLORS.STATUS.OK);
  });

  it('colors the inverse progress correctly', () => {
    expect(getProgressColor()).toBe('#ddd');
    expect(getProgressColor(10, true)).toBe(COLORS.STATUS.OK);
    expect(getProgressColor(50, true)).toBe(COLORS.STATUS.WARNING);
    expect(getProgressColor(90, true)).toBe(COLORS.STATUS.ERROR);
  });
});
