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

import { useMemo } from 'react';
import { type HeaderNavTab, type HeaderNavTabItem } from '@backstage/ui';
import { type EntityContentGroupDefinitions } from '@backstage/plugin-catalog-react/alpha';
import { type SubRoute, useSelectedSubRoute } from './EntityTabs';

function tabHrefFromPath(path: string): string {
  return path.replace(/\/\*$/, '').replace(/^\//, '');
}

export function buildHeaderTabs(
  routes: SubRoute[],
  groupDefinitions: EntityContentGroupDefinitions,
  defaultContentOrder: 'title' | 'natural',
): HeaderNavTabItem[] {
  const aliases = Object.entries(groupDefinitions).reduce(
    (map, [id, group]) => {
      for (const alias of group.aliases ?? []) map[alias] = id;
      return map;
    },
    {} as Record<string, string>,
  );
  const groups = routes.reduce((result, route) => {
    const groupId =
      route.group &&
      (groupDefinitions[route.group] ? route.group : aliases[route.group]);
    const group = groupId ? groupDefinitions[groupId] : undefined;
    const key = groupId && group ? groupId : route.path;
    result[key] ??= { group, items: [] };
    result[key].items.push({
      id: route.path,
      label: route.title,
      href: tabHrefFromPath(route.path),
    });
    return result;
  }, {} as Record<string, { group?: EntityContentGroupDefinitions[string]; items: HeaderNavTab[] }>);
  const order = Object.keys(groupDefinitions);
  const entries = Object.entries(groups).sort(([a], [b]) => {
    const ai = order.indexOf(a);
    const bi = order.indexOf(b);
    if (ai !== -1 && bi !== -1) return ai - bi;
    if (ai !== -1) return -1;
    if (bi !== -1) return 1;
    return 0;
  });
  for (const [, group] of entries) {
    if (
      group.group &&
      (group.group.contentOrder ?? defaultContentOrder) === 'title'
    ) {
      group.items.sort((a, b) =>
        a.label.localeCompare(b.label, undefined, { sensitivity: 'base' }),
      );
    }
  }
  return entries.map(([id, group]) =>
    group.group && group.items.length > 1
      ? { id, label: group.group.title, items: group.items }
      : group.items[0],
  );
}

export function useEntityTabs(props: {
  routes: SubRoute[];
  groupDefinitions: EntityContentGroupDefinitions;
  defaultContentOrder: 'title' | 'natural';
}) {
  const { routes, groupDefinitions, defaultContentOrder } = props;
  const { route, element } = useSelectedSubRoute(routes);
  const tabs = useMemo(
    () => buildHeaderTabs(routes, groupDefinitions, defaultContentOrder),
    [routes, groupDefinitions, defaultContentOrder],
  );
  return {
    tabs,
    activeTabId: route?.path,
    content: element,
    title: route?.title,
  };
}
