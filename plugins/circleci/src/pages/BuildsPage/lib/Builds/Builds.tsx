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

import React, { FC } from 'react';

// import Alert from '@material-ui/lab/Alert';
// import { Progress } from '@backstage/core';

import { BuildSummary } from 'circleci-api';

import { CITable, CITableBuildInfo } from '../CITable';
import { useSelector, useDispatch } from 'react-redux';
import { iRootState, Dispatch } from 'state/store';
import { useApi } from '@backstage/core';
import { circleCIApiRef } from 'api';
// "lifecycle" : "finished", // :queued, :scheduled, :not_run, :not_running, :running or :finished
// "outcome" : "failed", // :canceled, :infrastructure_fail, :timedout, :failed, :no_tests or :success

const makeReadableStatus = (status: string | undefined) => {
  if (typeof status === 'undefined') return '';
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
  } as Record<string, string>)[status];
};

const transform = (
  buildsData: BuildSummary[],
  dispatch: Dispatch,
  api: typeof circleCIApiRef.T,
): CITableBuildInfo[] => {
  return buildsData.map((buildData) => {
    const tableBuildInfo: CITableBuildInfo = {
      id: String(buildData.build_num),
      buildName: buildData.subject
        ? buildData.subject +
          (buildData.retry_of ? ` (retry of #${buildData.retry_of})` : '')
        : '',
      onRetryClick: () =>
        dispatch.builds.restartBuild({ buildId: buildData.build_num, api }),
      source: {
        branchName: String(buildData.branch),
        commit: {
          hash: String(buildData.vcs_revision),
          url: 'todo',
        },
      },
      status: makeReadableStatus(buildData.status),
      buildUrl: buildData.build_url,
      // tests: {
      //   failed: 0,
      //   passed: 10,
      //   skipped: 3,
      //   testUrl: 'nourlnow',
      //   total: 13,
      // },
    };
    return tableBuildInfo;
  });
};

export const Builds: FC<{}> = () => {
  const dispatch: Dispatch = useDispatch();
  const api = useApi(circleCIApiRef);

  React.useEffect(() => {
    dispatch.builds.startPolling(api);
    return () => {
      dispatch.builds.stopPolling();
    };
  }, []);
  const { builds } = useSelector((state: iRootState) => state.builds);
  const { repo, owner } = useSelector((state: iRootState) => state.settings);
  const transformedBuilds = transform(builds, dispatch, api);

  return (
    <CITable builds={transformedBuilds} projectName={`${owner}/${repo}`} />
  );
};
