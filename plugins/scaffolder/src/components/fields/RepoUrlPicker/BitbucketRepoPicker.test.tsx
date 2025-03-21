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
import userEvent from '@testing-library/user-event';
import React from 'react';
import { act } from 'react-dom/test-utils';
import { BitbucketRepoPicker } from './BitbucketRepoPicker';

describe('BitbucketRepoPicker', () => {
  const scaffolderApiMock: Partial<ScaffolderApi> = {
    autocomplete: jest.fn().mockImplementation(opts =>
      Promise.resolve({
        results: [{ id: `${opts.resource}_example` }],
      }),
    ),
  };

  it('renders a select if there is a list of allowed owners', async () => {
    const allowedOwners = ['owner1', 'owner2'];
    const { findByText } = await renderInTestApp(
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

  it('renders workspace input when host is bitbucket.org', async () => {
    const state = { host: 'bitbucket.org', workspace: 'lolsWorkspace' };

    const { getAllByRole } = await renderInTestApp(
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

  it('hides the workspace input when the host is not bitbucket.org', async () => {
    const state = {
      host: 'mycustom.domain.bitbucket.org',
    };

    const { getAllByRole } = await renderInTestApp(
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
    it('calls onChange when the workspace changes', async () => {
      const onChange = jest.fn();
      const { getAllByRole } = await renderInTestApp(
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
    it('calls onChange when the project changes', async () => {
      const onChange = jest.fn();
      const { getAllByRole } = await renderInTestApp(
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
      const { getAllByRole } = await renderInTestApp(
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
      const { getAllByRole } = await renderInTestApp(
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
      const { findByText } = await renderInTestApp(
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

      const { getAllByRole, getByText } = await renderInTestApp(
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

      const { getAllByRole, getByText } = await renderInTestApp(
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

      await renderInTestApp(
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
          availableRepos: [{ name: 'repositories_example' }],
        }),
      );
    });
  });

  describe('BitbucketRepoPicker - isDisabled', () => {
    it('disables workspace and project inputs when isDisabled is true', async () => {
      const { getAllByRole } = await renderInTestApp(
        <TestApiProvider apis={[[scaffolderApiRef, scaffolderApiMock]]}>
          <BitbucketRepoPicker
            onChange={jest.fn()}
            rawErrors={[]}
            state={{
              host: 'bitbucket.org',
              workspace: 'testWorkspace',
              project: 'testProject',
            }}
            isDisabled
          />
        </TestApiProvider>,
      );

      const inputs = getAllByRole('textbox');
      expect(inputs).toHaveLength(2);
      expect(inputs[0]).toBeDisabled();
      expect(inputs[1]).toBeDisabled();
    });

    it('does not disable workspace and project inputs when isDisabled is false', async () => {
      const { getAllByRole } = await renderInTestApp(
        <TestApiProvider apis={[[scaffolderApiRef, scaffolderApiMock]]}>
          <BitbucketRepoPicker
            onChange={jest.fn()}
            rawErrors={[]}
            state={{
              host: 'bitbucket.org',
              workspace: 'testWorkspace',
              project: 'testProject',
            }}
            isDisabled={false}
          />
        </TestApiProvider>,
      );

      const inputs = getAllByRole('textbox');
      expect(inputs).toHaveLength(2);
      expect(inputs[0]).not.toBeDisabled();
      expect(inputs[1]).not.toBeDisabled();
    });
  });
});
