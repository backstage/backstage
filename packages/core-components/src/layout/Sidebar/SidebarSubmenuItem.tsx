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

import { type CSSProperties, useContext, useState } from 'react';
import { resolvePath, useLocation, useResolvedPath } from 'react-router-dom';
import { Link } from '../../components/Link';
import { IconComponent } from '@backstage/core-plugin-api';
import { cn } from '../../lib/utils';
import { ChevronDown, ChevronUp } from 'lucide-react';
import {
  ShadcnTooltip,
  TooltipTrigger,
  TooltipContent,
  TooltipProvider,
} from '../../components/ui/tooltip';
import { SidebarItemWithSubmenuContext } from './config';
import { isLocationMatch } from './utils';

/**
 * Class key type for the SidebarSubmenuItem component.
 *
 * @remarks
 * Retained for backward compatibility with the public API contract and
 * the overridableComponents system. Consumers referencing this type for
 * custom theme overrides should migrate to CSS custom property-based
 * theming (e.g. `--sidebar-nav-color`, `--sidebar-nav-hover-bg`).
 *
 * @public
 */
export type SidebarSubmenuItemClassKey =
  | 'item'
  | 'itemContainer'
  | 'selected'
  | 'label'
  | 'subtitle'
  | 'dropdownArrow'
  | 'dropdown'
  | 'dropdownItem'
  | 'textContent';

/* -------------------------------------------------------------------------
 * Tailwind utility class constants — centralised for readability and reuse.
 * CSS custom properties allow theme-level customisation without rebuilding:
 *   --sidebar-nav-color          navigation text color (default #b5b5b5)
 *   --sidebar-nav-hover-bg       hover background       (default #404040)
 *   --sidebar-nav-selected-color hover/selected text    (default #fff)
 * ----------------------------------------------------------------------- */

/** Base item styles applied to every submenu row (button or link). */
const ITEM_CLASSES =
  'flex items-center h-12 w-full cursor-pointer relative bg-transparent border-none px-2.5 py-2.5 font-[inherit] text-[var(--sidebar-nav-color,#b5b5b5)] hover:bg-[var(--sidebar-nav-hover-bg,#404040)] hover:text-[var(--sidebar-nav-selected-color,#fff)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--sidebar-primary,#fff)] focus-visible:ring-inset';

/** Active / selected state overlay. */
const SELECTED_CLASSES = 'bg-[#6f6f6f] text-white';

/** Title label inside a submenu row. */
const LABEL_CLASSES =
  'mx-1 my-[7px] text-sm whitespace-nowrap overflow-hidden text-ellipsis leading-none';

/** Subtitle line beneath the title. */
const SUBTITLE_CLASSES =
  'text-[10px] whitespace-nowrap overflow-hidden text-ellipsis';

/** Dropdown expand/collapse chevron icon. */
const DROPDOWN_ARROW_CLASSES = 'absolute right-[21px]';

/** Vertical dropdown container. */
const DROPDOWN_CLASSES = 'flex flex-col items-end';

/** Individual dropdown link row. */
const DROPDOWN_ITEM_CLASSES =
  'w-full py-2.5 hover:bg-[var(--sidebar-nav-hover-bg,#404040)] hover:text-[var(--sidebar-nav-selected-color,#fff)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--sidebar-primary,#fff)] focus-visible:ring-inset';

/** Text content inside a dropdown link row. */
const TEXT_CONTENT_CLASSES =
  'text-[var(--sidebar-nav-color,#b5b5b5)] pl-4 pr-1 text-sm whitespace-nowrap overflow-hidden text-ellipsis';

/**
 * Clickable item displayed when submenu item is clicked.
 * title: Text content of item
 * to: Path to navigate to when item is clicked
 *
 * @public
 */
export type SidebarSubmenuItemDropdownItem = {
  title: string;
  to: string;
};

/**
 * Holds submenu item content.
 *
 * @remarks
 * title: Text content of submenu item
 * subtitle: A subtitle displayed under the main title
 * to: Path to navigate to when item is clicked
 * icon: Icon displayed on the left of text content
 * dropdownItems: Optional array of dropdown items displayed when submenu item is clicked.
 *
 * @public
 */
