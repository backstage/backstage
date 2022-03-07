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
  Progress,
  ResponseErrorPanel,
} from '@backstage/core-components';
import { PullRequestColumnConfig, PullRequestGroup } from './lib/types';
import React, { useState } from 'react';
import { getPullRequestGroupConfigs, getPullRequestGroups } from './lib/utils';

import { FilterType } from './lib/filters';
import { PullRequestGrid } from './lib/PullRequestGrid';
import { useDashboardPullRequests } from '../../hooks';
import { useFilterProcessor } from './lib/hooks';

type PullRequestsPageContentProps = {
  pullRequestGroups: PullRequestGroup[] | undefined;
  loading: boolean;
  error?: Error;
};

const PullRequestsPageContent = ({
  pullRequestGroups,
  loading,
  error,
}: PullRequestsPageContentProps) => {
  if (loading && (!pullRequestGroups || pullRequestGroups.length <= 0)) {
    return <Progress />;
  }

  if (error) {
    return <ResponseErrorPanel error={error} />;
  }

  return <PullRequestGrid pullRequestGroups={pullRequestGroups ?? []} />;
};

const DEFAULT_COLUMN_CONFIGS: PullRequestColumnConfig[] = [
  {
    title: 'Created by me',
    filters: [{ type: FilterType.CreatedByCurrentUser }],
    simplified: false,
  },
  {
    title: 'Other PRs',
    filters: [{ type: FilterType.All }],
    simplified: true,
  },
];

type PullRequestsPageProps = {
  projectName?: string;
  pollingInterval?: number;
  defaultColumnConfigs?: PullRequestColumnConfig[];
};

export const PullRequestsPage = ({
  projectName,
  pollingInterval,
  defaultColumnConfigs,
}: PullRequestsPageProps) => {
  const { pullRequests, loading, error } = useDashboardPullRequests(
    projectName,
    pollingInterval,
  );

  const [columnConfigs] = useState(
    defaultColumnConfigs ?? DEFAULT_COLUMN_CONFIGS,
  );

  const filterProcessor = useFilterProcessor();

  const pullRequestGroupConfigs = getPullRequestGroupConfigs(
    columnConfigs,
    filterProcessor,
  );

  const pullRequestGroups = getPullRequestGroups(
    pullRequests,
    pullRequestGroupConfigs,
  );

  return (
    <Page themeId="tool">
      <Header title="Azure Pull Requests" />
      <Content>
        <PullRequestsPageContent
          pullRequestGroups={pullRequestGroups}
          loading={loading}
          error={error}
        />
      </Content>
    </Page>
  );
};
