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
import { TemplateListPage } from '../TemplateListPage';
import { TemplateWizardPage } from '../TemplateWizardPage';
import {
  NextFieldExtensionOptions,
  FormProps,
} from '@backstage/plugin-scaffolder-react/alpha';
import {
  ScaffolderTaskOutput,
  SecretsContextProvider,
  useCustomFieldExtensions,
  useCustomLayouts,
} from '@backstage/plugin-scaffolder-react';

import { TemplateEntityV1beta3 } from '@backstage/plugin-scaffolder-common';
import { TemplateGroupFilter } from '../TemplateListPage/TemplateGroups';
import { DEFAULT_SCAFFOLDER_FIELD_EXTENSIONS } from '../../extensions/default';

import {
  nextActionsRouteRef,
  nextEditRouteRef,
  nextScaffolderListTaskRouteRef,
  nextScaffolderTaskRouteRef,
  nextSelectedTemplateRouteRef,
} from '../routes';
import { ErrorPage } from '@backstage/core-components';
import { OngoingTask } from '../OngoingTask';
import { ActionsPage } from '../../components/ActionsPage';
import { ListTasksPage } from '../../components/ListTasksPage';
import { TemplateEditorPage } from '../TemplateEditorPage';

/**
 * The Props for the Scaffolder Router
 *
 * @alpha
 */
export type NextRouterProps = {
  components?: {
    TemplateCardComponent?: React.ComponentType<{
      template: TemplateEntityV1beta3;
    }>;
    TaskPageComponent?: React.ComponentType<{}>;
    TemplateOutputsComponent?: React.ComponentType<{
      output?: ScaffolderTaskOutput;
    }>;
    TemplatePageHeaderComponent?: React.ComponentType<{}>;
    TemplateListContentHeaderComponent?: React.ComponentType<{}>;
  };
  groups?: TemplateGroupFilter[];
  // todo(blam): rename this to formProps
  FormProps?: FormProps;
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
 * @alpha
 */
export const Router = (props: PropsWithChildren<NextRouterProps>) => {
  const {
    components: {
      TemplateCardComponent,
      TemplateOutputsComponent,
      TaskPageComponent = OngoingTask,
      TemplatePageHeaderComponent,
      TemplateListContentHeaderComponent,
    } = {},
  } = props;
  const outlet = useOutlet() || props.children;
  const customFieldExtensions =
    useCustomFieldExtensions<NextFieldExtensionOptions>(outlet);

  const fieldExtensions = [
    ...customFieldExtensions,
    ...DEFAULT_SCAFFOLDER_FIELD_EXTENSIONS.filter(
      ({ name }) =>
        !customFieldExtensions.some(
          customFieldExtension => customFieldExtension.name === name,
        ),
    ),
  ] as NextFieldExtensionOptions[];

  const customLayouts = useCustomLayouts(outlet);

  return (
    <Routes>
      <Route
        path="/"
        element={
          <TemplateListPage
            TemplateCardComponent={TemplateCardComponent}
            contextMenu={props.contextMenu}
            groups={props.groups}
            TemplatePageHeaderComponent={TemplatePageHeaderComponent}
            TemplateListContentHeaderComponent={
              TemplateListContentHeaderComponent
            }
          />
        }
      />
      <Route
        path={nextSelectedTemplateRouteRef.path}
        element={
          <SecretsContextProvider>
            <TemplateWizardPage
              customFieldExtensions={fieldExtensions}
              layouts={customLayouts}
              FormProps={props.FormProps}
              TemplatePageHeaderComponent={TemplatePageHeaderComponent}
            />
          </SecretsContextProvider>
        }
      />
      <Route
        path={nextScaffolderTaskRouteRef.path}
        element={
          <TaskPageComponent
            TemplateOutputsComponent={TemplateOutputsComponent}
          />
        }
      />
      <Route
        path={nextEditRouteRef.path}
        element={
          <SecretsContextProvider>
            <TemplateEditorPage
              customFieldExtensions={fieldExtensions}
              layouts={customLayouts}
            />
          </SecretsContextProvider>
        }
      />

      <Route path={nextActionsRouteRef.path} element={<ActionsPage />} />
      <Route
        path={nextScaffolderListTaskRouteRef.path}
        element={<ListTasksPage />}
      />
      <Route
        path="*"
        element={<ErrorPage status="404" statusMessage="Page not found" />}
      />
    </Routes>
  );
};
