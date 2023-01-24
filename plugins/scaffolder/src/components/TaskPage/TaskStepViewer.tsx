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

import React, { useMemo } from 'react';
import { TaskErrors } from './TaskErrors';
import { LogViewer, Progress } from '@backstage/core-components';
import { TaskStream } from '../hooks/useEventStream';

export type TaskStepViewerProps = {
  currentStepId: string | undefined;
  loadingText: string | undefined;
  taskStream: TaskStream;
};

export const TaskStepViewer = ({
  currentStepId,
  loadingText,
  taskStream,
}: TaskStepViewerProps) => {
  const logAsString = useMemo(() => {
    if (!currentStepId) {
      return loadingText ? loadingText : 'Loading...';
    }
    const log = taskStream.stepLogs[currentStepId];

    if (!log?.length) {
      return 'Waiting for logs...';
    }
    return log.join('\n');
  }, [taskStream.stepLogs, currentStepId, loadingText]);

  return (
    <>
      {!currentStepId && <Progress />}

      <div style={{ height: '80vh' }}>
        <TaskErrors error={taskStream.error} />
        <LogViewer text={logAsString} />
      </div>
    </>
  );
};
