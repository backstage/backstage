import React, { useState } from 'react';
import { withTheme, FormProps, IChangeEvent } from '@rjsf/core';
import { Theme as MuiTheme } from '@rjsf/material-ui';
import {
  Stepper,
  Step,
  StepLabel,
  StepContent,
  Button,
  Paper,
  Typography,
  Box,
} from '@material-ui/core';
import { Content, StructuredMetadataTable } from '@backstage/core';

const Form = withTheme(MuiTheme);
type Step = {
  schema: FormProps<any>['schema'];
  label: string;
};
type Props = {
  steps: Step[];
  formData: Record<string, any>;
  onChange: (e: IChangeEvent) => void;
  onReset: () => void;
  onFinish: () => void;
};
export const MultistepJsonForm = ({
  steps,
  formData,
  onChange,
  onReset,
  onFinish,
}: Props) => {
  const [activeStep, setActiveStep] = useState(0);

  const handleReset = () => {
    setActiveStep(0);
    onReset();
  };
  const handleNext = () =>
    setActiveStep(Math.min(activeStep + 1, steps.length));
  const handleBack = () => setActiveStep(Math.max(activeStep - 1, 0));
  return (
    <>
      <Stepper activeStep={activeStep} orientation="vertical">
        {steps.map(({ label, schema }) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
            <StepContent>
              <Form
                noHtml5Validate
                formData={formData}
                onChange={onChange}
                schema={schema}
                onSubmit={e => {
                  if (e.errors.length === 0) handleNext();
                }}
              >
                <div>
                  <div>
                    <Button disabled={activeStep === 0} onClick={handleBack}>
                      Back
                    </Button>
                    <Button variant="contained" color="primary" type="submit">
                      {activeStep === steps.length - 1 ? 'Finish' : 'Next'}
                    </Button>
                  </div>
                </div>
              </Form>
            </StepContent>
          </Step>
        ))}
      </Stepper>
      {activeStep === steps.length && (
        <Content>
          <Paper square elevation={0}>
            <Typography variant="h6">Review and create</Typography>
            <StructuredMetadataTable dense metadata={formData} />
            <Box mb={4} />
            <Button onClick={handleBack}>Back</Button>
            <Button onClick={handleReset}>Reset</Button>
            <Button variant="contained" color="primary" onClick={onFinish}>
              Create
            </Button>
          </Paper>
        </Content>
      )}
    </>
  );
};
