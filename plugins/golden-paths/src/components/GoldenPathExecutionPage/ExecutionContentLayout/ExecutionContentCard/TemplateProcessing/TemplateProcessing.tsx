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
import { ComponentType } from 'react';
import { ErrorPanel } from '@backstage/core-components';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import Paper from '@material-ui/core/Paper';
import { ScaffolderTaskOutput } from '@backstage/plugin-scaffolder-common';
import {
  DefaultTemplateOutputs,
  TaskLogStream,
  TaskSteps,
} from '@backstage/plugin-scaffolder-react/alpha';
import { GoldenPathContextMenu } from '@backstage/plugin-golden-paths-react';

import { useTemplateProcessing } from './TemplateProcessing.utils';
import {
  Positioner,
  StyledInfoCard,
  TaskLogStreamContainer,
  useStyles,
} from './TemplateProcessing.styles';

type Props = {
  TemplateOutputsComponent?: ComponentType<{
    output?: ScaffolderTaskOutput;
  }>;
};

/**
 * @public
 */
export const TemplateProcessing = ({ TemplateOutputsComponent }: Props) => {
  const {
    activeStep,
    isRetryableTask,
    logsVisible,
    setLogVisibleState,
    startOver,
    steps,
    taskStream,
    triggerCancel,
    triggerRetry,
    templateTitle,
    templateSubtitle,
    isCancelButtonDisabled,
    isRetryButtonDisabled,
    isStartOverButtonDisabled,
    templateUrl,
    goldenPathStatus,
  } = useTemplateProcessing();

  const classes = useStyles();
  const Outputs = TemplateOutputsComponent ?? DefaultTemplateOutputs;
  return (
    <>
      {taskStream.error ? (
        <Box paddingBottom={2}>
          <ErrorPanel
            error={taskStream.error}
            titleFormat="markdown"
            title={taskStream.error.message}
          />
        </Box>
      ) : null}

      <Box paddingBottom={2}>
        <StyledInfoCard title={templateTitle} subheader={templateSubtitle}>
          {templateUrl && (
            <Positioner>
              <GoldenPathContextMenu taskConfigUrl={templateUrl} />
            </Positioner>
          )}

          <TaskSteps
            steps={steps}
            activeStep={activeStep}
            isComplete={taskStream.completed}
            isError={Boolean(taskStream.error)}
          />
        </StyledInfoCard>
      </Box>

      <Outputs output={taskStream.output} />

      <Box paddingBottom={2}>
        <Paper>
          <Box padding={2}>
            <div className={classes.buttonBar}>
              <Button
                className={classes.cancelButton}
                disabled={isCancelButtonDisabled}
                onClick={triggerCancel}
                data-testid="cancel-button"
              >
                Cancel
              </Button>
              {isRetryableTask && (
                <Button
                  className={classes.retryButton}
                  disabled={isRetryButtonDisabled}
                  onClick={triggerRetry}
                  data-testid="retry-button"
                >
                  Retry
                </Button>
              )}
              <Button
                className={classes.logsVisibilityButton}
                color="primary"
                variant="outlined"
                onClick={() => setLogVisibleState(!logsVisible)}
              >
                {logsVisible ? 'Hide Logs' : 'Show Logs'}
              </Button>
              <Button
                variant="contained"
                color="primary"
                disabled={
                  goldenPathStatus === 'cancelled' ||
                  goldenPathStatus === 'completed' ||
                  isStartOverButtonDisabled
                }
                onClick={startOver}
                data-testid="start-over-button"
              >
                Start Over
              </Button>
            </div>
          </Box>
        </Paper>
      </Box>

      {logsVisible ? (
        <Paper style={{ height: '100%' }}>
          <TaskLogStreamContainer>
            <TaskLogStream logs={taskStream.stepLogs} />
          </TaskLogStreamContainer>
        </Paper>
      ) : null}
    </>
  );
};
