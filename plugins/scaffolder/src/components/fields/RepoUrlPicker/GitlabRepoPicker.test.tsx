/*
 * Copyright 2022 The Backstage Authors
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
import { renderInTestApp, TestApiProvider } from '@backstage/test-utils';
import { fireEvent, waitFor } from '@testing-library/react';
import { GitlabRepoPicker } from './GitlabRepoPicker';

/*
 * Browser API polyfills for jsdom environment.
 * Radix UI primitives (Select, Popover) and cmdk rely on browser APIs
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

// Radix Select scrolls the selected item into view when opening.
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

describe('GitlabRepoPicker', () => {
  const scaffolderApiMock: Partial<ScaffolderApi> = {
    autocomplete: jest.fn().mockImplementation(opts =>
      Promise.resolve({
        results: [{ title: `${opts.resource}_example` }],
      }),
    ),
  };

  describe('GitlabRepoPicker - isDisabled', () => {
    it('disables owner combobox when isDisabled is true', async () => {
      const { getByRole } = await renderInTestApp(
        <TestApiProvider apis={[[scaffolderApiRef, scaffolderApiMock]]}>
          <GitlabRepoPicker
            onChange={jest.fn()}
            rawErrors={[]}
            state={{ repoName: 'repo' }}
            isDisabled
          />
        </TestApiProvider>,
      );

      expect(getByRole('combobox')).toBeDisabled();
    });

    it('does not disable owner combobox when isDisabled is false', async () => {
      const { getByRole } = await renderInTestApp(
        <TestApiProvider apis={[[scaffolderApiRef, scaffolderApiMock]]}>
          <GitlabRepoPicker
            onChange={jest.fn()}
            rawErrors={[]}
            state={{ repoName: 'repo' }}
            isDisabled={false}
          />
        </TestApiProvider>,
      );

      expect(getByRole('combobox')).not.toBeDisabled();
    });

    it('disables select input when allowedOwners are provided and isDisabled is true', async () => {
      const allowedOwners = ['owner1', 'owner2'];
      const { getByRole } = await renderInTestApp(
        <TestApiProvider apis={[[scaffolderApiRef, scaffolderApiMock]]}>
          <GitlabRepoPicker
            onChange={jest.fn()}
            rawErrors={[]}
            state={{ repoName: 'repo' }}
            allowedOwners={allowedOwners}
            isDisabled
          />
        </TestApiProvider>,
      );

      expect(getByRole('combobox')).toBeDisabled();
    });

    it('does not disable select input when allowedOwners are provided and isDisabled is false', async () => {
      const allowedOwners = ['owner1', 'owner2'];
      const { getByRole } = await renderInTestApp(
        <TestApiProvider apis={[[scaffolderApiRef, scaffolderApiMock]]}>
          <GitlabRepoPicker
            onChange={jest.fn()}
            rawErrors={[]}
            state={{ repoName: 'repo' }}
            allowedOwners={allowedOwners}
            isDisabled={false}
          />
        </TestApiProvider>,
      );

      expect(getByRole('combobox')).not.toBeDisabled();
    });
  });

  describe('owner field', () => {
    it('renders a select if there is a list of allowed owners', async () => {
      const allowedOwners = ['owner1', 'owner2'];
      const { getByRole, findByText } = await renderInTestApp(
        <TestApiProvider apis={[[scaffolderApiRef, scaffolderApiMock]]}>
          <GitlabRepoPicker
            onChange={jest.fn()}
            rawErrors={[]}
            state={{ repoName: 'repo' }}
            allowedOwners={allowedOwners}
          />
          ,
        </TestApiProvider>,
      );

      // Open the Radix Select dropdown to render options in the portal
      fireEvent.click(getByRole('combobox'));

      expect(await findByText('owner1')).toBeInTheDocument();
      expect(await findByText('owner2')).toBeInTheDocument();
    });

    it('calls onChange when the owner is changed to a different owner', async () => {
      const onChange = jest.fn();
      const allowedOwners = ['owner1', 'owner2'];
      const { getByRole, findByText } = await renderInTestApp(
        <TestApiProvider apis={[[scaffolderApiRef, scaffolderApiMock]]}>
          <GitlabRepoPicker
            onChange={onChange}
            rawErrors={[]}
            state={{ repoName: 'repo' }}
            allowedOwners={allowedOwners}
          />
          ,
        </TestApiProvider>,
      );

      // Open the Radix Select dropdown
      fireEvent.click(getByRole('combobox'));

      // Click the 'owner2' option in the portal-rendered list
      const option = await findByText('owner2');
      fireEvent.click(option);

      await waitFor(() => {
        expect(onChange).toHaveBeenCalledWith({ owner: 'owner2' });
      });
    });

    it('is disabled picked when only one allowed owner', async () => {
      const onChange = jest.fn();
      const allowedOwners = ['owner1'];
      const { getByRole } = await renderInTestApp(
        <TestApiProvider apis={[[scaffolderApiRef, scaffolderApiMock]]}>
          <GitlabRepoPicker
            onChange={onChange}
            rawErrors={[]}
            state={{ repoName: 'repo' }}
            allowedOwners={allowedOwners}
          />
          ,
        </TestApiProvider>,
      );

      expect(getByRole('combobox')).toBeDisabled();
    });

    it('should allow free text input when no allowed owners are passed', async () => {
      const onChange = jest.fn();
      const { getByRole, getByPlaceholderText } = await renderInTestApp(
        <TestApiProvider apis={[[scaffolderApiRef, scaffolderApiMock]]}>
          <GitlabRepoPicker
            onChange={onChange}
            rawErrors={[]}
            state={{ repoName: 'repo' }}
          />
        </TestApiProvider>,
      );

      // Click the combobox trigger to open the Popover + Command palette
      fireEvent.click(getByRole('combobox'));

      // The CommandInput renders an <input> inside the popover portal
      // Find it by its placeholder text (the owner title translation)
      const commandInput = getByPlaceholderText('Owner Available');
      fireEvent.change(commandInput, {
        target: { value: 'my-mock-owner' },
      });

      await waitFor(() => {
        expect(onChange).toHaveBeenCalledWith({ owner: 'my-mock-owner' });
      });
    });
  });
});
