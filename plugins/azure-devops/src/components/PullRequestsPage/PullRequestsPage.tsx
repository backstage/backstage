/*
 * Copyright 2021 The Backstage Authors
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
  Content,
  Header,
  Page,
  ResponseErrorPanel,
} from '@backstage/core-components';
import { PullRequestGroup, PullRequestGroupConfig } from './lib/types';
import React, { useEffect, useState } from 'react';
import { getCreatedByUserFilter, getPullRequestGroups } from './lib/utils';
import { useDashboardPullRequests, useUserEmail } from '../../hooks';

import { DashboardPullRequest } from '@backstage/plugin-azure-devops-common';
import { PullRequestGrid } from './lib/PullRequestGrid';

/**
 * @deprecated TEMPORARY - This will be configurable in a follow up PR.
 */
const PROJECT_NAME = 'projectName';

function usePullRequestGroupConfigs(
  userEmail: string | undefined,
): PullRequestGroupConfig[] {
  const [pullRequestGroupConfigs, setPullRequestGroupConfigs] = useState<
    PullRequestGroupConfig[]
  >([]);

  useEffect(() => {
    const prGroupConfigs: PullRequestGroupConfig[] = [
      { title: 'Created by me', filter: getCreatedByUserFilter(userEmail) },
      { title: 'Other PRs', filter: _ => true, simplified: false },
    ];

    setPullRequestGroupConfigs(prGroupConfigs);
  }, [userEmail]);

  return pullRequestGroupConfigs;
}

function usePullRequestGroups(
  pullRequests: DashboardPullRequest[] | undefined,
  pullRequestGroupConfigs: PullRequestGroupConfig[],
): PullRequestGroup[] {
  const [pullRequestGroups, setPullRequestGroups] = useState<
    PullRequestGroup[]
  >([]);

  useEffect(() => {
    if (pullRequests) {
      const groups = getPullRequestGroups(
        pullRequests,
        pullRequestGroupConfigs,
      );
      setPullRequestGroups(groups);
    }
  }, [pullRequests, pullRequestGroupConfigs]);

  return pullRequestGroups;
}

export const PullRequestsPage = () => {
  const { pullRequests, error } = useDashboardPullRequests(PROJECT_NAME);
  const userEmail = useUserEmail();
  const pullRequestGroupConfigs = usePullRequestGroupConfigs(userEmail);
  const pullRequestGroups = usePullRequestGroups(
    pullRequests,
    pullRequestGroupConfigs,
  );

  const pullRequestsContent = error ? (
    <ResponseErrorPanel error={error} />
  ) : (
    <PullRequestGrid pullRequestGroups={pullRequestGroups} />
  );

  return (
    <Page themeId="tool">
      <Header title="Azure Pull Requests" />
      <Content>{pullRequestsContent}</Content>
    </Page>
  );
};
