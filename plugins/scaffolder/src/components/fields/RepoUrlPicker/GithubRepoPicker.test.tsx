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

import { act } from 'react';
import { GithubRepoPicker } from './GithubRepoPicker';
import { fireEvent, waitFor } from '@testing-library/react';
import { renderInTestApp, TestApiProvider } from '@backstage/test-utils';
import {
  ScaffolderApi,
  scaffolderApiRef,
} from '@backstage/plugin-scaffolder-react';

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

describe('GithubRepoPicker', () => {
  const scaffolderApiMock: Partial<ScaffolderApi> = {
    autocomplete: jest.fn().mockImplementation(opts =>
      Promise.resolve({
        results: [
          {
            id:
              opts.resource === 'repositoriesWithOwner'
                ? 'spotify/backstage'
                : `${opts.resource}_example`,
          },
        ],
      }),
    ),
  };
  describe('owner field', () => {
    it('renders a select if there is a list of allowed owners', async () => {
      const allowedOwners = ['owner1', 'owner2'];
      const { getByRole, findByText } = await renderInTestApp(
        <TestApiProvider apis={[[scaffolderApiRef, scaffolderApiMock]]}>
          <GithubRepoPicker
            onChange={jest.fn()}
            rawErrors={[]}
            state={{ repoName: 'repo' }}
            allowedOwners={allowedOwners}
          />
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
          <GithubRepoPicker
            onChange={onChange}
            rawErrors={[]}
            state={{ repoName: 'repo' }}
            allowedOwners={allowedOwners}
          />
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
          <GithubRepoPicker
            onChange={onChange}
            rawErrors={[]}
            state={{ repoName: 'repo' }}
            allowedOwners={allowedOwners}
          />
        </TestApiProvider>,
      );

      expect(getByRole('combobox')).toBeDisabled();
    });

    it('should display free text if no allowed owners are passed', async () => {
      const onChange = jest.fn();
      const { getAllByRole } = await renderInTestApp(
        <TestApiProvider apis={[[scaffolderApiRef, scaffolderApiMock]]}>
          <GithubRepoPicker
            onChange={onChange}
            rawErrors={[]}
            state={{ repoName: 'repo' }}
          />
        </TestApiProvider>,
      );
      const ownerField = getAllByRole('textbox')[0];
      act(() => {
        ownerField.focus();
        fireEvent.change(ownerField, { target: { value: 'my-mock-owner' } });
        ownerField.blur();
      });

      expect(onChange).toHaveBeenCalledWith({ owner: 'my-mock-owner' });
    });
  });

  describe('autocompletion', () => {
    it('should populate owners if accessToken is provided', async () => {
      const onChange = jest.fn();

      const { findByRole, getByText } = await renderInTestApp(
        <TestApiProvider apis={[[scaffolderApiRef, scaffolderApiMock]]}>
          <GithubRepoPicker
            onChange={onChange}
            rawErrors={[]}
            state={{ host: 'github.com', repoName: 'repo' }}
            accessToken="foo"
          />
        </TestApiProvider>,
      );

      // Wait for the combobox button to appear (indicates availableOwners are populated
      // and the component switched from the plain Input branch to the Popover+Command branch)
      const combobox = await findByRole('combobox', {}, { timeout: 1500 });

      // Open the Popover+Command dropdown
      fireEvent.click(combobox);

      // Verify that the available owners are shown in the Command list
      await waitFor(() => expect(getByText('spotify')).toBeInTheDocument());

      // Verify that selecting an option calls onChange
      fireEvent.click(getByText('spotify'));
      await waitFor(() => {
        expect(onChange).toHaveBeenCalledWith({
          owner: 'spotify',
        });
      });
    });

    it('should populate repositories if owner and accessToken are provided', async () => {
      const onChange = jest.fn();

      await renderInTestApp(
        <TestApiProvider apis={[[scaffolderApiRef, scaffolderApiMock]]}>
          <GithubRepoPicker
            onChange={onChange}
            rawErrors={[]}
            state={{ host: 'github.com', owner: 'spotify' }}
            accessToken="foo"
          />
        </TestApiProvider>,
      );

      // Verify that the available repos are updated
      await waitFor(
        () =>
          expect(onChange).toHaveBeenCalledWith({
            availableRepos: [{ name: 'backstage' }],
          }),
        { timeout: 1500 },
      );
    });
  });

  describe('GithubRepoPicker - isDisabled', () => {
    it('disables all inputs when isDisabled is true', async () => {
      const { getByLabelText } = await renderInTestApp(
        <TestApiProvider apis={[[scaffolderApiRef, scaffolderApiMock]]}>
          <GithubRepoPicker
            onChange={jest.fn()}
            rawErrors={[]}
            state={{ repoName: 'repo' }}
            isDisabled
          />
        </TestApiProvider>,
      );

      const ownerInput = getByLabelText(/owner/i);
      expect(ownerInput).toBeDisabled();
    });

    it('does not disable inputs when isDisabled is false', async () => {
      const { getByLabelText } = await renderInTestApp(
        <TestApiProvider apis={[[scaffolderApiRef, scaffolderApiMock]]}>
          <GithubRepoPicker
            onChange={jest.fn()}
            rawErrors={[]}
            state={{ repoName: 'repo' }}
            isDisabled={false}
          />
        </TestApiProvider>,
      );

      const ownerInput = getByLabelText(/owner/i);
      expect(ownerInput).not.toBeDisabled();
    });
  });
});
