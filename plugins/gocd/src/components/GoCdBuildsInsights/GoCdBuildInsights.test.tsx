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

import { render } from '@testing-library/react';
import React from 'react';
import {
  GoCdBuildsInsights,
  GoCdBuildsInsightsProps,
} from './GoCdBuildsInsights';

const minProps: GoCdBuildsInsightsProps = {
  loading: false,
  error: undefined,
  pipelineHistory: {
    _links: { next: { href: 'some-href' } },
    pipelines: [
      {
        name: 'fortune',
        counter: 278,
        label: '278-8ab3',
        natural_order: 278.0,
        can_run: true,
        preparing_to_schedule: false,
        comment: null,
        scheduled_date: 1643019617380,
        build_cause: {
          trigger_message: 'Forced by api',
          trigger_forced: true,
          approver: 'api',
          material_revisions: [
            {
              changed: false,
              material: {
                name: 'git',
                fingerprint: 'print',
                type: 'Git',
                description:
                  'URL: git@github.com:fake-org/fortune.git, Branch: master',
              },
              modifications: [
                {
                  revision: '85d5debb5a93e5d43c7a695',
                  modified_time: 1642177395000,
                  user_name: 'User Name',
                  comment: 'This is a fake build',
                  email_address: null,
                },
              ],
            },
          ],
        },
        stages: [
          {
            result: 'Passed',
            status: 'Passed',
            rerun_of_counter: null,
            name: 'init',
            counter: '1',
            scheduled: true,
            approval_type: 'success',
            approved_by: 'api',
            operate_permission: true,
            can_run: true,
            jobs: [
              {
                name: 'package-publish',
                scheduled_date: 1643019617380,
                state: 'Completed',
                result: 'Passed',
              },
              {
                name: 'publish-deploy-replicas',
                scheduled_date: 1643019617380,
                state: 'Completed',
                result: 'Passed',
              },
              {
                name: 'lint',
                scheduled_date: 1643019617380,
                state: 'Completed',
                result: 'Passed',
              },
              {
                name: 'test-all',
                scheduled_date: 1643019617380,
                state: 'Completed',
                result: 'Passed',
              },
            ],
          },
          {
            result: 'Passed',
            status: 'Passed',
            rerun_of_counter: null,
            name: 'canary',
            counter: '1',
            scheduled: true,
            approval_type: 'success',
            approved_by: 'changes',
            operate_permission: true,
            can_run: true,
            jobs: [
              {
                name: 'canary',
                scheduled_date: 1643019690373,
                state: 'Completed',
                result: 'Passed',
              },
            ],
          },
          {
            result: 'Passed',
            status: 'Passed',
            rerun_of_counter: null,
            name: 'deploy',
            counter: '1',
            scheduled: true,
            approval_type: 'success',
            approved_by: 'changes',
            operate_permission: true,
            can_run: true,
            jobs: [
              {
                name: 'promote-and-deploy',
                scheduled_date: 1643020668387,
                state: 'Completed',
                result: 'Passed',
              },
            ],
          },
        ],
      },
      {
        name: 'fortune',
        counter: 277,
        label: '277-8ab3',
        natural_order: 277.0,
        can_run: true,
        preparing_to_schedule: false,
        comment: null,
        scheduled_date: 1642177416721,
        build_cause: {
          trigger_message: 'modified by User Name',
          trigger_forced: false,
          approver: 'changes',
          material_revisions: [
            {
              changed: true,
              material: {
                name: 'git',
                fingerprint: '23feea5b59ef40cc7d43ac46bf08e3718',
                type: 'Git',
                description:
                  'URL: git@github.com:fake-org/fortune.git, Branch: master',
              },
              modifications: [
                {
                  revision: '85d53e5d43c7a695',
                  modified_time: 1642177395000,
                  user_name: 'User Name',
                  comment: 'Update README',
                  email_address: null,
                },
              ],
            },
          ],
        },
        stages: [
          {
            result: 'Passed',
            status: 'Passed',
            rerun_of_counter: null,
            name: 'init',
            counter: '1',
            scheduled: true,
            approval_type: 'success',
            approved_by: 'changes',
            operate_permission: true,
            can_run: true,
            jobs: [
              {
                name: 'test-all',
                scheduled_date: 1642177416721,
                state: 'Completed',
                result: 'Passed',
              },
              {
                name: 'lint',
                scheduled_date: 1642177416721,
                state: 'Completed',
                result: 'Passed',
              },
              {
                name: 'publish-deploy-replicas',
                scheduled_date: 1642377416721,
                state: 'Completed',
                result: 'Failed',
              },
              {
                name: 'package-publish',
                scheduled_date: 1642177416721,
                state: 'Completed',
                result: 'Passed',
              },
            ],
          },
          {
            result: 'Passed',
            status: 'Passed',
            rerun_of_counter: null,
            name: 'canary',
            counter: '1',
            scheduled: true,
            approval_type: 'success',
            approved_by: 'changes',
            operate_permission: true,
            can_run: true,
            jobs: [
              {
                name: 'canary',
                scheduled_date: 1642177485728,
                state: 'Completed',
                result: 'Passed',
              },
            ],
          },
          {
            result: 'Passed',
            status: 'Passed',
            rerun_of_counter: null,
            name: 'deploy',
            counter: '1',
            scheduled: true,
            approval_type: 'success',
            approved_by: 'changes',
            operate_permission: true,
            can_run: true,
            jobs: [
              {
                name: 'promote-and-deploy',
                scheduled_date: 1642178467479,
                state: 'Completed',
                result: 'Passed',
              },
            ],
          },
        ],
      },
      {
        name: 'fortune',
        counter: 277,
        label: '277-8ab3',
        natural_order: 277.0,
        can_run: true,
        preparing_to_schedule: false,
        comment: null,
        scheduled_date: 1642177416721,
        build_cause: {
          trigger_message: 'modified by User Name',
          trigger_forced: false,
          approver: 'changes',
          material_revisions: [
            {
              changed: true,
              material: {
                name: 'git',
                fingerprint: '23feea5b59ef40cc7d43ac46bf08e3718',
                type: 'Git',
                description:
                  'URL: git@github.com:fake-org/fortune.git, Branch: master',
              },
              modifications: [
                {
                  revision: '85d53e5d43c7a695',
                  modified_time: 1642177395000,
                  user_name: 'User Name',
                  comment: 'Update README',
                  email_address: null,
                },
              ],
            },
          ],
        },
        stages: [
          {
            result: 'Passed',
            status: 'Passed',
            rerun_of_counter: null,
            name: 'init',
            counter: '1',
            scheduled: true,
            approval_type: 'success',
            approved_by: 'changes',
            operate_permission: true,
            can_run: true,
            jobs: [
              {
                name: 'test-all',
                scheduled_date: 1642174416721,
                state: 'Completed',
                result: 'Failed',
              },
              {
                name: 'lint',
                scheduled_date: 1642177416721,
                state: 'Completed',
                result: 'Passed',
              },
              {
                name: 'publish-deploy-replicas',
                scheduled_date: 1642177416721,
                state: 'Completed',
                result: 'Passed',
              },
              {
                name: 'package-publish',
                scheduled_date: 1642177416721,
                state: 'Completed',
                result: 'Passed',
              },
            ],
          },
          {
            result: 'Passed',
            status: 'Passed',
            rerun_of_counter: null,
            name: 'canary',
            counter: '1',
            scheduled: true,
            approval_type: 'success',
            approved_by: 'changes',
            operate_permission: true,
            can_run: true,
            jobs: [
              {
                name: 'canary',
                scheduled_date: 1642177485728,
                state: 'Completed',
                result: 'Passed',
              },
            ],
          },
          {
            result: 'Passed',
            status: 'Passed',
            rerun_of_counter: null,
            name: 'deploy',
            counter: '1',
            scheduled: true,
            approval_type: 'success',
            approved_by: 'changes',
            operate_permission: true,
            can_run: true,
            jobs: [
              {
                name: 'promote-and-deploy',
                scheduled_date: 1642178467479,
                state: 'Completed',
                result: 'Passed',
              },
            ],
          },
        ],
      },
    ],
  },
};

