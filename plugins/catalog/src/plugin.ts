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
  entityPresentationApiRef,
  entityRouteRef,
  starredEntitiesApiRef,
} from '@backstage/plugin-catalog-react';
import {
  createComponentRouteRef,
  createFromTemplateRouteRef,
  unregisterRedirectRouteRef,
  viewTechDocRouteRef,
  rootRouteRef,
} from './routes';
import {
  createApiFactory,
  createComponentExtension,
  createPlugin,
  createRoutableExtension,
  discoveryApiRef,
  fetchApiRef,
  storageApiRef,
} from '@backstage/core-plugin-api';
import {
  createSearchResultListItemExtension,
  SearchResultListItemExtensionProps,
} from '@backstage/plugin-search-react';
import { DefaultStarredEntitiesApi } from './apis';
import { AboutCardProps } from './components/AboutCard';
import { DefaultCatalogPageProps } from './components/CatalogPage';
import { DependencyOfComponentsCardProps } from './components/DependencyOfComponentsCard';
import { DependsOnComponentsCardProps } from './components/DependsOnComponentsCard';
import { DependsOnResourcesCardProps } from './components/DependsOnResourcesCard';
import { HasComponentsCardProps } from './components/HasComponentsCard';
import { HasResourcesCardProps } from './components/HasResourcesCard';
import { HasSubcomponentsCardProps } from './components/HasSubcomponentsCard';
import { HasSubdomainsCardProps } from './components/HasSubdomainsCard';
import { HasSystemsCardProps } from './components/HasSystemsCard';
import { RelatedEntitiesCardProps } from './components/RelatedEntitiesCard';
import { CatalogSearchResultListItemProps } from './components/CatalogSearchResultListItem';
import { DefaultEntityPresentationApi } from './apis/EntityPresentationApi';

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
    createApiFactory({
      api: entityPresentationApiRef,
      deps: { catalogApi: catalogApiRef },
      factory: ({ catalogApi }) =>
        DefaultEntityPresentationApi.create({ catalogApi }),
    }),
  ],
  routes: {
    catalogIndex: rootRouteRef,
    catalogEntity: entityRouteRef,
  },
  externalRoutes: {
    createComponent: createComponentRouteRef,
    viewTechDoc: viewTechDocRouteRef,
    createFromTemplate: createFromTemplateRouteRef,
    unregisterRedirect: unregisterRedirectRouteRef,
  },
});

/** @public */
export const CatalogIndexPage: (props: DefaultCatalogPageProps) => JSX.Element =
  catalogPlugin.provide(
    createRoutableExtension({
      name: 'CatalogIndexPage',
      component: () =>
        import('./components/CatalogPage').then(m => m.CatalogPage),
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

/**
 * An example About card to show at the top of entity pages.
 *
 * @public
 * @remarks
 *
 * This card collects some high level information about the entity, but is just
 * an example component. Many organizations will want to replace it with a
 * custom card that is more tailored to their specific needs. The card itself is
 * not extremely customizable; feel free to make a copy of it as a starting
 * point if you like.
 */
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
export const EntityLabelsCard = catalogPlugin.provide(
  createComponentExtension({
    name: 'EntityLabelsCard',
    component: {
      lazy: () =>
        import('./components/EntityLabelsCard').then(m => m.EntityLabelsCard),
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
export const EntityHasSubdomainsCard: (
  props: HasSubdomainsCardProps,
) => JSX.Element = catalogPlugin.provide(
  createComponentExtension({
    name: 'EntityHasSubdomainsCard',
    component: {
      lazy: () =>
        import('./components/HasSubdomainsCard').then(m => m.HasSubdomainsCard),
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

/** @public */
export const CatalogSearchResultListItem: (
  props: SearchResultListItemExtensionProps<CatalogSearchResultListItemProps>,
) => JSX.Element | null = catalogPlugin.provide(
  createSearchResultListItemExtension({
    name: 'CatalogSearchResultListItem',
    component: () =>
      import('./components/CatalogSearchResultListItem').then(
        m => m.CatalogSearchResultListItem,
      ),
    predicate: result => result.type === 'software-catalog',
  }),
);
