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
  ApiBlueprint,
  createApiFactory,
  discoveryApiRef,
  fetchApiRef,
  identityApiRef,
  createExtensionInput,
} from '@backstage/frontend-plugin-api';
import React from 'react';
import { rootRouteRef } from '../routes';
import CreateComponentIcon from '@material-ui/icons/AddCircleOutline';
import { FormFieldBlueprint } from '@backstage/plugin-scaffolder-react/alpha';
import { scmIntegrationsApiRef } from '@backstage/integration-react';
import { scaffolderApiRef } from '@backstage/plugin-scaffolder-react';
import { ScaffolderClient } from '../api';

export const scaffolderPage = PageBlueprint.makeWithOverrides({
  inputs: {
    formFields: createExtensionInput([
      FormFieldBlueprint.dataRefs.formFieldLoader,
    ]),
  },
  factory(originalFactory, { inputs }) {
    const formFieldLoaders = inputs.formFields.map(i =>
      i.get(FormFieldBlueprint.dataRefs.formFieldLoader),
    );
    return originalFactory({
      routeRef: convertLegacyRouteRef(rootRouteRef),
      defaultPath: '/create',
      loader: () =>
        import('../components/Router/Router').then(m =>
          compatWrapper(
            <m.InternalRouter formFieldLoaders={formFieldLoaders} />,
          ),
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

export const scaffolderApi = ApiBlueprint.make({
  params: {
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
  },
});
