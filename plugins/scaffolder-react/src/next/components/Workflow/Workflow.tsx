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

import { stringifyEntityRef } from '@backstage/catalog-model';
import {
  Content,
  InfoCard,
  MarkdownContent,
  Progress,
} from '@backstage/core-components';
import { errorApiRef, useAnalytics, useApi } from '@backstage/core-plugin-api';
import { useTranslationRef } from '@backstage/frontend-plugin-api';
import { ReviewStepProps } from '@backstage/plugin-scaffolder-react';
import { JsonValue } from '@backstage/types';
import { Box } from '@backstage/ui';
import { makeStyles } from '@material-ui/core/styles';
import { ComponentType, useCallback, useEffect } from 'react';

import { SecretsContextProvider } from '../../../secrets/SecretsContext';
import { scaffolderReactTranslationRef } from '../../../translation';
import { useFilteredSchemaProperties } from '../../hooks/useFilteredSchemaProperties';
import { useTemplateParameterSchema } from '../../hooks/useTemplateParameterSchema';
import { useTemplateTimeSavedMinutes } from '../../hooks/useTemplateTimeSaved';
import { Stepper, type StepperProps } from '../Stepper/Stepper';
import { WizardTemplateHeader } from '../Stepper/WizardTemplateHeader';

const useStyles = makeStyles({
  markdown: {
    '& :first-child': {
      marginTop: 0,
    },
    '& :last-child': {
      marginBottom: 0,
    },
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
    ReviewStepComponent?: ComponentType<ReviewStepProps>;
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

type MuiWorkflowLayoutProps = {
  title: string;
  description: string;
  loading: boolean;
  sortedManifest: NonNullable<ReturnType<typeof useFilteredSchemaProperties>>;
  workflowOnCreate: WorkflowProps['onCreate'];
  props: Pick<
    StepperProps,
    'extensions' | 'formProps' | 'components' | 'initialState' | 'layouts'
  >;
};

const MuiWorkflowLayout = ({
  title,
  description,
  loading,
  sortedManifest,
  workflowOnCreate,
  props,
}: MuiWorkflowLayoutProps) => {
  const styles = useStyles();

  return (
    <Content>
      {loading && <Progress />}
      {sortedManifest && (
        <InfoCard
          title={title}
          subheader={
            <MarkdownContent
              className={styles.markdown}
              linkTarget="_blank"
              content={description}
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
    </Content>
  );
};

/**
 * @alpha
 */
export const Workflow = (workflowProps: WorkflowProps): JSX.Element | null => {
  const { t } = useTranslationRef(scaffolderReactTranslationRef);
  const { title, description, namespace, templateName, onCreate, ...props } =
    workflowProps;

  const analytics = useAnalytics();
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
      await onCreate(formState);

      analytics.captureEvent('create', 'Task has been created', {
        value: minutesSaved,
        attributes: {
          templateSteps: sortedManifest?.steps?.length ?? 0,
        },
      });
    },
    [onCreate, analytics, minutesSaved, sortedManifest],
  );

  useEffect(() => {
    if (error) {
      errorApi.post(new Error(`Failed to load template, ${error}`));
    }
  }, [error, errorApi]);

  if (error) {
    return props.onError(error);
  }

  const theme = props.formProps?.EXPERIMENTAL_theme ?? 'mui';

  if (theme === 'bui') {
    return (
      <Box style={{ height: '100%' }}>
        {loading && <Progress />}
        {sortedManifest && (
          <>
            <WizardTemplateHeader
              title={title ?? sortedManifest.title}
              description={
                description ??
                sortedManifest.description ??
                t('workflow.noDescription')
              }
            />
            <Stepper
              manifest={sortedManifest}
              onCreate={workflowOnCreate}
              {...props}
            />
          </>
        )}
      </Box>
    );
  }

  return (
    <MuiWorkflowLayout
      title={title ?? sortedManifest?.title ?? ''}
      description={
        description ??
        sortedManifest?.description ??
        t('workflow.noDescription')
      }
      loading={loading}
      sortedManifest={sortedManifest!}
      workflowOnCreate={workflowOnCreate}
      props={props}
    />
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
