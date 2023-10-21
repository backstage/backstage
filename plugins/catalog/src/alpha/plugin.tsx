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

import React from 'react';
import Grid from '@material-ui/core/Grid';
import HomeIcon from '@material-ui/icons/Home';

import { convertLegacyRouteRef } from '@backstage/core-plugin-api/alpha';
import {
  createPlugin,
  createNavItemExtension,
  coreExtensionData,
  createExtensionInput,
} from '@backstage/frontend-plugin-api';

import { entityRouteRef } from '@backstage/plugin-catalog-react';
import {
  createEntityContentExtension,
  createEntityCardExtension,
} from '@backstage/plugin-catalog-react/alpha';
import { createSearchResultListItemExtension } from '@backstage/plugin-search-react/alpha';

import {
  createComponentRouteRef,
  createFromTemplateRouteRef,
  rootRouteRef,
  viewTechDocRouteRef,
} from '../routes';

import apis from './apis';
import pages from './pages';
import filters from './filters';

/** @alpha */
export const CatalogSearchResultListItemExtension =
  createSearchResultListItemExtension({
    id: 'catalog',
    predicate: result => result.type === 'software-catalog',
    component: () =>
      import('../components/CatalogSearchResultListItem').then(
        m => m.CatalogSearchResultListItem,
      ),
  });

const EntityAboutCard = createEntityCardExtension({
  id: 'about',
  loader: async () =>
    import('../components/AboutCard').then(m => (
      <m.AboutCard variant="gridItem" />
    )),
});

const OverviewEntityContent = createEntityContentExtension({
  id: 'overview',
  defaultPath: '/',
  defaultTitle: 'Overview',
  disabled: false,
  inputs: {
    cards: createExtensionInput({
      element: coreExtensionData.reactElement,
    }),
  },
  loader: async ({ inputs }) => (
    <Grid container spacing={3} alignItems="stretch">
      {inputs.cards.map(card => (
        <Grid item md={6} xs={12}>
          {card.element}
        </Grid>
      ))}
    </Grid>
  ),
});

const CatalogNavItem = createNavItemExtension({
  id: 'catalog.nav.index',
  routeRef: convertLegacyRouteRef(rootRouteRef),
  title: 'Catalog',
  icon: HomeIcon,
});

/** @alpha */
export default createPlugin({
  id: 'catalog',
  routes: {
    catalogIndex: convertLegacyRouteRef(rootRouteRef),
    catalogEntity: convertLegacyRouteRef(entityRouteRef),
  },
  externalRoutes: {
    viewTechDoc: convertLegacyRouteRef(viewTechDocRouteRef),
    createComponent: convertLegacyRouteRef(createComponentRouteRef),
    createFromTemplate: convertLegacyRouteRef(createFromTemplateRouteRef),
  },
  extensions: [
    ...apis,
    ...pages,
    ...filters,
    CatalogSearchResultListItemExtension,
    CatalogNavItem,
    OverviewEntityContent,
    EntityAboutCard,
  ],
});
