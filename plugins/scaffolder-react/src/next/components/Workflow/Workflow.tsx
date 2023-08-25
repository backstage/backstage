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
import React, { useEffect } from 'react';
import {
  Content,
  InfoCard,
  MarkdownContent,
  Progress,
} from '@backstage/core-components';
import { stringifyEntityRef } from '@backstage/catalog-model';
import { makeStyles } from '@material-ui/core';
import { BackstageTheme } from '@backstage/theme';
import {
  errorApiRef,
  useApi,
  featureFlagsApiRef,
} from '@backstage/core-plugin-api';
import { useTemplateParameterSchema } from '../../hooks/useTemplateParameterSchema';
import { Stepper, type StepperProps } from '../Stepper/Stepper';
import { SecretsContextProvider } from '../../../secrets/SecretsContext';
import cloneDeep from 'lodash/cloneDeep';
import { useMemo, useCallback } from 'react';

const useStyles = makeStyles<BackstageTheme>(() => ({
  markdown: {
    /** to make the styles for React Markdown not leak into the description */
    '& :first-child': {
      marginTop: 0,
    },
    '& :last-child': {
      marginBottom: 0,
    },
  },
}));

/**
 * @alpha
 */
export type WorkflowProps = {
  title?: string;
  description?: string;
  namespace: string;
  templateName: string;
  onError(error: Error | undefined): JSX.Element | null;
} & Pick<
  StepperProps,
  | 'extensions'
  | 'FormProps'
  | 'components'
  | 'onCreate'
  | 'initialState'
  | 'layouts'
>;

/**
 * @alpha
 */
export const Workflow = (workflowProps: WorkflowProps): JSX.Element | null => {
  const { title, description, namespace, templateName, ...props } =
    workflowProps;

  const styles = useStyles();
  const templateRef = stringifyEntityRef({
    kind: 'Template',
    namespace: namespace,
    name: templateName,
  });

  const errorApi = useApi(errorApiRef);
  const { loading, manifest, error } = useTemplateParameterSchema(templateRef);

  const featureFlagKey = 'backstage:featureFlag';
  const featureFlagApi = useApi(featureFlagsApiRef);

  const filterOutProperties = useCallback(
    (step: Step): Step => {
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
        filteredStep.schema.required = Array.isArray(
          filteredStep.schema.required,
        )
          ? filteredStep.schema.required?.filter(
              r => !removedPropertyKeys.includes(r as string),
            )
          : filteredStep.schema.required;
      }
      return filteredStep;
    },
    [featureFlagKey, featureFlagApi],
  );

  const filterOutSteps = useCallback(
    m => {
      if (m) {
        const filteredSteps = m.steps
          .filter(step => {
            const featureFlag = step.schema[featureFlagKey];
            return (
              typeof featureFlag !== 'string' ||
              featureFlagApi.isActive(featureFlag)
            );
          })
          .map(filterOutProperties);

        m.steps = filteredSteps;
      }

      return m;
    },
    [featureFlagApi, filterOutProperties, featureFlagKey],
  );

  const sortedManifest = useMemo(
    () => filterOutSteps(manifest),
    [manifest, filterOutSteps],
  );

  useEffect(() => {
    if (error) {
      errorApi.post(new Error(`Failed to load template, ${error}`));
    }
  }, [error, errorApi]);

  if (error) {
    return props.onError(error);
  }

  return (
    <Content>
      {loading && <Progress />}
      {sortedManifest && (
        <InfoCard
          title={title ?? manifest.title}
          subheader={
            <MarkdownContent
              className={styles.markdown}
              content={description ?? manifest.description ?? 'No description'}
            />
          }
          noPadding
          titleTypographyProps={{ component: 'h2' }}
        >
          <Stepper manifest={manifest} templateName={templateName} {...props} />
        </InfoCard>
      )}
    </Content>
  );
};

/**
 * @alpha
 */
export const EmbeddableWorkflow = (props: WorkflowProps) => (
  <SecretsContextProvider>
    <Workflow {...props} />
  </SecretsContextProvider>
);
