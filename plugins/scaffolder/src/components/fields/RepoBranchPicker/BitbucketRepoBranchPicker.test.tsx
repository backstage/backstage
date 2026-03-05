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

import {
  ScaffolderApi,
  scaffolderApiRef,
} from '@backstage/plugin-scaffolder-react';
import { BitbucketRepoBranchPicker } from './BitbucketRepoBranchPicker';
import { act, fireEvent, waitFor, screen } from '@testing-library/react';
import { renderInTestApp, TestApiProvider } from '@backstage/test-utils';

/*
 * Browser API polyfills for jsdom environment.
 * Radix UI primitives (Popover) and cmdk rely on browser APIs
 * that are not available in jsdom.
 */

// cmdk uses ResizeObserver for measuring list dimensions.
if (typeof globalThis.ResizeObserver === 'undefined') {
  (globalThis as any).ResizeObserver = class {
    observe() {}
    unobserve() {}
    disconnect() {}
  };
}

// Radix scrolls the selected item into view when opening.
if (!Element.prototype.scrollIntoView) {
  Element.prototype.scrollIntoView = function scrollIntoView() {};
}

// Radix uses pointer capture APIs for pointer event management.
if (!Element.prototype.hasPointerCapture) {
  Element.prototype.hasPointerCapture = function () {
    return false;
  };
}
if (!Element.prototype.setPointerCapture) {
  Element.prototype.setPointerCapture = function () {};
}
if (!Element.prototype.releasePointerCapture) {
  Element.prototype.releasePointerCapture = function () {};
}

// DOMRect.fromRect is used by Radix for collision-aware positioning.
if (typeof DOMRect === 'undefined' || !DOMRect.fromRect) {
  (globalThis as any).DOMRect = {
    fromRect: () => ({
      top: 0,
      left: 0,
      bottom: 0,
      right: 0,
      width: 0,
      height: 0,
      x: 0,
      y: 0,
      toJSON: () => ({}),
    }),
  };
}

describe('BitbucketRepoBranchPicker', () => {
  const scaffolderApiMock: Partial<ScaffolderApi> = {
    autocomplete: jest.fn().mockResolvedValue({ results: [{ id: 'branch1' }] }),
  };

  it('renders an input field', async () => {
    const { getByRole } = await renderInTestApp(
      <TestApiProvider apis={[[scaffolderApiRef, scaffolderApiMock]]}>
        <BitbucketRepoBranchPicker
          onChange={jest.fn()}
          state={{ branch: 'main' }}
          rawErrors={[]}
        />
      </TestApiProvider>,
    );

    expect(getByRole('textbox')).toBeInTheDocument();
    expect(getByRole('textbox')).toHaveValue('main');
  });

  it('input field disabled', async () => {
    await renderInTestApp(
      <TestApiProvider apis={[[scaffolderApiRef, scaffolderApiMock]]}>
        <BitbucketRepoBranchPicker
          onChange={jest.fn()}
          isDisabled
          state={{ branch: 'main' }}
          rawErrors={[]}
        />
      </TestApiProvider>,
    );

    const input = screen.getByRole('textbox');

    // Expect input to be disabled
    expect(input).toBeDisabled();
    expect(input).toHaveValue('main');
  });

  it('calls onChange when the input field changes', async () => {
    const onChange = jest.fn();

    const { getByRole } = await renderInTestApp(
      <TestApiProvider apis={[[scaffolderApiRef, scaffolderApiMock]]}>
        <BitbucketRepoBranchPicker
          onChange={onChange}
          state={{ branch: 'main' }}
          rawErrors={[]}
        />
      </TestApiProvider>,
    );

    const input = getByRole('textbox');

    act(() => {
      input.focus();
      fireEvent.change(input, {
        target: { value: 'develop' },
      });
      input.blur();
    });

    expect(onChange).toHaveBeenCalledWith({ branch: 'develop' });
  });

  it('should populate branches', async () => {
    const onChange = jest.fn();

    const { getByRole, getByText } = await renderInTestApp(
      <TestApiProvider apis={[[scaffolderApiRef, scaffolderApiMock]]}>
        <BitbucketRepoBranchPicker
          onChange={onChange}
          state={{
            branch: 'main',
            host: 'bitbucket.org',
            workspace: 'foo',
            repository: 'bar',
          }}
          rawErrors={[]}
          accessToken="token"
        />
      </TestApiProvider>,
    );

    // Open the Popover+Command dropdown via the combobox trigger button
    const combobox = getByRole('combobox');
    fireEvent.click(combobox);

    // Verify that the available branches are shown in the Command list
    await waitFor(() => expect(getByText('branch1')).toBeInTheDocument());

    // Verify that selecting an option calls onChange
    fireEvent.click(getByText('branch1'));
    await waitFor(() => {
      expect(onChange).toHaveBeenCalledWith({
        branch: 'branch1',
      });
    });
  });
});
