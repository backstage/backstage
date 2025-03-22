/*
 * Copyright 2021 The Backstage Authors
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

import { render, waitFor, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import { CurveFilter } from './CurveFilter';
import { mockApis, MockErrorApi, TestApiProvider } from '@backstage/test-utils';
import { translationApiRef } from '@backstage/core-plugin-api/alpha';
import { errorApiRef } from '@backstage/core-plugin-api';

describe('<CurveFilter/>', () => {
  test('should display current curve label', () => {
    const onChange = jest.fn();
    render(
      <TestApiProvider
        apis={[
          [translationApiRef, mockApis.translation()],
          [errorApiRef, new MockErrorApi()],
        ]}
      >
        <CurveFilter value="curveMonotoneX" onChange={onChange} />
      </TestApiProvider>,
    );

    expect(screen.getByText('Monotone X')).toBeInTheDocument();
  });

  test('should select an alternative curve factory', async () => {
    const onChange = jest.fn();
    render(
      <TestApiProvider
        apis={[
          [translationApiRef, mockApis.translation()],
          [errorApiRef, new MockErrorApi()],
        ]}
      >
        <CurveFilter value="curveStepBefore" onChange={onChange} />
      </TestApiProvider>,
    );

    expect(screen.getByText('Step Before')).toBeInTheDocument();

    await userEvent.click(
      within(screen.getByTestId('select')).getByRole('button'),
    );
    await userEvent.click(screen.getByText('Monotone X'));

    await waitFor(() => {
      expect(screen.getByText('Monotone X')).toBeInTheDocument();
      expect(onChange).toHaveBeenCalledWith('curveMonotoneX');
    });
  });
});
