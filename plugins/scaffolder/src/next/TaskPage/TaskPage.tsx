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
import React, { useMemo } from 'react';
import { Page, Header, Content } from '@backstage/core-components';
import { useTaskEventStream } from '../../components/hooks/useEventStream';
import { useParams } from 'react-router-dom';
import { Box, LinearProgress, Paper } from '@material-ui/core';
import { TaskSteps } from './TaskSteps';

export const TaskPage = () => {
  const { taskId } = useParams();
  // check that task Id actually exists, and that it's valid. otherwise redirect to something more useful.
  const taskStream = useTaskEventStream(taskId!);
  const steps = useMemo(
    () =>
      taskStream.task?.spec.steps.map(step => ({
        ...step,
        ...taskStream?.steps?.[step.id],
      })) ?? [],
    [taskStream],
  );

  const activeStep = React.useMemo(() => {
    for (let i = steps.length - 1; i >= 0; i--) {
      if (steps[i].status !== 'open') {
        return i;
      }
    }

    return 0;
  }, [steps]);

  return (
    <Page themeId="website">
      <Header
        pageTitleOverride="Task ID"
        title="View Task"
        subtitle="View the status of a task"
      />
      <Content>
        <Paper style={{ position: 'relative', overflow: 'hidden' }}>
          <LinearProgress variant="indeterminate" value={100} />
          <Box padding={2}>
            <TaskSteps steps={steps} activeStep={activeStep} />
          </Box>
        </Paper>
      </Content>
    </Page>
  );
};
