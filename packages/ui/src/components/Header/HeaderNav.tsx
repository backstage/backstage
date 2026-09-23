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

import { useCallback, useMemo, useRef, useState } from 'react';
import { mergeProps, useFocusVisible, useHover, useLink } from 'react-aria';
import {
  matchRoutes,
  resolvePath,
  type NavigateOptions,
} from 'react-router-dom';
import { Button as RAButton } from 'react-aria-components';
import { RiArrowDownSLine } from '@remixicon/react';
import {
  useDefinition,
  type UseDefinitionResult,
} from '../../hooks/useDefinition';
import {
  HeaderNavDefinition,
  HeaderNavItemDefinition,
  HeaderNavGroupDefinition,
} from './HeaderNavDefinition';
import { HeaderNavIndicators } from './HeaderNavIndicators';
import { MenuTrigger, Menu, MenuItem } from '../Menu';
import type {
  HeaderNavLinkProps,
  HeaderNavTabGroup,
  HeaderNavTabItem,
} from './types';
import { useRoutingIntegration } from '../../navigation/useRouting';
import type { AnchorNavigation } from '../../navigation/useNavigation';

function isTabGroup(tab: HeaderNavTabItem): tab is HeaderNavTabGroup {
  return 'items' in tab;
}

type HeaderNavLinkViewProps = {
  definitionResult: UseDefinitionResult<
    typeof HeaderNavItemDefinition,
    HeaderNavLinkProps
  >;
  navigation: AnchorNavigation;
};

function HeaderNavLinkView({
  definitionResult,
  navigation,
}: HeaderNavLinkViewProps) {
  const { ownProps, analytics } = definitionResult;
  const { id, label, active, registerRef, onHighlight } = ownProps;
  const { href } = ownProps;

  const linkRef = useRef<HTMLAnchorElement>(null);
  let ariaHref = href;
  let routerOptions: NavigateOptions | undefined;
  if (navigation.type === 'router') {
    ariaHref = navigation.ariaHref;
    routerOptions = navigation.routerOptions;
  } else if (navigation.type === 'native') {
    ariaHref = navigation.ariaHref;
  }
  const { linkProps } = useLink(
    {
      href: ariaHref,
      routerOptions,
    },
    linkRef,
  );
  const { hoverProps } = useHover({
    onHoverStart: () => onHighlight(id),
    onHoverEnd: () => onHighlight(null),
  });

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    linkProps.onClick?.(e);
    analytics.captureEvent('click', label, {
      attributes: { to: href },
    });
  };
  const { href: _href, ...anchorProps } = mergeProps(
    linkProps,
    hoverProps,
  ) as React.AnchorHTMLAttributes<HTMLAnchorElement>;
  const ref = (el: HTMLAnchorElement | null) => {
    (linkRef as React.MutableRefObject<HTMLAnchorElement | null>).current = el;
    registerRef(id, el);
  };
  const commonProps = {
    ...anchorProps,
    ref,
    className: ownProps.classes.root,
    'aria-current': active ? ('page' as const) : undefined,
    onClick: handleClick,
    onFocus: () => onHighlight(id),
    onBlur: () => onHighlight(null),
    children: label,
  };
  const browserHref =
    navigation.type === 'native' ? navigation.browserHref : href;

  return (
    <li>
      {navigation.type === 'router' ? (
        <navigation.Link
          {...commonProps}
          {...navigation.routerLinkOptions}
          to={navigation.to}
        />
      ) : (
        <a {...commonProps} href={browserHref} />
      )}
    </li>
  );
}

function HeaderNavLink(props: HeaderNavLinkProps) {
  const definitionResult = useDefinition(HeaderNavItemDefinition, props);
  const Navigation = definitionResult.navigation;

  return (
    <Navigation
      props={{ href: definitionResult.ownProps.href }}
      view={HeaderNavLinkView}
      viewProps={{ definitionResult }}
    />
  );
}

interface HeaderNavGroupItemProps {
  group: HeaderNavTabGroup;
  active: boolean;
  activeChildId?: string;
  registerRef: (key: string, el: HTMLElement | null) => void;
  onHighlight: (key: string | null) => void;
}

