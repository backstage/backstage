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

const QontoConnector = withStyles({
  active: {
    '& $line': {
      borderColor: '#784af4',
    },
  },
  completed: {
    '& $line': {
      borderColor: '#784af4',
    },
  },
  line: {
    borderColor: '#eaeaf0',
    borderTopWidth: 3,
    borderRadius: 1,
  },
})(StepConnector);

const useQontoStepIconStyles = makeStyles({
  root: {
    color: '#eaeaf0',
    display: 'flex',
    height: 22,
    alignItems: 'center',
  },
  active: {
    color: 'grey',
  },
  error: {
    color: 'red',
  },
  circle: {
    width: 8,
    height: 8,
    borderRadius: '50%',
    backgroundColor: 'currentColor',
  },
  completed: {
    color: 'green',
    zIndex: 1,
    fontSize: 18,
  },
});

function QontoStepIcon(props: StepIconProps) {
  const classes = useQontoStepIconStyles();
  const { active, completed, error } = props;

  const getComponent = () => {
    if (error) {
      return <Cancel className={classes.error} />;
    }

    if (completed) {
      return <Check className={classes.completed} />;
    }

    if (active) {
      return <div className={classes.circle} />;
    }
    return undefined;
  };
  return (
    <div
      className={clsx(classes.root, {
        [classes.active]: active,
        [classes.error]: error,
      })}
    >
      {getComponent()}
    </div>
  );
}

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

export const TaskStepper = ({ steps }: { steps: Steps[] }) => {
  const classes = useStyles();
  const [activeStep, setActiveStep] = useState(0);
  const [expandAll, setExpandAll] = useState(false);

  const handleStep = (step: number) => {
    setExpandAll(false);
    setActiveStep(step);
  };

  useEffect(() => {
    const activeIndex = steps.findIndex(step =>
      ['failed', 'processing'].includes(step.status),
    );
    setActiveStep(2);
  }, [steps]);

  return (
    <div className={classes.root}>
      <Button variant="outlined" onClick={() => setExpandAll(true)}>
        Expand All
      </Button>
      <Button variant="outlined">Retry</Button>
      <Button variant="outlined">Raw Log</Button>
      <Stepper activeStep={activeStep} orientation="vertical" nonLinear>
        {steps.map((step, index) => {
          const isCompleted = step.status === 'completed';
          const isFailed = step.status === 'failed';
          // return (
          //   <TaskStep
          //     key={String(index)}
          //     log={step.log.length ? step.log.join('\n') : 'please wait'}
          //     expanded={expandAll}
          //     name={step.name}
          //     isFailed={isFailed}
          //     isCompleted={isCompleted}
          //     handleStep={handleStep}
          //     index={index}
          //   />
          // );

          return (
            <Step key={String(index)} expanded>
              <StepButton onClick={() => {}}>
                <StepLabel
                  StepIconProps={{ completed: isCompleted, error: isFailed }}
                  StepIconComponent={QontoStepIcon}
                >
                  {step.name}
                </StepLabel>
              </StepButton>

              <StepContent>
                <div style={{ height: '50vh' }}>
                  <LazyLog
                    extraLines={1}
                    text={step.log.length ? step.log.join('\n') : 'please wait'}
                  />
                </div>
              </StepContent>
            </Step>
          );
        })}
      </Stepper>
    </div>
  );
};

type TaskStepOptions = {
  name: string;
  isCompleted: boolean;
  isFailed: boolean;
  expanded: boolean;
  handleStep: () => void;
  index: number;
  log: string;
};

export const TaskStep = memo(
  ({
    log,
    name,
    isCompleted,
    isFailed,
    handleStep,
    index,
    expanded,
  }: TaskStepOptions) => {
    const onClick = React.useCallback(() => handleStep(index), [
      handleStep,
      index,
    ]);
    return (
      <Step key={String(index)} expanded={expanded}>
        <StepButton onClick={onClick}>
          <StepLabel
            StepIconProps={{ completed: isCompleted, error: isFailed }}
            StepIconComponent={QontoStepIcon}
          >
            {name}
          </StepLabel>
        </StepButton>

        <StepContent>
          <div style={{ height: '50vh' }}>
            <LazyLog extraLines={1} text={log} />
          </div>
        </StepContent>
      </Step>
    );
  },
);
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
        <TaskStepper steps={steps} />
      </Content>
    </Page>
  );
};
