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
import { setupServer } from 'msw/node';
import { rest } from 'msw';
import { Models } from '@backstage/plugin-bitbucket-cloud-common';
import userEvent from '@testing-library/user-event';

const server = setupServer();

describe('BitbucketRepoPicker', () => {
  it('renders a select if there is a list of allowed owners', async () => {
    const allowedOwners = ['owner1', 'owner2'];
    const { findByText } = render(
      <BitbucketRepoPicker
        onChange={jest.fn()}
        rawErrors={[]}
        state={{ host: 'bitbucket.org', repoName: 'repo' }}
        allowedOwners={allowedOwners}
      />,
    );

    expect(await findByText('owner1')).toBeInTheDocument();
    expect(await findByText('owner2')).toBeInTheDocument();
  });

  it('renders workspace input when host is bitbucket.org', () => {
    const state = { host: 'bitbucket.org', workspace: 'lolsWorkspace' };

    const { getAllByRole } = render(
      <BitbucketRepoPicker onChange={jest.fn()} rawErrors={[]} state={state} />,
    );

    expect(getAllByRole('textbox')).toHaveLength(2);
    expect(getAllByRole('textbox')[0]).toHaveValue('lolsWorkspace');
  });

  it('hides the workspace input when the host is not bitbucket.org', () => {
    const state = {
      host: 'mycustom.domain.bitbucket.org',
    };

    const { getAllByRole } = render(
      <BitbucketRepoPicker onChange={jest.fn()} rawErrors={[]} state={state} />,
    );

    expect(getAllByRole('textbox')).toHaveLength(1);
  });

  describe('workspace field', () => {
    it('calls onChange when the workspace changes', () => {
      const onChange = jest.fn();
      const { getAllByRole } = render(
        <BitbucketRepoPicker
          onChange={onChange}
          rawErrors={[]}
          state={{ host: 'bitbucket.org' }}
        />,
      );

      const workspaceInput = getAllByRole('textbox')[0];

      fireEvent.change(workspaceInput, { target: { value: 'test-workspace' } });

      expect(onChange).toHaveBeenCalledWith({ workspace: 'test-workspace' });
    });
  });

  describe('project field', () => {
    it('calls onChange when the project changes', () => {
      const onChange = jest.fn();
      const { getAllByRole } = render(
        <BitbucketRepoPicker
          onChange={onChange}
          rawErrors={[]}
          state={{ host: 'bitbucket.org' }}
        />,
      );

      const projectInput = getAllByRole('textbox')[1];

      fireEvent.change(projectInput, { target: { value: 'test-project' } });

      expect(onChange).toHaveBeenCalledWith({ project: 'test-project' });
    });

    it('Does not render a select if the list of allowed projects does not exist', async () => {
      const { getAllByRole } = render(
        <BitbucketRepoPicker
          onChange={jest.fn()}
          rawErrors={[]}
          state={{ host: 'bitbucket.org', repoName: 'repo' }}
        />,
      );

      expect(getAllByRole('textbox')).toHaveLength(2);
      expect(getAllByRole('textbox')[1]).toHaveValue('');
    });

    it('Does not render a select if the list of allowed projects is empty', async () => {
      const { getAllByRole } = render(
        <BitbucketRepoPicker
          onChange={jest.fn()}
          rawErrors={[]}
          state={{ host: 'bitbucket.org', repoName: 'repo' }}
          allowedProjects={[]}
        />,
      );

      expect(getAllByRole('textbox')).toHaveLength(2);
      expect(getAllByRole('textbox')[1]).toHaveValue('');
    });

    it('Does render a select if there is a list of allowed projects', async () => {
      const allowedProjects = ['project1', 'project2'];
      const { findByText } = render(
        <BitbucketRepoPicker
          onChange={jest.fn()}
          rawErrors={[]}
          state={{ host: 'bitbucket.org', repoName: 'repo' }}
          allowedProjects={allowedProjects}
        />,
      );

      expect(await findByText('project1')).toBeInTheDocument();
      expect(await findByText('project2')).toBeInTheDocument();
    });
  });

  describe('autocompletion', () => {
    beforeAll(() => server.listen({ onUnhandledRequest: 'error' }));
    beforeEach(() => {
      // BitbucketCloudClient.listWorkspaces()
      server.use(
        rest.get('https://api.bitbucket.org/2.0/workspaces', (_, res, ctx) => {
          const response = {
            values: [
              {
                type: 'workspace',
                slug: 'workspace1',
              } as Models.Workspace,
            ],
          };
          return res(ctx.json(response));
        }),
      );

      // BitbucketCloudClient.listProjectsByWorkspace()
      server.use(
        rest.get(
          'https://api.bitbucket.org/2.0/workspaces/workspace1/projects',
          (_, res, ctx) => {
            const response = {
              values: [
                {
                  type: 'project',
                  key: 'project1',
                } as Models.Project,
              ],
            };
            return res(ctx.json(response));
          },
        ),
      );

      // BitbucketCloudClient.listRepositoriesByWorkspace()
      server.use(
        rest.get(
          'https://api.bitbucket.org/2.0/repositories/workspace1',
          (_, res, ctx) => {
            const response = {
              values: [
                {
                  type: 'repository',
                  slug: 'repo1',
                } as Models.Repository,
              ],
            };
            return res(ctx.json(response));
          },
        ),
      );
    });
    afterAll(() => server.close());
    afterEach(() => server.resetHandlers());

    it('should populate workspaces if host is set and accessToken is provided', async () => {
      const onChange = jest.fn();
      const { getAllByRole, getByText } = render(
        <BitbucketRepoPicker
          onChange={onChange}
          rawErrors={[]}
          state={{ host: 'bitbucket.org' }}
          accessToken="foo"
        />,
      );

      // Open the Autcomplete dropdown
      const workspaceInput = getAllByRole('textbox')[0];
      await userEvent.click(workspaceInput);

      // Verify that the available workspaces are shown
      await waitFor(() => expect(getByText('workspace1')).toBeInTheDocument());

      // Verify that selecting an option calls onChange
      await userEvent.click(getByText('workspace1'));
      expect(onChange).toHaveBeenCalledWith({ workspace: 'workspace1' });
    });

    it('should populate projects if host and workspace are set and accessToken is provided', async () => {
      const onChange = jest.fn();
      const { getAllByRole, getByText } = render(
        <BitbucketRepoPicker
          onChange={onChange}
          rawErrors={[]}
          state={{ host: 'bitbucket.org', workspace: 'workspace1' }}
          accessToken="foo"
        />,
      );

      // Open the Autcomplete dropdown
      const projectInput = getAllByRole('textbox')[1];
      await userEvent.click(projectInput);

      // Verify that the available projects are shown
      await waitFor(() => expect(getByText('project1')).toBeInTheDocument());

      // Verify that selecting an option calls onChange
      await userEvent.click(getByText('project1'));
      expect(onChange).toHaveBeenCalledWith({ project: 'project1' });
    });

    it('should populate repositories if host, workspace and project are set and accessToken is provided', async () => {
      const onChange = jest.fn();
      render(
        <BitbucketRepoPicker
          onChange={onChange}
          rawErrors={[]}
          state={{
            host: 'bitbucket.org',
            workspace: 'workspace1',
            project: 'project1',
          }}
          accessToken="foo"
        />,
      );

      // Verify that the available repos are updated
      await waitFor(() =>
        expect(onChange).toHaveBeenCalledWith({ availableRepos: ['repo1'] }),
      );
    });
  });
});