function HeaderNavGroupItem(props: HeaderNavGroupItemProps) {
  const { group, active, activeChildId, registerRef, onHighlight } = props;
  const { ownProps } = useDefinition(HeaderNavGroupDefinition, {});
  const { hoverProps } = useHover({
    onHoverStart: () => onHighlight(group.id),
    onHoverEnd: () => onHighlight(null),
  });

  return (
    <li>
      <MenuTrigger>
        <RAButton
          ref={el => {
            registerRef(group.id, el);
          }}
          className={ownProps.classes.root}
          aria-current={active ? 'page' : undefined}
          {...hoverProps}
          onFocus={() => onHighlight(group.id)}
          onBlur={() => onHighlight(null)}
        >
          {group.label}
          <RiArrowDownSLine size={16} />
        </RAButton>
        <Menu
          selectionMode="single"
          selectedKeys={new Set(activeChildId ? [activeChildId] : [])}
        >
          {group.items.map(item => (
            <MenuItem key={item.id} id={item.id} href={item.href}>
              {item.label}
            </MenuItem>
          ))}
        </Menu>
      </MenuTrigger>
    </li>
  );
}

interface HeaderNavProps {
  tabs: HeaderNavTabItem[];
  activeTabId?: string | null;
}

function useAutoActiveTabId(tabs: HeaderNavTabItem[]): string | undefined {
  const routing = useRoutingIntegration({ fallback: true });
  const basePath = routing.useResolvedPath('.').pathname;
  const { pathname } = routing.useLocation();

  return useMemo(() => {
    const allTabs = tabs.flatMap(tab => (isTabGroup(tab) ? tab.items : [tab]));
    const routeObjects = allTabs.map(tab => ({
      path: `${resolvePath(tab.href, basePath).pathname}/*`,
      id: tab.id,
    }));
    const matches = matchRoutes(routeObjects, pathname);
    return matches?.[0]?.route.id;
  }, [tabs, basePath, pathname]);
}

function HeaderNavAutoDetect(props: { tabs: HeaderNavTabItem[] }) {
  const activeTabId = useAutoActiveTabId(props.tabs);
  return <HeaderNavInner tabs={props.tabs} activeTabId={activeTabId} />;
}

function HeaderNavInner(props: HeaderNavProps) {
  const { tabs, activeTabId } = props;
  const { ownProps } = useDefinition(HeaderNavDefinition, {
    tabs,
    activeTabId,
  });
  const { classes } = ownProps;

  const { isFocusVisible } = useFocusVisible();
  const navRef = useRef<HTMLElement>(null);
  const itemRefs = useRef<Map<string, HTMLElement>>(new Map());

  const [highlightedKey, setHighlightedKey] = useState<string | null>(null);

  // Resolve activeTabId to a top-level key (groups own their children's active state)
  const { activeKey, activeChildId } = useMemo(() => {
    if (!activeTabId) return { activeKey: undefined, activeChildId: undefined };
    for (const item of tabs) {
      if (isTabGroup(item)) {
        const child = item.items.find(c => c.id === activeTabId);
        if (child) {
          return { activeKey: item.id, activeChildId: child.id };
        }
      } else if (item.id === activeTabId) {
        return { activeKey: item.id, activeChildId: undefined };
      }
    }
    return { activeKey: undefined, activeChildId: undefined };
  }, [activeTabId, tabs]);

  const registerRef = useCallback((key: string, el: HTMLElement | null) => {
    if (el) {
      itemRefs.current.set(key, el);
    } else {
      itemRefs.current.delete(key);
    }
  }, []);

  return (
    <nav
      ref={navRef}
      aria-label="Content navigation"
      className={classes.root}
      data-focus-visible={isFocusVisible || undefined}
    >
      <ul role="list" className={classes.list}>
        {tabs.map(item =>
          isTabGroup(item) ? (
            <HeaderNavGroupItem
              key={item.id}
              group={item}
              active={activeKey === item.id}
              activeChildId={activeChildId}
              registerRef={registerRef}
              onHighlight={setHighlightedKey}
            />
          ) : (
            <HeaderNavLink
              key={item.id}
              id={item.id}
              label={item.label}
              href={item.href}
              active={activeKey === item.id}
              registerRef={registerRef}
              onHighlight={setHighlightedKey}
            />
          ),
        )}
      </ul>
      <HeaderNavIndicators
        navRef={navRef}
        itemRefs={itemRefs}
        activeKey={activeKey}
        highlightedKey={highlightedKey}
        classes={{ active: classes.active, hovered: classes.hovered }}
      />
    </nav>
  );
}

/** @internal */
export function HeaderNav(props: HeaderNavProps) {
  const routing = useRoutingIntegration({ fallback: true });
  const inRouter = routing.useInRouterContext();

  if (props.activeTabId === undefined && inRouter) {
    return <HeaderNavAutoDetect tabs={props.tabs} />;
  }

  return <HeaderNavInner tabs={props.tabs} activeTabId={props.activeTabId} />;
}
