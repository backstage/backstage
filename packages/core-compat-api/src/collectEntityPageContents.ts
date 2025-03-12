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

import {
  ApiHolder,
  getComponentData,
  BackstagePlugin as LegacyBackstagePlugin,
} from '@backstage/core-plugin-api';
import { ExtensionDefinition } from '@backstage/frontend-plugin-api';
import React from 'react';
import {
  EntityCardBlueprint,
  EntityContentBlueprint,
} from '@backstage/plugin-catalog-react/alpha';
import { normalizeRoutePath } from './normalizeRoutePath';

const ENTITY_SWITCH_KEY = 'core.backstage.entitySwitch';
const ENTITY_ROUTE_KEY = 'plugin.catalog.entityLayoutRoute';

// Placeholder to make sure internal types here are consitent
type Entity = { apiVersion: string; kind: string };

type EntityFilter = (entity: Entity, ctx: { apis: ApiHolder }) => boolean;
type AsyncEntityFilter = (
  entity: Entity,
  context: { apis: ApiHolder },
) => boolean | Promise<boolean>;

function allFilters(
  ...ifs: (EntityFilter | undefined)[]
): EntityFilter | undefined {
  const filtered = ifs.filter(Boolean) as EntityFilter[];
  if (!filtered.length) {
    return undefined;
  }
  if (filtered.length === 1) {
    return filtered[0];
  }
  return (entity, ctx) => filtered.every(ifFunc => ifFunc(entity, ctx));
}

function anyFilters(
  ...ifs: (EntityFilter | undefined)[]
): EntityFilter | undefined {
  const filtered = ifs.filter(Boolean) as EntityFilter[];
  if (!filtered.length) {
    return undefined;
  }
  if (filtered.length === 1) {
    return filtered[0];
  }
  return (entity, ctx) => filtered.some(ifFunc => ifFunc(entity, ctx));
}

function invertFilter(ifFunc?: EntityFilter): EntityFilter {
  if (!ifFunc) {
    return () => true;
  }
  return (entity, ctx) => !ifFunc(entity, ctx);
}

export function collectEntityPageContents(
  entityPageElement: React.JSX.Element,
  context: {
    discoverExtension(
      extension: ExtensionDefinition,
      plugin?: LegacyBackstagePlugin,
    ): void;
  },
) {
  let cardCounter = 1;
  let routeCounter = 1;

  function traverse(element: React.ReactNode, parentFilter?: EntityFilter) {
    if (!React.isValidElement(element)) {
      return;
    }

    const pageNode = maybeParseEntityPageNode(element);
    if (pageNode) {
      if (pageNode.type === 'route') {
        const mergedIf = allFilters(parentFilter, pageNode.if);

        if (pageNode.path === '/') {
          context.discoverExtension(
            EntityCardBlueprint.makeWithOverrides({
              name: `discovered-${cardCounter++}`,
              factory(originalFactory, { apis }) {
                return originalFactory({
                  type: 'content',
                  filter: mergedIf && (entity => mergedIf(entity, { apis })),
                  loader: () => Promise.resolve(pageNode.children),
                });
              },
            }),
          );
        } else {
          const name = `discovered-${routeCounter++}`;

          context.discoverExtension(
            EntityContentBlueprint.makeWithOverrides({
              name,
              factory(originalFactory, { apis }) {
                return originalFactory({
                  defaultPath: normalizeRoutePath(pageNode.path),
                  defaultTitle: pageNode.title,
                  filter: mergedIf && (entity => mergedIf(entity, { apis })),
                  loader: () => Promise.resolve(pageNode.children),
                });
              },
            }),
            getComponentData<LegacyBackstagePlugin>(
              pageNode.children,
              'core.plugin',
            ),
          );
        }
      }
      if (pageNode.type === 'switch') {
        if (pageNode.renderMultipleMatches === 'all') {
          for (const entityCase of pageNode.cases) {
            traverse(
              entityCase.children,
              allFilters(parentFilter, entityCase.if),
            );
          }
        } else {
          let previousIf: EntityFilter = () => false;
          for (const entityCase of pageNode.cases) {
            const didNotMatchEarlier = invertFilter(previousIf);
            traverse(
              entityCase.children,
              allFilters(parentFilter, entityCase.if, didNotMatchEarlier),
            );
            previousIf = anyFilters(previousIf, entityCase.if)!;
          }
        }
      }
      return;
    }

    React.Children.forEach(
      (element.props as { children?: React.ReactNode })?.children,
      child => {
        traverse(child, parentFilter);
      },
    );
  }

  traverse(entityPageElement);
}

type EntityRoute = {
  type: 'route';
  path: string;
  title: string;
  if?: EntityFilter;
  children: JSX.Element;
};

type EntitySwitchCase = {
  if?: EntityFilter;
  children: React.ReactNode;
};

type EntitySwitch = {
  type: 'switch';
  cases: EntitySwitchCase[];
  renderMultipleMatches: 'first' | 'all';
};

function wrapAsyncEntityFilter(
  asyncFilter?: AsyncEntityFilter,
): EntityFilter | undefined {
  if (!asyncFilter) {
    return asyncFilter;
  }
  let loggedError = false;
  return (entity, ctx) => {
    const result = asyncFilter(entity, ctx);
    if (result && typeof result === 'object' && 'then' in result) {
      if (!loggedError) {
        // eslint-disable-next-line no-console
        console.error(
          `collectEntityPageContents does not support async entity filters, skipping filter ${asyncFilter}`,
        );
        loggedError = true;
      }
      return false;
    }
    return result;
  };
}

function maybeParseEntityPageNode(
  element: React.JSX.Element,
): EntityRoute | EntitySwitch | undefined {
  if (getComponentData(element, ENTITY_ROUTE_KEY)) {
    const props = element.props as EntityRoute;
    return {
      type: 'route',
      path: props.path,
      title: props.title,
      if: props.if,
      children: props.children,
    };
  }

  const parentProps = element.props as {
    children?: React.ReactNode;
    renderMultipleMatches?: 'first' | 'all';
  };

  const children = React.Children.toArray(parentProps?.children);
  if (!children.length) {
    return undefined;
  }

  const cases = [];
  for (const child of children) {
    if (!getComponentData(child, ENTITY_SWITCH_KEY)) {
      return undefined;
    }
    const props = (child as { props: EntitySwitchCase }).props;

    cases.push({
      if: wrapAsyncEntityFilter(props.if),
      children: props.children,
    });
  }
  return {
    type: 'switch',
    cases,
    renderMultipleMatches: parentProps?.renderMultipleMatches ?? 'first',
  };
}
