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
import React, { useState } from 'react';
import { withTheme, IChangeEvent, FormProps } from '@rjsf/core';
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
import { JSONSchema } from '@backstage/catalog-model';

const Form = withTheme(MuiTheme);
type Step = {
  schema: JSONSchema;
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
                schema={schema as FormProps<any>['schema']}
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
