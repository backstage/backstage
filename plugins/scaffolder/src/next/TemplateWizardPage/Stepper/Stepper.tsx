/*
 * Copyright 2022 The Backstage Authors
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
import {
  Stepper as MuiStepper,
  Step as MuiStep,
  StepLabel as MuiStepLabel,
  Button,
  makeStyles,
} from '@material-ui/core';
import { withTheme } from '@rjsf/core';
import { Theme as MuiTheme } from '@rjsf/material-ui';
import React, { useState } from 'react';
import { TemplateParameterSchema } from '../../../types';

const useStyles = makeStyles(theme => ({
  backButton: {
    marginRight: theme.spacing(1),
  },
  footer: {
    padding: theme.spacing(1, 1),
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'right',
  },
  formWrapper: {
    padding: theme.spacing(2),
  },
}));

export interface StepperProps {
  manifest: TemplateParameterSchema;
}

const Form = withTheme(MuiTheme);

export const Stepper = (props: StepperProps) => {
  const { steps } = props.manifest;
  const [activeStep, setActiveStep] = useState(0);
  const styles = useStyles();
  const handleBack = () => {};
  const handleNext = () => {};

  return (
    <>
      <MuiStepper activeStep={0} alternativeLabel>
        {steps.map((step, index) => (
          <MuiStep key={index}>
            <MuiStepLabel>{step.title}</MuiStepLabel>
          </MuiStep>
        ))}
      </MuiStepper>
      <div className={styles.formWrapper}>
        <Form schema={steps[activeStep].schema} />
      </div>
      <div className={styles.footer}>
        <Button onClick={handleBack} className={styles.backButton}>
          Back
        </Button>
        <Button variant="contained" color="primary" onClick={handleNext}>
          {activeStep === steps.length - 1 ? 'Finish' : 'Next'}
        </Button>
      </div>
    </>
  );
};
