/*
 * Copyright 2023 The Backstage Authors
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

import {
  compatWrapper,
  convertLegacyRouteRef,
} from '@backstage/core-compat-api';
import {
  NavItemBlueprint,
  PageBlueprint,
  coreExtensionData,
  createExtensionInput,
  createRouteRef,
} from '@backstage/frontend-plugin-api';
import React from 'react';
import { rootRouteRef } from '../routes';
import CreateComponentIcon from '@material-ui/icons/AddCircleOutline';
import { FormFieldBlueprint } from '@backstage/plugin-scaffolder-react/alpha';
import { Route, Routes } from 'react-router-dom';
import { ErrorPage } from '@backstage/core-components';

export const selectedTemplateRouteRef = createRouteRef({
  params: ['namespace', 'templateName'],
});

export const scaffolderTaskRouteRef = createRouteRef({ params: ['taskId'] });
export const scaffolderListTaskRouteRef = createRouteRef();
export const actionsRouteRef = createRouteRef();
export const editRouteRef = createRouteRef();

export const scaffolderPage = PageBlueprint.makeWithOverrides({
  inputs: {
    routes: createExtensionInput([
      coreExtensionData.routePath,
      coreExtensionData.reactElement,
      coreExtensionData.routeRef.optional(),
    ]),
  },
  factory(origFactory, { inputs }) {
    return origFactory({
      // TODO(Rugvip): It should be possible to put this down on the template list page, but that currently breaks routing
      routeRef: convertLegacyRouteRef(rootRouteRef),
      defaultPath: '/create',
      loader: async () =>
        compatWrapper(
          <Routes>
            {...inputs.routes.map(i => (
              <Route
                path={i.get(coreExtensionData.routePath)}
                element={i.get(coreExtensionData.reactElement)}
              />
            ))}
            <Route
              path="*"
              element={
                <ErrorPage status="404" statusMessage="Page not found" />
              }
            />
          </Routes>,
        ),
    });
  },
});
export const scaffolderNavItem = NavItemBlueprint.make({
  params: {
    routeRef: convertLegacyRouteRef(rootRouteRef),
    title: 'Create...',
    icon: CreateComponentIcon,
  },
});

export const repoUrlPickerFormField = FormFieldBlueprint.make({
  name: 'repo-url-picker',
  params: {
    field: () => import('./fields/RepoUrlPicker').then(m => m.RepoUrlPicker),
  },
});

export const templateListPage = PageBlueprint.make({
  name: 'template-list',
  attachTo: { id: 'page:scaffolder', input: 'routes' },
  params: {
    defaultPath: '/',
    loader: () =>
      import('./components/TemplateListPage').then(m => <m.TemplateListPage />),
  },
});

export const selectedTemplatePage = PageBlueprint.make({
  name: 'selected-template',
  attachTo: { id: 'page:scaffolder', input: 'routes' },
  params: {
    routeRef: selectedTemplateRouteRef,
    defaultPath: '/templates/:namespace/:templateName',
    loader: () =>
      import('./components/TemplateListPage').then(m => <m.TemplateListPage />),
  },
});

export const scaffolderTaskPage = PageBlueprint.make({
  name: 'task',
  attachTo: { id: 'page:scaffolder', input: 'routes' },
  params: {
    routeRef: scaffolderTaskRouteRef,
    defaultPath: '/tasks/:taskId',
    loader: () =>
      import('./components/TemplateListPage').then(m => <m.TemplateListPage />),
  },
});

export const scaffolderListTaskPage = PageBlueprint.make({
  name: 'task-list',
  attachTo: { id: 'page:scaffolder', input: 'routes' },
  params: {
    routeRef: scaffolderListTaskRouteRef,
    defaultPath: '/tasks',
    loader: () =>
      import('./components/TemplateListPage').then(m => <m.TemplateListPage />),
  },
});

export const actionsPage = PageBlueprint.make({
  name: 'actions',
  attachTo: { id: 'page:scaffolder', input: 'routes' },
  params: {
    routeRef: actionsRouteRef,
    defaultPath: '/actions',
    loader: () =>
      import('./components/TemplateListPage').then(m => <m.TemplateListPage />),
  },
});

export const editPage = PageBlueprint.make({
  name: 'edit',
  attachTo: { id: 'page:scaffolder', input: 'routes' },
  params: {
    routeRef: editRouteRef,
    defaultPath: '/edit',
    loader: () =>
      import('./components/TemplateListPage').then(m => <m.TemplateListPage />),
  },
});
