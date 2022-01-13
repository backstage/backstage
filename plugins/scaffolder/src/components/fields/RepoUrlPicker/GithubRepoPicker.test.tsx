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

import React from 'react';
import { GithubRepoPicker } from './GithubRepoPicker';
import { render, fireEvent } from '@testing-library/react';

describe('GitubRepoPicker', () => {
  describe('owner field', () => {
    it('renders a select if there is a list of allowed owners', async () => {
      const allowedOwners = ['owner1', 'owner2'];
      const { findByText } = render(
        <GithubRepoPicker
          onOwnerChange={jest.fn()}
          onRepoNameChange={jest.fn()}
          rawErrors={[]}
          repoName="repo"
          allowedOwners={allowedOwners}
        />,
      );

      expect(await findByText('owner1')).toBeInTheDocument();
      expect(await findByText('owner2')).toBeInTheDocument();
    });

    it('calls onOwnerChange when the owner is changed to a different owner', async () => {
      const onOwnerChange = jest.fn();
      const allowedOwners = ['owner1', 'owner2'];
      const { getByRole } = render(
        <GithubRepoPicker
          onOwnerChange={onOwnerChange}
          onRepoNameChange={jest.fn()}
          rawErrors={[]}
          repoName="repo"
          allowedOwners={allowedOwners}
        />,
      );

      await fireEvent.change(getByRole('combobox'), {
        target: { value: 'owner2' },
      });

      expect(onOwnerChange).toHaveBeenCalledWith('owner2');
    });

    it('is disabled picked when only one allowed owner', () => {
      const onOwnerChange = jest.fn();
      const allowedOwners = ['owner1'];
      const { getByRole } = render(
        <GithubRepoPicker
          onOwnerChange={onOwnerChange}
          onRepoNameChange={jest.fn()}
          rawErrors={[]}
          repoName="repo"
          allowedOwners={allowedOwners}
        />,
      );

      expect(getByRole('combobox')).toBeDisabled();
    });

    it('should display free text if no allowed owners are passed', async () => {
      const onOwnerChange = jest.fn();
      const { getAllByRole } = render(
        <GithubRepoPicker
          onOwnerChange={onOwnerChange}
          onRepoNameChange={jest.fn()}
          rawErrors={[]}
          repoName="repo"
        />,
      );

      const ownerField = getAllByRole('textbox')[0];
      fireEvent.change(ownerField, { target: { value: 'my-mock-owner' } });

      expect(onOwnerChange).toHaveBeenCalledWith('my-mock-owner');
    });
  });

  describe('repo name', () => {
    it('should render free text field for input of repo name', () => {
      const onRepoNameChange = jest.fn();
      const { getAllByRole } = render(
        <GithubRepoPicker
          onOwnerChange={jest.fn()}
          onRepoNameChange={onRepoNameChange}
          rawErrors={[]}
          repoName="repo"
        />,
      );

      const repoNameField = getAllByRole('textbox')[1];
      fireEvent.change(repoNameField, {
        target: { value: 'my-mock-repo-name' },
      });

      expect(onRepoNameChange).toHaveBeenCalledWith('my-mock-repo-name');
    });
  });
});
