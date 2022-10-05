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
import React, { useContext, useEffect } from 'react';
import {
  Page,
  Header,
  Content,
  Progress,
  InfoCard,
  MarkdownContent,
} from '@backstage/core-components';
import { NextFieldExtensionOptions } from '../../extensions';
import { Navigate, useNavigate } from 'react-router';
import { stringifyEntityRef } from '@backstage/catalog-model';
import {
  errorApiRef,
  useApi,
  useRouteRef,
  useRouteRefParams,
} from '@backstage/core-plugin-api';
import { scaffolderApiRef } from '../../api';
import useAsync from 'react-use/lib/useAsync';
import { makeStyles } from '@material-ui/core';
import { Stepper } from './Stepper';
import { BackstageTheme } from '@backstage/theme';
import {
  nextRouteRef,
  nextScaffolderTaskRouteRef,
  selectedTemplateRouteRef,
} from '../../routes';
import { SecretsContext } from '../../components/secrets/SecretsContext';
import { JsonValue } from '@backstage/types';

export interface TemplateWizardPageProps {
  customFieldExtensions: NextFieldExtensionOptions<any, any>[];
}

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

const useTemplateParameterSchema = (templateRef: string) => {
  const scaffolderApi = useApi(scaffolderApiRef);
  const { value, loading, error } = useAsync(
    () => scaffolderApi.getTemplateParameterSchema(templateRef),
    [scaffolderApi, templateRef],
  );

  return { manifest: value, loading, error };
};

export const TemplateWizardPage = (props: TemplateWizardPageProps) => {
  const styles = useStyles();
  const rootRef = useRouteRef(nextRouteRef);
  const nextTemplateRef = useRouteRef(nextScaffolderTaskRouteRef);
  const { secrets } = useContext(SecretsContext) ?? {};
  const scaffolderApi = useApi(scaffolderApiRef);
  const navigate = useNavigate();
  const { templateName, namespace } = useRouteRefParams(
    selectedTemplateRouteRef,
  );
  const templateRef = stringifyEntityRef({
    kind: 'Template',
    namespace,
    name: templateName,
  });

  const errorApi = useApi(errorApiRef);
  const { loading, manifest, error } = useTemplateParameterSchema(templateRef);

  const onComplete = async (values: Record<string, JsonValue>) => {
    const { taskId } = await scaffolderApi.scaffold({
      templateRef,
      values,
      secrets,
    });

    navigate(nextTemplateRef({ taskId }));
  };

  useEffect(() => {
    if (error) {
      errorApi.post(new Error(`Failed to load template, ${error}`));
    }
  }, [error, errorApi]);

  if (error) {
    return <Navigate to={rootRef()} />;
  }

  return (
    <Page themeId="website">
      <Header
        pageTitleOverride="Create a new component"
        title="Create a new component"
        subtitle="Create new software components using standard templates in your organization"
      />
      <Content>
        {loading && <Progress />}
        {manifest && (
          <InfoCard
            title={manifest.title}
            subheader={
              <MarkdownContent
                className={styles.markdown}
                content={manifest.description ?? 'No description'}
              />
            }
            noPadding
            titleTypographyProps={{ component: 'h2' }}
          >
            <Stepper
              manifest={manifest}
              extensions={props.customFieldExtensions}
              onComplete={onComplete}
            />
          </InfoCard>
        )}
      </Content>
    </Page>
  );
};
