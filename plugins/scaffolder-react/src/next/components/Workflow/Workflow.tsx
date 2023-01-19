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
import { errorApiRef, useApi } from '@backstage/core-plugin-api';
import { useTemplateParameterSchema } from '../../hooks/useTemplateParameterSchema';
import { Stepper, type StepperProps } from '../Stepper/Stepper';
import { SecretsContextProvider } from '../../../secrets/SecretsContext';

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
      {manifest && (
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
          <Stepper manifest={manifest} {...props} />
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
