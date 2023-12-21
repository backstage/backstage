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
import { createEntityCardExtension } from '@backstage/plugin-catalog-react/alpha';
import { compatWrapper } from '@backstage/core-compat-api';

export const catalogAboutEntityCard = createEntityCardExtension({
  name: 'about',
  loader: async () =>
    import('../components/AboutCard').then(m =>
      compatWrapper(<m.AboutCard variant="gridItem" />),
    ),
});

export const catalogLinksEntityCard = createEntityCardExtension({
  name: 'links',
  filter: 'has:links',
  loader: async () =>
    import('../components/EntityLinksCard').then(m =>
      compatWrapper(<m.EntityLinksCard variant="gridItem" />),
    ),
});

export const catalogLabelsEntityCard = createEntityCardExtension({
  name: 'labels',
  filter: 'has:labels',
  loader: async () =>
    import('../components/EntityLabelsCard').then(m =>
      compatWrapper(<m.EntityLabelsCard variant="gridItem" />),
    ),
});

export const catalogDependsOnComponentsEntityCard = createEntityCardExtension({
  name: 'depends-on-components',
  loader: async () =>
    import('../components/DependsOnComponentsCard').then(m =>
      compatWrapper(<m.DependsOnComponentsCard variant="gridItem" />),
    ),
});

export const catalogDependsOnResourcesEntityCard = createEntityCardExtension({
  name: 'depends-on-resources',
  loader: async () =>
    import('../components/DependsOnResourcesCard').then(m =>
      compatWrapper(<m.DependsOnResourcesCard variant="gridItem" />),
    ),
});

export const catalogHasComponentsEntityCard = createEntityCardExtension({
  name: 'has-components',
  loader: async () =>
    import('../components/HasComponentsCard').then(m =>
      compatWrapper(<m.HasComponentsCard variant="gridItem" />),
    ),
});

export const catalogHasResourcesEntityCard = createEntityCardExtension({
  name: 'has-resources',
  loader: async () =>
    import('../components/HasResourcesCard').then(m =>
      compatWrapper(<m.HasResourcesCard variant="gridItem" />),
    ),
});

export const catalogHasSubcomponentsEntityCard = createEntityCardExtension({
  name: 'has-subcomponents',
  loader: async () =>
    import('../components/HasSubcomponentsCard').then(m =>
      compatWrapper(<m.HasSubcomponentsCard variant="gridItem" />),
    ),
});

export const catalogHasSystemsEntityCard = createEntityCardExtension({
  name: 'has-systems',
  loader: async () =>
    import('../components/HasSystemsCard').then(m =>
      compatWrapper(<m.HasSystemsCard variant="gridItem" />),
    ),
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
  catalogHasSystemsEntityCard,
];
