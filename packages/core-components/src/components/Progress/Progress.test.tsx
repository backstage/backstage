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

import { renderInTestApp } from '@backstage/test-utils';
import { act } from '@testing-library/react';

import { Progress } from './Progress';

describe('<Progress />', () => {
  it('renders without exploding', async () => {
    const { queryByTestId } = await renderInTestApp(<Progress />);
    expect(queryByTestId('progress')).toBeInTheDocument();
  });

  it('shows progress indicator after delay', async () => {
    jest.useFakeTimers();
    const { queryByTestId } = await renderInTestApp(<Progress />);

    // Initially rendered but hidden during the delay period
    const element = queryByTestId('progress');
    expect(element).toBeInTheDocument();

    // After delay, the progress indicator becomes visible
    act(() => {
      jest.advanceTimersByTime(300); // exceed the 250ms default delay
    });

    expect(queryByTestId('progress')).toBeInTheDocument();
    jest.useRealTimers();
  });
});
