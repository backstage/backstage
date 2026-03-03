/*
 * Copyright 2021 The Backstage Authors
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

import { ReactNode, useContext, useEffect, useState } from 'react';

import { cn } from '../../lib/utils';
import { SidebarConfigContext, SidebarItemWithSubmenuContext } from './config';
import { useSidebarOpenState } from './SidebarOpenStateContext';

/** @public */
export type SidebarSubmenuClassKey = 'root' | 'drawer' | 'drawerOpen' | 'title';

/**
 * Holds a title for text Header of a sidebar submenu and children
 * components to be rendered inside SidebarSubmenu
 *
 * @public
 */
export type SidebarSubmenuProps = {
  title?: string;
  children: ReactNode;
};

/**
 * Used inside SidebarItem to display an expandable Submenu
 *
 * @public
 */
export const SidebarSubmenu = (props: SidebarSubmenuProps) => {
  const { isOpen } = useSidebarOpenState();
  const { sidebarConfig, submenuConfig } = useContext(SidebarConfigContext);
  const left = isOpen
    ? sidebarConfig.drawerWidthOpen
    : sidebarConfig.drawerWidthClosed;

  const { isHoveredOn } = useContext(SidebarItemWithSubmenuContext);
  const [isSubmenuOpen, setIsSubmenuOpen] = useState(false);

  useEffect(() => {
    setIsSubmenuOpen(isHoveredOn);
  }, [isHoveredOn]);

  return (
    <div
      className={cn(
        'flex flex-col items-start fixed opacity-0 top-0 bottom-0 p-0 overflow-x-hidden cursor-default shrink-0',
        '[scrollbar-width:none] [-ms-overflow-style:none] [&>*]:shrink-0 [&::-webkit-scrollbar]:hidden',
        'bg-[var(--sidebar-submenu-bg,#404040)]',
        'transition-none sm:transition-[margin-left,opacity,width]',
        isSubmenuOpen &&
          'opacity-100 max-sm:w-full max-sm:relative max-sm:pl-6 max-sm:left-0 max-sm:top-0',
      )}
      style={{
        marginLeft: left,
        width: isSubmenuOpen
          ? submenuConfig.drawerWidthOpen
          : submenuConfig.drawerWidthClosed,
        transitionDuration: `${submenuConfig.defaultOpenDelayMs}ms`,
        transitionDelay: isSubmenuOpen
          ? '0ms'
          : `${submenuConfig.defaultOpenDelayMs}ms`,
        transitionTimingFunction: 'cubic-bezier(0.4, 0, 0.6, 1)',
      }}
    >
      <span className="text-xl font-medium text-[var(--sidebar-nav-color,#b5b5b5)] p-2.5 max-sm:hidden">
        {props.title}
      </span>
      {props.children}
    </div>
  );
};
