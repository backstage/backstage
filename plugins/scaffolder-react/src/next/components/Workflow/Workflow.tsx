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

import React, { useCallback, useEffect } from 'react';
import {
  Content,
  InfoCard,
  MarkdownContent,
  Progress,
  Link,
} from '@backstage/core-components';
import { stringifyEntityRef } from '@backstage/catalog-model';
import { makeStyles } from '@material-ui/core/styles';
import { errorApiRef, useAnalytics, useApi } from '@backstage/core-plugin-api';
import { useTemplateParameterSchema } from '../../hooks/useTemplateParameterSchema';
import { Stepper, type StepperProps } from '../Stepper/Stepper';
import { SecretsContextProvider } from '../../../secrets/SecretsContext';
import { useFilteredSchemaProperties } from '../../hooks/useFilteredSchemaProperties';
import { ReviewStepProps } from '@backstage/plugin-scaffolder-react';
import { useTemplateTimeSavedMinutes } from '../../hooks/useTemplateTimeSaved';
import { JsonValue } from '@backstage/types';
import Grid from '@material-ui/core/Grid';

const useStyles = makeStyles({
  markdown: {
    /** to make the styles for React Markdown not leak into the description */
    '& :first-child': {
      marginTop: 0,
    },
    '& :last-child': {
      marginBottom: 0,
    },
  },
  instructions: {
    maxWidth: '380px',
    paddingRight: '20px',
  },
  formItems: {
    minWidth: '350px',
  },
  formWrapper: {
    paddingLeft: '18px',
    paddingRight: '20px',
    minWidth: '660px',
  },
  layoutWrapper: {
    marginTop: '10px',
    marginBottom: '15px',
  },
  description: {
    maxWidth: '550px',
  },
});

/**
 * @alpha
 */
export type WorkflowProps = {
  title?: string;
  description?: string;
  namespace: string;
  templateName: string;
  components?: {
    ReviewStepComponent?: React.ComponentType<ReviewStepProps>;
  };
  onError(error: Error | undefined): JSX.Element | null;
} & Pick<
  StepperProps,
  | 'extensions'
  | 'formProps'
  | 'components'
  | 'onCreate'
  | 'initialState'
  | 'layouts'
>;

/**
 * @alpha
 */
export const Workflow = (workflowProps: WorkflowProps): JSX.Element | null => {
  const { title, description, namespace, templateName, onCreate, ...props } =
    workflowProps;

  const analytics = useAnalytics();
  const styles = useStyles();
  const templateRef = stringifyEntityRef({
    kind: 'Template',
    namespace: namespace,
    name: templateName,
  });

  const errorApi = useApi(errorApiRef);

  const { loading, manifest, error } = useTemplateParameterSchema(templateRef);

  const sortedManifest = useFilteredSchemaProperties(manifest);

  const minutesSaved = useTemplateTimeSavedMinutes(templateRef);

  const workflowOnCreate = useCallback(
    async (formState: Record<string, JsonValue>) => {
      onCreate(formState);

      const name =
        typeof formState.name === 'string' ? formState.name : undefined;
      analytics.captureEvent('create', name ?? templateName ?? 'unknown', {
        value: minutesSaved,
      });
    },
    [onCreate, analytics, templateName, minutesSaved],
  );

  useEffect(() => {
    if (error) {
      errorApi.post(new Error(`Failed to load template, ${error}`));
    }
  }, [error, errorApi]);

  if (error) {
    return props.onError(error);
  }

  const mdContent =
    "As part of our Large Scale Onboarding initiative, we've implemented new features to assist with the efficient onboarding of your services to Beacon.\n  To complete this Ownership Template and register your new Entities to the Beacon-UCP, verify the following information:\n  * Service ID: this can be found in the Service Registry on the Service Components table. Scroll to the right to find your service’s ID.\n  * Service name: this can be found in the Service registry on the Service Components table.\n\n  Once you’ve verified all the information, select Next, and we’ll collect some details about your service’s owner.";

  return (
    <Content>
      {loading && <Progress />}
      <Grid
        container
        component="div"
        justifyContent="space-evenly"
        spacing={4}
        className={styles.layoutWrapper}
      >
        <Grid item xs={8} className={styles.formWrapper}>
          {sortedManifest && (
            <InfoCard
              title={title ?? sortedManifest.title}
              subheader={
                <MarkdownContent
                  className={styles.markdown}
                  content={
                    description ??
                    sortedManifest.description ??
                    'No description'
                  }
                />
              }
              noPadding
              titleTypographyProps={{ component: 'h2' }}
            >
              <Stepper
                manifest={sortedManifest}
                onCreate={workflowOnCreate}
                {...props}
              />
            </InfoCard>
          )}
        </Grid>
        <Grid item xs={8} className={styles.instructions}>
          <InfoCard title="Using this form">
            <MarkdownContent content={mdContent} />
            <Link
              to="https://git.autodesk.com/internal-dev-portal/beacon/blob/master/docs/Contributing_to_Backstage.md"
              variant="button"
            >
              Learn More
            </Link>
          </InfoCard>
        </Grid>
      </Grid>
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
