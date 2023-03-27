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
import {
  DismissableBanner,
  LogViewer,
  Progress,
} from '@backstage/core-components';
import React from 'react';

import { ContainerLogContext } from './types';
import { usePodLogs } from './usePodLogs';

interface PodLogsProps {
  previous?: boolean;
  logContext: ContainerLogContext;
}

export const PodLogs: React.FC<PodLogsProps> = ({
  previous,
  logContext,
}: PodLogsProps) => {
  const { value, error, loading } = usePodLogs({
    logContext: logContext,
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
      <div style={{ height: '50rem', width: '100rem' }}>
        {/* TODO Make this a skeleton? */}
        {loading && <Progress />}
        {!loading && value !== undefined && <LogViewer text={value} />}
      </div>
    </>
  );
};
