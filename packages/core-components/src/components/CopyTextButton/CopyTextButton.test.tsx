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
import { act, fireEvent } from '@testing-library/react';
import { renderInTestApp, TestApiProvider } from '@backstage/test-utils';
import { CopyTextButton } from './CopyTextButton';
import { errorApiRef } from '@backstage/core-plugin-api';
import useCopyToClipboard from 'react-use/lib/useCopyToClipboard';

jest.mock('popper.js', () => {
  const PopperJS = jest.requireActual('popper.js');

  return class {
    static placements = PopperJS.placements;
    update() {}
    destroy() {}
    scheduleUpdate() {}
  };
});

jest.mock('react-use/lib/useCopyToClipboard', () => {
  const original = jest.requireActual('react-use/lib/useCopyToClipboard');

  return {
    __esModule: true,
    default: jest.fn().mockImplementation(original.default),
  };
});

const props = {
  text: 'mockText',
  tooltipDelay: 2,
  tooltipText: 'mockTooltip',
};

const mockErrorApi = {
  post: jest.fn(),
  error$: jest.fn(),
};
const apis = [[errorApiRef, mockErrorApi] as const] as const;

describe('<CopyTextButton />', () => {
  it('renders without exploding', async () => {
    const { getByTitle, queryByText, getByLabelText } = await renderInTestApp(
      <TestApiProvider apis={apis}>
        <CopyTextButton {...props} />
      </TestApiProvider>,
    );
    expect(getByTitle('mockTooltip')).toBeInTheDocument();
    expect(queryByText('mockTooltip')).not.toBeInTheDocument();
    expect(getByLabelText('Copy text')).toBeInTheDocument();
  });

  it('displays tooltip and copy the text on click', async () => {
    jest.useFakeTimers();

    const spy = useCopyToClipboard as jest.Mock;
    const copy = jest.fn();
    spy.mockReturnValue([{}, copy]);

    const rendered = await renderInTestApp(
      <TestApiProvider apis={apis}>
        <CopyTextButton {...props} />
      </TestApiProvider>,
    );
    const button = rendered.getByTitle('mockTooltip');
    fireEvent.click(button);
    act(() => {
      jest.runAllTimers();
    });
    expect(copy).toHaveBeenCalledWith('mockText');
    rendered.getByText('mockTooltip');
    jest.useRealTimers();
  });

  it('reports copy errors', async () => {
    const spy = useCopyToClipboard as jest.Mock;

    const error = new Error('just an error');
    spy.mockReturnValue([{ error }, jest.fn()]);

    await renderInTestApp(
      <TestApiProvider apis={apis}>
        <CopyTextButton {...props} />
      </TestApiProvider>,
    );
    expect(mockErrorApi.post).toHaveBeenCalledWith(error);
  });

  it('aria-label', async () => {
    const { getByLabelText } = await renderInTestApp(
      <TestApiProvider apis={apis}>
        <CopyTextButton {...props} aria-label="text for aria-label" />
      </TestApiProvider>,
    );
    expect(getByLabelText('text for aria-label')).toBeInTheDocument();
  });
});
