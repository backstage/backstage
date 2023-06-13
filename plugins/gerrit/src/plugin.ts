import { createPlugin, createRoutableExtension } from '@backstage/core-plugin-api';
import { rootRouteRef } from './routes';
import { Entity } from '@backstage/catalog-model';
import { GERRIT_ANNOTATION } from './components/RepoGerritReviews'

/** @public */
export const isGerritRepo = (entity: Entity) => {
  return (
    Boolean(entity.metadata.annotations?.[GERRIT_ANNOTATION]))
}

/** @public */
export const gerritPlugin = createPlugin({
  id: 'gerrit',
  routes: {
    root: rootRouteRef,
  },
});

/** @public */
export const EntityGerritReviewsContentPage = gerritPlugin.provide(
  createRoutableExtension({
    name: 'EntityGerritReviewsContentPage',
    component: () =>
      import('./components/RepoGerritReviews').then(m => m.GerritReviews),
    mountPoint: rootRouteRef,
  },
  ));

/** @public */
export const EntityGerritReviewsCard = gerritPlugin.provide(
  createRoutableExtension({
    name: 'EntityGerritReviewsCard',
    component: () =>
      import('./components/GerritReviews').then(m => m.GerritReviews),
    mountPoint: rootRouteRef,
  }),
);