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

import { CatalogClient } from '@backstage/catalog-client';
import {
  catalogApiRef,
  catalogRouteRef,
  entityRouteRef,
} from '@backstage/plugin-catalog-react';
import { CatalogClientWrapper } from './CatalogClientWrapper';
import { createComponentRouteRef, viewTechDocRouteRef } from './routes';
import {
  createApiFactory,
  createComponentExtension,
  createPlugin,
  createRoutableExtension,
  discoveryApiRef,
  identityApiRef,
} from '@backstage/core-plugin-api';

export const catalogPlugin = createPlugin({
  id: 'catalog',
  apis: [
    createApiFactory({
      api: catalogApiRef,
      deps: { discoveryApi: discoveryApiRef, identityApi: identityApiRef },
      factory: ({ discoveryApi, identityApi }) =>
        new CatalogClientWrapper({
          client: new CatalogClient({ discoveryApi }),
          identityApi,
        }),
    }),
  ],
  routes: {
    catalogIndex: catalogRouteRef,
    catalogEntity: entityRouteRef,
  },
  externalRoutes: {
    createComponent: createComponentRouteRef,
    viewTechDoc: viewTechDocRouteRef,
  },
});

export const CatalogIndexPage = catalogPlugin.provide(
  createRoutableExtension({
    name: 'CatalogIndexPage',
    component: () =>
      import('./components/CatalogPage').then(m => m.CatalogPage),
    mountPoint: catalogRouteRef,
  }),
);

export const CatalogEntityPage = catalogPlugin.provide(
  createRoutableExtension({
    name: 'CatalogEntityPage',
    component: () =>
      import('./components/CatalogEntityPage').then(m => m.CatalogEntityPage),
    mountPoint: entityRouteRef,
  }),
);

export const EntityAboutCard = catalogPlugin.provide(
  createComponentExtension({
    name: 'EntityAboutCard',
    component: {
      lazy: () => import('./components/AboutCard').then(m => m.AboutCard),
    },
  }),
);

export const EntityLinksCard = catalogPlugin.provide(
  createComponentExtension({
    name: 'EntityLinksCard',
    component: {
      lazy: () =>
        import('./components/EntityLinksCard').then(m => m.EntityLinksCard),
    },
  }),
);

export const EntityHasSystemsCard = catalogPlugin.provide(
  createComponentExtension({
    name: 'EntityHasSystemsCard',
    component: {
      lazy: () =>
        import('./components/HasSystemsCard').then(m => m.HasSystemsCard),
    },
  }),
);

export const EntityHasComponentsCard = catalogPlugin.provide(
  createComponentExtension({
    name: 'EntityHasComponentsCard',
    component: {
      lazy: () =>
        import('./components/HasComponentsCard').then(m => m.HasComponentsCard),
    },
  }),
);

export const EntityHasSubcomponentsCard = catalogPlugin.provide(
  createComponentExtension({
    name: 'EntityHasSubcomponentsCard',
    component: {
      lazy: () =>
        import('./components/HasSubcomponentsCard').then(
          m => m.HasSubcomponentsCard,
        ),
    },
  }),
);

export const EntityHasResourcesCard = catalogPlugin.provide(
  createComponentExtension({
    name: 'EntityHasResourcesCard',
    component: {
      lazy: () =>
        import('./components/HasResourcesCard').then(m => m.HasResourcesCard),
    },
  }),
);

export const EntityDependsOnComponentsCard = catalogPlugin.provide(
  createComponentExtension({
    name: 'EntityDependsOnComponentsCard',
    component: {
      lazy: () =>
        import('./components/DependsOnComponentsCard').then(
          m => m.DependsOnComponentsCard,
        ),
    },
  }),
);

export const EntityDependencyOfComponentsCard = catalogPlugin.provide(
  createComponentExtension({
    name: 'EntityDependencyOfComponentsCard',
    component: {
      lazy: () =>
        import('./components/DependencyOfComponentsCard').then(
          m => m.DependencyOfComponentsCard,
        ),
    },
  }),
);

export const EntityDependsOnResourcesCard = catalogPlugin.provide(
  createComponentExtension({
    name: 'EntityDependsOnResourcesCard',
    component: {
      lazy: () =>
        import('./components/DependsOnResourcesCard').then(
          m => m.DependsOnResourcesCard,
        ),
    },
  }),
);

export const EntitySystemDiagramCard = catalogPlugin.provide(
  createComponentExtension({
    name: 'EntitySystemDiagramCard',
    component: {
      lazy: () =>
        import('./components/SystemDiagramCard').then(m => m.SystemDiagramCard),
    },
  }),
);
