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
import { JsonObject } from '@backstage/types';
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
  identityApiRef,
} from '@backstage/core-plugin-api';
import { parseEntityRef } from '@backstage/catalog-model';
import { catalogApiRef } from '@backstage/plugin-catalog-react';
import { FormProps, IChangeEvent, UiSchema, withTheme } from '@rjsf/core';
import { Theme as MuiTheme } from '@rjsf/material-ui';
import React, { useState } from 'react';
import { transformSchemaToProps } from './schema';
import { Content, StructuredMetadataTable } from '@backstage/core-components';
import cloneDeep from 'lodash/cloneDeep';
import * as fieldOverrides from './FieldOverrides';

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
  formData: Record<string, any>;
  onChange: (e: IChangeEvent) => void;
  onReset: () => void;
  onFinish?: () => Promise<void>;
  widgets?: FormProps<any>['widgets'];
  fields?: FormProps<any>['fields'];
};

export function getUiSchemasFromSteps(steps: Step[]): UiSchema[] {
  const uiSchemas: Array<UiSchema> = [];
  steps.forEach(step => {
    const schemaProps = step.schema.properties as JsonObject;
    for (const key in schemaProps) {
      if (schemaProps.hasOwnProperty(key)) {
        const uiSchema = schemaProps[key] as UiSchema;
        uiSchema.name = key;
        uiSchemas.push(uiSchema);
      }
    }
  });
  return uiSchemas;
}

export function getReviewData(formData: Record<string, any>, steps: Step[]) {
  const uiSchemas = getUiSchemasFromSteps(steps);
  const reviewData: Record<string, any> = {};
  for (const key in formData) {
    if (formData.hasOwnProperty(key)) {
      const uiSchema = uiSchemas.find(us => us.name === key);

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
      if (!review.show) {
        continue;
      }

      if (review.mask) {
        reviewData[key] = review.mask;
        continue;
      }
      reviewData[key] = formData[key];
    }
  }

  return reviewData;
}

export const MultistepJsonForm = (props: Props) => {
  const { formData, onChange, onReset, onFinish, fields, widgets } = props;
  const [activeStep, setActiveStep] = useState(0);
  const [disableButtons, setDisableButtons] = useState(false);
  const identityApi = useApi(identityApiRef);
  const catalogApi = useApi(catalogApiRef);
  const errorApi = useApi(errorApiRef);
  const featureFlagApi = useApi(featureFlagsApiRef);

  async function userInGroup(entityRef: string) {
    const { name, namespace } = parseEntityRef(entityRef);

    const profile = await identityApi.getBackstageIdentity();
    const response = await catalogApi.getEntities({
      filter: [{ kind: 'group', 'relations.hasMember': profile.userEntityRef }],
      fields: ['entityRef'],
    });

    const userGroups = response.items;

    const matchedGroup = userGroups.find(
      g => g.metadata.name === name && g.metadata.namespace === namespace,
    );

    if (matchedGroup) return true;

    return false;
  }

  const stepFilters: {
    key: string;
    stepHandler: (step: Step, filterKey: string) => boolean | Promise<boolean>;
    propertyHandler: (
      value: any,
      filterKey: string,
    ) => boolean | Promise<boolean>;
  }[] = [
    {
      key: 'backstage:featureFlag',
      stepHandler: (step, filterKey) => {
        const featureFlag = step.schema[filterKey];
        return (
          typeof featureFlag !== 'string' ||
          featureFlagApi.isActive(featureFlag)
        );
      },
      propertyHandler: (value, filterKey) => {
        if (featureFlagApi.isActive(value[filterKey])) {
          return true;
        }
        return false;
      },
    },
    {
      key: 'backstage:memberOf',
      stepHandler: async (step, filterKey) => {
        const entityRef = step.schema[filterKey];
        return typeof entityRef !== 'string' || userInGroup(entityRef);
      },
      propertyHandler: async (value, filterKey) => {
        if (await userInGroup(value[filterKey])) {
          return true;
        }
        return false;
      },
    },
  ];

  const filterOutProperties = (step: Step): Step => {
    const filteredStep = cloneDeep(step);
    const removedPropertyKeys: Array<string> = [];
    if (filteredStep.schema.properties) {
      filteredStep.schema.properties = Object.fromEntries(
        Object.entries(filteredStep.schema.properties).filter(
          ([key, value]) => {
            for (let i = 0; i < stepFilters.length; i++) {
              const filter = stepFilters[i];
              if (value[filter.key]) {
                // Remove step if handler returns false
                if (!filter.propertyHandler(value, filter.key)) {
                  removedPropertyKeys.push(key);
                  return false;
                }
              }
            }
            return true;
          },
        ),
      );

      // remove the filtered property keys from required if they are not active
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
      for (let i = 0; i < stepFilters.length; i++) {
        const filter = stepFilters[i];
        if (step.schema[filter.key]) {
          // Remove step if handler returns false
          if (!filter.stepHandler(step, filter.key)) {
            return false;
          }
        }
      }
      return true;
    })
    .map(filterOutProperties);

  const handleReset = () => {
    setActiveStep(0);
    onReset();
  };
  const handleNext = () => {
    setActiveStep(Math.min(activeStep + 1, steps.length));
  };
  const handleBack = () => setActiveStep(Math.max(activeStep - 1, 0));
  const handleCreate = async () => {
    if (!onFinish) {
      return;
    }

    setDisableButtons(true);
    try {
      await onFinish();
    } catch (err) {
      setDisableButtons(false);
      errorApi.post(err);
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
                  showErrorList={false}
                  fields={{ ...fieldOverrides, ...fields }}
                  widgets={widgets}
                  noHtml5Validate
                  formData={formData}
                  onChange={onChange}
                  onSubmit={e => {
                    if (e.errors.length === 0) handleNext();
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
              metadata={getReviewData(formData, steps)}
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
              Create
            </Button>
          </Paper>
        </Content>
      )}
    </>
  );
};
