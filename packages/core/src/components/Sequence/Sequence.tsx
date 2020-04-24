/*
 * Copyright 2020 Spotify AB
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
import React, { Fragment, FC, useState } from 'react';
import {
  Stepper,
  Step,
  StepContent,
  StepLabel,
  Typography,
  makeStyles,
} from '@material-ui/core';
import SequenceFooter from './SequenceFooter';

const useStyles = makeStyles((theme: any) => ({
  content: {
    padding: theme.spacing(0, 4, 4, 4),
    backgroundColor: 'white',
  },
  completionBox: {
    padding: theme.spacing(3),
  },
}));

type Orientation = 'horizontal' | 'vertical';

export type StepActions = {
  showNext?: boolean;
  canNext?: () => boolean;
  onNext?: () => void;
  nextStep?: (current: number, last: number) => number;
  nextText?: string;

  showBack?: boolean;
  backText?: string;
  onBack?: () => void;

  showRestart?: boolean;
  canRestart?: () => boolean;
  onRestart?: () => void;
  restartText?: string;

  completedButton?: JSX.Element;
};

export type StepType = {
  title: string;
  actions?: StepActions;
  content: JSX.Element;
};

export interface SequenceProps {
  completed?: StepType;
  elevated?: boolean;
  orientation: Orientation;
  onSequenceStepChange?: (prevIndex: number, nextIndex: number) => void;
  steps: StepType[];
  footerProps?: any;
}

const Sequence: FC<SequenceProps> = ({
  completed,
  elevated,
  orientation,
  onSequenceStepChange,
  steps,
  footerProps,
}) => {
  const classes = useStyles();
  const [stepIndex, setStepIndex] = useState<number>(0);
  const [stepArray, setStepArray] = useState<number[]>([0]);
  const isVertical = orientation === 'vertical';
  const isCompleted = !!completed && stepIndex === steps.length;
  const horizontalStep = !isVertical && steps[stepIndex]?.content;

  return (
    <Fragment>
      <Stepper
        activeStep={stepIndex}
        orientation={orientation}
        elevation={elevated ? 2 : 0}
      >
        {steps.map((step, i) => (
          <Step key={i}>
            <StepLabel>
              <Typography variant="h6">{step.title}</Typography>
            </StepLabel>
            {isVertical && (
              <StepContent>
                {step.content}
                <SequenceFooter
                  stepIndex={i}
                  setStepIndex={setStepIndex}
                  stepArray={stepArray}
                  setStepArray={setStepArray}
                  length={steps.length}
                  onSequenceStepChange={onSequenceStepChange}
                  actions={step.actions || {}}
                  {...footerProps}
                />
              </StepContent>
            )}
          </Step>
        ))}
      </Stepper>
      {isCompleted && (
        <div key="completed" className={classes.completionBox}>
          <Typography variant="h6"> {completed?.title} </Typography>
          {completed?.content}
          <SequenceFooter
            stepIndex={stepIndex}
            setStepIndex={setStepIndex}
            stepArray={stepArray}
            setStepArray={setStepArray}
            length={steps.length}
            actions={{ ...(completed?.actions || {}), showNext: false }}
            {...footerProps}
          >
            {completed?.actions?.completedButton}
          </SequenceFooter>
        </div>
      )}
      {/* Horizontal steppers have buttons on the bottom of stepper */}
      {!isVertical && (
        <>
          <div className={classes.content}>
            {horizontalStep}
            <SequenceFooter
              stepIndex={stepIndex}
              setStepIndex={setStepIndex}
              stepArray={stepArray}
              setStepArray={setStepArray}
              length={steps.length}
              onSequenceStepChange={onSequenceStepChange}
              actions={steps[stepIndex]?.actions || {}}
              {...footerProps}
            />
          </div>
        </>
      )}
    </Fragment>
  );
};

export default Sequence;
