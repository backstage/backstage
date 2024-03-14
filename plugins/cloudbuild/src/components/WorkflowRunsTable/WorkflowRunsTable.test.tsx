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

import { TestApiProvider, renderInTestApp } from '@backstage/test-utils';
import React from 'react';
import { WorkflowRunsTable, WorkflowRunsTableView } from './WorkflowRunsTable';
import { WorkflowRun } from '../useWorkflowRuns';
import { rootRouteRef } from '../../routes';
import { Entity } from '@backstage/catalog-model';
import {
  ActionsListWorkflowRunsForRepoResponseData,
  cloudbuildApiRef,
} from '../../api';
import { errorApiRef } from '@backstage/core-plugin-api';
import { act, fireEvent, within } from '@testing-library/react';

describe('<WorkflowRunsTableView />', () => {
  let runs: WorkflowRun[] = [];

  beforeEach(() => {
    runs = [
      {
        id: 'run_id_1',
        projectId: 'test',
        location: 'global',
        message: 'A workflow message',
        rerun: jest.fn(),
        url: 'https://cloudbuild.run/',
        googleUrl: 'https://google.com',
        status: 'success',
        substitutions: {
          COMMIT_SHA: 'e3adasd2e3adasd2e3adasd2',
          SHORT_SHA: 'f12j1231',
          REF_NAME: 'main',
          REPO_NAME: 'backstage',
          REVISION_ID: 'g123123',
        },
        createTime: '2014-10-02T15:01:23.045123456Z',
      },
    ];
  });

  it('row has a link to the run', async () => {
    const { getByTestId } = await renderInTestApp(
      <WorkflowRunsTableView
        projects={[]}
        setProject={() => {}}
        loading={false}
        page={1}
        pageSize={10}
        onChangePage={jest.fn()}
        onChangePageSize={jest.fn()}
        retry={jest.fn()}
        runs={runs}
        total={runs.length}
      />,
      { mountedRoutes: { '/': rootRouteRef } },
    );

    expect(getByTestId('cell-source')).toHaveAttribute(
      'href',
      '/test/global/run_id_1',
    );
  });

  it('row has the time it was created', async () => {
    const { getByTestId } = await renderInTestApp(
      <WorkflowRunsTableView
        projects={[]}
        setProject={() => {}}
        loading={false}
        page={1}
        pageSize={10}
        onChangePage={jest.fn()}
        onChangePageSize={jest.fn()}
        retry={jest.fn()}
        runs={runs}
        total={runs.length}
      />,
      { mountedRoutes: { '/': rootRouteRef } },
    );

    expect(getByTestId('cell-created')).toHaveTextContent(
      '02-10-2014 03:01:23',
    );
  });

  it('row with an action to rerun', async () => {
    const { getByTestId } = await renderInTestApp(
      <WorkflowRunsTableView
        projects={[]}
        setProject={() => {}}
        loading={false}
        page={1}
        pageSize={10}
        onChangePage={jest.fn()}
        onChangePageSize={jest.fn()}
        retry={jest.fn()}
        runs={runs}
        total={runs.length}
      />,
      { mountedRoutes: { '/': rootRouteRef } },
    );

    const rerunActionElement = getByTestId('action-rerun');
    rerunActionElement.click();
    expect(runs[0].rerun).toHaveBeenCalled();
  });

  it('should allow to select the cloudbuild project which builds will be listed', async () => {
    const testComponent: Entity = {
      apiVersion: 'backstage.io/v1alpha1',
      kind: 'Component',
      metadata: {
        name: 'test-component',
        annotations: {
          'google.com/cloudbuild-project-slug':
            'project-1, project-2, project-3',
          'google.com/cloudbuild-repo-name': 'repo-name',
        },
      },
    };

    const cloudBuildApiClient = {
      listWorkflowRuns: jest.fn(
        (_options: {
          projectId: string;
          location: string;
          cloudBuildFilter: string;
        }): Promise<ActionsListWorkflowRunsForRepoResponseData> => {
          return Promise.resolve({ builds: [] });
        },
      ),
    };

    const renderResult = await renderInTestApp(
      <TestApiProvider
        apis={[
          [cloudbuildApiRef, cloudBuildApiClient],
          [errorApiRef, {}],
        ]}
      >
        <WorkflowRunsTable entity={testComponent} />
      </TestApiProvider>,
    );

    expect(cloudBuildApiClient.listWorkflowRuns).toHaveBeenNthCalledWith(1, {
      projectId: 'project-1',
      location: 'global',
      cloudBuildFilter: 'substitutions.REPO_NAME=repo-name',
    });

    cloudBuildApiClient.listWorkflowRuns.mockClear();

    const input = renderResult.getByTestId('select');
    expect(input.textContent).toBe('project-1');

    fireEvent.mouseDown(within(input).getByRole('button'));
    expect(renderResult.getAllByText('project-1').length).toBe(2);
    expect(renderResult.getByText('project-2')).toBeInTheDocument();
    expect(renderResult.getByText('project-3')).toBeInTheDocument();

    await act(() => {
      const projectOption = renderResult.getByText('project-3');
      fireEvent.click(projectOption);
    });

    expect(input.textContent).toBe('project-3');

    expect(cloudBuildApiClient.listWorkflowRuns).toHaveBeenNthCalledWith(1, {
      projectId: 'project-3',
      location: 'global',
      cloudBuildFilter: 'substitutions.REPO_NAME=test-component',
    });
  });
});
