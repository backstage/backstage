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
import { BackstageTheme } from '@backstage/theme';
import Badge from '@material-ui/core/Badge';
import Box from '@material-ui/core/Box';
import { makeStyles, styled, Theme } from '@material-ui/core/styles';
import {
  CreateCSSProperties,
  StyledComponentProps,
} from '@material-ui/core/styles/withStyles';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import ArrowDropDown from '@material-ui/icons/ArrowDropDown';
import ArrowDropUp from '@material-ui/icons/ArrowDropUp';
import ArrowRightIcon from '@material-ui/icons/ArrowRight';
import SearchIcon from '@material-ui/icons/Search';
import classnames from 'classnames';
import { Location } from 'history';
import React, {
  ComponentProps,
  ComponentType,
  CSSProperties,
  forwardRef,
  KeyboardEventHandler,
  ReactNode,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ElementRef,
  type Ref,
} from 'react';
import {
  Link,
  NavLinkProps as RRDNavLinkProps,
  To,
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
import { SidebarSubmenuProps } from './SidebarSubmenu';
import { SidebarSubmenuItemProps } from './SidebarSubmenuItem';
import { isLocationMatch } from './utils';
import Button from '@material-ui/core/Button';

type NavLinkProps = RRDNavLinkProps & { children?: ReactNode };

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

const makeSidebarStyles = (sidebarConfig: SidebarConfig) =>
  makeStyles<BackstageTheme>(
    theme => ({
      root: {
        color: theme.palette.navigation.color,
        display: 'flex',
        flexFlow: 'row nowrap',
        alignItems: 'center',
        height: 48,
        cursor: 'pointer',
      },
      buttonItem: {
        background: 'none',
        border: 'none',
        width: '100%',
        margin: 0,
        padding: 0,
        textAlign: 'inherit',
        font: 'inherit',
        textTransform: 'none',
      },
      closed: {
        width: sidebarConfig.drawerWidthClosed,
        justifyContent: 'center',
      },
      open: {
        [theme.breakpoints.up('sm')]: {
          width: sidebarConfig.drawerWidthOpen,
        },
      },
      highlightable: {
        '&:hover': {
          background:
            theme.palette.navigation.navItem?.hoverBackground ?? '#404040',
        },
      },
      highlighted: {
        background:
          theme.palette.navigation.navItem?.hoverBackground ?? '#404040',
      },
      label: {
        // XXX (@koroeskohr): I can't seem to achieve the desired font-weight from the designs
        fontWeight: 'bold',
        whiteSpace: 'nowrap',
        lineHeight: 'auto',
        flex: '3 1 auto',
        width: '110px',
        overflow: 'hidden',
        'text-overflow': 'ellipsis',
      },
      iconContainer: {
        boxSizing: 'border-box',
        height: '100%',
        width: sidebarConfig.iconContainerWidth,
        marginRight: -theme.spacing(2),
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        lineHeight: '0',
      },
      searchRoot: {
        marginBottom: 12,
      },
      searchField: {
        color: '#b5b5b5',
        fontWeight: theme.typography.fontWeightBold,
        fontSize: theme.typography.fontSize,
      },
      searchFieldHTMLInput: {
        padding: theme.spacing(2, 0, 2),
      },
      searchContainer: {
        width: sidebarConfig.drawerWidthOpen - sidebarConfig.iconContainerWidth,
      },
      secondaryAction: {
        width: theme.spacing(6),
        textAlign: 'center',
        marginRight: theme.spacing(1),
      },
      closedItemIcon: {
        width: '100%',
        justifyContent: 'center',
      },
      submenuArrow: {
        display: 'flex',
      },
      expandButton: {
        background: 'none',
        border: 'none',
        color: theme.palette.navigation.color,
        width: '100%',
        cursor: 'pointer',
        position: 'relative',
        height: 48,
      },
      arrows: {
        position: 'absolute',
        right: 10,
      },
      selected: {
        '&$root': {
          borderLeft: `solid ${sidebarConfig.selectedIndicatorWidth}px ${theme.palette.navigation.indicator}`,
          color: theme.palette.navigation.selectedColor,
        },
        '&$closed': {
          width: sidebarConfig.drawerWidthClosed,
        },
        '& $closedItemIcon': {
          paddingRight: sidebarConfig.selectedIndicatorWidth,
        },
        '& $iconContainer': {
          marginLeft: -sidebarConfig.selectedIndicatorWidth,
        },
      },
    }),
    { name: 'BackstageSidebarItem' },
  );

// This is a workaround for this issue https://github.com/mui/material-ui/issues/15511
// The styling of the `selected` elements doesn't work as expected when using a prop callback.
// Don't use this pattern unless needed
function useMemoStyles(sidebarConfig: SidebarConfig) {
  const useStyles = useMemo(
    () => makeSidebarStyles(sidebarConfig),
    [sidebarConfig],
  );
  return useStyles();
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
  submenu: React.ReactElement<SidebarSubmenuProps>,
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
  onClick?: (ev: React.MouseEvent) => void;
};

type SidebarItemButtonProps = SidebarItemBaseProps &
  React.ComponentProps<'button'> & {
    type: 'button';
  };

type SidebarItemLinkProps = SidebarItemBaseProps &
  NavLinkProps &
  React.ComponentProps<'a'> & {
    type: 'link';
    to: string;
  };

type SidebarItemWithSubmenuProps = SidebarItemBaseProps &
  React.ComponentProps<'nav'> & {
    type: 'submenu';
    children: React.ReactElement<SidebarSubmenuProps>;
  };

type RefTypeEnum = {
  button: ElementRef<'button'>;
  link: ElementRef<'a'>;
  submenu: ElementRef<'a'>;
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

type GetSidebarItemType<PropType extends SidebarItemProps> = PropType extends {
  type: infer ElementType;
}
  ? ElementType
  : never;

/* If the GetRefType has an error, update RefTypeEnum to include missing type */
type GetRefType<T extends SidebarItemProps> = Ref<
  RefTypeEnum[GetSidebarItemType<T>]
>;

// TODO(Rugvip): Remove this once NavLink is updated in react-router-dom.
//               This is needed because react-router doesn't handle the path comparison
//               properly yet, matching for example /foobar with /foo.
export const WorkaroundNavLink = React.forwardRef<
  ElementRef<'a'>,
  NavLinkProps & {
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
      className={classnames([
        className,
        isActive ? activeClassName : undefined,
      ])}
    />
  );
});

