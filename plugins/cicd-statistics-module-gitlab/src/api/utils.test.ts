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

import { pipelinesToBuilds, jobsToStages } from './utils';
import { Types } from '@gitbeaker/core';

const pipelineMock: Types.PipelineSchema[] = [
  {
    id: 1000,
    iid: 1,
    project_id: 1,
    sha: 'd40',
    ref: 'main',
    status: 'success',
    source: 'schedule',
    created_at: '2022-03-30T13:03:09.846Z',
    updated_at: '2022-03-30T13:07:49.248Z',
    web_url: 'https://gitlab.com/backstage/app/-/pipelines/1000',
    user: {
      name: 'user',
      avatar_url: 'avatar_user',
    },
  },
];

// cast to unknown so we can omit a lot unused vars but also keep the type
const jobMock = [
  {
    id: 6962883,
    status: 'success',
    stage: 'build',
    name: 'docker',
    ref: 'refs/merge-requests/209/train',
    tag: false,
    allow_failure: false,
    created_at: new Date('2022-03-30T08:35:15.394Z'),
    started_at: new Date('2022-03-30T08:35:16.532Z'),
    finished_at: new Date('2022-03-30T08:35:37.731Z'),
    duration: 21.199465,
    queued_duration: 0.976313,
  },
] as unknown as Array<Types.JobSchema>;

describe('util functionality', () => {
  it('transforms the pipeline object to the build object', () => {
    const builds = pipelinesToBuilds(pipelineMock);
    expect(builds).toEqual([
      {
        id: '1000',
        status: 'succeeded',
        branchType: 'master',
        duration: 0,
        requestedAt: new Date('2022-03-30T13:03:09.846Z'),
        triggeredBy: 'internal',
        stages: [],
      },
    ]);
  });

  it('transforms the job object to the stage object', () => {
    const stages = jobsToStages(jobMock);
    expect(stages).toEqual([
      {
        name: 'build',
        status: 'succeeded',
        duration: 21199.465,
        stages: [
          {
            name: 'docker',
            status: 'succeeded',
            duration: 21199.465,
          },
        ],
      },
    ]);
  });
});
