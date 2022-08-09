/*
 * Copyright 2020 The Backstage Authors
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
import { JsonObject, JsonValue } from '@backstage/types';
import {
  Box,
  Button,
  Paper,
  Step as StepUI,
  StepContent,
  StepLabel,
  Stepper,
  Typography,
} from '@material-ui/core';
import {
  errorApiRef,
  useApi,
  featureFlagsApiRef,
} from '@backstage/core-plugin-api';
import { FormProps, IChangeEvent, withTheme } from '@rjsf/core';
import { Theme as MuiTheme } from '@rjsf/material-ui';
import React, { useEffect, useState } from 'react';
import { transformSchemaToProps } from './schema';
import { Content, StructuredMetadataTable } from '@backstage/core-components';
import cloneDeep from 'lodash/cloneDeep';
import * as fieldOverrides from './FieldOverrides';
import { Draft07 as JSONSchema } from 'json-schema-library';
import { utils } from '@rjsf/core';
import { useMap } from '@react-hookz/web';

const Form = withTheme(MuiTheme);
type Step = {
  schema: JsonObject;
  title: string;
} & Partial<Omit<FormProps<any>, 'schema'>>;

type Props = {
  /**
   * Steps for the form, each contains title and form schema
   */
  steps: Step[];
  intialFormData: Record<string, any>;
  widgets?: FormProps<any>['widgets'];
  fields?: FormProps<any>['fields'];
  finishButtonLabel?: string;

  onFinish?: (formState: Record<string, JsonValue>) => Promise<void>;
};

export function getReviewData(formData: Record<string, any>, steps: Step[]) {
  const reviewData: Record<string, any> = {};
  const schemas = steps.map(
    step => new JSONSchema(utils.retrieveSchema(step.schema, {}, formData)),
  );

  for (const [key] of Object.entries(formData)) {
    const uiSchema = schemas
      .map(schema => schema.getSchema(`#/${key}`, formData))
      .filter(schema => schema.type !== 'error')[0];

    if (!uiSchema) {
      reviewData[key] = formData[key];
      continue;
    }

    if (uiSchema['ui:widget'] === 'password') {
      reviewData[key] = '******';
      continue;
    }

    if (!uiSchema['ui:backstage'] || !uiSchema['ui:backstage'].review) {
      reviewData[key] = formData[key];
      continue;
    }

    const review = uiSchema['ui:backstage'].review as JsonObject;
    if (review.mask) {
      reviewData[key] = review.mask;
      continue;
    }

    if (!review.show) {
      continue;
    }

    reviewData[key] = formData[key];
  }

  return reviewData;
}

export const MultistepJsonForm = (props: Props) => {
  const { intialFormData, onFinish, fields, widgets, finishButtonLabel } =
    props;
  const [activeStep, setActiveStep] = useState(0);
  const [formChangeData, setFormChangeData] = useState(intialFormData);
  const stepsState = useMap();
  const [formState, setFormState] = useState({});

  const [disableButtons, setDisableButtons] = useState(false);
  const errorApi = useApi(errorApiRef);
  const featureFlagApi = useApi(featureFlagsApiRef);
  const featureFlagKey = 'backstage:featureFlag';
  const filterOutProperties = (step: Step): Step => {
    const filteredStep = cloneDeep(step);
    const removedPropertyKeys: Array<string> = [];
    if (filteredStep.schema.properties) {
      filteredStep.schema.properties = Object.fromEntries(
        Object.entries(filteredStep.schema.properties).filter(
          ([key, value]) => {
            if (value[featureFlagKey]) {
              if (featureFlagApi.isActive(value[featureFlagKey])) {
                return true;
              }
              removedPropertyKeys.push(key);
              return false;
            }
            return true;
          },
        ),
      );

      // remove the feature flag property key from required if they are not active
      filteredStep.schema.required = Array.isArray(filteredStep.schema.required)
        ? filteredStep.schema.required?.filter(
            r => !removedPropertyKeys.includes(r as string),
          )
        : filteredStep.schema.required;
    }
    return filteredStep;
  };

  const steps = props.steps
    .filter(step => {
      const featureFlag = step.schema[featureFlagKey];
      return (
        typeof featureFlag !== 'string' || featureFlagApi.isActive(featureFlag)
      );
    })
    .map(filterOutProperties);

  const handleReset = () => {
    setActiveStep(0);
    stepsState.clear();
  };

  const handleNext = (e: IChangeEvent) => {
    stepsState.set(activeStep, e.formData);
    setActiveStep(Math.min(activeStep + 1, steps.length));
    setFormState(
      Array.from(stepsState.values()).reduce(
        (curr, next) => ({
          ...curr,
          ...next,
        }),
        {},
      ),
    );
  };

  const onChange = (e: IChangeEvent) => {
    setFormChangeData(old => ({ ...old, ...e.formData }));
  };

  const handleBack = () => setActiveStep(Math.max(activeStep - 1, 0));

  const handleCreate = async () => {
    if (!onFinish) {
      return;
    }

    setDisableButtons(true);
    try {
      await onFinish(formState);
    } catch (err) {
      errorApi.post(err);
    } finally {
      setDisableButtons(false);
    }
  };

  return (
    <>
      <Stepper activeStep={activeStep} orientation="vertical">
        {steps.map(({ title, schema, ...formProps }, index) => {
          return (
            <StepUI key={title}>
              <StepLabel
                aria-label={`Step ${index + 1} ${title}`}
                aria-disabled="false"
                tabIndex={0}
              >
                <Typography variant="h6" component="h3">
                  {title}
                </Typography>
              </StepLabel>
              <StepContent key={title}>
                <Form
                  omitExtraData
                  showErrorList={false}
                  fields={{ ...fieldOverrides, ...fields }}
                  widgets={widgets}
                  noHtml5Validate
                  formData={formChangeData}
                  formContext={{ formData: formState }}
                  onChange={onChange}
                  onSubmit={e => {
                    if (e.errors.length === 0) handleNext(e);
                  }}
                  {...formProps}
                  {...transformSchemaToProps(schema)}
                >
                  <Button disabled={activeStep === 0} onClick={handleBack}>
                    Back
                  </Button>
                  <Button variant="contained" color="primary" type="submit">
                    Next step
                  </Button>
                </Form>
              </StepContent>
            </StepUI>
          );
        })}
      </Stepper>
      {activeStep === steps.length && (
        <Content>
          <Paper square elevation={0}>
            <Typography variant="h6">Review and create</Typography>
            <StructuredMetadataTable
              dense
              metadata={getReviewData(formState, steps)}
            />
            <Box mb={4} />
            <Button onClick={handleBack} disabled={disableButtons}>
              Back
            </Button>
            <Button onClick={handleReset} disabled={disableButtons}>
              Reset
            </Button>
            <Button
              variant="contained"
              color="primary"
              onClick={handleCreate}
              disabled={!onFinish || disableButtons}
            >
              {finishButtonLabel ?? 'Create'}
            </Button>
          </Paper>
        </Content>
      )}
    </>
  );
};
