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
import { ActionOutput } from './ActionOutput';

import * as action from './__fixtures__/action.json';
import { renderInTestApp } from '@backstage/test-utils';
import { fireEvent } from '@testing-library/react';

jest.mock('../../../../hooks/useStepOutput', () => ({
  useStepOutput: jest
    .fn()
    .mockReturnValue({ loading: false, output: 'Step output' }),
}));

describe('ActionOutput', () => {
  const renderComponent = () =>
    renderInTestApp(
      <ActionOutput action={action as any} buildNumber={29165} />,
    );

  it('should render build steps', async () => {
    const rendered = await renderComponent();

    expect(
      await rendered.findByText(
        'Preparing environment variables (0.008 seconds)',
      ),
    ).toBeInTheDocument();
  });

  it('should render output when accordion is clicked', async () => {
    const rendered = await renderComponent();
    const button = await rendered.findByRole('button');

    await fireEvent.click(button);

    expect(await rendered.findByText('Step output')).toBeInTheDocument();
  });
});
