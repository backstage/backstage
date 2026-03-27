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

import {
  IconComponent,
  useAnalytics,
  useElementFilter,
} from '@backstage/core-plugin-api';
import { ChevronDown, ChevronUp, ChevronRight, Search } from 'lucide-react';
import { cn } from '../../lib/utils';
import type { Location } from 'history';

import {
  ComponentProps,
  ComponentType,
  CSSProperties,
  forwardRef,
  KeyboardEventHandler,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  MouseEvent,
  ChangeEvent,
  ReactElement,
  createElement,
} from 'react';

import {
  Link,
  NavLinkProps,
  resolvePath,
  useLocation,
  useResolvedPath,
} from 'react-router-dom';

import {
  SidebarConfig,
  SidebarConfigContext,
  SidebarItemWithSubmenuContext,
} from './config';
import DoubleArrowLeft from './icons/DoubleArrowLeft';
import DoubleArrowRight from './icons/DoubleArrowRight';
import { useSidebarOpenState } from './SidebarOpenStateContext';
import { SidebarSubmenu, SidebarSubmenuProps } from './SidebarSubmenu';
import { SidebarSubmenuItemProps } from './SidebarSubmenuItem';
import { isLocationMatch } from './utils';

/** @public */
export type SidebarItemClassKey =
  | 'root'
  | 'buttonItem'
  | 'closed'
  | 'open'
  | 'highlightable'
  | 'highlighted'
  | 'label'
  | 'iconContainer'
  | 'searchRoot'
  | 'searchField'
  | 'searchFieldHTMLInput'
  | 'searchContainer'
  | 'secondaryAction'
  | 'closedItemIcon'
  | 'submenuArrow'
  | 'expandButton'
  | 'arrows'
  | 'selected';

/**
 * Returns Tailwind class names for sidebar item states.
 * Replaces the MUI makeStyles block. Dynamic widths that depend on
 * sidebarConfig values are applied via inline `style` at the call site.
 */
function getSidebarItemClasses(_sidebarConfig: SidebarConfig) {
  return {
    root: 'flex flex-row flex-nowrap items-center h-12 cursor-pointer text-[var(--sidebar-nav-color,#b5b5b5)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--sidebar-primary,#fff)] focus-visible:ring-inset',
    buttonItem:
      'bg-transparent border-none w-full m-0 p-0 text-left font-inherit normal-case',
    closed: 'justify-center',
    open: '',
    highlightable: 'hover:bg-[var(--sidebar-nav-hover-bg,#404040)]',
    highlighted: 'bg-[var(--sidebar-nav-hover-bg,#404040)]',
    label:
      'font-bold whitespace-nowrap leading-none flex-[3_1_auto] w-[110px] overflow-hidden text-ellipsis',
    iconContainer:
      'box-border h-full flex items-center justify-center leading-none',
    searchRoot: 'mb-3',
    searchField: 'text-[#b5b5b5] font-bold text-sm',
    searchFieldHTMLInput: 'py-4 px-0',
    searchContainer: '',
    secondaryAction: 'w-12 text-center mr-2',
    closedItemIcon: 'w-full justify-center',
    submenuArrow: 'flex',
    expandButton:
      'bg-transparent border-none text-[var(--sidebar-nav-color,#b5b5b5)] w-full cursor-pointer relative h-12 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--sidebar-primary,#fff)] focus-visible:ring-inset',
    arrows: 'absolute right-2.5',
    /** Marker class + Tailwind color for the selected (active link) state.
     *  Border-left is applied via inline style because selectedIndicatorWidth
     *  is dynamic. Child offset adjustments (iconContainer marginLeft,
     *  closedItemIcon paddingRight) are also applied via inline style. */
    selected:
      'sidebar-item-selected text-[var(--sidebar-nav-selected-color,#fff)]',
  };
}

/**
 * Memoised wrapper around getSidebarItemClasses – replaces MUI useMemoStyles.
 */
function useSidebarClasses(sidebarConfig: SidebarConfig) {
  return useMemo(() => getSidebarItemClasses(sidebarConfig), [sidebarConfig]);
}

