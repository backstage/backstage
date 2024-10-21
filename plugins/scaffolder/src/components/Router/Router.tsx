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
import React, { PropsWithChildren } from 'react';
import { Routes, Route, useOutlet } from 'react-router-dom';

import {
  FieldExtensionOptions,
  FormProps,
  ReviewStepProps,
  TemplateGroupFilter,
} from '@backstage/plugin-scaffolder-react';
import {
  ScaffolderTaskOutput,
  SecretsContextProvider,
  useCustomFieldExtensions,
  useCustomLayouts,
} from '@backstage/plugin-scaffolder-react';

import { TemplateEntityV1beta3 } from '@backstage/plugin-scaffolder-common';
import { DEFAULT_SCAFFOLDER_FIELD_EXTENSIONS } from '../../extensions/default';

import {
  actionsRouteRef,
  editorRouteRef,
  customFieldsRouteRef,
  editRouteRef,
  scaffolderListTaskRouteRef,
  scaffolderTaskRouteRef,
  selectedTemplateRouteRef,
  templateFormRouteRef,
} from '../../routes';
import { ErrorPage } from '@backstage/core-components';

import { ActionsPage } from '../../components/ActionsPage';
import { ListTasksPage } from '../../components/ListTasksPage';

import {
  TemplateListPageProps,
  TemplateWizardPageProps,
} from '@backstage/plugin-scaffolder/alpha';
import { TemplateListPage, TemplateWizardPage } from '../../alpha/components';
import { OngoingTask } from '../OngoingTask';
import {
  TemplateFormPage,
  TemplateIntroPage,
  TemplateEditorPage,
  CustomFieldsPage,
} from '../../alpha/components/TemplateEditorPage';
import { RequirePermission } from '@backstage/plugin-permission-react';
import { taskReadPermission } from '@backstage/plugin-scaffolder-common/alpha';

/**
 * The Props for the Scaffolder Router
 *
 * @public
 */
export type RouterProps = {
  components?: {
    ReviewStepComponent?: React.ComponentType<ReviewStepProps>;
    TemplateCardComponent?: React.ComponentType<{
      template: TemplateEntityV1beta3;
    }>;
    TaskPageComponent?: React.ComponentType<PropsWithChildren<{}>>;
    EXPERIMENTAL_TemplateOutputsComponent?: React.ComponentType<{
      output?: ScaffolderTaskOutput;
    }>;
    EXPERIMENTAL_TemplateListPageComponent?: React.ComponentType<TemplateListPageProps>;
    EXPERIMENTAL_TemplateWizardPageComponent?: React.ComponentType<TemplateWizardPageProps>;
  };
  groups?: TemplateGroupFilter[];
  templateFilter?: (entity: TemplateEntityV1beta3) => boolean;
  headerOptions?: {
    pageTitleOverride?: string;
    title?: string;
    subtitle?: string;
  };
  defaultPreviewTemplate?: string;
  formProps?: FormProps;
  contextMenu?: {
    /** Whether to show a link to the template editor */
    editor?: boolean;
    /** Whether to show a link to the actions documentation */
    actions?: boolean;
    /** Whether to show a link to the tasks page */
    tasks?: boolean;
  };
};

/**
 * The Scaffolder Router
 *
 * @public
 */
export const Router = (props: PropsWithChildren<RouterProps>) => {
  const {
    components: {
      TemplateCardComponent,
      TaskPageComponent = OngoingTask,
      ReviewStepComponent,
      EXPERIMENTAL_TemplateOutputsComponent: TemplateOutputsComponent,
      EXPERIMENTAL_TemplateListPageComponent:
        TemplateListPageComponent = TemplateListPage,
      EXPERIMENTAL_TemplateWizardPageComponent:
        TemplateWizardPageComponent = TemplateWizardPage,
    } = {},
  } = props;
  const outlet = useOutlet() || props.children;
  const customFieldExtensions =
    useCustomFieldExtensions<FieldExtensionOptions>(outlet);

  const fieldExtensions = [
    ...customFieldExtensions,
    ...DEFAULT_SCAFFOLDER_FIELD_EXTENSIONS.filter(
      ({ name }) =>
        !customFieldExtensions.some(
          customFieldExtension => customFieldExtension.name === name,
        ),
    ),
  ] as FieldExtensionOptions[];

  const customLayouts = useCustomLayouts(outlet);

  return (
    <Routes>
      <Route
        path="/"
        element={
          <TemplateListPageComponent
            TemplateCardComponent={TemplateCardComponent}
            contextMenu={props.contextMenu}
            groups={props.groups}
            templateFilter={props.templateFilter}
            headerOptions={props.headerOptions}
          />
        }
      />
      <Route
        path={selectedTemplateRouteRef.path}
        element={
          <SecretsContextProvider>
            <TemplateWizardPageComponent
              headerOptions={props.headerOptions}
              customFieldExtensions={fieldExtensions}
              layouts={customLayouts}
              components={{ ReviewStepComponent }}
              formProps={props.formProps}
            />
          </SecretsContextProvider>
        }
      />
      <Route
        path={scaffolderTaskRouteRef.path}
        element={
          <RequirePermission permission={taskReadPermission}>
            <TaskPageComponent
              TemplateOutputsComponent={TemplateOutputsComponent}
            />
          </RequirePermission>
        }
      />
      <Route
        path={editRouteRef.path}
        element={
          <SecretsContextProvider>
            <TemplateIntroPage />
          </SecretsContextProvider>
        }
      />
      <Route
        path={customFieldsRouteRef.path}
        element={
          <SecretsContextProvider>
            <CustomFieldsPage fieldExtensions={fieldExtensions} />
          </SecretsContextProvider>
        }
      />
      <Route
        path={templateFormRouteRef.path}
        element={
          <SecretsContextProvider>
            <TemplateFormPage
              layouts={customLayouts}
              formProps={props.formProps}
              fieldExtensions={fieldExtensions}
            />
          </SecretsContextProvider>
        }
      />

      <Route path={actionsRouteRef.path} element={<ActionsPage />} />
      <Route
        path={scaffolderListTaskRouteRef.path}
        element={
          <RequirePermission permission={taskReadPermission}>
            <ListTasksPage />
          </RequirePermission>
        }
      />
      <Route
        path={editorRouteRef.path}
        element={
          <SecretsContextProvider>
            <TemplateEditorPage
              layouts={customLayouts}
              formProps={props.formProps}
              fieldExtensions={fieldExtensions}
            />
          </SecretsContextProvider>
        }
      />
      <Route
        path="*"
        element={<ErrorPage status="404" statusMessage="Page not found" />}
      />
    </Routes>
  );
};
