/*
 * Copyright 2020 The Backstage Authors
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

import { ReactNode, useContext } from 'react';
import { useLocation } from 'react-router-dom';
import { cn } from '../../lib/utils';
import { Link } from '../../components/Link/Link';
import { SidebarConfigContext } from './config';
import { MobileSidebarContext } from './MobileSidebarContext';
import { useSidebarPinState } from './SidebarPinStateContext';

/**
 * Props for the `SidebarGroup`
 *
 * @public
 */
export interface SidebarGroupProps {
  /**
   * If the `SidebarGroup` should be a `Link`, `to` should be a pathname to that location
   */
  to?: string;
  /**
   * If the `SidebarGroup`s should be in a different order than in the normal `Sidebar`, you can provide
   * each `SidebarGroup` it's own priority to reorder them.
   */
  priority?: number;
  /**
   * React children
   */
  children?: ReactNode;
  /**
   * Label for the bottom nav action
   */
  label?: string;
  /**
   * Icon to display in the mobile bottom navigation
   */
  icon?: ReactNode;
  /**
   * Value identifier for selection state in the mobile bottom navigation
   */
  value?: number;
}

/**
 * Returns a Tailwind-styled Link, which is aware of the current location & the selected item in the mobile sidebar,
 * such that it will highlight a `MobileSidebarGroup` either on location change or if the selected item changes.
 *
 * @param props `to`: pathname of link; `value`: index of the selected item
 * @internal
 */
const MobileSidebarGroup = (props: SidebarGroupProps) => {
  const { to, label, icon, value } = props;
  const { sidebarConfig } = useContext(SidebarConfigContext);
  const location = useLocation();
  const { selectedMenuItemIndex, setSelectedMenuItemIndex } =
    useContext(MobileSidebarContext);

  const handleClick = (e: { preventDefault: () => void }) => {
    // Overlay-type groups (no `to` prop) should not trigger link navigation —
    // they only toggle the overlay menu open/closed. Prevent default to stop
    // React Router from processing a navigation that resets component state.
    if (!to) {
      e.preventDefault();
    }
    const numValue = value as number;
    if (numValue === selectedMenuItemIndex) {
      setSelectedMenuItemIndex(-1);
    } else {
      setSelectedMenuItemIndex(numValue);
    }
  };

  const selected =
    (value === selectedMenuItemIndex && selectedMenuItemIndex >= 0) ||
    (!(value === selectedMenuItemIndex) &&
      !(selectedMenuItemIndex >= 0) &&
      to === location.pathname);

  return (
    <Link
      to={(to ? to : location.pathname) as string}
      role="button"
      aria-label={label}
      onClick={handleClick}
      className={cn(
        'flex flex-col items-center justify-center grow-0 mx-2 py-1.5 min-w-0 no-underline',
        selected
          ? 'text-[var(--sidebar-nav-selected-color,#fff)] -mt-px'
          : 'text-[var(--sidebar-nav-color,#b5b5b5)]',
      )}
      // The borderTopWidth uses a runtime config value (sidebarConfig.selectedIndicatorWidth)
      // which cannot be expressed as a static Tailwind class; inline style is required here.
      style={
        selected
          ? {
              borderTopWidth: sidebarConfig.selectedIndicatorWidth,
              borderTopStyle: 'solid',
              borderTopColor: 'var(--sidebar-nav-indicator, #9BF0E1)',
            }
          : undefined
      }
    >
      {icon}
      <span className="text-xs truncate max-w-full">{label}</span>
    </Link>
  );
};

/**
 * Groups items of the `Sidebar` together.
 *
 * @remarks
 * On bigger screens, this won't have any effect at the moment.
 * On small screens, it will add an action to the bottom navigation - either triggering an overlay menu or acting as a link
 *
 * @public
 */
export const SidebarGroup = (props: SidebarGroupProps) => {
  const { children, to, label, icon, value } = props;
  const { isMobile } = useSidebarPinState();

  return isMobile ? (
    <MobileSidebarGroup to={to} label={label} icon={icon} value={value} />
  ) : (
    <>{children}</>
  );
};
