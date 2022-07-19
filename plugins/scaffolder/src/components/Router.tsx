/*
 * Copyright 2021 The Backstage Authors
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

import React, { ComponentType, useEffect } from 'react';
import { Routes, Route, useOutlet, Navigate, useParams } from 'react-router';
import { Entity } from '@backstage/catalog-model';
import { TemplateEntityV1beta3 } from '@backstage/plugin-scaffolder-common';
import { ScaffolderPage } from './ScaffolderPage';
import { TemplatePage } from './TemplatePage';
import { TaskPage } from './TaskPage';
import { ActionsPage } from './ActionsPage';
import { SecretsContextProvider } from './secrets/SecretsContext';
import { TemplateEditorPage } from './TemplateEditorPage';

import {
  FieldExtensionOptions,
  FIELD_EXTENSION_WRAPPER_KEY,
  FIELD_EXTENSION_KEY,
  DEFAULT_SCAFFOLDER_FIELD_EXTENSIONS,
} from '../extensions';
import { useElementFilter, useRouteRef } from '@backstage/core-plugin-api';
import {
  actionsRouteRef,
  editRouteRef,
  legacySelectedTemplateRouteRef,
  scaffolderListTaskRouteRef,
  scaffolderTaskRouteRef,
  selectedTemplateRouteRef,
} from '../routes';
import { ListTasksPage } from './ListTasksPage';

/**
 * The props for the entrypoint `ScaffolderPage` component the plugin.
 * @public
 */
export type RouterProps = {
  components?: {
    TemplateCardComponent?:
      | ComponentType<{ template: TemplateEntityV1beta3 }>
      | undefined;
    TaskPageComponent?: ComponentType<{}>;
  };
  groups?: Array<{
    title?: React.ReactNode;
    filter: (entity: Entity) => boolean;
  }>;
  defaultPreviewTemplate?: string;
  /**
   * Options for the context menu on the scaffolder page.
   */
  contextMenu?: {
    /** Whether to show a link to the template editor */
    editor?: boolean;
    /** Whether to show a link to the actions documentation */
    actions?: boolean;
  };
};

/**
 * The main entrypoint `Router` for the `ScaffolderPlugin`.
 *
 * @public
 */
export const Router = (props: RouterProps) => {
  const { groups, components = {}, defaultPreviewTemplate } = props;

  const { TemplateCardComponent, TaskPageComponent } = components;

  const outlet = useOutlet();
  const TaskPageElement = TaskPageComponent ?? TaskPage;

  const customFieldExtensions = useElementFilter(outlet, elements =>
    elements
      .selectByComponentData({
        key: FIELD_EXTENSION_WRAPPER_KEY,
      })
      .findComponentData<FieldExtensionOptions>({
        key: FIELD_EXTENSION_KEY,
      }),
  );

  const fieldExtensions = [
    ...customFieldExtensions,
    ...DEFAULT_SCAFFOLDER_FIELD_EXTENSIONS.filter(
      ({ name }) =>
        !customFieldExtensions.some(
          customFieldExtension => customFieldExtension.name === name,
        ),
    ),
  ];
  /**
   * This component can be deleted once the older routes have been deprecated.
   */
  const RedirectingComponent = () => {
    const { templateName } = useParams();
    const newLink = useRouteRef(selectedTemplateRouteRef);
    useEffect(
      () =>
        // eslint-disable-next-line no-console
        console.warn(
          'The route /template/:templateName is deprecated, please use the new /template/:namespace/:templateName route instead',
        ),
      [],
    );
    return <Navigate to={newLink({ namespace: 'default', templateName })} />;
  };

  return (
    <Routes>
      <Route
        element={
          <ScaffolderPage
            groups={groups}
            TemplateCardComponent={TemplateCardComponent}
            contextMenu={props.contextMenu}
          />
        }
      />
      <Route path={legacySelectedTemplateRouteRef.path}>
        <RedirectingComponent />
      </Route>
      <Route
        path={selectedTemplateRouteRef.path}
        element={
          <SecretsContextProvider>
            <TemplatePage customFieldExtensions={fieldExtensions} />
          </SecretsContextProvider>
        }
      />
      <Route
        path={scaffolderListTaskRouteRef.path}
        element={<ListTasksPage />}
      />
      <Route path={scaffolderTaskRouteRef.path} element={<TaskPageElement />} />
      <Route path={actionsRouteRef.path} element={<ActionsPage />} />
      <Route
        path={editRouteRef.path}
        element={
          <SecretsContextProvider>
            <TemplateEditorPage
              defaultPreviewTemplate={defaultPreviewTemplate}
              customFieldExtensions={fieldExtensions}
            />
          </SecretsContextProvider>
        }
      />

      <Route path="preview" element={<Navigate to="../edit" />} />
    </Routes>
  );
};
