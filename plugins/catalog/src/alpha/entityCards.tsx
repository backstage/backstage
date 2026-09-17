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
  IconLinkVertical,
  IconLinkVerticalProps,
} from '@backstage/core-components';
import { useEntity } from '@backstage/plugin-catalog-react';
import { Entity } from '@backstage/catalog-model';
import { buildFilterFn } from './filter/FilterWrapper';

type EntityIconLink = {
  id: string;
  filter: (entity: Entity) => boolean;
  useProps: () => IconLinkVerticalProps;
};

function EntityIconLinkItem(props: Pick<EntityIconLink, 'useProps'>) {
  const { useProps } = props;
  const linkProps = useProps();
  return <IconLinkVertical {...linkProps} />;
}

export function EntityIconLinkRow(props: { links: EntityIconLink[] }) {
  const { entity } = useEntity();
  const links = props.links.filter(link => link.filter(entity));

  return links.length ? (
    <HeaderIconLinkRow links={[]}>
      {links.map(link => (
        <EntityIconLinkItem key={link.id} useProps={link.useProps} />
      ))}
    </HeaderIconLinkRow>
  ) : null;
}

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
    const iconLinks = inputs.iconLinks.map(iconLink => ({
      id: iconLink.node.spec.id,
      filter: buildFilterFn(
        iconLink.get(EntityIconLinkBlueprint.dataRefs.filterFunction),
        iconLink.get(EntityIconLinkBlueprint.dataRefs.filterExpression),
      ),
      useProps: iconLink.get(EntityIconLinkBlueprint.dataRefs.useProps),
    }));

    function Subheader() {
      return <EntityIconLinkRow links={iconLinks} />;
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
        return <InternalAboutCard iconLinks={<Subheader />} />;
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
      import('../components/EntityLinksCard').then(m => <m.EntityLinksCard />),
  },
});

export const catalogLabelsEntityCard = EntityCardBlueprint.make({
  name: 'labels',
  params: {
    type: 'info',
    filter: { 'metadata.labels': { $exists: true } },
    loader: async () =>
      import('../components/EntityLabelsCard').then(m => (
        <m.EntityLabelsCard />
      )),
  },
});

export const catalogDependsOnComponentsEntityCard = EntityCardBlueprint.make({
  name: 'depends-on-components',
  params: {
    filter: { kind: 'component' },
    loader: async () =>
      import('../components/DependsOnComponentsCard').then(m => (
        <m.DependsOnComponentsCard />
      )),
  },
});

export const catalogDependsOnResourcesEntityCard = EntityCardBlueprint.make({
  name: 'depends-on-resources',
  params: {
    filter: { kind: 'component' },
    loader: async () =>
      import('../components/DependsOnResourcesCard').then(m => (
        <m.DependsOnResourcesCard />
      )),
  },
});

export const catalogHasComponentsEntityCard = EntityCardBlueprint.make({
  name: 'has-components',
  params: {
    filter: { kind: 'system' },
    loader: async () =>
      import('../components/HasComponentsCard').then(m => (
        <m.HasComponentsCard />
      )),
  },
});

export const catalogHasResourcesEntityCard = EntityCardBlueprint.make({
  name: 'has-resources',
  params: {
    filter: { kind: 'system' },
    loader: async () =>
      import('../components/HasResourcesCard').then(m => (
        <m.HasResourcesCard />
      )),
  },
});

export const catalogHasSubcomponentsEntityCard = EntityCardBlueprint.make({
  name: 'has-subcomponents',
  params: {
    filter: { kind: 'component' },
    loader: async () =>
      import('../components/HasSubcomponentsCard').then(m => (
        <m.HasSubcomponentsCard />
      )),
  },
});

export const catalogHasSubdomainsEntityCard = EntityCardBlueprint.make({
  name: 'has-subdomains',
  params: {
    filter: { kind: 'domain' },
    loader: async () =>
      import('../components/HasSubdomainsCard').then(m => (
        <m.HasSubdomainsCard />
      )),
  },
});

export const catalogHasSystemsEntityCard = EntityCardBlueprint.make({
  name: 'has-systems',
  params: {
    filter: { kind: 'domain' },
    loader: async () =>
      import('../components/HasSystemsCard').then(m => <m.HasSystemsCard />),
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
