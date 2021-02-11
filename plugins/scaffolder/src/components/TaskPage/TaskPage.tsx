/*
 * Copyright 2021 Spotify AB
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

import { Page, Header, Lifecycle, Content } from '@backstage/core';
import React, { useState, useEffect, memo, useMemo } from 'react';
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { useParams } from 'react-router';
import { useTaskEventStream } from '../hooks/useEventStream';
import LazyLog from 'react-lazylog/build/LazyLog';
import { StepButton, StepIconProps } from '@material-ui/core';
import { Status } from '../../types';
import { DateTime, Interval } from 'luxon';
import { useInterval } from 'react-use';

// typings are wrong for this library, so fallback to not parsing types.
const humanizeDuration = require('humanize-duration');

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      width: '100%',
    },
    button: {
      marginTop: theme.spacing(1),
      marginRight: theme.spacing(1),
    },
    actionsContainer: {
      marginBottom: theme.spacing(2),
    },
    resetContainer: {
      padding: theme.spacing(3),
    },
    labelWrapper: {
      display: 'flex',
      flex: 1,
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    stepWrapper: {
      width: '100%',
    },
  }),
);

type TaskS = {
  id: string;
  name: string;
  status: Status;
  startedAt?: string;
  endedAt?: string;
};

const StepTimeTicker = ({ step }: { step: TaskS }) => {
  const [time, setTime] = useState('');

  useInterval(() => {
    if (!step.startedAt) {
      setTime('');
      return;
    }

    const end = step.endedAt
      ? DateTime.fromISO(step.endedAt)
      : DateTime.local();

    const startedAt = DateTime.fromISO(step.startedAt);
    const formatted = Interval.fromDateTimes(startedAt, end)
      .toDuration()
      .valueOf();

    setTime(humanizeDuration(formatted, { round: true }));
  }, 1000);

  return <Typography variant="caption">{time}</Typography>;
};

export const TaskStatusStepper = memo(
  ({
    steps,
    currentStepId,
    onUserStepChange,
  }: {
    steps: TaskS[];
    currentStepId: string | undefined;
    onUserStepChange: (id: string) => void;
  }) => {
    const classes = useStyles();

    return (
      <div className={classes.root}>
        <Stepper
          activeStep={steps.findIndex(s => s.id === currentStepId)}
          orientation="vertical"
          nonLinear
        >
          {steps.map((step, index) => {
            const isCompleted = step.status === 'completed';
            const isFailed = step.status === 'failed';
            return (
              <Step key={String(index)} expanded>
                <StepButton onClick={() => onUserStepChange(step.id)}>
                  <StepLabel
                    StepIconProps={{ completed: isCompleted, error: isFailed }}
                    className={classes.stepWrapper}
                  >
                    <div className={classes.labelWrapper}>
                      <Typography variant="subtitle2">{step.name}</Typography>
                      <StepTimeTicker step={step} />
                    </div>
                  </StepLabel>
                </StepButton>
              </Step>
            );
          })}
        </Stepper>
      </div>
    );
  },
);

const TaskLogger = memo(({ log }: { log: string }) => {
  return (
    <div style={{ height: '80vh' }}>
      <LazyLog text={log} extraLines={1} follow />
    </div>
  );
});

export const TaskPage = () => {
  const [userSelectedStepId, setUserSelectedStepId] = useState<
    string | undefined
  >(undefined);
  const [lastActiveStepId, setLastActiveStepId] = useState<string | undefined>(
    undefined,
  );
  const { taskId } = useParams();
  const taskStream = useTaskEventStream(taskId);
  const completed = taskStream.completed;

  const steps = useMemo(
    () =>
      taskStream.task?.spec.steps.map(step => ({
        ...step,
        ...taskStream?.steps?.[step.id],
      })) ?? [],
    [taskStream],
  );
  useEffect(() => {
    const activeStep = steps.find(step =>
      ['failed', 'processing'].includes(step.status),
    );

    if (completed) {
      setLastActiveStepId(steps[steps.length - 1]?.id);
      return;
    }

    setLastActiveStepId(activeStep?.id);
  }, [steps, completed]);

  const currentStepId = userSelectedStepId ?? lastActiveStepId;

  const logAsString = useMemo(() => {
    if (!currentStepId) {
      return 'Loading...';
    }
    const log = taskStream.stepLogs[currentStepId];

    if (!log?.length) {
      return 'Waiting for logs...';
    }
    return log.join('\n');
  }, [taskStream.stepLogs, currentStepId]);

  return (
    <Page themeId="home">
      <Header
        pageTitleOverride={`Task ${taskId}`}
        title={
          <>
            Task Activity <Lifecycle alpha shorthand />
          </>
        }
        subtitle={`Activity for task: ${taskId}`}
      />
      <Content>
        <Grid container>
          <Grid item xs={4}>
            <TaskStatusStepper
              steps={steps}
              currentStepId={currentStepId}
              onUserStepChange={setUserSelectedStepId}
            />
          </Grid>
          <Grid item xs={8}>
            <TaskLogger log={logAsString} />
          </Grid>
        </Grid>
      </Content>
    </Page>
  );
};
