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

import { stringifyEntityRef } from '@backstage/catalog-model';
import {
  createApiFactory,
  createComponentExtension,
  createPlugin,
  createRoutableExtension,
  discoveryApiRef,
  fetchApiRef,
} from '@backstage/core-plugin-api';
import { useAsyncEntity } from '@backstage/plugin-catalog-react';
import React from 'react';

import { entityFeedbackApiRef, EntityFeedbackClient } from './api';
import { rootRouteRef } from './routes';

/**
 * @public
 */
export const entityFeedbackPlugin = createPlugin({
  id: 'entity-feedback',
  routes: {
    root: rootRouteRef,
  },
  apis: [
    createApiFactory({
      api: entityFeedbackApiRef,
      deps: {
        discoveryApi: discoveryApiRef,
        fetchApi: fetchApiRef,
      },
      factory: ({ discoveryApi, fetchApi }) =>
        new EntityFeedbackClient({ discoveryApi, fetchApi }),
    }),
  ],
});

/**
 * @public
 */
export const LikeDislikeButtons = entityFeedbackPlugin.provide(
  createComponentExtension({
    name: 'LikeDislikeButtons',
    component: {
      lazy: () =>
        import('./components/LikeDislikeButtons').then(
          m => m.LikeDislikeButtons,
        ),
    },
  }),
);

/**
 * @public
 */
export const StarredRatingButtons = entityFeedbackPlugin.provide(
  createComponentExtension({
    name: 'StarredRatingButtons',
    component: {
      lazy: () =>
        import('./components/StarredRatingButtons').then(
          m => m.StarredRatingButtons,
        ),
    },
  }),
);

/**
 * @public
 */
export const FeedbackResponseDialog = entityFeedbackPlugin.provide(
  createComponentExtension({
    name: 'FeedbackResponseDialog',
    component: {
      lazy: () =>
        import('./components/FeedbackResponseDialog').then(
          m => m.FeedbackResponseDialog,
        ),
    },
  }),
);

/**
 * @public
 */
export const EntityFeedbackResponseContent = entityFeedbackPlugin.provide(
  createRoutableExtension({
    name: 'EntityFeedbackResponseContent',
    mountPoint: rootRouteRef,
    component: () =>
      import('./components/FeedbackResponseTable').then(
        ({ FeedbackResponseTable }) => {
          return () => {
            const { entity } = useAsyncEntity();
            return (
              <FeedbackResponseTable
                entityRef={entity ? stringifyEntityRef(entity) : ''}
              />
            );
          };
        },
      ),
  }),
);

/**
 * @public
 */
export const FeedbackResponseTable = entityFeedbackPlugin.provide(
  createComponentExtension({
    name: 'FeedbackResponseTable',
    component: {
      lazy: () =>
        import('./components/FeedbackResponseTable').then(
          m => m.FeedbackResponseTable,
        ),
    },
  }),
);

/**
 * @public
 */
export const EntityLikeDislikeRatingsCard = entityFeedbackPlugin.provide(
  createComponentExtension({
    name: 'EntityLikeDislikeRatingsCard',
    component: {
      lazy: () =>
        import('./components/LikeDislikeRatingsTable').then(
          ({ LikeDislikeRatingsTable }) => {
            return () => {
              const { entity } = useAsyncEntity();
              return (
                <LikeDislikeRatingsTable
                  ownerRef={entity ? stringifyEntityRef(entity) : ''}
                />
              );
            };
          },
        ),
    },
  }),
);

/**
 * @public
 */
export const LikeDislikeRatingsTable = entityFeedbackPlugin.provide(
  createComponentExtension({
    name: 'LikeDislikeRatingsTable',
    component: {
      lazy: () =>
        import('./components/LikeDislikeRatingsTable').then(
          m => m.LikeDislikeRatingsTable,
        ),
    },
  }),
);

/**
 * @public
 */
export const EntityStarredRatingsCard = entityFeedbackPlugin.provide(
  createComponentExtension({
    name: 'EntityStarredRatingsCard',
    component: {
      lazy: () =>
        import('./components/StarredRatingsTable').then(
          ({ StarredRatingsTable }) => {
            return () => {
              const { entity } = useAsyncEntity();
              return (
                <StarredRatingsTable
                  ownerRef={entity ? stringifyEntityRef(entity) : ''}
                />
              );
            };
          },
        ),
    },
  }),
);

/**
 * @public
 */
export const StarredRatingsTable = entityFeedbackPlugin.provide(
  createComponentExtension({
    name: 'StarredRatingsTable',
    component: {
      lazy: () =>
        import('./components/StarredRatingsTable').then(
          m => m.StarredRatingsTable,
        ),
    },
  }),
);

/**
 * @public
 */
export const AppRatingButton = entityFeedbackPlugin.provide(
  createComponentExtension({
    name: 'AppRatingButton',
    component: {
      lazy: () =>
        import('./components/AppRatingButton/AppRatingButton').then(
          m => m.AppRatingButton,
        ),
    },
  }),
);

/**
 * @public
 */
export const AppRatingPopUp = entityFeedbackPlugin.provide(
  createComponentExtension({
    name: 'AppRatingPopUp',
    component: {
      lazy: () =>
        import('./components/AppRatingPopUp/AppRatingPopUp').then(
          m => m.AppRatingPopUp,
        ),
    },
  }),
);

/** @public */
export const AppRatingCard = entityFeedbackPlugin.provide(
  createComponentExtension({
    name: 'AppRatingCard',
    component: {
      lazy: () =>
        import('./components/AppRatingCard').then(m => m.AppRatingCard),
    },
  }),
);
