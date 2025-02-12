/*
 * Copyright 2025 The Backstage Authors
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

import React, { lazy as reactLazy } from 'react';
import {
  createExtensionDataRef,
  createExtensionBlueprint,
  ExtensionBoundary,
  IconComponent,
} from '@backstage/frontend-plugin-api';
import {
  entityFilterExpressionDataRef,
  entityFilterFunctionDataRef,
} from './extensionData';

/** @alpha */
export type BaseEntityHeaderProps = {
  // NOTE(freben): Intentionally not exported at this point, since it's part of
  // the unstable extra context menu items concept below
  UNSTABLE_extraContextMenuItems?: {
    title: string;
    Icon: IconComponent;
    onClick: () => void;
  }[];
  // NOTE(blam): Intentionally not exported at this point, since it's part of
  // unstable context menu option, eg: disable the unregister entity menu
  UNSTABLE_contextMenuOptions?: {
    disableUnregister: boolean | 'visible' | 'hidden' | 'disable';
  };
  /**
   * An array of relation types used to determine the parent entities in the hierarchy.
   * These relations are prioritized in the order provided, allowing for flexible
   * navigation through entity relationships.
   *
   * For example, use relation types like `["partOf", "memberOf", "ownedBy"]` to define how the entity is related to
   * its parents in the Entity Catalog.
   *
   * It adds breadcrumbs in the Entity page to enhance user navigation and context awareness.
   */
  parentEntityRelations?: string[];
};

const entityHeaderComponentDataRef = createExtensionDataRef<
  <P extends BaseEntityHeaderProps>(props: P) => JSX.Element
>().with({
  id: 'catalog.entity-header.component',
});

/** @alpha */
export const EntityHeaderBlueprint = createExtensionBlueprint({
  kind: 'entity-header',
  attachTo: { id: 'page:catalog/entity', input: 'headers' },
  output: [
    entityFilterFunctionDataRef.optional(),
    entityFilterExpressionDataRef.optional(),
    entityHeaderComponentDataRef,
  ],
  dataRefs: {
    filterFunction: entityFilterFunctionDataRef,
    filterExpression: entityFilterExpressionDataRef,
    component: entityHeaderComponentDataRef,
  },
  config: {
    schema: {
      filter: z => z.string().optional(),
    },
  },
  *factory(
    {
      loader,
      defaultFilter,
    }: {
      defaultFilter?:
        | typeof entityFilterFunctionDataRef.T
        | typeof entityFilterExpressionDataRef.T;
      loader: () => Promise<
        <P extends BaseEntityHeaderProps>(props: P) => JSX.Element
      >;
    },
    { node, config },
  ) {
    if (config.filter) {
      yield entityFilterExpressionDataRef(config.filter);
    } else if (typeof defaultFilter === 'string') {
      yield entityFilterExpressionDataRef(defaultFilter);
    } else if (typeof defaultFilter === 'function') {
      yield entityFilterFunctionDataRef(defaultFilter);
    }

    const ExtensionComponent = reactLazy(() =>
      loader().then(component => ({ default: component })),
    );

    yield entityHeaderComponentDataRef(
      <P extends BaseEntityHeaderProps>(props: P) => {
        return (
          <ExtensionBoundary node={node}>
            <ExtensionComponent {...props} />
          </ExtensionBoundary>
        );
      },
    );
  },
});
