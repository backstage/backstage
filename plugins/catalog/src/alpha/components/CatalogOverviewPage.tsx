/*
 * Copyright 2026 The Backstage Authors
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

import { ComponentType, lazy as reactLazy, ReactElement } from 'react';
import { Entity } from '@backstage/catalog-model';
import {
  type AppNode,
  ExtensionBoundary,
} from '@backstage/frontend-plugin-api';
import { useEntity } from '@backstage/plugin-catalog-react';
import {
  type EntityCardType,
  type EntityContentLayoutProps,
} from '@backstage/plugin-catalog-react/alpha';

const LazyDefaultLayoutComponent = reactLazy(() =>
  import('../DefaultEntityContentLayout').then(m => ({
    default: m.DefaultEntityContentLayout,
  })),
);

export interface CatalogOverviewPageProps {
  node: AppNode;
  layouts: Array<{
    filter: (entity: Entity) => boolean;
    Component: ComponentType<EntityContentLayoutProps>;
  }>;
  cards: Array<{
    element: ReactElement;
    type?: EntityCardType;
    filter: (entity: Entity) => boolean;
  }>;
}

export function CatalogOverviewPage(props: CatalogOverviewPageProps) {
  const { entity } = useEntity();
  const layout = props.layouts.find(item => item.filter(entity));
  const cards = props.cards.filter(card => card.filter(entity));

  if (layout) {
    return <layout.Component cards={cards} />;
  }

  return (
    <ExtensionBoundary node={props.node}>
      <LazyDefaultLayoutComponent cards={cards} />
    </ExtensionBoundary>
  );
}
