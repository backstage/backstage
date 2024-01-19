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

import React from 'react';
import {
  createApiExtension,
  createApiFactory,
  createNavItemExtension,
  createPageExtension,
  createPlugin,
  discoveryApiRef,
  fetchApiRef,
  identityApiRef,
} from '@backstage/frontend-plugin-api';
import CreateComponentIcon from '@material-ui/icons/AddCircleOutline';
import {
  compatWrapper,
  convertLegacyRouteRef,
  convertLegacyRouteRefs,
} from '@backstage/core-compat-api';
import { scmIntegrationsApiRef } from '@backstage/integration-react';
import { scaffolderApiRef } from '@backstage/plugin-scaffolder-react';
import { ScaffolderClient } from './api';
import {
  registerComponentRouteRef,
  rootRouteRef,
  viewTechDocRouteRef,
  selectedTemplateRouteRef,
  scaffolderTaskRouteRef,
  scaffolderListTaskRouteRef,
  actionsRouteRef,
  editRouteRef,
} from './routes';

export {
  type FormProps,
  type TemplateListPageProps,
  type TemplateWizardPageProps,
} from './next';

const scaffolderApi = createApiExtension({
  factory: createApiFactory({
    api: scaffolderApiRef,
    deps: {
      discoveryApi: discoveryApiRef,
      scmIntegrationsApi: scmIntegrationsApiRef,
      fetchApi: fetchApiRef,
      identityApi: identityApiRef,
    },
    factory: ({ discoveryApi, scmIntegrationsApi, fetchApi, identityApi }) =>
      new ScaffolderClient({
        discoveryApi,
        scmIntegrationsApi,
        fetchApi,
        identityApi,
      }),
  }),
});

const scaffolderPage = createPageExtension({
  routeRef: convertLegacyRouteRef(rootRouteRef),
  defaultPath: '/create',
  loader: () =>
    import('./components/Router').then(m => compatWrapper(<m.Router />)),
});

const scaffolderNavItem = createNavItemExtension({
  routeRef: convertLegacyRouteRef(rootRouteRef),
  title: 'Create...',
  icon: CreateComponentIcon,
});

/** @alpha */
export default createPlugin({
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
  extensions: [scaffolderApi, scaffolderPage, scaffolderNavItem],
});
