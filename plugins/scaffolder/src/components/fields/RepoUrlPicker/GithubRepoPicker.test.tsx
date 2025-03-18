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

import React, { act } from 'react';
import { GithubRepoPicker } from './GithubRepoPicker';
import { fireEvent, waitFor } from '@testing-library/react';
import { renderInTestApp, TestApiProvider } from '@backstage/test-utils';
import {
  ScaffolderApi,
  scaffolderApiRef,
} from '@backstage/plugin-scaffolder-react';
import userEvent from '@testing-library/user-event';

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
      const { findByText } = await renderInTestApp(
        <TestApiProvider apis={[[scaffolderApiRef, scaffolderApiMock]]}>
          <GithubRepoPicker
            onChange={jest.fn()}
            rawErrors={[]}
            state={{ repoName: 'repo' }}
            allowedOwners={allowedOwners}
          />
        </TestApiProvider>,
      );

      expect(await findByText('owner1')).toBeInTheDocument();
      expect(await findByText('owner2')).toBeInTheDocument();
    });

    it('calls onChange when the owner is changed to a different owner', async () => {
      const onChange = jest.fn();
      const allowedOwners = ['owner1', 'owner2'];
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

      await fireEvent.change(getByRole('combobox'), {
        target: { value: 'owner2' },
      });

      expect(onChange).toHaveBeenCalledWith({ owner: 'owner2' });
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

      const { getAllByRole, getByText } = await renderInTestApp(
        <TestApiProvider apis={[[scaffolderApiRef, scaffolderApiMock]]}>
          <GithubRepoPicker
            onChange={onChange}
            rawErrors={[]}
            state={{ host: 'github.com', repoName: 'repo' }}
            accessToken="foo"
          />
        </TestApiProvider>,
      );

      // Open the Autcomplete dropdown
      const ownerInput = getAllByRole('textbox')[0];
      await userEvent.click(ownerInput);

      // Verify that the available owners are shown
      await waitFor(() => expect(getByText('spotify')).toBeInTheDocument());

      // Verify that selecting an option calls onChange
      await userEvent.click(getByText('spotify'));
      expect(onChange).toHaveBeenCalledWith({
        owner: 'spotify',
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
