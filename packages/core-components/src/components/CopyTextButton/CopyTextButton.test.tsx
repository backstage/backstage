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
import { fireEvent } from '@testing-library/react';
import { act } from 'react-dom/test-utils';
import { renderInTestApp } from '@backstage/test-utils';
import { CopyTextButton } from './CopyTextButton';
import { ApiProvider, ApiRegistry } from '@backstage/core-app-api';
import { errorApiRef, ErrorApi } from '@backstage/core-plugin-api';
import { useCopyToClipboard } from 'react-use';

jest.mock('popper.js', () => {
  const PopperJS = jest.requireActual('popper.js');

  return class {
    static placements = PopperJS.placements;
    update() {}
    destroy() {}
    scheduleUpdate() {}
  };
});

jest.mock('react-use', () => {
  const original = jest.requireActual('react-use');

  return {
    ...original,
    useCopyToClipboard: jest
      .fn()
      .mockImplementation(original.useCopyToClipboard),
  };
});

const props = {
  text: 'mockText',
  tooltipDelay: 2,
  tooltipText: 'mockTooltip',
};

const apiRegistry = ApiRegistry.from([
  [
    errorApiRef,
    {
      post: jest.fn(),
      error$: jest.fn(),
    } as ErrorApi,
  ],
]);

describe('<CopyTextButton />', () => {
  it('renders without exploding', async () => {
    const { getByTitle, queryByText } = await renderInTestApp(
      <ApiProvider apis={apiRegistry}>
        <CopyTextButton {...props} />
      </ApiProvider>,
    );
    expect(getByTitle('mockTooltip')).toBeInTheDocument();
    expect(queryByText('mockTooltip')).not.toBeInTheDocument();
  });

  it('displays tooltip and copy the text on click', async () => {
    jest.useFakeTimers();

    const spy = useCopyToClipboard as jest.Mock;
    const copy = jest.fn();
    spy.mockReturnValue([{}, copy]);

    const rendered = await renderInTestApp(
      <ApiProvider apis={apiRegistry}>
        <CopyTextButton {...props} />
      </ApiProvider>,
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
      <ApiProvider apis={apiRegistry}>
        <CopyTextButton {...props} />
      </ApiProvider>,
    );
    expect(apiRegistry.get(errorApiRef)?.post).toHaveBeenCalledWith(error);
  });
});
