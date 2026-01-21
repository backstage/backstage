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

import {
  EntityIconLinkBlueprint,
  EntityCardBlueprint,
} from '@backstage/plugin-catalog-react/alpha';
import { createExtensionInput } from '@backstage/frontend-plugin-api';
import {
  HeaderIconLinkRow,
  IconLinkVerticalProps,
} from '@backstage/core-components';
import { useEntity } from '@backstage/plugin-catalog-react';
import { buildFilterFn } from './filter/FilterWrapper';

export const catalogAboutEntityCard = EntityCardBlueprint.makeWithOverrides({
  name: 'about',
  inputs: {
    iconLinks: createExtensionInput([
      EntityIconLinkBlueprint.dataRefs.filterFunction.optional(),
      EntityIconLinkBlueprint.dataRefs.filterExpression.optional(),
      EntityIconLinkBlueprint.dataRefs.useProps,
    ]),
  },
  factory(originalFactory, { inputs }) {
    function Subheader() {
      const { entity } = useEntity();
      // The "useProps" functions may be calling other hooks, so we need to
      // call them in a component function to avoid breaking the rules of hooks.
      const links = inputs.iconLinks.reduce((rest, iconLink) => {
        const filter = buildFilterFn(
          iconLink.get(EntityIconLinkBlueprint.dataRefs.filterFunction),
          iconLink.get(EntityIconLinkBlueprint.dataRefs.filterExpression),
        );
        if (filter(entity)) {
          const props = iconLink.get(
            EntityIconLinkBlueprint.dataRefs.useProps,
          )();
          return [...rest, props];
        }
        return rest;
      }, new Array<IconLinkVerticalProps>());
      return links.length ? <HeaderIconLinkRow links={links} /> : null;
    }
    return originalFactory({
      type: 'info',
      filter: {
        $not: {
          kind: { $in: ['user', 'group'] },
        },
      },
      async loader() {
        const { InternalAboutCard } = await import(
          '../components/AboutCard/AboutCard'
        );
        return (
          <InternalAboutCard variant="gridItem" subheader={<Subheader />} />
        );
      },
    });
  },
});

export const catalogLinksEntityCard = EntityCardBlueprint.make({
  name: 'links',
  params: {
    type: 'info',
    filter: { 'metadata.links': { $exists: true } },
    loader: async () =>
      import('../components/EntityLinksCard').then(m => (
        <m.EntityLinksCard variant="gridItem" />
      )),
  },
});

export const catalogLabelsEntityCard = EntityCardBlueprint.make({
  name: 'labels',
  params: {
    type: 'info',
    filter: { 'metadata.labels': { $exists: true } },
    loader: async () =>
      import('../components/EntityLabelsCard').then(m => (
        <m.EntityLabelsCard variant="gridItem" />
      )),
  },
});

export const catalogDependsOnComponentsEntityCard = EntityCardBlueprint.make({
  name: 'depends-on-components',
  params: {
    filter: { kind: 'component' },
    loader: async () =>
      import('../components/DependsOnComponentsCard').then(m => (
        <m.DependsOnComponentsCard variant="gridItem" />
      )),
  },
});

export const catalogDependsOnResourcesEntityCard = EntityCardBlueprint.make({
  name: 'depends-on-resources',
  params: {
    filter: { kind: 'component' },
    loader: async () =>
      import('../components/DependsOnResourcesCard').then(m => (
        <m.DependsOnResourcesCard variant="gridItem" />
      )),
  },
});

export const catalogHasComponentsEntityCard = EntityCardBlueprint.make({
  name: 'has-components',
  params: {
    filter: { kind: 'system' },
    loader: async () =>
      import('../components/HasComponentsCard').then(m => (
        <m.HasComponentsCard variant="gridItem" />
      )),
  },
});

export const catalogHasResourcesEntityCard = EntityCardBlueprint.make({
  name: 'has-resources',
  params: {
    filter: { kind: 'system' },
    loader: async () =>
      import('../components/HasResourcesCard').then(m => (
        <m.HasResourcesCard variant="gridItem" />
      )),
  },
});

export const catalogHasSubcomponentsEntityCard = EntityCardBlueprint.make({
  name: 'has-subcomponents',
  params: {
    filter: { kind: 'component' },
    loader: async () =>
      import('../components/HasSubcomponentsCard').then(m => (
        <m.HasSubcomponentsCard variant="gridItem" />
      )),
  },
});

export const catalogHasSubdomainsEntityCard = EntityCardBlueprint.make({
  name: 'has-subdomains',
  params: {
    filter: { kind: 'domain' },
    loader: async () =>
      import('../components/HasSubdomainsCard').then(m => (
        <m.HasSubdomainsCard variant="gridItem" />
      )),
  },
});

export const catalogHasSystemsEntityCard = EntityCardBlueprint.make({
  name: 'has-systems',
  params: {
    filter: { kind: 'domain' },
    loader: async () =>
      import('../components/HasSystemsCard').then(m => (
        <m.HasSystemsCard variant="gridItem" />
      )),
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
