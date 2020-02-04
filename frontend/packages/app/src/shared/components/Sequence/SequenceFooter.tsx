import React, { FC, ReactNode } from 'react';
import { makeStyles } from '@material-ui/core';
import { StepActions } from 'shared/components/Sequence/Sequence';
import Button from 'shared/components/Button';

const useStyles = makeStyles(theme => ({
  root: {
    display: 'block',
    marginTop: theme.spacing(3),
  },
}));

export const RestartBtn: FC<{ text?: string; handleClick?: () => void; stepIndex: number }> = ({
  text,
  handleClick,
  stepIndex,
}) => (
  <Button data-testid={`restartButton-${stepIndex}`} color="initial" onClick={handleClick}>
    {text || 'Reset'}
  </Button>
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
    {text ? text : last ? 'Finish' : 'Next'}
  </Button>
);
const BackBtn: FC<{ text?: string; handleClick?: () => void; disabled?: boolean; stepIndex: number }> = ({
  text,
  handleClick,
  disabled,
  stepIndex,
}) => (
  <Button onClick={handleClick} data-testid={`backButton-${stepIndex}`} disabled={disabled}>
    {text || 'Back'}
  </Button>
);

export type SequenceFooterProps = {
  stepIndex: number;
  setStepIndex: React.Dispatch<React.SetStateAction<number>>;
  stepArray: number[];
  setStepArray: React.Dispatch<React.SetStateAction<number[]>>;
  length?: number;
  actions: StepActions;
  onSequenceStepChange?: (old: number, updated: number) => void;
  children?: ReactNode;
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
    const newIndex = actions.nextStep ? actions.nextStep() : stepIndex + 1;
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
    <div className={classes.root}>
      {[undefined, true].includes(actions.showBack) && stepIndex !== 0 && (
        <BackBtn text={actions.backText} handleClick={handleBack} disabled={stepIndex === 0} stepIndex={stepIndex} />
      )}
      {[undefined, true].includes(actions.showNext) && (
        <NextBtn
          text={actions.nextText}
          handleClick={handleNext}
          disabled={(!!length && stepIndex >= length) || (!!actions.canNext && !actions.canNext())}
          stepIndex={stepIndex}
        />
      )}
      {actions.showRestart && stepIndex !== 0 && (
        <RestartBtn text={actions.restartText} handleClick={handleRestart} stepIndex={stepIndex} />
      )}
      {children}
    </div>
  );
};

export default SequenceFooter;
