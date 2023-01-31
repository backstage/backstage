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
import React, { useEffect, useMemo, useState, useCallback } from 'react';
import { Page, Header, Content } from '@backstage/core-components';
import { useTaskEventStream } from '../../components/hooks/useEventStream';
import { useNavigate, useParams } from 'react-router-dom';
import { Box, Button, Paper } from '@material-ui/core';
import { TaskSteps } from './TaskSteps';
import { TaskBorder } from './TaskBorder';
import { TaskLogStream } from './TaskLogStream';
import { nextSelectedTemplateRouteRef } from '../routes';
import { useRouteRef } from '@backstage/core-plugin-api';
import qs from 'qs';
import { DefaultOutputs } from './Outputs';

export const OngoingTask = () => {
  // todo(blam): check that task Id actually exists, and that it's valid. otherwise redirect to something more useful.
  const { taskId } = useParams();
  const templateRouteRef = useRouteRef(nextSelectedTemplateRouteRef);
  const navigate = useNavigate();
  const taskStream = useTaskEventStream(taskId!);
  const steps = useMemo(
    () =>
      taskStream.task?.spec.steps.map(step => ({
        ...step,
        ...taskStream?.steps?.[step.id],
      })) ?? [],
    [taskStream],
  );

  const [logsVisible, setLogsVisible] = useState(false);

  useEffect(() => {
    if (taskStream.error) {
      setLogsVisible(true);
    }
  }, [taskStream.error]);

  const activeStep = useMemo(() => {
    for (let i = steps.length - 1; i >= 0; i--) {
      if (steps[i].status !== 'open') {
        return i;
      }
    }

    return 0;
  }, [steps]);

  const startOver = useCallback(() => {
    const { namespace, name } =
      taskStream.task?.spec.templateInfo?.entity?.metadata ?? {};

    const formData = taskStream.task?.spec.parameters ?? {};

    if (!namespace || !name) {
      return;
    }

    navigate({
      pathname: templateRouteRef({
        namespace,
        templateName: name,
      }),
      search: `?${qs.stringify({ formData: JSON.stringify(formData) })}`,
    });
  }, [
    navigate,
    taskStream.task?.spec.parameters,
    taskStream.task?.spec.templateInfo?.entity?.metadata,
    templateRouteRef,
  ]);

  const templateName =
    taskStream.task?.spec.templateInfo?.entity?.metadata.name;

  return (
    <Page themeId="website">
      <Header
        pageTitleOverride={`Run of ${templateName}`}
        title={
          <div>
            Run of <code>{templateName}</code>
          </div>
        }
        subtitle={`Task ${taskId}`}
      />
      <Content>
        <Box paddingBottom={2}>
          <Paper style={{ position: 'relative', overflow: 'hidden' }}>
            <TaskBorder
              isComplete={taskStream.completed}
              isError={Boolean(taskStream.error)}
            />
            <Box padding={2}>
              <TaskSteps steps={steps} activeStep={activeStep} />
            </Box>
          </Paper>
        </Box>
        <DefaultOutputs output={taskStream.output} />
        <Box paddingBottom={2}>
          <Paper>
            <Box
              padding={2}
              justifyContent="flex-end"
              display="flex"
              gridGap={16}
            >
              <Button variant="contained" color="primary" onClick={startOver}>
                Start over
              </Button>
              <Button
                variant="contained"
                color="primary"
                onClick={() => setLogsVisible(!logsVisible)}
              >
                {logsVisible ? 'Hide logs' : 'Show logs'}
              </Button>
            </Box>
          </Paper>
        </Box>
        {logsVisible ? (
          <Box paddingBottom={2} height="100%">
            <Paper style={{ height: '100%' }}>
              <Box padding={2} height="100%">
                <TaskLogStream logs={taskStream.stepLogs} />
              </Box>
            </Paper>
          </Box>
        ) : null}
      </Content>
    </Page>
  );
};
