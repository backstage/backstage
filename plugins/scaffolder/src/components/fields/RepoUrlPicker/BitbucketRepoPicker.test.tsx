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
import { BitbucketRepoPicker } from './BitbucketRepoPicker';
import { render, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { TestApiProvider } from '@backstage/test-utils';
import {
  ScaffolderApi,
  scaffolderApiRef,
} from '@backstage/plugin-scaffolder-react';
import { act } from 'react-dom/test-utils';

describe('BitbucketRepoPicker', () => {
  const scaffolderApiMock: Partial<ScaffolderApi> = {
    autocomplete: jest.fn().mockImplementation(opts =>
      Promise.resolve({
        results: [{ title: `${opts.resource}_example` }],
      }),
    ),
  };

  it('renders a select if there is a list of allowed owners', async () => {
    const allowedOwners = ['owner1', 'owner2'];
    const { findByText } = render(
      <TestApiProvider apis={[[scaffolderApiRef, scaffolderApiMock]]}>
        <BitbucketRepoPicker
          onChange={jest.fn()}
          rawErrors={[]}
          state={{ host: 'bitbucket.org', repoName: 'repo' }}
          allowedOwners={allowedOwners}
        />
      </TestApiProvider>,
    );

    expect(await findByText('owner1')).toBeInTheDocument();
    expect(await findByText('owner2')).toBeInTheDocument();
  });

  it('renders workspace input when host is bitbucket.org', () => {
    const state = { host: 'bitbucket.org', workspace: 'lolsWorkspace' };

    const { getAllByRole } = render(
      <TestApiProvider apis={[[scaffolderApiRef, scaffolderApiMock]]}>
        <BitbucketRepoPicker
          onChange={jest.fn()}
          rawErrors={[]}
          state={state}
        />
      </TestApiProvider>,
    );

    expect(getAllByRole('textbox')).toHaveLength(2);
    expect(getAllByRole('textbox')[0]).toHaveValue('lolsWorkspace');
  });

  it('hides the workspace input when the host is not bitbucket.org', () => {
    const state = {
      host: 'mycustom.domain.bitbucket.org',
    };

    const { getAllByRole } = render(
      <TestApiProvider apis={[[scaffolderApiRef, scaffolderApiMock]]}>
        <BitbucketRepoPicker
          onChange={jest.fn()}
          rawErrors={[]}
          state={state}
        />
      </TestApiProvider>,
    );

    expect(getAllByRole('textbox')).toHaveLength(1);
  });

  describe('workspace field', () => {
    it('calls onChange when the workspace changes', () => {
      const onChange = jest.fn();
      const { getAllByRole } = render(
        <TestApiProvider apis={[[scaffolderApiRef, scaffolderApiMock]]}>
          <BitbucketRepoPicker
            onChange={onChange}
            rawErrors={[]}
            state={{ host: 'bitbucket.org' }}
          />
        </TestApiProvider>,
      );

      const workspaceInput = getAllByRole('textbox')[0];

      act(() => {
        workspaceInput.focus();
        fireEvent.change(workspaceInput, {
          target: { value: 'test-workspace' },
        });
        workspaceInput.blur();
      });

      expect(onChange).toHaveBeenCalledWith({ workspace: 'test-workspace' });
    });
  });

  describe('project field', () => {
    it('calls onChange when the project changes', () => {
      const onChange = jest.fn();
      const { getAllByRole } = render(
        <TestApiProvider apis={[[scaffolderApiRef, scaffolderApiMock]]}>
          <BitbucketRepoPicker
            onChange={onChange}
            rawErrors={[]}
            state={{ host: 'bitbucket.org' }}
          />
        </TestApiProvider>,
      );

      const projectInput = getAllByRole('textbox')[1];

      act(() => {
        projectInput.focus();
        fireEvent.change(projectInput, { target: { value: 'test-project' } });
        projectInput.blur();
      });

      expect(onChange).toHaveBeenCalledWith({ project: 'test-project' });
    });

    it('Does not render a select if the list of allowed projects does not exist', async () => {
      const { getAllByRole } = render(
        <TestApiProvider apis={[[scaffolderApiRef, scaffolderApiMock]]}>
          <BitbucketRepoPicker
            onChange={jest.fn()}
            rawErrors={[]}
            state={{ host: 'bitbucket.org', repoName: 'repo' }}
          />
        </TestApiProvider>,
      );

      expect(getAllByRole('textbox')).toHaveLength(2);
      expect(getAllByRole('textbox')[1]).toHaveValue('');
    });

    it('Does not render a select if the list of allowed projects is empty', async () => {
      const { getAllByRole } = render(
        <TestApiProvider apis={[[scaffolderApiRef, scaffolderApiMock]]}>
          <BitbucketRepoPicker
            onChange={jest.fn()}
            rawErrors={[]}
            state={{ host: 'bitbucket.org', repoName: 'repo' }}
            allowedProjects={[]}
          />
        </TestApiProvider>,
      );

      expect(getAllByRole('textbox')).toHaveLength(2);
      expect(getAllByRole('textbox')[1]).toHaveValue('');
    });

    it('Does render a select if there is a list of allowed projects', async () => {
      const allowedProjects = ['project1', 'project2'];
      const { findByText } = render(
        <TestApiProvider apis={[[scaffolderApiRef, scaffolderApiMock]]}>
          <BitbucketRepoPicker
            onChange={jest.fn()}
            rawErrors={[]}
            state={{ host: 'bitbucket.org', repoName: 'repo' }}
            allowedProjects={allowedProjects}
          />
        </TestApiProvider>,
      );

      expect(await findByText('project1')).toBeInTheDocument();
      expect(await findByText('project2')).toBeInTheDocument();
    });
  });

  describe('autocompletion', () => {
    it('should populate workspaces if host is set and accessToken is provided', async () => {
      const onChange = jest.fn();

      const { getAllByRole, getByText } = render(
        <TestApiProvider apis={[[scaffolderApiRef, scaffolderApiMock]]}>
          <BitbucketRepoPicker
            onChange={onChange}
            rawErrors={[]}
            state={{ host: 'bitbucket.org' }}
            accessToken="foo"
          />
        </TestApiProvider>,
      );

      // Open the Autcomplete dropdown
      const workspaceInput = getAllByRole('textbox')[0];
      await userEvent.click(workspaceInput);

      // Verify that the available workspaces are shown
      await waitFor(() =>
        expect(getByText('workspaces_example')).toBeInTheDocument(),
      );

      // Verify that selecting an option calls onChange
      await userEvent.click(getByText('workspaces_example'));
      expect(onChange).toHaveBeenCalledWith({
        workspace: 'workspaces_example',
      });
    });

    it('should populate projects if host and workspace are set and accessToken is provided', async () => {
      const onChange = jest.fn();

      const { getAllByRole, getByText } = render(
        <TestApiProvider apis={[[scaffolderApiRef, scaffolderApiMock]]}>
          <BitbucketRepoPicker
            onChange={onChange}
            rawErrors={[]}
            state={{ host: 'bitbucket.org', workspace: 'workspace1' }}
            accessToken="foo"
          />
        </TestApiProvider>,
      );

      // Open the Autcomplete dropdown
      const projectInput = getAllByRole('textbox')[1];
      await userEvent.click(projectInput);

      // Verify that the available projects are shown
      await waitFor(() =>
        expect(getByText('projects_example')).toBeInTheDocument(),
      );

      // Verify that selecting an option calls onChange
      await userEvent.click(getByText('projects_example'));
      expect(onChange).toHaveBeenCalledWith({ project: 'projects_example' });
    });

    it('should populate repositories if host, workspace and project are set and accessToken is provided', async () => {
      const onChange = jest.fn();

      render(
        <TestApiProvider apis={[[scaffolderApiRef, scaffolderApiMock]]}>
          <BitbucketRepoPicker
            onChange={onChange}
            rawErrors={[]}
            state={{
              host: 'bitbucket.org',
              workspace: 'workspace1',
              project: 'project1',
            }}
            accessToken="foo"
          />
        </TestApiProvider>,
      );

      // Verify that the available repos are updated
      await waitFor(() =>
        expect(onChange).toHaveBeenCalledWith({
          availableRepos: ['repositories_example'],
        }),
      );
    });
  });
});
