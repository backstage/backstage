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

/**
 * The props for the Task Step Viewer in scaffolder template form.
 * It represents the right panel on the scaffolder template execution screen.
 *
 * @public
 */
export type TaskStepViewerProps = {
  currentStepId: string | undefined;
  loadingText: string | undefined;
  taskStream: {
    error?: Error;
    stepLogs: { [stepId in string]: string[] };
  };
};

/**
 * The component displaying the information about the running task step.
 * It includes the logs and the error messages.
 * This component can be replaced by your own custom component as well.
 *
 * @param currentStepId - Currently executed step in the template.
 * @param loadingText - Shown text to the user when data is being loaded. If not specified, 'Loading...' will be shown.
 * @param taskStream - The stream of the task, containing all information about the task including steps information.
 *
 * @public
 */
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
