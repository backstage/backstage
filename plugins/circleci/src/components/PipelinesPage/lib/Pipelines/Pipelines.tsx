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
import { Box, IconButton, Typography } from '@material-ui/core';
import { GitHubIcon, InfoCard } from '@backstage/core-components';
import RefreshIcon from '@material-ui/icons/Refresh';
import { CITable } from '../CITable';
import { usePipelines } from '../../../../hooks';

export const Pipelines = () => {
  const [
    { loading, pipelines = [], projectName, hasMore },
    { fetchMore, rerunWorkflow, reload },
  ] = usePipelines();

  return (
    <InfoCard
      title={
        <Box display="flex" alignItems="center">
          <GitHubIcon />
          <Box mr={1} />
          <Typography variant="h6">{projectName}</Typography>
        </Box>
      }
      action={
        <IconButton onClick={reload}>
          <RefreshIcon />
        </IconButton>
      }
    >
      <CITable
        loading={loading}
        rerunWorkflow={rerunWorkflow}
        projectName={projectName}
        pipelines={pipelines}
        onFetchMore={fetchMore}
        hasMore={hasMore}
      />
    </InfoCard>
  );
};
