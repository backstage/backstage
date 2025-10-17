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
import { ComponentType, useCallback, useEffect, useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import useAsync from 'react-use/esm/useAsync';
import {
  ANNOTATION_EDIT_URL,
  stringifyEntityRef,
} from '@backstage/catalog-model';
import {
  AnalyticsContext,
  useApi,
  useRouteRef,
  useRouteRefParams,
} from '@backstage/core-plugin-api';
import {
  FieldExtensionOptions,
  FormProps,
  type LayoutOptions,
  ReviewStepProps,
  scaffolderApiRef,
  useTemplateSecrets,
} from '@backstage/plugin-scaffolder-react';
import { catalogApiRef } from '@backstage/plugin-catalog-react';

import {
  useTemplateParameterSchema,
  Workflow,
} from '@backstage/plugin-scaffolder-react/alpha';
import { JsonValue } from '@backstage/types';
import { Header, Page, Progress } from '@backstage/core-components';

import {
  rootRouteRef,
  scaffolderTaskRouteRef,
  selectedTemplateRouteRef,
} from '../../../routes';

import { TemplateWizardPageContextMenu } from './TemplateWizardPageContextMenu';
import { useFormDecorators } from '../../hooks';

/**
 * @alpha
 */
export type TemplateWizardPageProps = {
  customFieldExtensions: FieldExtensionOptions<any, any>[];
  components?: {
    ReviewStepComponent?: ComponentType<ReviewStepProps>;
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
  const [description, setDescription] = useState('');
  const [showDescription, setShowDescription] = useState(false);
  const navigate = useNavigate();
  const { templateName, namespace } = useRouteRefParams(
    selectedTemplateRouteRef,
  );
  const templateRef = stringifyEntityRef({
    kind: 'Template',
    namespace,
    name: templateName,
  });

  const { manifest } = useTemplateParameterSchema(templateRef);
  const decorators = useFormDecorators();

  const title = manifest?.title ?? templateName;

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

  useEffect(() => {
    const desc = manifest?.description ?? '';
    setDescription(desc);
    if (desc.length > 140) {
      setShowDescription(true);
    }
  }, [manifest?.description, setDescription, setShowDescription]);

  return (
    <AnalyticsContext attributes={{ entityRef: templateRef }}>
      <Page themeId="website">
        <Header
          pageTitleOverride={title}
          title={title}
          subtitle={description.length < 140 ? description : ''}
          {...props.headerOptions}
        >
          <TemplateWizardPageContextMenu
            editUrl={editUrl}
            hasDescription={description.length > 0}
            showDescription={showDescription}
            onShowDescription={() => setShowDescription(true)}
            onHideDescription={() => setShowDescription(false)}
          />
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
          title={title}
          description={description}
          showDescription={showDescription}
          onHideDescription={() => setShowDescription(false)}
        />
      </Page>
    </AnalyticsContext>
  );
};
