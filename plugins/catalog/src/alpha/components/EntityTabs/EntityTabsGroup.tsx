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
  ReactNode,
  forwardRef,
  useState,
  MouseEventHandler,
  ReactElement,
} from 'react';
import { Link } from 'react-router-dom';
import {
  cn,
  Popover,
  PopoverTrigger,
  PopoverContent,
} from '@backstage/core-components';
import { ShadcnButton as Button } from '@backstage/core-components';
import { ChevronDown } from 'lucide-react';
import { useApi } from '@backstage/core-plugin-api';
import { IconsApi, iconsApiRef } from '@backstage/frontend-plugin-api';

/**
 * Represents a single navigable item within an entity tab group.
 * Each item maps to a route path and optional icon for display.
 */
type EntityTabsGroupItem = {
  id: string;
  label: string;
  path: string;
  icon?: string | ReactElement;
};

/**
 * Props for the EntityTabsGroup component.
 *
 * @remarks
 * Replaces the previous MUI TabProps + HOC styling pattern with
 * explicit props and Tailwind CSS class-based customization via the
 * `classes` and `className` props.
 */
type EntityTabsGroupProps = {
  /** Additional CSS class names applied to the root tab button element. */
  className?: string;
  /**
   * Optional Tailwind CSS class name overrides for specific states.
   * Accepted keys: `root` (base styles), `selected` (active tab),
   * `disabled` (disabled tab). Values are Tailwind class strings.
   */
  classes?: Record<string, string | undefined>;
  /** Whether the tab is disabled and non-interactive. */
  disabled?: boolean;
  /** Whether this tab is currently selected/active. */
  selected?: boolean;
  /** Label displayed on the tab trigger (used for multi-item groups). */
  label?: ReactNode;
  /** Icon identifier or React element displayed alongside the label. */
  icon?: string | ReactElement;
  /** Value identifier for this tab group (used by parent tab list). */
  value?: string;
  /** Optional indicator element rendered after the tab label (e.g., badge). */
  indicator?: ReactNode;
  /** ID of the currently highlighted/selected sub-item within the group. */
  highlightedButton?: string;
  /** Array of navigable tab items within this group. */
  items: EntityTabsGroupItem[];
  /** Callback invoked when a tab item link is clicked. */
  onSelectTab?: MouseEventHandler<HTMLAnchorElement>;
  /** Whether to resolve and display icons for each tab item. */
  showIcons?: boolean;
  /** Test identifier forwarded to the root tab button element. */
  'data-testid'?: string | false;
};

/**
 * Resolves an icon from either a string identifier (via Backstage IconsApi)
 * or a React element. Returns undefined when icons are disabled or not found.
 */
function resolveIcon(
  icon: string | ReactElement | undefined,
  iconsApi: IconsApi,
  showIcons: boolean,
) {
  if (!showIcons) {
    return undefined;
  }
  if (typeof icon === 'string') {
    const Icon = iconsApi.getIcon(icon);
    if (Icon) {
      return <Icon />;
    }
    return undefined;
  }
  return icon;
}

/**
 * A tab group component that renders either a single navigable tab button
 * or a multi-item tab with a popover dropdown menu. Used by EntityTabsList
 * to display grouped entity content tabs.
 *
 * @remarks
 * - Single item: renders a shadcn Button (ghost variant) composed with
 *   React Router Link via asChild for direct navigation.
 * - Multiple items: renders a popover trigger button with a ChevronDown
 *   indicator and a dropdown list of navigable sub-items.
 * - Supports ref forwarding for parent focus management.
 * - Uses Backstage IconsApi for string-based icon resolution.
 *
 * @public
 */
export const EntityTabsGroup = forwardRef(function EntityTabsGroup(
  props: EntityTabsGroupProps,
  ref: any,
) {
  const [open, setOpen] = useState(false);
  const iconsApi = useApi(iconsApiRef);

  const {
    classes,
    className,
    disabled = false,
    items,
    indicator,
    label,
    onSelectTab,
    selected,
    highlightedButton,
    showIcons = false,
  } = props;

  const groupIcon = resolveIcon(props.icon, iconsApi, showIcons);
  const testId = 'data-testid' in props && props['data-testid'];

  const handleMenuClose = () => {
    setOpen(false);
  };

  /* Compose base tab button classes from Tailwind utilities, merging
     any consumer-provided class overrides for root, selected, and
     disabled states via the classes prop. */
  const tabBaseClasses = cn(
    'relative max-w-[264px] min-w-[72px] min-h-[48px] shrink-0 px-3 py-1.5 sm:px-6 sm:min-w-[160px] overflow-hidden whitespace-normal text-center',
    classes?.root,
    selected && 'text-foreground opacity-100',
    selected && classes?.selected,
    !selected && 'text-muted-foreground opacity-70',
    disabled && 'opacity-50 pointer-events-none',
    disabled && classes?.disabled,
    className,
  );

  /* Single-item tab: render as a direct navigation link styled as a
     ghost button, using asChild to compose Button with React Router Link. */
  if (items.length === 1) {
    const itemIcon = resolveIcon(items[0].icon, iconsApi, showIcons);
    return (
      <Button
        variant="ghost"
        data-testid={testId || undefined}
        className={tabBaseClasses}
        ref={ref}
        role="tab"
        aria-selected={selected}
        disabled={disabled}
        asChild
      >
        <Link to={items[0]?.path} onClick={onSelectTab}>
          {itemIcon && <span className="mr-2">{itemIcon}</span>}
          <span className="inline-flex items-center justify-center w-full flex-row text-sm font-medium uppercase">
            {items[0].label}
          </span>
          {indicator}
        </Link>
      </Button>
    );
  }

  /* Multi-item tab group: render a popover trigger button with a dropdown
     list of navigable sub-items. Radix Popover handles open/close state,
     keyboard navigation, and collision-aware positioning. */
  const hasIcons = showIcons && items.some(i => i.icon);
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          data-testid={testId || undefined}
          className={tabBaseClasses}
          ref={ref}
          role="tab"
          aria-selected={selected}
          disabled={disabled}
        >
          {groupIcon && <span className="mr-2">{groupIcon}</span>}
          <span className="inline-flex items-center justify-center w-full flex-row text-sm font-medium uppercase">
            {label}
          </span>
          <ChevronDown className="h-4 w-4 ml-1 shrink-0" />
        </Button>
      </PopoverTrigger>
      <PopoverContent align="center" className="w-auto p-0">
        <ul role="listbox" className="py-1">
          {items.map(i => {
            const itemIcon = resolveIcon(i.icon, iconsApi, showIcons);
            return (
              <li key={`popover_item_${i.id}`}>
                <Link
                  to={i.path}
                  onClick={e => {
                    handleMenuClose();
                    onSelectTab?.(e);
                  }}
                  className={cn(
                    'flex items-center gap-2 px-3 py-2 text-sm transition-colors hover:bg-accent hover:text-accent-foreground',
                    highlightedButton === i.id &&
                      'bg-accent text-accent-foreground font-medium',
                    disabled && 'opacity-50 pointer-events-none',
                  )}
                  aria-selected={highlightedButton === i.id}
                >
                  {itemIcon && (
                    <span className="shrink-0 w-5 h-5 flex items-center justify-center">
                      {itemIcon}
                    </span>
                  )}
                  {!itemIcon && hasIcons && (
                    <span className="shrink-0 w-5 h-5" />
                  )}
                  <span className="text-sm font-medium uppercase">
                    {i.label}
                  </span>
                  {indicator}
                </Link>
              </li>
            );
          })}
        </ul>
      </PopoverContent>
    </Popover>
  );
});