/**
 * Common component used by SidebarItem & SidebarItemWithSubmenu
 */
const SidebarItemBase = forwardRef(
  <T extends Exclude<SidebarItemProps, SidebarItemWithSubmenuProps>>(
    props: T,
    ref: GetRefType<T>,
  ) => {
    const {
      type,
      icon: Icon,
      text,
      hasNotifications = false,
      hasSubmenu = false,
      disableHighlight = false,
      onClick,
      noTrack,
      children,
      className,
      ...rest
    } = props;
    const { sidebarConfig } = useContext(SidebarConfigContext);
    const classes = useMemoStyles(sidebarConfig);
    // XXX (@koroeskohr): unsure this is optimal. But I just really didn't want to have the item component
    // depend on the current location, and at least have it being optionally forced to selected.
    // Still waiting on a Q answered to fine tune the implementation
    const { isOpen } = useSidebarOpenState();

    const divStyle =
      !isOpen && hasSubmenu
        ? { display: 'flex', marginLeft: '20px' }
        : { lineHeight: '0' };

    const displayItemIcon = (
      <Box style={divStyle}>
        <Icon fontSize="small" />
        {!isOpen && hasSubmenu ? <ArrowRightIcon fontSize="small" /> : <></>}
      </Box>
    );

    const itemIcon = (
      <Badge
        color="secondary"
        variant="dot"
        overlap="circular"
        invisible={!hasNotifications}
        className={classnames({ [classes.closedItemIcon]: !isOpen })}
      >
        {displayItemIcon}
      </Badge>
    );

    const openContent = (
      <>
        <Box data-testid="login-button" className={classes.iconContainer}>
          {itemIcon}
        </Box>
        {text && (
          <Typography
            variant="subtitle2"
            component="span"
            className={classes.label}
          >
            {text}
          </Typography>
        )}
        <div className={classes.secondaryAction}>{children}</div>
      </>
    );

    const content = isOpen ? openContent : itemIcon;

    const childProps = {
      onClick,
      className: classnames(
        className,
        classes.root,
        isOpen ? classes.open : classes.closed,
        type === 'button' && classes.buttonItem,
        { [classes.highlightable]: !disableHighlight },
      ),
    };

    const analyticsApi = useAnalytics();
    const { pathname: to } = useResolvedPath(
      type === 'button' ? '' : props.to || '',
    );

    const handleClick = useCallback(
      (event: React.MouseEvent) => {
        if (!noTrack) {
          const action = 'click';
          const subject = text ?? 'Sidebar Item';
          const options = to ? { attributes: { to } } : undefined;
          analyticsApi.captureEvent(action, subject, options);
        }
        onClick?.(event);
      },
      [analyticsApi, text, to, noTrack, onClick],
    );

    if (type === 'button') {
      return (
        <Button
          role="button"
          aria-label={text}
          {...childProps}
          ref={ref as GetRefType<SidebarItemButtonProps>}
          onClick={handleClick}
        >
          {content}
        </Button>
      );
    }

    return (
      <WorkaroundNavLink
        {...(rest as React.ComponentProps<'a'>)}
        {...childProps}
        activeClassName={classes.selected}
        to={props.to ?? ''}
        // XXX (@RobotSail): TypeScript doesn't properly infer the type of ref here, so we cast as any
        // to avoid a type error.
        ref={ref as any}
        aria-label={text ?? props.to}
        onClick={handleClick}
      >
        {content}
      </WorkaroundNavLink>
    );
  },
);

