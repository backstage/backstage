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

import { act, fireEvent, screen } from '@testing-library/react';
import { renderInTestApp, TestApiProvider } from '@backstage/test-utils';
import { CopyTextButton } from './CopyTextButton';
import { errorApiRef } from '@backstage/core-plugin-api';
import { default as useCopyToClipboardUnmocked } from 'react-use/esm/useCopyToClipboard';

const useCopyToClipboard = jest.mocked(useCopyToClipboardUnmocked);
jest.mock('react-use/esm/useCopyToClipboard', () =>
  jest.fn().mockImplementation(() => [{ noUserInteraction: false }, jest.fn()]),
);

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
    const { getByRole, queryByText, getByLabelText } = await renderInTestApp(
      <TestApiProvider apis={apis}>
        <CopyTextButton {...props} />
      </TestApiProvider>,
    );
    expect(getByRole('button', { name: 'Copy text' })).toBeInTheDocument();
    expect(queryByText('mockTooltip')).not.toBeInTheDocument();
    expect(getByLabelText('Copy text')).toBeInTheDocument();
  });

  it('displays tooltip and copy the text on click', async () => {
    jest.useFakeTimers();

    const spy = useCopyToClipboard;
    const copy = jest.fn();
    spy.mockReturnValue([{ noUserInteraction: false }, copy]);

    const rendered = await renderInTestApp(
      <TestApiProvider apis={apis}>
        <CopyTextButton {...props} />
      </TestApiProvider>,
    );
    const button = rendered.getByRole('button', { name: 'Copy text' });
    fireEvent.click(button);
    expect(copy).toHaveBeenCalledWith('mockText');
    // Assert tooltip visible before timers fire the close setTimeout.
    // Radix Tooltip renders content in both a visible element and a
    // screen-reader-accessible <span role="tooltip">, so use getAllByText.
    expect(screen.getAllByText('mockTooltip').length).toBeGreaterThanOrEqual(1);
    act(() => {
      jest.runAllTimers();
    });
    jest.useRealTimers();
  });

  it('reports copy errors', async () => {
    const spy = useCopyToClipboard;

    const error = new Error('just an error');
    spy.mockReturnValue([{ noUserInteraction: false, error }, jest.fn()]);

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
