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

import { convertLegacyRouteRefs } from '@backstage/core-compat-api';
import { createPlugin } from '@backstage/frontend-plugin-api';

import { entityRouteRef } from '@backstage/plugin-catalog-react';

import {
  createComponentRouteRef,
  createFromTemplateRouteRef,
  rootRouteRef,
  unregisterRedirectRouteRef,
  viewTechDocRouteRef,
} from '../routes';

import apis from './apis';
import pages from './pages';
import filters from './filters';
import navItems from './navItems';
import entityCards from './entityCards';
import entityContents from './entityContents';
import searchResultItems from './searchResultItems';

/** @alpha */
export default createPlugin({
  id: 'catalog',
  routes: convertLegacyRouteRefs({
    catalogIndex: rootRouteRef,
    catalogEntity: entityRouteRef,
  }),
  externalRoutes: convertLegacyRouteRefs({
    viewTechDoc: viewTechDocRouteRef,
    createComponent: createComponentRouteRef,
    createFromTemplate: createFromTemplateRouteRef,
    unregisterRedirect: unregisterRedirectRouteRef,
  }),
  extensions: [
    ...apis,
    ...pages,
    ...filters,
    ...navItems,
    ...entityCards,
    ...entityContents,
    ...searchResultItems,
  ],
});