const SidebarItemWithSubmenu = ({
  children,
  ...rest
}: SidebarItemWithSubmenuProps) => {
  const { sidebarConfig } = useContext(SidebarConfigContext);
  const classes = useMemoStyles(sidebarConfig);
  const [isHoveredOn, setIsHoveredOn] = useState(false);
  const location = useLocation();
  const isActive = useLocationMatch(children, location);
  const isSmallScreen = useMediaQuery<BackstageTheme>((theme: BackstageTheme) =>
    theme.breakpoints.down('sm'),
  );

  const handleMouseEnter = () => {
    setIsHoveredOn(true);
  };
  const handleMouseLeave = () => {
    setIsHoveredOn(false);
  };

  const ArrowIcon: IconComponent = () => {
    if (isSmallScreen) {
      return isHoveredOn ? (
        <ArrowDropUp fontSize="small" className={classes.submenuArrow} />
      ) : (
        <ArrowDropDown fontSize="small" className={classes.submenuArrow} />
      );
    }
    return !isHoveredOn ? (
      <ArrowRightIcon fontSize="small" className={classes.submenuArrow} />
    ) : null;
  };

  return (
    <SidebarItemWithSubmenuContext.Provider
      value={{
        isHoveredOn,
        setIsHoveredOn,
      }}
    >
      <nav
        data-testid="item-with-submenu"
        onMouseLeave={handleMouseLeave}
        onTouchStart={isHoveredOn ? handleMouseLeave : handleMouseEnter}
        onMouseEnter={handleMouseEnter}
        className={classnames(isHoveredOn && classes.highlighted)}
        {...rest}
      >
        <SidebarItemBase
          type="button"
          hasSubmenu
          className={isActive ? classes.selected : ''}
          icon={ArrowIcon}
        />
        {isHoveredOn && children}
      </nav>
    </SidebarItemWithSubmenuContext.Provider>
  );
};

/**
 * Creates a `SidebarItem`
 *
 * @remarks
 * If children contain a `SidebarSubmenu` component the `SidebarItem` will have a expandable submenu
 */
export const SidebarItem = forwardRef<ElementRef<'a'>, SidebarItemProps>(
  (props, ref) => {
    if (props.type === 'submenu') {
      console.log('[SidebarItem] rendering SidebarItemWithSubmenu');
      return (
        <SidebarItemWithSubmenu {...props}>
          {props.children as React.ReactElement<SidebarSubmenuProps>}
        </SidebarItemWithSubmenu>
      );
    }

    console.log('[SidebarItem] rendering SidebarItemBase');
    return <SidebarItemBase {...props} ref={ref} />;
  },
) as (props: SidebarItemProps) => JSX.Element;

type SidebarSearchFieldProps = {
  onSearch: (input: string) => void;
  to?: To & string;
  icon?: IconComponent;
};

