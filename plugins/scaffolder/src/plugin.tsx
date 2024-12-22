/*
 * Copyright 2020 The Backstage Authors
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

import { scmIntegrationsApiRef } from '@backstage/integration-react';
import {
  createScaffolderFieldExtension,
  scaffolderApiRef,
} from '@backstage/plugin-scaffolder-react';
import { ScaffolderClient } from './api';
import {
  EntityPicker,
  EntityPickerSchema,
} from './components/fields/EntityPicker/EntityPicker';
import { entityNamePickerValidation } from './components/fields/EntityNamePicker';
import {
  EntityNamePicker,
  EntityNamePickerSchema,
} from './components/fields/EntityNamePicker/EntityNamePicker';
import {
  OwnerPicker,
  OwnerPickerSchema,
} from './components/fields/OwnerPicker/OwnerPicker';
import {
  MultiEntityPicker,
  MultiEntityPickerSchema,
  validateMultiEntityPickerValidation,
} from './components/fields/MultiEntityPicker/MultiEntityPicker';
import { repoPickerValidation } from './components/fields/RepoUrlPicker';
import {
  RepoUrlPicker,
  RepoUrlPickerSchema,
} from './components/fields/RepoUrlPicker/RepoUrlPicker';
import {
  createApiFactory,
  createPlugin,
  createRoutableExtension,
  discoveryApiRef,
  fetchApiRef,
  identityApiRef,
} from '@backstage/core-plugin-api';
import {
  OwnedEntityPicker,
  OwnedEntityPickerSchema,
} from './components/fields/OwnedEntityPicker/OwnedEntityPicker';
import {
  EntityTagsPicker,
  EntityTagsPickerSchema,
} from './components/fields/EntityTagsPicker/EntityTagsPicker';
import {
  registerComponentRouteRef,
  rootRouteRef,
  viewTechDocRouteRef,
  selectedTemplateRouteRef,
  scaffolderTaskRouteRef,
  scaffolderListTaskRouteRef,
  actionsRouteRef,
  editRouteRef,
  editorRouteRef,
  customFieldsRouteRef,
  templateFormRouteRef,
} from './routes';
import {
  MyGroupsPicker,
  MyGroupsPickerSchema,
} from './components/fields/MyGroupsPicker/MyGroupsPicker';
import { RepoBranchPicker } from './components/fields/RepoBranchPicker/RepoBranchPicker';
import { RepoBranchPickerSchema } from './components/fields/RepoBranchPicker/schema';
import { formDecoratorsApiRef } from './alpha/api/ref';
import { DefaultScaffolderFormDecoratorsApi } from './alpha/api/FormDecoratorsApi';
import { formFieldsApiRef } from '@backstage/plugin-scaffolder-react/alpha';

/**
 * The main plugin export for the scaffolder.
 * @public
 */
export const scaffolderPlugin = createPlugin({
  id: 'scaffolder',
  apis: [
    createApiFactory({
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
    createApiFactory({
      api: formDecoratorsApiRef,
      deps: {},
      factory: () => DefaultScaffolderFormDecoratorsApi.create(),
    }),
    createApiFactory({
      api: formFieldsApiRef,
      deps: {},
      factory: () => ({ getFormFields: async () => [] }),
    }),
  ],
  routes: {
    root: rootRouteRef,
    selectedTemplate: selectedTemplateRouteRef,
    ongoingTask: scaffolderTaskRouteRef,
    actions: actionsRouteRef,
    listTasks: scaffolderListTaskRouteRef,
    edit: editRouteRef,
    editor: editorRouteRef,
    customFields: customFieldsRouteRef,
    templateForm: templateFormRouteRef,
  },
  externalRoutes: {
    registerComponent: registerComponentRouteRef,
    viewTechDoc: viewTechDocRouteRef,
  },
});

/**
 * A field extension for selecting an Entity that exists in the Catalog.
 *
 * @public
 */
export const EntityPickerFieldExtension = scaffolderPlugin.provide(
  createScaffolderFieldExtension({
    component: EntityPicker,
    name: 'EntityPicker',
    schema: EntityPickerSchema,
  }),
);

/**
 * The field extension for selecting a name for a new Entity in the Catalog.
 *
 * @public
 */
export const EntityNamePickerFieldExtension = scaffolderPlugin.provide(
  createScaffolderFieldExtension({
    component: EntityNamePicker,
    name: 'EntityNamePicker',
    validation: entityNamePickerValidation,
    schema: EntityNamePickerSchema,
  }),
);

/**
 * A field extension for selecting multiple entities that exists in the Catalog.
 *
 * @public
 */
export const MultiEntityPickerFieldExtension = scaffolderPlugin.provide(
  createScaffolderFieldExtension({
    component: MultiEntityPicker,
    name: 'MultiEntityPicker',
    schema: MultiEntityPickerSchema,
    validation: validateMultiEntityPickerValidation,
  }),
);

/**
 * The field extension which provides the ability to select a RepositoryUrl.
 * Currently, this is an encoded URL that looks something like the following `github.com?repo=myRepoName&owner=backstage`.
 *
 * @public
 */
export const RepoUrlPickerFieldExtension = scaffolderPlugin.provide(
  createScaffolderFieldExtension({
    component: RepoUrlPicker,
    name: 'RepoUrlPicker',
    validation: repoPickerValidation,
    schema: RepoUrlPickerSchema,
  }),
);

/**
 * A field extension for picking users and groups out of the Catalog.
 *
 * @public
 */
export const OwnerPickerFieldExtension = scaffolderPlugin.provide(
  createScaffolderFieldExtension({
    component: OwnerPicker,
    name: 'OwnerPicker',
    schema: OwnerPickerSchema,
  }),
);

/**
 * A field extension for picking groups a user belongs to out of the catalog.
 *
 * @public
 */
export const MyGroupsPickerFieldExtension = scaffolderPlugin.provide(
  createScaffolderFieldExtension({
    component: MyGroupsPicker,
    name: 'MyGroupsPicker',
    schema: MyGroupsPickerSchema,
  }),
);

/**
 * The Router and main entrypoint to the Scaffolder plugin.
 *
 * @public
 */
export const ScaffolderPage = scaffolderPlugin.provide(
  createRoutableExtension({
    name: 'ScaffolderPage',
    component: () => import('./components/Router').then(m => m.Router),
    mountPoint: rootRouteRef,
  }),
);

/**
 * A field extension to show all the Entities that are owned by the current logged-in User for use in templates.
 *
 * @public
 */
export const OwnedEntityPickerFieldExtension = scaffolderPlugin.provide(
  createScaffolderFieldExtension({
    component: OwnedEntityPicker,
    name: 'OwnedEntityPicker',
    schema: OwnedEntityPickerSchema,
  }),
);

/**
 * EntityTagsPickerFieldExtension
 * @public
 */
export const EntityTagsPickerFieldExtension = scaffolderPlugin.provide(
  createScaffolderFieldExtension({
    component: EntityTagsPicker,
    name: 'EntityTagsPicker',
    schema: EntityTagsPickerSchema,
  }),
);

/**
 * A field extension to select a branch from a repository.
 *
 * @public
 */
export const RepoBranchPickerFieldExtension = scaffolderPlugin.provide(
  createScaffolderFieldExtension({
    component: RepoBranchPicker,
    name: 'RepoBranchPicker',
    schema: RepoBranchPickerSchema,
  }),
);
