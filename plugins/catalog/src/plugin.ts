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
import { Entity } from '@backstage/catalog-model';
import {
  catalogApiRef,
  entityRouteRef,
  starredEntitiesApiRef,
} from '@backstage/plugin-catalog-react';
import { createComponentRouteRef, viewTechDocRouteRef } from './routes';
import {
  createApiFactory,
  createComponentExtension,
  createPlugin,
  createRoutableExtension,
  discoveryApiRef,
  fetchApiRef,
  storageApiRef,
  AnyMetadata,
} from '@backstage/core-plugin-api';
import { DefaultStarredEntitiesApi } from './apis';
import { AboutCardProps } from './components/AboutCard';
import { DefaultCatalogPageProps } from './components/CatalogPage';
import { DependencyOfComponentsCardProps } from './components/DependencyOfComponentsCard';
import { DependsOnComponentsCardProps } from './components/DependsOnComponentsCard';
import { DependsOnResourcesCardProps } from './components/DependsOnResourcesCard';
import { HasComponentsCardProps } from './components/HasComponentsCard';
import { HasResourcesCardProps } from './components/HasResourcesCard';
import { HasSubcomponentsCardProps } from './components/HasSubcomponentsCard';
import { HasSystemsCardProps } from './components/HasSystemsCard';
import { RelatedEntitiesCardProps } from './components/RelatedEntitiesCard';
import { rootRouteRef } from './routes';

export interface CatalogPluginMetadata extends AnyMetadata {
  createComponentTitle: string;
  supportButton: () => Promise<JSX.Element>;
  supportButtonText: string;
}

const metadata = {
  createComponentTitle: 'Create Component',
  supportButton: () =>
    import('@backstage/core-components').then(m => m.SupportButton),
  supportButtonText: 'All your software catalog entities',
} as CatalogPluginMetadata;

/** @public */
export const catalogPlugin = createPlugin({
  id: 'catalog',
  apis: [
    createApiFactory({
      api: catalogApiRef,
      deps: {
        discoveryApi: discoveryApiRef,
        fetchApi: fetchApiRef,
      },
      factory: ({ discoveryApi, fetchApi }) =>
        new CatalogClient({ discoveryApi, fetchApi }),
    }),
    createApiFactory({
      api: starredEntitiesApiRef,
      deps: { storageApi: storageApiRef },
      factory: ({ storageApi }) =>
        new DefaultStarredEntitiesApi({ storageApi }),
    }),
  ],
  routes: {
    catalogIndex: rootRouteRef,
    catalogEntity: entityRouteRef,
  },
  externalRoutes: {
    createComponent: createComponentRouteRef,
    viewTechDoc: viewTechDocRouteRef,
  },
  metadata,
});

/** @public */
export const CatalogIndexPage: (props: DefaultCatalogPageProps) => JSX.Element =
  catalogPlugin.provide(
    createRoutableExtension({
      name: 'CatalogIndexPage',
      component: () =>
        import('./components/CatalogPage').then(m => m.CatalogPage),
      metadata,
      mountPoint: rootRouteRef,
    }),
  );

/** @public */
export const CatalogEntityPage: () => JSX.Element = catalogPlugin.provide(
  createRoutableExtension({
    name: 'CatalogEntityPage',
    component: () =>
      import('./components/CatalogEntityPage').then(m => m.CatalogEntityPage),
    mountPoint: entityRouteRef,
  }),
);

/** @public */
export const EntityAboutCard: (props: AboutCardProps) => JSX.Element =
  catalogPlugin.provide(
    createComponentExtension({
      name: 'EntityAboutCard',
      component: {
        lazy: () => import('./components/AboutCard').then(m => m.AboutCard),
      },
    }),
  );

/** @public */
export const EntityLinksCard = catalogPlugin.provide(
  createComponentExtension({
    name: 'EntityLinksCard',
    component: {
      lazy: () =>
        import('./components/EntityLinksCard').then(m => m.EntityLinksCard),
    },
  }),
);

/** @public */
export const EntityHasSystemsCard: (props: HasSystemsCardProps) => JSX.Element =
  catalogPlugin.provide(
    createComponentExtension({
      name: 'EntityHasSystemsCard',
      component: {
        lazy: () =>
          import('./components/HasSystemsCard').then(m => m.HasSystemsCard),
      },
    }),
  );

/** @public */
export const EntityHasComponentsCard: (
  props: HasComponentsCardProps,
) => JSX.Element = catalogPlugin.provide(
  createComponentExtension({
    name: 'EntityHasComponentsCard',
    component: {
      lazy: () =>
        import('./components/HasComponentsCard').then(m => m.HasComponentsCard),
    },
  }),
);

/** @public */
export const EntityHasSubcomponentsCard: (
  props: HasSubcomponentsCardProps,
) => JSX.Element = catalogPlugin.provide(
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

/** @public */
export const EntityHasResourcesCard: (
  props: HasResourcesCardProps,
) => JSX.Element = catalogPlugin.provide(
  createComponentExtension({
    name: 'EntityHasResourcesCard',
    component: {
      lazy: () =>
        import('./components/HasResourcesCard').then(m => m.HasResourcesCard),
    },
  }),
);

/** @public */
export const EntityDependsOnComponentsCard: (
  props: DependsOnComponentsCardProps,
) => JSX.Element = catalogPlugin.provide(
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

/** @public */
export const EntityDependencyOfComponentsCard: (
  props: DependencyOfComponentsCardProps,
) => JSX.Element = catalogPlugin.provide(
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

/** @public */
export const EntityDependsOnResourcesCard: (
  props: DependsOnResourcesCardProps,
) => JSX.Element = catalogPlugin.provide(
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

/** @public */
export const RelatedEntitiesCard: <T extends Entity>(
  props: RelatedEntitiesCardProps<T>,
) => JSX.Element = catalogPlugin.provide(
  createComponentExtension({
    name: 'RelatedEntitiesCard',
    component: {
      lazy: () =>
        import('./components/RelatedEntitiesCard').then(
          m => m.RelatedEntitiesCard,
        ),
    },
  }),
);
