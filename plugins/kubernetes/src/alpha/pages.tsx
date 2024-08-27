/*
 * Copyright 2024 The Backstage Authors
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

import React from 'react'; // Add this line to import React

import { PageBlueprint } from '@backstage/frontend-plugin-api';
import {
  compatWrapper,
  convertLegacyRouteRef,
} from '@backstage/core-compat-api';
import { rootCatalogKubernetesRouteRef } from '../plugin';

export const kubernetesPage = PageBlueprint.make({
  params: {
    defaultPath: '/kubernetes',
    // you can reuse the existing routeRef
    // by wrapping into the convertLegacyRouteRef.
    routeRef: convertLegacyRouteRef(rootCatalogKubernetesRouteRef),
    // these inputs usually match the props required by the component.
    loader: () => import('../Router').then(m => compatWrapper(<m.Router />)),
  },
});
