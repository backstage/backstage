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

import {
  configApiRef,
  createApiFactory,
  createPlugin,
  createRoutableExtension,
} from '@backstage/core-plugin-api';
import { rootRouteRef } from './routes';
import { linterApiRef, LinterClient } from './api';

/**
 * The Backstage plugin that holds API docs spectral linter specific components
 * @public
 */
export const apiDocsSpectralLinterPlugin = createPlugin({
  id: 'api-docs-spectral-linter',
  apis: [
    createApiFactory({
      api: linterApiRef,
      deps: {
        configApi: configApiRef,
      },
      factory({ configApi }) {
        return new LinterClient({ configApi });
      },
    }),
  ],
  routes: {
    root: rootRouteRef,
  },
});

/**
 * An extension for browsing API docs spectral linter on an entity page.
 * @public
 */
export const EntityApiDocsSpectralLinterContent =
  apiDocsSpectralLinterPlugin.provide(
    createRoutableExtension({
      name: 'EntityApiDocsSpectralLinterPluginContent',
      component: () =>
        import('./components/EntityApiDocsSpectralLinterContent').then(
          m => m.EntityApiDocsSpectralLinterContent,
        ),
      mountPoint: rootRouteRef,
    }),
  );