/**
 * Evaluates the routes of the SubmenuItems & nested DropdownItems.
 * The reevaluation is only triggered, if the `locationPathname` changes, as `useElementFilter` uses memorization.
 *
 * @param submenu SidebarSubmenu component
 * @param location Location
 * @returns boolean
 */
const useLocationMatch = (
  submenu: ReactElement<SidebarSubmenuProps>,
  location: Location,
): boolean =>
  useElementFilter(
    submenu.props.children,
    elements => {
      let active = false;
      elements
        .getElements()
        .forEach(
          ({
            props: { to, dropdownItems },
          }: {
            props: Partial<SidebarSubmenuItemProps>;
          }) => {
            if (!active) {
              if (dropdownItems?.length) {
                dropdownItems.forEach(
                  ({ to: _to }) =>
                    (active =
                      active || isLocationMatch(location, resolvePath(_to))),
                );
                return;
              }
              if (to) {
                active = isLocationMatch(location, resolvePath(to));
              }
            }
          },
        );
      return active;
    },
    [location.pathname],
  );

type SidebarItemBaseProps = {
  icon: IconComponent;
  text?: string;
  hasNotifications?: boolean;
  hasSubmenu?: boolean;
  disableHighlight?: boolean;
  className?: string;
  noTrack?: boolean;
  onClick?: (ev: MouseEvent) => void;
};

type SidebarItemButtonProps = SidebarItemBaseProps & {
  onClick: (ev: MouseEvent) => void;
  children?: ReactNode;
};

type SidebarItemLinkProps = SidebarItemBaseProps & {
  to: string;
  onClick?: (ev: MouseEvent) => void;
} & NavLinkProps;

type SidebarItemWithSubmenuProps = SidebarItemBaseProps & {
  to?: string;
  onClick?: (ev: MouseEvent) => void;
  children: ReactNode;
};

/**
 * SidebarItem with 'to' property will be a clickable link.
 * SidebarItem with 'onClick' property and without 'to' property will be a clickable button.
 * SidebarItem which wraps a SidebarSubmenu will be a clickable button which opens a submenu.
 */
type SidebarItemProps =
  | SidebarItemLinkProps
  | SidebarItemButtonProps
  | SidebarItemWithSubmenuProps;

function isButtonItem(
  props: SidebarItemProps,
): props is SidebarItemButtonProps {
  return (props as SidebarItemLinkProps).to === undefined;
}

const sidebarSubmenuType = createElement(SidebarSubmenu).type;

// TODO(Rugvip): Remove this once NavLink is updated in react-router-dom.
//               This is needed because react-router doesn't handle the path comparison
//               properly yet, matching for example /foobar with /foo.
export const WorkaroundNavLink = forwardRef<
  HTMLAnchorElement,
  NavLinkProps & {
    children?: ReactNode;
    activeStyle?: CSSProperties;
    activeClassName?: string;
  }
>(function WorkaroundNavLinkWithRef(
  {
    to,
    end,
    style,
    className,
    activeStyle,
    caseSensitive,
    activeClassName = 'active',
    'aria-current': ariaCurrentProp = 'page',
    ...rest
  },
  ref,
) {
  let { pathname: locationPathname } = useLocation();
  let { pathname: toPathname } = useResolvedPath(to);

  if (!caseSensitive) {
    locationPathname = locationPathname.toLocaleLowerCase('en-US');
    toPathname = toPathname.toLocaleLowerCase('en-US');
  }

  let isActive = locationPathname === toPathname;
  if (!isActive && !end) {
    // This is the behavior that is different from the original NavLink
    isActive = locationPathname.startsWith(`${toPathname}/`);
  }

  const ariaCurrent = isActive ? ariaCurrentProp : undefined;

  return (
    <Link
      {...rest}
      to={to}
      ref={ref}
      aria-current={ariaCurrent}
      style={{ ...style, ...(isActive ? activeStyle : undefined) }}
      className={cn(
        typeof className !== 'function' ? className : undefined,
        isActive ? activeClassName : undefined,
      )}
    />
  );
});

