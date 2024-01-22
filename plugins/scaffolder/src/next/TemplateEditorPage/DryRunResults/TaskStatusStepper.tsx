/*
 * Copyright 2024 The Backstage Authors
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
import React, { useState } from 'react';
import { memo } from 'react';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import Stepper from '@material-ui/core/Stepper';
import { ScaffolderTaskStatus } from '@backstage/plugin-scaffolder-react';
import {
  StepButton,
  StepIconProps,
  Theme,
  createStyles,
  makeStyles,
  CircularProgress,
} from '@material-ui/core';
import Cancel from '@material-ui/icons/Cancel';
import Check from '@material-ui/icons/Check';
import FiberManualRecordIcon from '@material-ui/icons/FiberManualRecord';
import Typography from '@material-ui/core/Typography';
import { DateTime, Interval } from 'luxon';
import useInterval from 'react-use/lib/useInterval';
import humanizeDuration from 'humanize-duration';
import classNames from 'classnames';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      width: '100%',
    },
    button: {
      marginBottom: theme.spacing(2),
      marginLeft: theme.spacing(2),
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

type TaskStep = {
  id: string;
  name: string;
  status: ScaffolderTaskStatus;
  startedAt?: string;
  endedAt?: string;
};

const useStepIconStyles = makeStyles(theme =>
  createStyles({
    root: {
      color: theme.palette.text.disabled,
      display: 'flex',
      height: 22,
      alignItems: 'center',
    },
    completed: {
      color: theme.palette.status.ok,
    },
    error: {
      color: theme.palette.status.error,
    },
  }),
);

const StepTimeTicker = ({ step }: { step: TaskStep }) => {
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

function TaskStepIconComponent(props: StepIconProps) {
  const classes = useStepIconStyles();
  const { active, completed, error } = props;

  const getMiddle = () => {
    if (active) {
      return <CircularProgress size="24px" />;
    }
    if (completed) {
      return <Check />;
    }
    if (error) {
      return <Cancel />;
    }
    return <FiberManualRecordIcon />;
  };

  return (
    <div
      className={classNames(classes.root, {
        [classes.completed]: completed,
        [classes.error]: error,
      })}
    >
      {getMiddle()}
    </div>
  );
}

export const TaskStatusStepper = memo(
  (props: {
    steps: TaskStep[];
    currentStepId: string | undefined;
    onUserStepChange: (id: string) => void;
    classes?: {
      root?: string;
    };
  }) => {
    const { steps, currentStepId, onUserStepChange } = props;
    const classes = useStyles(props);

    return (
      <div className={classes.root}>
        <Stepper
          activeStep={steps.findIndex(s => s.id === currentStepId)}
          orientation="vertical"
          nonLinear
        >
          {steps.map((step, index) => {
            const isCancelled = step.status === 'cancelled';
            const isActive = step.status === 'processing';
            const isCompleted = step.status === 'completed';
            const isFailed = step.status === 'failed';
            const isSkipped = step.status === 'skipped';

            return (
              <Step key={String(index)} expanded>
                <StepButton onClick={() => onUserStepChange(step.id)}>
                  <StepLabel
                    StepIconProps={{
                      completed: isCompleted,
                      error: isFailed || isCancelled,
                      active: isActive,
                    }}
                    StepIconComponent={TaskStepIconComponent}
                    className={classes.stepWrapper}
                  >
                    <div className={classes.labelWrapper}>
                      <Typography variant="subtitle2">{step.name}</Typography>
                      {isSkipped ? (
                        <Typography variant="caption">Skipped</Typography>
                      ) : (
                        <StepTimeTicker step={step} />
                      )}
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
