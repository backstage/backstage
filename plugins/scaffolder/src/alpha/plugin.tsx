/*
 * Copyright 2024 The Backstage Authors
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

import { convertLegacyRouteRefs } from '@backstage/core-compat-api';
import { createFrontendPlugin } from '@backstage/frontend-plugin-api';
import {
  rootRouteRef,
  actionsRouteRef,
  editRouteRef,
  registerComponentRouteRef,
  scaffolderListTaskRouteRef,
  scaffolderTaskRouteRef,
  selectedTemplateRouteRef,
  viewTechDocRouteRef,
} from '../routes';
import {
  repoUrlPickerFormField,
  scaffolderNavItem,
  scaffolderPage,
  scaffolderApi,
} from './extensions';
import { formFieldsApi } from '@backstage/plugin-scaffolder-react/alpha';
import { formDecoratorsApi } from './api';

/** @alpha */
export default createFrontendPlugin({
  id: 'scaffolder',
  routes: convertLegacyRouteRefs({
    root: rootRouteRef,
    selectedTemplate: selectedTemplateRouteRef,
    ongoingTask: scaffolderTaskRouteRef,
    actions: actionsRouteRef,
    listTasks: scaffolderListTaskRouteRef,
    edit: editRouteRef,
  }),
  externalRoutes: convertLegacyRouteRefs({
    registerComponent: registerComponentRouteRef,
    viewTechDoc: viewTechDocRouteRef,
  }),
  extensions: [
    scaffolderApi,
    scaffolderPage,
    scaffolderNavItem,
    formDecoratorsApi,
    formFieldsApi,
    repoUrlPickerFormField,
  ],
});