export type SidebarSubmenuItemProps = {
  title: string;
  subtitle?: string;
  to?: string;
  icon?: IconComponent;
  dropdownItems?: SidebarSubmenuItemDropdownItem[];
  exact?: boolean;
  initialShowDropdown?: boolean;
};

/**
 * Item used inside a submenu within the sidebar.
 *
 * @public
 */
export const SidebarSubmenuItem = (props: SidebarSubmenuItemProps) => {
  const { title, subtitle, to, icon: Icon, dropdownItems, exact } = props;
  const { setIsHoveredOn } = useContext(SidebarItemWithSubmenuContext);
  const closeSubmenu = () => {
    setIsHoveredOn(false);
  };
  const toLocation = useResolvedPath(to ?? '');
  const currentLocation = useLocation();
  let isActive = isLocationMatch(currentLocation, toLocation, exact);

  const [showDropDown, setShowDropDown] = useState(
    props.initialShowDropdown ?? false,
  );
  const handleClickDropdown = () => {
    setShowDropDown(!showDropDown);
  };

  /* ---------- Dropdown variant (button + collapsible item list) ---------- */
  if (dropdownItems !== undefined) {
    dropdownItems.some(item => {
      const resolvedPath = resolvePath(item.to);
      isActive = isLocationMatch(currentLocation, resolvedPath, exact);
      return isActive;
    });

    return (
      <TooltipProvider delayDuration={500}>
        <div className="w-full">
          {/* Main toggle button with tooltip */}
          <ShadcnTooltip>
            <TooltipTrigger asChild>
              <button
                type="button"
                onClick={handleClickDropdown}
                onTouchStart={e => e.stopPropagation()}
                className={cn(
                  ITEM_CLASSES,
                  'normal-case justify-start',
                  isActive && SELECTED_CLASSES,
                )}
                style={{ '--tw-ring-color': '#fff' } as CSSProperties}
              >
                {Icon && <Icon fontSize="small" />}
                <span className={LABEL_CLASSES}>
                  {title}
                  <br />
                  {subtitle && (
                    <span className={SUBTITLE_CLASSES}>{subtitle}</span>
                  )}
                </span>
                {showDropDown ? (
                  <ChevronUp className={DROPDOWN_ARROW_CLASSES} />
                ) : (
                  <ChevronDown className={DROPDOWN_ARROW_CLASSES} />
                )}
              </button>
            </TooltipTrigger>
            <TooltipContent>{title}</TooltipContent>
          </ShadcnTooltip>

          {/* Collapsible dropdown items */}
          {dropdownItems && showDropDown && (
            <div className={DROPDOWN_CLASSES}>
              {dropdownItems.map((object, key) => (
                <ShadcnTooltip key={key}>
                  <TooltipTrigger asChild>
                    <Link
                      to={object.to}
                      className={cn(
                        'no-underline hover:no-underline',
                        DROPDOWN_ITEM_CLASSES,
                      )}
                      style={{ '--tw-ring-color': '#fff' } as CSSProperties}
                      onClick={closeSubmenu}
                      onTouchStart={e => e.stopPropagation()}
                    >
                      <span className={TEXT_CONTENT_CLASSES}>
                        {object.title}
                      </span>
                    </Link>
                  </TooltipTrigger>
                  <TooltipContent>{object.title}</TooltipContent>
                </ShadcnTooltip>
              ))}
            </div>
          )}
        </div>
      </TooltipProvider>
    );
  }

  /* ---------- Standard link variant (no dropdown) ---------- */
  return (
    <TooltipProvider delayDuration={500}>
      <div className="w-full">
        <ShadcnTooltip>
          <TooltipTrigger asChild>
            <Link
              to={to!}
              className={cn(
                'no-underline hover:no-underline',
                ITEM_CLASSES,
                isActive && SELECTED_CLASSES,
              )}
              style={{ '--tw-ring-color': '#fff' } as CSSProperties}
              onClick={closeSubmenu}
              onTouchStart={e => e.stopPropagation()}
            >
              {Icon && <Icon fontSize="small" />}
              <span className={LABEL_CLASSES}>
                {title}
                <br />
                {subtitle && (
                  <span className={SUBTITLE_CLASSES}>{subtitle}</span>
                )}
              </span>
            </Link>
          </TooltipTrigger>
          <TooltipContent>{title}</TooltipContent>
        </ShadcnTooltip>
      </div>
    </TooltipProvider>
  );
};
