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
import React, { useCallback, useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import useAsync from 'react-use/esm/useAsync';
import {
  stringifyEntityRef,
  ANNOTATION_EDIT_URL,
} from '@backstage/catalog-model';
import {
  AnalyticsContext,
  useApi,
  useRouteRef,
  useRouteRefParams,
} from '@backstage/core-plugin-api';
import {
  scaffolderApiRef,
  useTemplateSecrets,
  type LayoutOptions,
  FormProps,
  FieldExtensionOptions,
  ReviewStepProps,
} from '@backstage/plugin-scaffolder-react';
import { catalogApiRef } from '@backstage/plugin-catalog-react';

import {
  Workflow,
  useTemplateParameterSchema,
} from '@backstage/plugin-scaffolder-react/alpha';
import { JsonValue } from '@backstage/types';
import { Header, Page, Progress } from '@backstage/core-components';

import {
  rootRouteRef,
  scaffolderTaskRouteRef,
  selectedTemplateRouteRef,
} from '../../../routes';
import { useTranslationRef } from '@backstage/core-plugin-api/alpha';
import { scaffolderTranslationRef } from '../../../translation';

import { TemplateWizardPageContextMenu } from './TemplateWizardPageContextMenu';
import { useFormDecorators } from '../../hooks';

/**
 * @alpha
 */
export type TemplateWizardPageProps = {
  customFieldExtensions: FieldExtensionOptions<any, any>[];
  components?: {
    ReviewStepComponent?: React.ComponentType<ReviewStepProps>;
  };
  layouts?: LayoutOptions[];
  formProps?: FormProps;
  headerOptions?: {
    pageTitleOverride?: string;
    title?: string;
    subtitle?: string;
  };
};

export const TemplateWizardPage = (props: TemplateWizardPageProps) => {
  const rootRef = useRouteRef(rootRouteRef);
  const taskRoute = useRouteRef(scaffolderTaskRouteRef);
  const { secrets: contextSecrets } = useTemplateSecrets();
  const scaffolderApi = useApi(scaffolderApiRef);
  const catalogApi = useApi(catalogApiRef);
  const [isCreating, setIsCreating] = useState(false);
  const navigate = useNavigate();
  const { templateName, namespace } = useRouteRefParams(
    selectedTemplateRouteRef,
  );
  const { t } = useTranslationRef(scaffolderTranslationRef);

  const templateRef = stringifyEntityRef({
    kind: 'Template',
    namespace,
    name: templateName,
  });

  const { manifest } = useTemplateParameterSchema(templateRef);
  const decorators = useFormDecorators();

  const { value: editUrl } = useAsync(async () => {
    const data = await catalogApi.getEntityByRef(templateRef);
    return data?.metadata.annotations?.[ANNOTATION_EDIT_URL];
  }, [templateRef, catalogApi]);

  const onCreate = useCallback(
    async (initialValues: Record<string, JsonValue>) => {
      if (isCreating) {
        return;
      }

      setIsCreating(true);

      const { formState: values, secrets } = await decorators.run({
        formState: initialValues,
        secrets: contextSecrets,
        manifest,
      });

      const { taskId } = await scaffolderApi.scaffold({
        templateRef,
        values,
        secrets,
      });

      navigate(taskRoute({ taskId }));
    },
    [
      contextSecrets,
      decorators,
      isCreating,
      manifest,
      navigate,
      scaffolderApi,
      taskRoute,
      templateRef,
    ],
  );

  const onError = useCallback(() => <Navigate to={rootRef()} />, [rootRef]);

  return (
    <AnalyticsContext attributes={{ entityRef: templateRef }}>
      <Page themeId="website">
        <Header
          pageTitleOverride={t('templateWizardPage.pageTitle')}
          title={t('templateWizardPage.title')}
          subtitle={t('templateWizardPage.subtitle')}
          {...props.headerOptions}
        >
          <TemplateWizardPageContextMenu editUrl={editUrl} />
        </Header>
        {isCreating && <Progress />}
        <Workflow
          namespace={namespace}
          templateName={templateName}
          onCreate={onCreate}
          components={props.components}
          onError={onError}
          extensions={props.customFieldExtensions}
          formProps={props.formProps}
          layouts={props.layouts}
        />
      </Page>
    </AnalyticsContext>
  );
};
