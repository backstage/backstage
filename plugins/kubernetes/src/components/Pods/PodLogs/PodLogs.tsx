/*
 * Copyright 2023 The Backstage Authors
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

import { DismissableBanner, LogViewer } from '@backstage/core-components';
import { Paper } from '@material-ui/core';
import { Skeleton } from '@material-ui/lab';

import { ContainerScope } from './types';
import { usePodLogs } from './usePodLogs';

interface PodLogsProps {
  logContext: ContainerScope;
}

export const PodLogs: React.FC<PodLogsProps> = ({
  logContext,
}: PodLogsProps) => {
  const { value, error, loading } = usePodLogs({
    logContext: logContext,
  });

  return (
    <>
      {error && (
        <DismissableBanner
          {...{
            message: error.message,
            variant: 'error',
            fixed: false,
          }}
          id="pod-logs"
        />
      )}
      <Paper
        elevation={1}
        style={{ height: '100%', width: '100%', minHeight: '30rem' }}
      >
        {loading && <Skeleton variant="rect" width="100%" height="100%" />}
        {!loading && value !== undefined && <LogViewer text={value.text} />}
      </Paper>
    </>
  );
};
