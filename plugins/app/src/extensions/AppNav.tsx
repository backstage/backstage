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
  createExtension,
  coreExtensionData,
  createExtensionInput,
  NavItemBlueprint,
  routeResolutionApiRef,
  appTreeApiRef,
  IconComponent,
  IconElement,
  RouteRef,
  RouteResolutionApi,
  useApi,
} from '@backstage/frontend-plugin-api';
import {
  NavContentBlueprint,
  NavContentComponent,
  NavContentComponentProps,
  NavContentNavItem,
  NavContentNavItems,
} from '@backstage/plugin-app-react';
import { Sidebar, SidebarItem } from '@backstage/core-components';
import { useMemo } from 'react';

class NavItemBag implements NavContentNavItems {
  readonly #items: NavContentNavItem[];
  readonly #index: Map<string, NavContentNavItem>;
  readonly #taken: Set<string>;

  constructor(items: NavContentNavItem[], taken?: Iterable<string>) {
    this.#items = items;
    this.#index = new Map(items.map(item => [item.node.spec.id, item]));
    this.#taken = new Set(taken);
  }

  take(id: string): NavContentNavItem | undefined {
    const item = this.#index.get(id);
    if (item) {
      this.#taken.add(id);
    }
    return item;
  }

  rest(): NavContentNavItem[] {
    return this.#items.filter(item => !this.#taken.has(item.node.spec.id));
  }

  clone(): NavContentNavItems {
    return new NavItemBag(this.#items, this.#taken);
  }

  withComponent(Component: (props: NavContentNavItem) => JSX.Element) {
    return {
      take: (id: string) => {
        const item = this.take(id);
        return item ? <Component {...item} /> : null;
      },
      rest: (options?: { sortBy?: 'title' }) => {
        const items = this.rest();
        if (options?.sortBy === 'title') {
          items.sort((a, b) => a.title.localeCompare(b.title));
        }
        return items.map(item => (
          <Component key={item.node.spec.id} {...item} />
        ));
      },
    };
  }
}

function DefaultNavContent(props: NavContentComponentProps) {
  const items = props.navItems.rest();
  return (
    <Sidebar>
      {items.map(item => (
        <SidebarItem
          to={item.href}
          icon={() => item.icon}
          text={item.title}
          key={item.node.spec.id}
        />
      ))}
    </Sidebar>
  );
}

// Tries to resolve a routeRef to a link path, returning undefined if it
// can't be resolved (e.g. parameterized routes).
function tryResolveLink(
  routeResolutionApi: RouteResolutionApi,
  routeRef: RouteRef,
): string | undefined {
  try {
    const link = routeResolutionApi.resolve(routeRef);
    return link?.();
  } catch {
    return undefined;
  }
}

// Defers rendering until the app is fully initialized so that APIs like
// RouteResolutionApi and AppTreeApi are available.
function NavContentRenderer(props: {
  Content: NavContentComponent;
  legacyNavItems: Array<{
    title: string;
    icon: IconComponent;
    routeRef: RouteRef<undefined>;
  }>;
}) {
  const appTreeApi = useApi(appTreeApiRef);
  const routeResolutionApi = useApi(routeResolutionApiRef);

  // Deprecated items: just resolve nav item routeRefs to paths, no page discovery.
  const legacyItems = useMemo(() => {
    return props.legacyNavItems.flatMap(item => {
      const link = routeResolutionApi.resolve(item.routeRef);
      if (!link) return [];
      return [
        {
          to: link(),
          text: item.title,
          icon: item.icon,
          title: item.title,
          routeRef: item.routeRef,
        },
      ];
    });
  }, [props.legacyNavItems, routeResolutionApi]);

  // New navItems: discover pages from the extension tree, merged with nav items.
  const navItems = useMemo(() => {
    const { tree } = appTreeApi.getTree();
    const routesNode = tree.nodes.get('app/routes');
    if (!routesNode) return new NavItemBag([]);

    // Index nav items by routeRef for matching against pages
    const navItemsByRouteRef = new Map<
      RouteRef,
      { title: string; icon: IconComponent }
    >(props.legacyNavItems.map(item => [item.routeRef, item]));

    const pageNodes = routesNode.edges.attachments.get('routes') ?? [];
    const items = pageNodes.flatMap((node): NavContentNavItem[] => {
      if (!node.instance || node.spec.disabled) {
        return [];
      }

      const routeRef = node.instance.getData(coreExtensionData.routeRef);
      if (!routeRef) {
        return [];
      }

      const matchingNavItem = navItemsByRouteRef.get(routeRef);

      // PageBlueprint resolves title as: config.title ?? params.title ?? plugin.title ?? pluginId
      // We want the priority: page (config/params) -> nav item -> plugin -> pluginId
      const resolvedTitle = node.instance.getData(coreExtensionData.title);
      const pluginTitle = node.spec.plugin.title;
      const pluginId = node.spec.plugin.pluginId;
      const hasExplicitPageTitle =
        resolvedTitle !== undefined &&
        resolvedTitle !== pluginTitle &&
        resolvedTitle !== pluginId;
      const title = hasExplicitPageTitle
        ? resolvedTitle
        : matchingNavItem?.title ?? pluginTitle ?? pluginId;

      // PageBlueprint resolves icon as: params.icon ?? plugin.icon
      // We want the priority: page (params) -> nav item -> plugin -> (excluded)
      const resolvedIcon = node.instance.getData(coreExtensionData.icon);
      const hasExplicitPageIcon = resolvedIcon && !node.spec.plugin.icon;
      const NavItemIcon = matchingNavItem?.icon;

      let icon: IconElement | undefined;
      if (hasExplicitPageIcon) {
        icon = resolvedIcon;
      } else if (NavItemIcon) {
        icon = <NavItemIcon />;
      } else if (resolvedIcon) {
        icon = resolvedIcon;
      }

      if (!title || !icon) {
        return [];
      }

      const to = tryResolveLink(routeResolutionApi, routeRef);
      if (!to) {
        return [];
      }

      return [{ node, href: to, title, icon, routeRef }];
    });

    return new NavItemBag(items);
  }, [appTreeApi, routeResolutionApi, props.legacyNavItems]);

  return <props.Content navItems={navItems} items={legacyItems} />;
}

export const AppNav = createExtension({
  name: 'nav',
  attachTo: { id: 'app/layout', input: 'nav' },
  inputs: {
    items: createExtensionInput([NavItemBlueprint.dataRefs.target]),
    content: createExtensionInput([NavContentBlueprint.dataRefs.component], {
      singleton: true,
      optional: true,
      internal: true,
    }),
  },
  output: [coreExtensionData.reactElement],
  *factory({ inputs }) {
    const Content =
      inputs.content?.get(NavContentBlueprint.dataRefs.component) ??
      DefaultNavContent;

    yield coreExtensionData.reactElement(
      <NavContentRenderer
        legacyNavItems={inputs.items.map(item =>
          item.get(NavItemBlueprint.dataRefs.target),
        )}
        Content={Content}
      />,
    );
  },
});