describe('<GoCdBuildsInsights />', () => {
  it('renders without exploding', () => {
    const { getByText } = render(<GoCdBuildsInsights {...minProps} />);
    expect(getByText('Run Frequency')).toBeInTheDocument();
    expect(getByText('Mean Time to Recovery')).toBeInTheDocument();
    expect(getByText('Mean Time Between Failures')).toBeInTheDocument();
    expect(getByText('Failure Rate')).toBeInTheDocument();
  });

  it('renders mean time to recovery', () => {
    const { getByText } = render(<GoCdBuildsInsights {...minProps} />);
    expect(getByText('-1d -3h -21m -40s')).toBeInTheDocument();
  });

  it('renders mean time between failures', () => {
    const { getByText } = render(<GoCdBuildsInsights {...minProps} />);
    expect(getByText('2d 8h 23m 20s')).toBeInTheDocument();
  });

  it('renders failure rate', () => {
    const { getByText } = render(<GoCdBuildsInsights {...minProps} />);
    expect(getByText('11.11%')).toBeInTheDocument();
    expect(getByText('(2 out of 18 jobs)')).toBeInTheDocument();
  });

  it('renders nothing when loading', () => {
    const props = {
      loading: true,
      pipelineHistory: undefined,
      error: undefined,
    };
    const { getByTestId } = render(<GoCdBuildsInsights {...props} />);

    expect(() => getByTestId('GoCdBuildsInsightsBox')).toThrow();
  });
});
