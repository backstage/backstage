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
import { Page, Header, Content, ErrorPanel } from '@backstage/core-components';
import { useNavigate, useParams } from 'react-router-dom';
import { Box, makeStyles, Paper } from '@material-ui/core';
import {
  TaskSteps,
  TaskBorder,
  TaskLogStream,
  ScaffolderTaskOutput,
  useTaskEventStream,
} from '@backstage/plugin-scaffolder-react';
import { nextSelectedTemplateRouteRef } from '../routes';
import { useRouteRef } from '@backstage/core-plugin-api';
import qs from 'qs';
import { ContextMenu } from './ContextMenu';
import { DefaultTemplateOutputs } from '@backstage/plugin-scaffolder-react/alpha';

const useStyles = makeStyles({
  contentWrapper: {
    display: 'flex',
    flexDirection: 'column',
  },
});

export const OngoingTask = (props: {
  TemplateOutputsComponent?: React.ComponentType<{
    output?: ScaffolderTaskOutput;
  }>;
}) => {
  // todo(blam): check that task Id actually exists, and that it's valid. otherwise redirect to something more useful.
  const { taskId } = useParams();
  const templateRouteRef = useRouteRef(nextSelectedTemplateRouteRef);
  const navigate = useNavigate();
  const taskStream = useTaskEventStream(taskId!);
  const classes = useStyles();
  const steps = useMemo(
    () =>
      taskStream.task?.spec.steps.map(step => ({
        ...step,
        ...taskStream?.steps?.[step.id],
      })) ?? [],
    [taskStream],
  );

  const [logsVisible, setLogVisibleState] = useState(false);

  useEffect(() => {
    if (taskStream.error) {
      setLogVisibleState(true);
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

  const Outputs = props.TemplateOutputsComponent ?? DefaultTemplateOutputs;

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
      >
        <ContextMenu
          onToggleLogs={setLogVisibleState}
          onStartOver={startOver}
          logsVisible={logsVisible}
        />
      </Header>
      <Content className={classes.contentWrapper}>
        {taskStream.error ? (
          <Box paddingBottom={2}>
            <ErrorPanel
              error={taskStream.error}
              title={taskStream.error.message}
            />
          </Box>
        ) : null}

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

        <Outputs output={taskStream.output} />

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
