/*
 * Copyright 2024 The Backstage Authors
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
import Gauge from './Gauge';

describe('Gauge', () => {
  it('renders without crashing', () => {
    const { getByText } = render(<Gauge number={0} heading="" />);
    expect(getByText('N/A')).toBeInTheDocument();
  });

  it('renders with default props', () => {
    const { getByText, getByTestId } = render(<Gauge number={50} />);
    expect(getByTestId('circle')).toHaveStyle('stroke: #ffab00');
    expect(getByText('50%')).toBeInTheDocument();
  });

  it('renders with custom description', () => {
    const { getByText, getByTestId } = render(
      <Gauge number={75} heading="Custom heading" />,
    );
    expect(getByTestId('circle')).toHaveStyle('stroke: #00c853');
    expect(getByText('Custom Description')).toBeInTheDocument();
  });
});