export function SidebarSearchField(props: SidebarSearchFieldProps) {
  const { sidebarConfig } = useContext(SidebarConfigContext);
  const [input, setInput] = useState('');
  const classes = useMemoStyles(sidebarConfig);
  const Icon = props.icon ? props.icon : SearchIcon;

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

  const handleInput = (ev: React.ChangeEvent<HTMLInputElement>) => {
    setInput(ev.target.value);
  };

  const handleInputClick = (ev: React.MouseEvent<HTMLInputElement>) => {
    // Clicking into the search fields shouldn't navigate to the search page
    ev.preventDefault();
    ev.stopPropagation();
  };

  const handleItemClick = (ev: React.MouseEvent) => {
    // Clicking on the search icon while should execute a query with the current field content
    search();
    ev.preventDefault();
  };

  return (
    <Box className={classes.searchRoot}>
      <SidebarItem
        icon={Icon}
        to={props.to ?? ''}
        onClick={handleItemClick}
        disableHighlight
        type="link"
      >
        <TextField
          placeholder="Search"
          data-testid="search-field"
          value={input}
          onClick={handleInputClick}
          onChange={handleInput}
          onKeyDown={handleEnter}
          className={classes.searchContainer}
          InputProps={{
            disableUnderline: true,
            className: classes.searchField,
          }}
          inputProps={{
            className: classes.searchFieldHTMLInput,
          }}
        />
      </SidebarItem>
    </Box>
  );
}

export type SidebarSpaceClassKey = 'root';

export const SidebarSpace = styled('div')(
  {
    flex: 1,
  },
  { name: 'BackstageSidebarSpace' },
) as ComponentType<ComponentProps<'div'> & StyledComponentProps<'root'>>;

export type SidebarSpacerClassKey = 'root';

export const SidebarSpacer = styled('div')(
  {
    height: 8,
  },
  { name: 'BackstageSidebarSpacer' },
) as ComponentType<ComponentProps<'div'> & StyledComponentProps<'root'>>;

export type SidebarDividerClassKey = 'root';

export const SidebarDivider = styled('hr')(
  ({ theme }) => ({
    height: 1,
    width: '100%',
    background: '#383838',
    border: 'none',
    margin: theme.spacing(1.2, 0),
  }),
  { name: 'BackstageSidebarDivider' },
) as ComponentType<ComponentProps<'hr'> & StyledComponentProps<'root'>>;

const styledScrollbar = (theme: Theme): CreateCSSProperties => ({
  overflowY: 'auto',
  '&::-webkit-scrollbar': {
    backgroundColor: theme.palette.background.default,
    width: '5px',
    borderRadius: '5px',
  },
  '&::-webkit-scrollbar-thumb': {
    backgroundColor: theme.palette.text.secondary,
    borderRadius: '5px',
  },
});

export const SidebarScrollWrapper = styled('div')(({ theme }) => {
  const scrollbarStyles = styledScrollbar(theme);
  return {
    flex: '0 1 auto',
    overflowX: 'hidden',
    // 5px space to the right of the scrollbar
    width: 'calc(100% - 5px)',
    // Display at least one item in the container
    // Question: Can this be a config/theme variable - if so, which? :/
    minHeight: '48px',
    overflowY: 'hidden',
    '@media (hover: none)': scrollbarStyles,
    '&:hover': scrollbarStyles,
  };
}) as ComponentType<ComponentProps<'div'> & StyledComponentProps<'root'>>;

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
  const classes = useMemoStyles(sidebarConfig);
  const { isOpen, setOpen } = useSidebarOpenState();
  const isSmallScreen = useMediaQuery<BackstageTheme>(
    theme => theme.breakpoints.down('md'),
    { noSsr: true },
  );

  if (isSmallScreen) {
    return null;
  }

  const handleClick = () => {
    setOpen(!isOpen);
  };

  return (
    <Button
      role="button"
      onClick={handleClick}
      className={classes.expandButton}
      aria-label="Expand Sidebar"
      data-testid="sidebar-expand-button"
    >
      <Box className={classes.arrows}>
        {isOpen ? <DoubleArrowLeft /> : <DoubleArrowRight />}
      </Box>
    </Button>
  );
};
