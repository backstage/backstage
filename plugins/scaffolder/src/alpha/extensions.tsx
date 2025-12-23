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
  ApiBlueprint,
  createExtensionInput,
  discoveryApiRef,
  fetchApiRef,
  identityApiRef,
  NavItemBlueprint,
  PageBlueprint,
} from '@backstage/frontend-plugin-api';
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
      routeRef: rootRouteRef,
      path: '/create',
      loader: () =>
        import('../components/Router/Router').then(m => (
          <m.InternalRouter formFieldLoaders={formFieldLoaders} />
        )),
    });
  },
});

export const scaffolderNavItem = NavItemBlueprint.make({
  params: {
    routeRef: rootRouteRef,
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

export const entityNamePickerFormField = FormFieldBlueprint.make({
  name: 'entity-name-picker',
  params: {
    field: () =>
      import('./fields/EntityNamePicker').then(m => m.EntityNamePicker),
  },
});

export const entityPickerFormField = FormFieldBlueprint.make({
  name: 'entity-picker',
  params: {
    field: () => import('./fields/EntityPicker').then(m => m.EntityPicker),
  },
});

export const ownerPickerFormField = FormFieldBlueprint.make({
  name: 'owner-picker',
  params: {
    field: () => import('./fields/OwnerPicker').then(m => m.OwnerPicker),
  },
});

export const entityTagsPickerFormField = FormFieldBlueprint.make({
  name: 'entity-tags-picker',
  params: {
    field: () =>
      import('./fields/EntityTagsPicker').then(m => m.EntityTagsPicker),
  },
});

export const multiEntityPickerFormField = FormFieldBlueprint.make({
  name: 'multi-entity-picker',
  params: {
    field: () =>
      import('./fields/MultiEntityPicker').then(m => m.MultiEntityPicker),
  },
});

export const myGroupsPickerFormField = FormFieldBlueprint.make({
  name: 'my-groups-picker',
  params: {
    field: () => import('./fields/MyGroupsPicker').then(m => m.MyGroupsPicker),
  },
});

export const ownedEntityPickerFormField = FormFieldBlueprint.make({
  name: 'owned-entity-picker',
  params: {
    field: () =>
      import('./fields/OwnedEntityPicker').then(m => m.OwnedEntityPicker),
  },
});

export const repoBranchPickerFormField = FormFieldBlueprint.make({
  name: 'repo-branch-picker',
  params: {
    field: () =>
      import('./fields/RepoBranchPicker').then(m => m.RepoBranchPicker),
  },
});

export const repoOwnerPickerFormField = FormFieldBlueprint.make({
  name: 'repo-owner-picker',
  params: {
    field: () =>
      import('./fields/RepoOwnerPicker').then(m => m.RepoOwnerPicker),
  },
});

export const scaffolderApi = ApiBlueprint.make({
  params: defineParams =>
    defineParams({
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
