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
import React, { FC, ReactNode } from 'react';
import { Button, makeStyles } from '@material-ui/core';
import { StepActions } from './Sequence';

const useStyles = makeStyles(theme => ({
  root: {
    marginTop: theme.spacing(3),
    '& button': {
      marginRight: theme.spacing(1),
    },
  },
}));

export const RestartBtn: FC<{
  text?: string;
  handleClick?: () => void;
  stepIndex: number;
}> = ({ text, handleClick }) => (
  <Button onClick={handleClick}>{text || 'Reset'}</Button>
);
const NextBtn: FC<{
  text?: string;
  handleClick?: () => void;
  disabled?: boolean;
  last?: boolean;
  stepIndex: number;
}> = ({ text, handleClick, disabled, last, stepIndex }) => (
  <Button
    variant="contained"
    color="primary"
    disabled={disabled}
    data-testid={`nextButton-${stepIndex}`}
    onClick={handleClick}
  >
    {text || (last ? 'Finish' : 'Next')}
  </Button>
);
const BackBtn: FC<{
  text?: string;
  handleClick?: () => void;
  disabled?: boolean;
  stepIndex: number;
}> = ({ text, handleClick, disabled, stepIndex }) => (
  <Button
    onClick={handleClick}
    data-testid={`backButton-${stepIndex}`}
    disabled={disabled}
  >
    {text || 'Back'}
  </Button>
);

export type SequenceFooterProps = {
  stepIndex: number;
  setStepIndex: React.Dispatch<React.SetStateAction<number>>;
  stepArray: number[];
  setStepArray: React.Dispatch<React.SetStateAction<number[]>>;
  length: number;
  actions: StepActions;
  onSequenceStepChange?: (old: number, updated: number) => void;
  children?: ReactNode;
  className: string;
};

const SequenceFooter: FC<SequenceFooterProps> = ({
  stepIndex,
  setStepIndex,
  stepArray,
  setStepArray,
  length,
  onSequenceStepChange,
  actions,
  children,
  className,
}) => {
  const classes = useStyles();

  const onChange = (newIndex: number, callback?: () => void) => {
    if (callback) {
      callback();
    }
    if (onSequenceStepChange) {
      onSequenceStepChange(stepIndex, newIndex);
    }

    setStepIndex(newIndex);
  };

  const handleNext = () => {
    const newIndex = actions.nextStep
      ? actions.nextStep(stepIndex, length - 1)
      : stepIndex + 1;
    onChange(newIndex, actions.onNext);
    setStepArray([...stepArray, newIndex]);
  };
  const handleBack = () => {
    stepArray.pop();
    onChange(stepArray[stepArray.length - 1], actions.onBack);
    setStepArray([...stepArray]);
  };
  const handleRestart = () => {
    onChange(0, actions.onRestart);
    setStepArray([0]);
  };

  return (
    <div className={`${classes.root} ${className}`}>
      {[undefined, true].includes(actions.showBack) && stepIndex !== 0 && (
        <BackBtn
          text={actions.backText}
          handleClick={handleBack}
          disabled={stepIndex === 0}
          stepIndex={stepIndex}
        />
      )}
      {[undefined, true].includes(actions.showNext) && (
        <NextBtn
          text={actions.nextText}
          handleClick={handleNext}
          disabled={
            (!!length && stepIndex >= length) ||
            (!!actions.canNext && !actions.canNext())
          }
          stepIndex={stepIndex}
        />
      )}
      {actions.showRestart && stepIndex !== 0 && (
        <RestartBtn
          text={actions.restartText}
          handleClick={handleRestart}
          stepIndex={stepIndex}
        />
      )}
      {children}
    </div>
  );
};

export default SequenceFooter;
