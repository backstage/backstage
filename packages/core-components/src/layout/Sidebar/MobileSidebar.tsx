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

import { useElementFilter } from '@backstage/core-plugin-api';
import { X as CloseIcon, Menu as MenuIcon } from 'lucide-react';
import { orderBy } from 'lodash';
import {
  cloneElement,
  useEffect,
  useState,
  useContext,
  ReactNode,
  ReactElement,
  createElement,
} from 'react';
import { useLocation } from 'react-router-dom';
import { cn } from '../../lib/utils';
import { SidebarOpenStateProvider } from './SidebarOpenStateContext';
import { SidebarGroup } from './SidebarGroup';
import { SidebarConfigContext } from './config';
import { MobileSidebarContext } from './MobileSidebarContext';

/**
 * Props of MobileSidebar
 *
 * @public
 */
export type MobileSidebarProps = {
  children?: ReactNode;
};

/**
 * @internal
 */
type OverlayMenuProps = {
  label?: string;
  onClose: () => void;
  open: boolean;
  children?: ReactNode;
};

const sortSidebarGroupsForPriority = (children: ReactElement[]) =>
  orderBy(
    children,
    ({ props: { priority } }) => (Number.isInteger(priority) ? priority : -1),
    'desc',
  );

const sidebarGroupType = createElement(SidebarGroup).type;

const OverlayMenu = ({
  children,
  label = 'Menu',
  open,
  onClose,
}: OverlayMenuProps) => {
  const { sidebarConfig } = useContext(SidebarConfigContext);

  if (!open) return null;

  return (
    <>
      {/* Backdrop — covers area above the bottom nav bar */}
      <div
        className={cn('fixed inset-0 z-[1300] bg-black/50')}
        style={{ marginBottom: `${sidebarConfig.mobileSidebarHeight}px` }}
        onClick={onClose}
        role="presentation"
      />
      {/* Overlay content panel — slides up from above the bottom nav */}
      <div
        className={cn(
          'fixed left-0 right-0 z-[1400] overflow-auto',
          'bg-[var(--sidebar-nav-bg,#171717)]',
        )}
        style={{
          bottom: `${sidebarConfig.mobileSidebarHeight}px`,
          height: `calc(100% - ${sidebarConfig.mobileSidebarHeight}px)`,
        }}
        role="dialog"
      >
        <div
          className={cn(
            'flex items-center justify-between px-3 py-2',
            'text-[var(--sidebar-nav-color,#b5b5b5)]',
          )}
        >
          <h3 className="text-lg font-semibold">{label}</h3>
          <button
            type="button"
            onClick={onClose}
            className={cn(
              'rounded-full p-2',
              'text-[var(--sidebar-nav-color,#b5b5b5)]',
              'hover:bg-white/10',
            )}
            aria-label="Close menu"
          >
            <CloseIcon size={24} />
          </button>
        </div>
        <nav>{children}</nav>
      </div>
    </>
  );
};

/**
 * A navigation component for mobile screens, which sticks to the bottom.
 *
 * @remarks
 * It alternates the normal sidebar by grouping the `SidebarItems` based on provided `SidebarGroup`s
 * either rendering them as a link or an overlay menu.
 * If no `SidebarGroup`s are provided the sidebar content is wrapped in an default overlay menu.
 *
 * @public
 */
export const MobileSidebar = (props: MobileSidebarProps) => {
  const { sidebarConfig } = useContext(SidebarConfigContext);
  const { children } = props;
  const location = useLocation();
  const [selectedMenuItemIndex, setSelectedMenuItemIndex] =
    useState<number>(-1);

  useEffect(() => {
    setSelectedMenuItemIndex(-1);
  }, [location.pathname]);

  // Filter children for SidebarGroups
  //
  // Directly comparing child.type with SidebarSubmenu will not work with in
  // combination with react-hot-loader
  //
  // https://github.com/gaearon/react-hot-loader/issues/304#issuecomment-456569720
  let sidebarGroups = useElementFilter(children, elements =>
    elements.getElements().filter(child => child.type === sidebarGroupType),
  );

  if (!children) {
    // If Sidebar has no children the MobileSidebar won't be rendered
    return null;
  } else if (!sidebarGroups.length) {
    // If Sidebar has no SidebarGroup as a children a default
    // SidebarGroup with the complete Sidebar content will be created
    sidebarGroups.push(
      <SidebarGroup key="default_menu" icon={<MenuIcon />}>
        {children}
      </SidebarGroup>,
    );
  } else {
    // Sort SidebarGroups for the given Priority
    sidebarGroups = sortSidebarGroupsForPriority(sidebarGroups);
  }

  const shouldShowGroupChildren =
    selectedMenuItemIndex >= 0 &&
    !sidebarGroups[selectedMenuItemIndex].props.to;

  return (
    <SidebarOpenStateProvider value={{ isOpen: true, setOpen: () => {} }}>
      <MobileSidebarContext.Provider
        value={{ selectedMenuItemIndex, setSelectedMenuItemIndex }}
      >
        <OverlayMenu
          label={
            sidebarGroups[selectedMenuItemIndex] &&
            (sidebarGroups[selectedMenuItemIndex]!.props.label as string)
          }
          open={shouldShowGroupChildren}
          onClose={() => setSelectedMenuItemIndex(-1)}
        >
          {sidebarGroups[selectedMenuItemIndex] &&
            (sidebarGroups[selectedMenuItemIndex].props.children as ReactNode)}
        </OverlayMenu>
        <nav
          className={cn(
            'fixed bottom-0 left-0 right-0 z-[1400] flex justify-around',
            'border-t border-[#383838]',
            'bg-[var(--sidebar-nav-bg,#171717)]',
            'text-[var(--sidebar-nav-color,#b5b5b5)]',
            'print:hidden',
          )}
          style={{ height: `${sidebarConfig.mobileSidebarHeight}px` }}
          data-testid="mobile-sidebar-root"
        >
          {/* Inject the value (index) prop into each SidebarGroup so that
              MobileSidebarGroup knows its position — replicates the behavior
              that MUI BottomNavigation provided via React.cloneElement. */}
          {sidebarGroups.map((group, index) =>
            cloneElement(group, { value: index, key: group.key ?? index }),
          )}
        </nav>
      </MobileSidebarContext.Provider>
    </SidebarOpenStateProvider>
  );
};
