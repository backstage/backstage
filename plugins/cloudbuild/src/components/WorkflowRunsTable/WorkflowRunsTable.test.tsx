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

import { renderInTestApp } from '@backstage/test-utils';
import React from 'react';
import { WorkflowRunsTableView } from './WorkflowRunsTable';
import { WorkflowRun } from '../useWorkflowRuns';

describe('<WorkflowRunsTableView />', () => {
  let runs: WorkflowRun[] = [];

  beforeEach(() => {
    runs = [
      {
        id: 'run_id_1',
        message: 'A workflow message',
        rerun: jest.fn(),
        url: 'https://cloudbuild.run/',
        googleUrl: 'https://google.com',
        status: 'success',
        substitutions: {
          COMMIT_SHA: 'e3adasd2e3adasd2e3adasd2',
          SHORT_SHA: 'f12j1231',
          BRANCH_NAME: 'main',
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
        loading={false}
        page={1}
        pageSize={10}
        onChangePage={jest.fn()}
        onChangePageSize={jest.fn()}
        projectName="Backstage"
        retry={jest.fn()}
        runs={runs}
        total={runs.length}
      />,
    );

    expect(getByTestId('cell-source')).toHaveAttribute('href', '/run_id_1');
  });

  it('row has the time it was created', async () => {
    const { getByTestId } = await renderInTestApp(
      <WorkflowRunsTableView
        loading={false}
        page={1}
        pageSize={10}
        onChangePage={jest.fn()}
        onChangePageSize={jest.fn()}
        projectName="Backstage"
        retry={jest.fn()}
        runs={runs}
        total={runs.length}
      />,
    );

    expect(getByTestId('cell-created')).toHaveTextContent(
      '02-10-2014 03:01:23',
    );
  });

  it('row with an action to rerun', async () => {
    const { getByTestId } = await renderInTestApp(
      <WorkflowRunsTableView
        loading={false}
        page={1}
        pageSize={10}
        onChangePage={jest.fn()}
        onChangePageSize={jest.fn()}
        projectName="Backstage"
        retry={jest.fn()}
        runs={runs}
        total={runs.length}
      />,
    );

    const rerunActionElement = getByTestId('action-rerun');
    rerunActionElement.click();
    expect(runs[0].rerun).toHaveBeenCalled();
  });
});
