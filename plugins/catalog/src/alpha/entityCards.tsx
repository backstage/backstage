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
import { EntityCardBlueprint } from '@backstage/plugin-catalog-react/alpha';
import { compatWrapper } from '@backstage/core-compat-api';

export const catalogAboutEntityCard = EntityCardBlueprint.make({
  name: 'about',
  params: {
    loader: async () =>
      import('../components/AboutCard').then(m =>
        compatWrapper(<m.AboutCard variant="gridItem" />),
      ),
  },
});

export const catalogLinksEntityCard = EntityCardBlueprint.make({
  name: 'links',
  params: {
    filter: 'has:links',
    loader: async () =>
      import('../components/EntityLinksCard').then(m =>
        compatWrapper(<m.EntityLinksCard variant="gridItem" />),
      ),
  },
});

export const catalogLabelsEntityCard = EntityCardBlueprint.make({
  name: 'labels',
  params: {
    filter: 'has:labels',
    loader: async () =>
      import('../components/EntityLabelsCard').then(m =>
        compatWrapper(<m.EntityLabelsCard variant="gridItem" />),
      ),
  },
});

export const catalogDependsOnComponentsEntityCard = EntityCardBlueprint.make({
  name: 'depends-on-components',
  params: {
    filter: 'kind:component',
    loader: async () =>
      import('../components/DependsOnComponentsCard').then(m =>
        compatWrapper(<m.DependsOnComponentsCard variant="gridItem" />),
      ),
  },
});

export const catalogDependsOnResourcesEntityCard = EntityCardBlueprint.make({
  name: 'depends-on-resources',
  params: {
    filter: 'kind:component',
    loader: async () =>
      import('../components/DependsOnResourcesCard').then(m =>
        compatWrapper(<m.DependsOnResourcesCard variant="gridItem" />),
      ),
  },
});

export const catalogHasComponentsEntityCard = EntityCardBlueprint.make({
  name: 'has-components',
  params: {
    filter: 'kind:system',
    loader: async () =>
      import('../components/HasComponentsCard').then(m =>
        compatWrapper(<m.HasComponentsCard variant="gridItem" />),
      ),
  },
});

export const catalogHasResourcesEntityCard = EntityCardBlueprint.make({
  name: 'has-resources',
  params: {
    filter: 'kind:system',
    loader: async () =>
      import('../components/HasResourcesCard').then(m =>
        compatWrapper(<m.HasResourcesCard variant="gridItem" />),
      ),
  },
});

export const catalogHasSubcomponentsEntityCard = EntityCardBlueprint.make({
  name: 'has-subcomponents',
  params: {
    filter: 'kind:component',
    loader: async () =>
      import('../components/HasSubcomponentsCard').then(m =>
        compatWrapper(<m.HasSubcomponentsCard variant="gridItem" />),
      ),
  },
});

export const catalogHasSubdomainsEntityCard = EntityCardBlueprint.make({
  name: 'has-subdomains',
  params: {
    filter: 'kind:domain',
    loader: async () =>
      import('../components/HasSubdomainsCard').then(m =>
        compatWrapper(<m.HasSubdomainsCard variant="gridItem" />),
      ),
  },
});

export const catalogHasSystemsEntityCard = EntityCardBlueprint.make({
  name: 'has-systems',
  params: {
    filter: 'kind:domain',
    loader: async () =>
      import('../components/HasSystemsCard').then(m =>
        compatWrapper(<m.HasSystemsCard variant="gridItem" />),
      ),
  },
});

export default [
  catalogAboutEntityCard,
  catalogLinksEntityCard,
  catalogLabelsEntityCard,
  catalogDependsOnComponentsEntityCard,
  catalogDependsOnResourcesEntityCard,
  catalogHasComponentsEntityCard,
  catalogHasResourcesEntityCard,
  catalogHasSubcomponentsEntityCard,
  catalogHasSubdomainsEntityCard,
  catalogHasSystemsEntityCard,
];
