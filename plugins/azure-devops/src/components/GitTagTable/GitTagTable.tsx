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

import { Box, Chip } from '@material-ui/core';
import {
  Link,
  ResponseErrorPanel,
  Table,
  TableColumn,
} from '@backstage/core-components';
import {
  PullRequest,
  PullRequestStatus,
} from '@backstage/plugin-azure-devops-common';
import React, { useState } from 'react';

import { AzurePullRequestsIcon } from '../AzurePullRequestsIcon';
import { DateTime } from 'luxon';
import { PullRequestStatusButtonGroup } from '../PullRequestStatusButtonGroup';
import { useEntity } from '@backstage/plugin-catalog-react';
import { useGitTags } from '../../hooks/useGitTags';

const columns: TableColumn[] = [
  {
    title: 'Tag',
    field: 'name',
    highlight: false,
    width: 'auto',
  },
  {
    title: 'Commit',
    field: 'peeledObjectId',
    width: 'auto',
  },
  {
    title: 'Created By',
    field: 'createdBy',
    width: 'auto',
  },
];

type PullRequestTableProps = {
  defaultLimit?: number;
};

export const GitTagTable = ({ defaultLimit }: PullRequestTableProps) => {
  const [pullRequestStatusState, setPullRequestStatusState] =
    useState<PullRequestStatus>(PullRequestStatus.Active);
  const { entity } = useEntity();

  const { items, loading, error } = useGitTags(
    entity,
    defaultLimit,
    pullRequestStatusState,
  );

  if (error) {
    return (
      <div>
        <ResponseErrorPanel error={error} />
      </div>
    );
  }

  return (
    <Table
      isLoading={loading}
      columns={columns}
      options={{
        search: true,
        paging: true,
        pageSize: 5,
        showEmptyDataSourceMessage: !loading,
      }}
      title={
        <Box display="flex" alignItems="center">
          <AzurePullRequestsIcon style={{ fontSize: 30 }} />
          <Box mr={1} />
          Azure Repos - Git Tags ({items ? items.length : 0})
          <Box position="absolute" right={320} top={20}>
            <PullRequestStatusButtonGroup
              status={pullRequestStatusState}
              setStatus={setPullRequestStatusState}
            />
          </Box>
        </Box>
      }
      data={items ?? []}
    />
  );
};
