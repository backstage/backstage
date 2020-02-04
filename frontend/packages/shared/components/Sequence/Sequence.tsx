import React, { Fragment, FC, useState } from 'react';
import { Stepper, Step, StepContent, StepLabel, Typography, withStyles } from '@material-ui/core';
import SequenceFooter from './SequenceFooter';

type Orientation = 'horizontal' | 'vertical';

export type StepActions = {
  showNext?: boolean;
  canNext?: () => boolean;
  onNext?: () => void;
  nextStep?: () => number;
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
type SequenceProps = {
  completed: StepType;
  classes: any;
  elevation?: boolean;
  orientation: Orientation;
  onSequenceStepChange?: (prevIndex: number, nextIndex: number) => void;
  steps: StepType[];
};

const Sequence: FC<SequenceProps> = ({ completed, classes, elevation, orientation, onSequenceStepChange, steps }) => {
  const [stepIndex, setStepIndex] = useState<number>(0);
  const [stepArray, setStepArray] = useState<number[]>([0]);
  const isVertical = orientation === 'vertical';
  const horizontalStep = !isVertical && steps[stepIndex] ? steps[stepIndex].content : false;

  return (
    <Fragment>
      <Stepper activeStep={stepIndex} orientation={orientation} elevation={elevation ? 2 : 0}>
        {steps.map((step, i) => (
          <Step key={`step${i}`}>
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
                />
              </StepContent>
            )}
          </Step>
        ))}
      </Stepper>
      {stepIndex === steps.length && !!completed && (
        <div key="completed" className={classes.completionBox}>
          <Typography variant="h6"> {completed.title} </Typography>
          {completed.content}
          <SequenceFooter
            stepIndex={stepIndex}
            setStepIndex={setStepIndex}
            stepArray={stepArray}
            setStepArray={setStepArray}
            actions={{ ...(completed.actions || {}), showNext: false }}
          >
            {completed.actions && completed.actions.completedButton}
          </SequenceFooter>
        </div>
      )}
      {/* Horizontal steppers have buttons on the bottom of stepper */}
      {!isVertical && (
        <>
          {horizontalStep}
          <SequenceFooter
            stepIndex={stepIndex}
            setStepIndex={setStepIndex}
            stepArray={stepArray}
            setStepArray={setStepArray}
            length={steps.length}
            onSequenceStepChange={onSequenceStepChange}
            actions={steps[stepIndex].actions || {}}
          />
        </>
      )}
    </Fragment>
  );
};

const styles = (theme: any) => ({
  completionBox: {
    padding: theme.spacing(3),
  },
});

export default withStyles(styles)(Sequence);
