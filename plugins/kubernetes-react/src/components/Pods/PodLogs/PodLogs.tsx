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
import { FC } from 'react';

import {
  DismissableBanner,
  EmptyState,
  LogViewer,
} from '@backstage/core-components';
import Paper from '@material-ui/core/Paper';
import Skeleton from '@material-ui/lab/Skeleton';

import { ContainerScope } from './types';
import { usePodLogs } from './usePodLogs';

/**
 * Props for PodLogs
 *
 * @public
 */
export interface PodLogsProps {
  containerScope: ContainerScope;
  previous?: boolean;
}

/**
 * Shows the logs for the given pod
 *
 * @public
 */
export const PodLogs: FC<PodLogsProps> = ({
  containerScope,
  previous,
}: PodLogsProps) => {
  const { value, error, loading } = usePodLogs({
    containerScope,
    previous,
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
        style={{ height: '100%', width: '100%', minHeight: '55rem' }}
      >
        {loading && <Skeleton variant="rect" width="100%" height="100%" />}
        {!loading &&
          value !== undefined &&
          (value.text === '' ? (
            <EmptyState
              missing="data"
              title="No logs emitted"
              description="No logs were emitted by the container"
            />
          ) : (
            <LogViewer text={value.text} />
          ))}
      </Paper>
    </>
  );
};
