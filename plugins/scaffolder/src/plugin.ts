/*
 * Copyright 2020 Spotify AB
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

import { JsonValue } from '@backstage/config';
import {
  createApiFactory,
  createPlugin,
  createRoutableExtension,
  discoveryApiRef,
  identityApiRef,
} from '@backstage/core';
import { OwnerPicker as OwnerPickerComponent } from './components/fields/OwnerPicker';
import { RepoUrlPicker as RepoUrlPickerComponent } from './components/fields/RepoUrlPicker';
import { scmIntegrationsApiRef } from '@backstage/integration-react';
import { scaffolderApiRef, ScaffolderClient } from './api';
import { createScaffolderFieldExtension } from './extensions';
import { rootRouteRef, registerComponentRouteRef } from './routes';

export const scaffolderPlugin = createPlugin({
  id: 'scaffolder',
  apis: [
    createApiFactory({
      api: scaffolderApiRef,
      deps: {
        discoveryApi: discoveryApiRef,
        identityApi: identityApiRef,
        scmIntegrationsApi: scmIntegrationsApiRef,
      },
      factory: ({ discoveryApi, identityApi, scmIntegrationsApi }) =>
        new ScaffolderClient({ discoveryApi, identityApi, scmIntegrationsApi }),
    }),
  ],
  routes: {
    root: rootRouteRef,
  },
  externalRoutes: {
    registerComponent: registerComponentRouteRef,
  },
});

export const RepoUrlPicker = scaffolderPlugin.provide(
  createScaffolderFieldExtension({
    // TODO: work out how to type this component part so we can enforce FieldComponent from RJSF
    component: {
      sync: RepoUrlPickerComponent,
    },
    name: 'RepoUrlPicker',
    validation: (value: JsonValue, validation) => {
      try {
        const { host, searchParams } = new URL(`https://${value}`);
        if (!host || !searchParams.get('owner') || !searchParams.get('repo')) {
          validation.addError('Incomplete repository location provided');
        }
      } catch {
        validation.addError('Unable to parse the Repository URL');
      }
    },
  }),
);

export const OwnerPicker = scaffolderPlugin.provide(
  createScaffolderFieldExtension({
    component: {
      sync: OwnerPickerComponent,
    },
    name: 'OwnerPicker',
    validation: () => {},
  }),
);
export const ScaffolderPage = scaffolderPlugin.provide(
  createRoutableExtension({
    component: () => import('./components/Router').then(m => m.Router),
    mountPoint: rootRouteRef,
  }),
);
