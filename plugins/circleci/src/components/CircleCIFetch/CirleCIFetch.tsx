/*
 * Copyright 2020 Spotify AB
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in wr iting, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import React, { FC, useRef, useEffect } from 'react';

// import Alert from '@material-ui/lab/Alert';
import { useAsync } from 'react-use';
// import { Progress } from '@backstage/core';

import { CircleCI, GitType, CircleCIOptions, BuildSummary } from 'circleci-api';

import { CITable, CITableBuildInfo } from '../CITable';
const options: Partial<CircleCIOptions> = {
  // Required for all requests
  // token: CIRCLECI_TOKEN, // Set your CircleCi API token

  // Optional
  // Anything set here can be overriden when making the request

  // Git information is required for project/build/etc endpoints
  vcs: {
    type: GitType.GITHUB, // default: github
    owner: 'CircleCITest3',
    repo: 'circleci-test',
  },

  // Optional query params for requests
  // options: {
  //   branch: "master", // default: master
  // }
};

// "lifecycle" : "finished", // :queued, :scheduled, :not_run, :not_running, :running or :finished
// "outcome" : "failed", // :canceled, :infrastructure_fail, :timedout, :failed, :no_tests or :success

const makeReadableStatus = (status: string | undefined) => {
  if (typeof status === 'undefined') return ""
  return ({
    retried: 'Retried',
    canceled: 'Canceled',
    infrastructure_fail: 'Infra fail',
    timedout: 'Timedout',
    not_run: 'Not run',
    running: 'Running',
    failed: 'Failed',
    queued: 'Queued',
    scheduled: 'Scheduled',
    not_running: 'Not running',
    no_tests: 'No tests',
    fixed: 'Fixed',
    success: 'Success',
  } as Record<string, string>)[status]};

const transform = (buildsData: BuildSummary[]): CITableBuildInfo[] => {
  return buildsData.map(buildData => {
    const tableBuildInfo: CITableBuildInfo = {
      id: String(buildData.build_num),
      buildName: buildData.subject ? String(buildData.subject) : '',
      onRetriggerClick: () => null,
      source: {
        branchName: String(buildData.branch),
        commit: {
          hash: String(buildData.vcs_revision),
          url: 'todo',
        },
      },
      status: makeReadableStatus(buildData.status),
      tests: {
        failed: 0,
        passed: 10,
        skipped: 3,
        testUrl: 'nourlnow',
        total: 13,
      },
    };
    return tableBuildInfo;
  });
};

export const CircleCIFetch: FC<{ token: string }> = ({ token }) => {
  const api = useRef<CircleCI | null>(null);
  useEffect(() => {
    if (token !== '') api.current = new CircleCI({ ...options, token });
  }, [token]);

  const { value, loading, error } = useAsync(() => {
    if (api.current) return api.current.builds();
    return Promise.reject('Api token not provided');
  }, [token]);

  if (loading) return <div>loading</div>;
  if (error) return <div>{JSON.stringify(error, null, 2)}</div>;

  const builds = transform(value || []);
  return <CITable builds={builds} />;
};
