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

import React from 'react';
import { renderInTestApp } from '@backstage/test-utils';
import { JobsList } from './JobsList';
import * as data from './__fixtures__/jobs.json';
import { Workflow, WorkflowJobListResponse } from '../../../../types';

const jobsList = data as WorkflowJobListResponse;

describe('JobsList', () => {
  const renderComponent = (props = {}) =>
    renderInTestApp(
      <JobsList
        jobs={jobsList.items}
        loading={false}
        onJobSelect={() => {}}
        workflow={{ pipeline_number: 4170, id: 'workflow-id' } as Workflow}
        {...props}
      />,
    );

  it('should render jobs list', async () => {
    const rendered = await renderComponent();

    expect(rendered.getByText(/Jobs/)).toBeInTheDocument();
    expect(
      rendered.getByText('#29123 - vulnerability-scan'),
    ).toBeInTheDocument();
    expect(rendered.getByText('#29124 - test_windows')).toBeInTheDocument();
  });

  it('should display link to job in CircleCI site', async () => {
    await renderComponent();

    expect(document.querySelector('a')?.getAttribute('href')).toBe(
      'https://app.circleci.com/pipelines/gh/CircleCI-Public/circleci-cli/4170/workflows/workflow-id/jobs/29123',
    );
  });

  it('should display a progress bar when in a loading state', async () => {
    const rendered = await renderComponent({ loading: true });

    expect(await rendered.findByTestId('progress')).toBeInTheDocument();
  });

  it('should not display link when there is job number', async () => {
    const rendered = await renderComponent({
      jobs: [
        {
          id: '8f3f2a9a-cba2-4219-8c12-b5d7646ac978',
          started_at: '2023-10-05T14:13:16Z',
          name: 'vulnerability-scan',
          project_slug: 'gh/CircleCI-Public/circleci-cli',
          status: 'failed',
          type: 'build',
          stopped_at: '2023-10-05T14:13:38Z',
        },
      ],
    });

    expect(rendered.queryByRole('link')).toBeNull();
  });
});
