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
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Content, ErrorPanel, Header, Page } from '@backstage/core-components';
import { useNavigate, useParams } from 'react-router-dom';
import { Box, Button, makeStyles, Paper } from '@material-ui/core';
import {
  ScaffolderTaskOutput,
  scaffolderApiRef,
  useTaskEventStream,
} from '@backstage/plugin-scaffolder-react';
import { selectedTemplateRouteRef } from '../../routes';
import { useApi, useRouteRef } from '@backstage/core-plugin-api';
import qs from 'qs';
import { ContextMenu } from './ContextMenu';
import {
  DefaultTemplateOutputs,
  TaskLogStream,
  TaskSteps,
} from '@backstage/plugin-scaffolder-react/alpha';
import { useAsync } from '@react-hookz/web';

const useStyles = makeStyles(theme => ({
  contentWrapper: {
    display: 'flex',
    flexDirection: 'column',
  },
  buttonBar: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'right',
  },
  cancelButton: {
    marginRight: theme.spacing(1),
  },
}));

export const OngoingTask = (props: {
  TemplateOutputsComponent?: React.ComponentType<{
    output?: ScaffolderTaskOutput;
  }>;
}) => {
  // todo(blam): check that task Id actually exists, and that it's valid. otherwise redirect to something more useful.
  const { taskId } = useParams();
  const templateRouteRef = useRouteRef(selectedTemplateRouteRef);
  const navigate = useNavigate();
  const scaffolderApi = useApi(scaffolderApiRef);
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
  const [buttonBarVisible, setButtonBarVisibleState] = useState(true);

  useEffect(() => {
    if (taskStream.error) {
      setLogVisibleState(true);
    }
  }, [taskStream.error]);

  useEffect(() => {
    if (taskStream.completed && !taskStream.error) {
      setButtonBarVisibleState(false);
    }
  }, [taskStream.error, taskStream.completed]);

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

  const [{ status: cancelStatus }, { execute: triggerCancel }] = useAsync(
    async () => {
      if (taskId) {
        await scaffolderApi.cancelTask(taskId);
      }
    },
  );

  const Outputs = props.TemplateOutputsComponent ?? DefaultTemplateOutputs;

  const templateName =
    taskStream.task?.spec.templateInfo?.entity?.metadata.name;

  const cancelEnabled = !(taskStream.cancelled || taskStream.completed);

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
          cancelEnabled={cancelEnabled}
          logsVisible={logsVisible}
          buttonBarVisible={buttonBarVisible}
          onStartOver={startOver}
          onToggleLogs={setLogVisibleState}
          onToggleButtonBar={setButtonBarVisibleState}
          taskId={taskId}
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
          <TaskSteps
            steps={steps}
            activeStep={activeStep}
            isComplete={taskStream.completed}
            isError={Boolean(taskStream.error)}
          />
        </Box>

        <Outputs output={taskStream.output} />

        {buttonBarVisible ? (
          <Box paddingBottom={2}>
            <Paper>
              <Box padding={2}>
                <div className={classes.buttonBar}>
                  <Button
                    className={classes.cancelButton}
                    disabled={!cancelEnabled || cancelStatus !== 'not-executed'}
                    onClick={triggerCancel}
                    data-testid="cancel-button"
                  >
                    Cancel
                  </Button>
                  <Button
                    variant="contained"
                    color="primary"
                    disabled={cancelEnabled}
                    onClick={startOver}
                  >
                    Start Over
                  </Button>
                </div>
              </Box>
            </Paper>
          </Box>
        ) : null}

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