/**
 * Common component used by SidebarItem & SidebarItemWithSubmenu
 */
const SidebarItemBase = forwardRef<
  any,
  SidebarItemProps & { children: ReactNode }
>((props, ref) => {
  const {
    icon: Icon,
    text,
    hasNotifications = false,
    hasSubmenu = false,
    disableHighlight = false,
    onClick,
    noTrack,
    children,
    className,
    ...navLinkProps
  } = props;
  const { sidebarConfig } = useContext(SidebarConfigContext);
  const classes = useSidebarClasses(sidebarConfig);
  // XXX (@koroeskohr): unsure this is optimal. But I just really didn't want to have the item component
  // depend on the current location, and at least have it being optionally forced to selected.
  // Still waiting on a Q answered to fine tune the implementation
  const { isOpen } = useSidebarOpenState();

  const analyticsApi = useAnalytics();
  const resolvedPathObj = useResolvedPath(
    !isButtonItem(props) && props.to ? props.to : '',
  );
  const location = useLocation();

  // Detect selected state to adjust child element offsets (compensating for
  // the border-left that appears when an item is active).
  const isSelected = useMemo(() => {
    if (isButtonItem(props)) {
      // For button items the parent (SidebarItemWithSubmenu) passes the
      // selected marker via className.
      return className?.includes('sidebar-item-selected') ?? false;
    }
    // For link items replicate WorkaroundNavLink's isActive logic.
    const locPath = location.pathname.toLocaleLowerCase('en-US');
    const toPath = resolvedPathObj.pathname.toLocaleLowerCase('en-US');
    if (locPath === toPath) return true;
    if (!(props as SidebarItemLinkProps).end) {
      return locPath.startsWith(`${toPath}/`);
    }
    return false;
  }, [location.pathname, resolvedPathObj.pathname, className, props]);

  // Determine the root width — dynamic from sidebarConfig
  const rootWidth = isOpen
    ? sidebarConfig.drawerWidthOpen
    : sidebarConfig.drawerWidthClosed;

  const divStyle: CSSProperties =
    !isOpen && hasSubmenu
      ? { display: 'flex', marginLeft: '20px' }
      : { lineHeight: '0' };

  const displayItemIcon = (
    <div style={divStyle}>
      <Icon fontSize="small" />
      {!isOpen && hasSubmenu ? <ChevronRight size={16} /> : <></>}
    </div>
  );

  // Notification badge — replaces MUI Badge with a custom dot indicator
  const itemIcon = (
    <div
      className={cn('relative', !isOpen && classes.closedItemIcon)}
      style={
        isSelected && !isOpen
          ? { paddingRight: sidebarConfig.selectedIndicatorWidth }
          : undefined
      }
    >
      {displayItemIcon}
      {hasNotifications && (
        <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-500 ring-2 ring-[var(--sidebar-nav-bg,#171717)]" />
      )}
    </div>
  );

  const openContent = (
    <>
      <div
        data-testid="login-button"
        className={classes.iconContainer}
        style={{
          width: sidebarConfig.iconContainerWidth,
          marginRight: -16,
          ...(isSelected && {
            marginLeft: -sidebarConfig.selectedIndicatorWidth,
          }),
        }}
      >
        {itemIcon}
      </div>
      {text && <span className={classes.label}>{text}</span>}
      <div className={classes.secondaryAction}>{children}</div>
    </>
  );

  const content = isOpen ? openContent : itemIcon;

  // Selected border applied inline — width depends on dynamic sidebarConfig
  const selectedBorderStyle: CSSProperties = isSelected
    ? {
        borderLeft: `solid ${sidebarConfig.selectedIndicatorWidth}px var(--sidebar-nav-indicator, #9BF0E1)`,
      }
    : {};

  const childProps = {
    onClick,
    className: cn(
      className,
      classes.root,
      isOpen ? classes.open : classes.closed,
      isButtonItem(props) && classes.buttonItem,
      { [classes.highlightable]: !disableHighlight },
    ),
    style: {
      width: rootWidth,
      ...(isButtonItem(props) ? selectedBorderStyle : {}),
      /* Sidebar always uses a dark surface — force white focus ring for
         WCAG 2.4.7 / 2.4.11 compliant contrast.  Tailwind's universal
         reset prevents inheritance of --tw-ring-color from parent <nav>. */
      '--tw-ring-color': '#fff',
    } as CSSProperties,
  };

  const handleClick = useCallback(
    (event: MouseEvent<HTMLAnchorElement | HTMLButtonElement>) => {
      if (!noTrack) {
        const action = 'click';
        const subject = text ?? 'Sidebar Item';
        const options = resolvedPathObj.pathname
          ? { attributes: { to: resolvedPathObj.pathname } }
          : undefined;
        analyticsApi.captureEvent(action, subject, options);
      }
      onClick?.(event);
    },
    [analyticsApi, text, resolvedPathObj.pathname, noTrack, onClick],
  );

  if (isButtonItem(props)) {
    return (
      <button aria-label={text} {...childProps} ref={ref} onClick={handleClick}>
        {content}
      </button>
    );
  }

  return (
    <WorkaroundNavLink
      {...childProps}
      activeClassName={classes.selected}
      activeStyle={{
        borderLeft: `solid ${sidebarConfig.selectedIndicatorWidth}px var(--sidebar-nav-indicator, #9BF0E1)`,
      }}
      to={props.to ? props.to : ''}
      ref={ref}
      aria-label={text ? text : props.to}
      {...navLinkProps}
      onClick={handleClick}
    >
      {content}
    </WorkaroundNavLink>
  );
});

const SidebarItemWithSubmenu = ({
  children,
  ...props
}: SidebarItemBaseProps & {
  children: ReactElement<SidebarSubmenuProps>;
}) => {
  const { sidebarConfig } = useContext(SidebarConfigContext);
  const classes = useSidebarClasses(sidebarConfig);
  const [isHoveredOn, setIsHoveredOn] = useState(false);
  const location = useLocation();
  const isActive = useLocationMatch(children, location);

  // Replaces MUI useMediaQuery — small screen detection (max-width: 599.95px)
  const [isSmallScreen, setIsSmallScreen] = useState(false);
  useEffect(() => {
    if (
      typeof window === 'undefined' ||
      typeof window.matchMedia !== 'function'
    )
      return undefined;
    const mql = window.matchMedia('(max-width: 599.95px)');
    setIsSmallScreen(mql.matches);
    const handler = (e: MediaQueryListEvent) => setIsSmallScreen(e.matches);
    mql.addEventListener('change', handler);
    return () => mql.removeEventListener('change', handler);
  }, []);

  const handleMouseEnter = () => {
    setIsHoveredOn(true);
  };
  const handleMouseLeave = () => {
    setIsHoveredOn(false);
  };

  const arrowIcon = () => {
    if (isSmallScreen) {
      return isHoveredOn ? (
        <ChevronUp size={16} className={classes.submenuArrow} />
      ) : (
        <ChevronDown size={16} className={classes.submenuArrow} />
      );
    }
    return (
      !isHoveredOn && (
        <ChevronRight size={16} className={classes.submenuArrow} />
      )
    );
  };

  return (
    <SidebarItemWithSubmenuContext.Provider
      value={{
        isHoveredOn,
        setIsHoveredOn,
      }}
    >
      <div
        data-testid="item-with-submenu"
        onMouseLeave={handleMouseLeave}
        onTouchStart={isHoveredOn ? handleMouseLeave : handleMouseEnter}
        onMouseEnter={handleMouseEnter}
        className={cn(isHoveredOn && classes.highlighted)}
      >
        <SidebarItemBase
          hasSubmenu
          className={isActive ? classes.selected : ''}
          {...props}
        >
          {arrowIcon()}
        </SidebarItemBase>
        {isHoveredOn && children}
      </div>
    </SidebarItemWithSubmenuContext.Provider>
  );
};

/**
 * Creates a `SidebarItem`
 *
 * @remarks
 * If children contain a `SidebarSubmenu` component the `SidebarItem` will have a expandable submenu
 */
export const SidebarItem = forwardRef<
  any,
  SidebarItemProps & { children: ReactNode }
>((props, ref) => {
  // Filter children for SidebarSubmenu components
  const [submenu] = useElementFilter(props.children, elements =>
    // Directly comparing child.type with SidebarSubmenu will not work with in
    // combination with react-hot-loader
    //
    // https://github.com/gaearon/react-hot-loader/issues/304#issuecomment-456569720
    elements.getElements().filter(child => child.type === sidebarSubmenuType),
  );

  if (submenu) {
    return (
      <SidebarItemWithSubmenu {...props}>
        {submenu as ReactElement<SidebarSubmenuProps>}
      </SidebarItemWithSubmenu>
    );
  }

  return <SidebarItemBase {...props} ref={ref} />;
}) as (props: SidebarItemProps) => JSX.Element;

type SidebarSearchFieldProps = {
  onSearch: (input: string) => void;
  to?: string;
  icon?: IconComponent;
};

/**
 * Default search icon adapter — wraps the lucide-react Search icon to
 * conform to Backstage's IconComponent interface (fontSize prop mapping).
 */
const searchIconSizeMap: Record<string, number> = {
  small: 16,
  large: 32,
  medium: 24,
  inherit: 24,
};
const DefaultSearchIcon: IconComponent = ({ fontSize }) => {
  const size = searchIconSizeMap[fontSize ?? 'medium'] ?? 24;
  return <Search size={size} />;
};

export function SidebarSearchField(props: SidebarSearchFieldProps) {
  const { sidebarConfig } = useContext(SidebarConfigContext);
  const [input, setInput] = useState('');
  const classes = useSidebarClasses(sidebarConfig);
  const Icon = props.icon ? props.icon : DefaultSearchIcon;

  const search = () => {
    props.onSearch(input);
    setInput('');
  };

  const handleEnter: KeyboardEventHandler = ev => {
    if (ev.key === 'Enter') {
      ev.preventDefault();
      search();
    }
  };

  const handleInput = (ev: ChangeEvent<HTMLInputElement>) => {
    setInput(ev.target.value);
  };

  const handleInputClick = (ev: MouseEvent<HTMLInputElement>) => {
    // Clicking into the search fields shouldn't navigate to the search page
    ev.preventDefault();
    ev.stopPropagation();
  };

  const handleItemClick = (ev: MouseEvent) => {
    // Clicking on the search icon while should execute a query with the current field content
    search();
    ev.preventDefault();
  };

  return (
    <div className={classes.searchRoot}>
      <SidebarItem
        icon={Icon}
        to={props.to}
        onClick={handleItemClick}
        disableHighlight
      >
        <input
          type="text"
          placeholder="Search"
          value={input}
          onClick={handleInputClick}
          onChange={handleInput}
          onKeyDown={handleEnter}
          className={cn(
            classes.searchField,
            classes.searchFieldHTMLInput,
            'bg-transparent border-none outline-none',
          )}
          style={{
            width:
              sidebarConfig.drawerWidthOpen - sidebarConfig.iconContainerWidth,
          }}
        />
      </SidebarItem>
    </div>
  );
}

export type SidebarSpaceClassKey = 'root';

export const SidebarSpace = forwardRef<HTMLDivElement, ComponentProps<'div'>>(
  ({ className: spClassName, ...spProps }, spRef) => (
    <div ref={spRef} className={cn('flex-1', spClassName)} {...spProps} />
  ),
) as ComponentType<ComponentProps<'div'>>;

export type SidebarSpacerClassKey = 'root';

export const SidebarSpacer = forwardRef<HTMLDivElement, ComponentProps<'div'>>(
  ({ className: spacerClassName, ...spacerProps }, spacerRef) => (
    <div
      ref={spacerRef}
      className={cn('h-2', spacerClassName)}
      {...spacerProps}
    />
  ),
) as ComponentType<ComponentProps<'div'>>;

export type SidebarDividerClassKey = 'root';

export const SidebarDivider = forwardRef<HTMLHRElement, ComponentProps<'hr'>>(
  ({ className: dividerClassName, ...dividerProps }, dividerRef) => (
    <hr
      ref={dividerRef}
      className={cn(
        'h-px w-full bg-[#383838] border-none my-[9.6px]',
        dividerClassName,
      )}
      {...dividerProps}
    />
  ),
) as ComponentType<ComponentProps<'hr'>>;

/**
 * Scrollable wrapper for sidebar content with custom scrollbar styling.
 * On hover-capable devices the scrollbar appears only on hover; on touch
 * devices it is always visible.
 */
export const SidebarScrollWrapper = forwardRef<
  HTMLDivElement,
  ComponentProps<'div'>
>(({ className: scrollClassName, ...scrollProps }, scrollRef) => (
  <div
    ref={scrollRef}
    className={cn(
      'flex-[0_1_auto] overflow-x-hidden w-full min-h-[48px] overflow-y-hidden',
      'hover:overflow-y-auto',
      'hover:[&::-webkit-scrollbar]:w-[5px] hover:[&::-webkit-scrollbar]:rounded-[5px] hover:[&::-webkit-scrollbar]:bg-[var(--background,#f8f8f8)]',
      'hover:[&::-webkit-scrollbar-thumb]:rounded-[5px] hover:[&::-webkit-scrollbar-thumb]:bg-[var(--muted-foreground,#6b7280)]',
      '[@media(hover:none)]:overflow-y-auto',
      '[@media(hover:none)]:[&::-webkit-scrollbar]:w-[5px] [@media(hover:none)]:[&::-webkit-scrollbar]:rounded-[5px] [@media(hover:none)]:[&::-webkit-scrollbar]:bg-[var(--background,#f8f8f8)]',
      '[@media(hover:none)]:[&::-webkit-scrollbar-thumb]:rounded-[5px] [@media(hover:none)]:[&::-webkit-scrollbar-thumb]:bg-[var(--muted-foreground,#6b7280)]',
      scrollClassName,
    )}
    {...scrollProps}
  />
)) as ComponentType<ComponentProps<'div'>>;

/**
 * A button which allows you to expand the sidebar when clicked.
 *
 * @remarks
 * Use optionally to replace sidebar's expand-on-hover feature with expand-on-click.
 *
 * If you are using this you might want to set the `disableExpandOnHover` of the `Sidebar` to `true`.
 *
 * @public
 */
export const SidebarExpandButton = () => {
  const { sidebarConfig } = useContext(SidebarConfigContext);
  const classes = useSidebarClasses(sidebarConfig);
  const { isOpen, setOpen } = useSidebarOpenState();

  // Replaces MUI useMediaQuery — medium screen detection (max-width: 959.95px).
  // Defaults to false on mount (equivalent to noSsr: true in MUI).
  const [isSmallScreen, setIsSmallScreen] = useState(false);
  useEffect(() => {
    if (
      typeof window === 'undefined' ||
      typeof window.matchMedia !== 'function'
    )
      return undefined;
    const mql = window.matchMedia('(max-width: 959.95px)');
    setIsSmallScreen(mql.matches);
    const handler = (e: MediaQueryListEvent) => setIsSmallScreen(e.matches);
    mql.addEventListener('change', handler);
    return () => mql.removeEventListener('change', handler);
  }, []);

  if (isSmallScreen) {
    return null;
  }

  const handleClick = () => {
    setOpen(!isOpen);
  };

  return (
    <button
      onClick={handleClick}
      className={classes.expandButton}
      style={{ '--tw-ring-color': '#fff' } as CSSProperties}
      aria-label="Expand Sidebar"
      data-testid="sidebar-expand-button"
    >
      <div className={classes.arrows}>
        {isOpen ? <DoubleArrowLeft /> : <DoubleArrowRight />}
      </div>
    </button>
  );
};
