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

export const EntityAboutCard = createEntityCardExtension({
  id: 'about',
  loader: async () =>
    import('../components/AboutCard').then(m => (
      <m.AboutCard variant="gridItem" />
    )),
});

export const EntityLinksCard = createEntityCardExtension({
  id: 'links',
  filter: ({ entity }) => Boolean(entity.metadata.links),
  loader: async () =>
    import('../components/EntityLinksCard').then(m => {
      return <m.EntityLinksCard variant="gridItem" />;
    }),
});

export const EntityLabelsCard = createEntityCardExtension({
  id: 'labels',
  filter: ({ entity }) => Boolean(entity.metadata.labels),
  loader: async () =>
    import('../components/EntityLabelsCard').then(m => (
      <m.EntityLabelsCard variant="gridItem" />
    )),
});

export const EntityDependsOnComponentsCard = createEntityCardExtension({
  id: 'dependsOn.components',
  loader: async () =>
    import('../components/DependsOnComponentsCard').then(m => (
      <m.DependsOnComponentsCard variant="gridItem" />
    )),
});

export const EntityDependsOnResourcesCard = createEntityCardExtension({
  id: 'dependsOn.resources',
  loader: async () =>
    import('../components/DependsOnResourcesCard').then(m => (
      <m.DependsOnResourcesCard variant="gridItem" />
    )),
});

export const EntityHasComponentsCard = createEntityCardExtension({
  id: 'has.components',
  loader: async () =>
    import('../components/HasComponentsCard').then(m => (
      <m.HasComponentsCard variant="gridItem" />
    )),
});

export const EntityHasResourcesCard = createEntityCardExtension({
  id: 'has.resources',
  loader: async () =>
    import('../components/HasResourcesCard').then(m => (
      <m.HasResourcesCard variant="gridItem" />
    )),
});

export const EntityHasSubcomponentsCard = createEntityCardExtension({
  id: 'has.subcomponents',
  loader: async () =>
    import('../components/HasSubcomponentsCard').then(m => (
      <m.HasSubcomponentsCard variant="gridItem" />
    )),
});

export const EntityHasSystemsCard = createEntityCardExtension({
  id: 'has.systems',
  loader: async () =>
    import('../components/HasSystemsCard').then(m => (
      <m.HasSystemsCard variant="gridItem" />
    )),
});

export default [
  EntityAboutCard,
  EntityLinksCard,
  EntityLabelsCard,
  EntityDependsOnComponentsCard,
  EntityDependsOnResourcesCard,
  EntityHasComponentsCard,
  EntityHasResourcesCard,
  EntityHasSubcomponentsCard,
  EntityHasSystemsCard,
];
