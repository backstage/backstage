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
import { BuildWithSteps } from './BuildWithSteps';
import { useBuildWithSteps } from '../../../../hooks';
import { render } from '@testing-library/react';

jest.mock('../../../../hooks/useBuildWithSteps', () => ({
  useBuildWithSteps: jest.fn().mockReturnValue({ loading: false, build: {} }),
  useStepOutput: jest.fn(),
}));

const mockedUseBuildWithSteps = useBuildWithSteps as jest.Mock;

describe('BuildWithSteps', () => {
  const renderComponent = () => render(<BuildWithSteps jobNumber={1} />);

  it('should render build steps', async () => {
    mockedUseBuildWithSteps.mockReturnValue({
      loading: false,
      build: {
        name: 'ci',
        build_num: 1234,
        steps: [
          {
            name: 'Test',
            actions: [
              {
                index: 0,
                step: 1,
                name: 'Checkout code',
                failed: false,
                start_time: '2023-11-01T00:00:01',
                end_time: '2023-11-01T00:00:03',
              },
              {
                index: 2,
                step: 99,
                name: 'Make test',
                failed: false,
                start_time: '2023-11-01T00:00:01',
                end_time: '2023-11-01T00:00:05.234',
              },
            ],
          },
        ],
      },
    });
    const rendered = await renderComponent();

    expect(await rendered.findByText('Steps')).toBeInTheDocument();
    expect(
      await rendered.findByText('Checkout code (2 seconds)'),
    ).toBeInTheDocument();
    expect(
      await rendered.findByText('Make test (4.234 seconds)'),
    ).toBeInTheDocument();
  });

  it('should display a progress bar when in a loading state', async () => {
    mockedUseBuildWithSteps.mockReturnValue({ loading: true, build: {} });
    const rendered = await renderComponent();

    expect(await rendered.findByTestId('progress')).toBeInTheDocument();
  });
});
