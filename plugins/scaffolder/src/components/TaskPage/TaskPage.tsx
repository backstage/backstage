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
import React, { useState, useEffect, memo } from 'react';
import {
  makeStyles,
  Theme,
  createStyles,
  withStyles,
} from '@material-ui/core/styles';
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import StepContent from '@material-ui/core/StepContent';
import StepConnector from '@material-ui/core/StepConnector';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import Paper from '@material-ui/core/Paper';
import clsx from 'clsx';
import Check from '@material-ui/icons/Check';
import Cancel from '@material-ui/icons/Cancel';
import Typography from '@material-ui/core/Typography';
import { useParams } from 'react-router';
import {
  useTaskEventStream,
  TaskStream,
  Status,
} from '../hooks/useEventStream';
import LazyLog from 'react-lazylog/build/LazyLog';
import { StepButton, StepIconProps } from '@material-ui/core';

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
  }),
);

type Steps = {
  log: string[];
  id: string;
  name: string;
  status: Status;
};

export const TaskStatusStepper = memo(({ steps }: { steps: Steps[] }) => {
  const classes = useStyles();
  const [activeStep, setActiveStep] = useState(0);

  const handleStep = (step: number) => {
    setActiveStep(step);
  };

  useEffect(() => {
    const activeIndex = steps.findIndex(step =>
      ['failed', 'processing'].includes(step.status),
    );
    setActiveStep(activeIndex);
  }, [steps]);

  return (
    <div className={classes.root}>
      <Stepper activeStep={activeStep} orientation="vertical" nonLinear>
        {steps.map((step, index) => {
          const isCompleted = step.status === 'completed';
          const isFailed = step.status === 'failed';
          return (
            <Step key={String(index)} expanded>
              <StepButton onClick={() => {}}>
                <StepLabel
                  StepIconProps={{ completed: isCompleted, error: isFailed }}
                >
                  {step.name}
                </StepLabel>
              </StepButton>
            </Step>
          );
        })}
      </Stepper>
    </div>
  );
});

const TaskLogger = memo(({ log }: { log: string }) => {
  console.log('rendering my log');
  return (
    <div style={{ height: '80vh' }}>
      <LazyLog text={log} extraLines={1} follow />
    </div>
  );
});

const TaskActionsBar = () => {
  return (
    <>
      <Button variant="outlined">Retry</Button>
      <Button variant="outlined">Raw Log</Button>
    </>
  );
};

export const TaskPage = () => {
  const { taskId } = useParams();
  const taskStream = useTaskEventStream(taskId);
  const steps =
    taskStream.task?.spec.steps.map(step => ({
      ...step,
      ...taskStream?.steps?.[step.id],
    })) ?? [];

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
        <TaskActionsBar />
        <Grid container>
          <Grid item xs={2}>
            <TaskStatusStepper steps={steps} />
          </Grid>
          <Grid item xs={10}>
            <TaskLogger
              log={
                taskStream.log.length ? taskStream.log.join('\n') : 'loading...'
              }
            />
          </Grid>
        </Grid>
      </Content>
    </Page>
  );
};
