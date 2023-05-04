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

import React, {
  CSSProperties,
  ComponentProps,
  ComponentType,
  KeyboardEventHandler,
  ReactNode,
  forwardRef,
  useCallback,
  useContext,
  useState,
} from 'react';

import { useAnalytics, useElementFilter } from '@backstage/core-plugin-api';
import ArrowDropDown from '@mui/icons-material/ArrowDropDown';
import ArrowDropUp from '@mui/icons-material/ArrowDropUp';
import ArrowRightIcon from '@mui/icons-material/ArrowRight';
import SearchIcon from '@mui/icons-material/Search';
import Badge from '@mui/material/Badge';
import Box from '@mui/material/Box';
import SvgIcon from '@mui/material/SvgIcon';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { Theme, styled } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import { StyledComponentProps } from '@mui/styles';
import { Location } from 'history';
import {
  Link,
  NavLinkProps,
  resolvePath,
  useLocation,
  useResolvedPath,
} from 'react-router-dom';
import { makeStyles } from 'tss-react/mui';

import Button from '@mui/material/Button';
import { clsx } from 'clsx';
import { useSidebarOpenState } from './SidebarOpenStateContext';
import { SidebarSubmenu, SidebarSubmenuProps } from './SidebarSubmenu';
import { SidebarSubmenuItemProps } from './SidebarSubmenuItem';
import {
  SidebarConfig,
  SidebarConfigContext,
  SidebarItemWithSubmenuContext,
} from './config';
import DoubleArrowLeft from './icons/DoubleArrowLeft';
import DoubleArrowRight from './icons/DoubleArrowRight';
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

const useStyles = makeStyles<
  { sidebarConfig: SidebarConfig },
  'root' | 'closed' | 'closedItemIcon' | 'iconContainer'
>({
  name: 'BackstageSidebarItem',
})((theme, { sidebarConfig }, classes) => ({
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
    background: theme.palette.navigation.navItem?.hoverBackground ?? '#404040',
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
    [`&.${classes.root}`]: {
      borderLeft: `solid ${sidebarConfig.selectedIndicatorWidth}px ${theme.palette.navigation.indicator}`,
      color: theme.palette.navigation.selectedColor,
    },
    [`&.${classes.closed}`]: {
      width: sidebarConfig.drawerWidthClosed,
    },
    [`& .${classes.closedItemIcon}`]: {
      paddingRight: sidebarConfig.selectedIndicatorWidth,
    },
    [`& .${classes.iconContainer}`]: {
      marginLeft: -sidebarConfig.selectedIndicatorWidth,
    },
  },
}));

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
  icon: typeof SvgIcon;
  text?: string;
  hasNotifications?: boolean;
  hasSubmenu?: boolean;
  disableHighlight?: boolean;
  className?: string;
  noTrack?: boolean;
  onClick?: (ev: React.MouseEvent) => void;
};

type SidebarItemButtonProps = SidebarItemBaseProps & {
  onClick: (ev: React.MouseEvent) => void;
  children?: ReactNode;
};

type SidebarItemLinkProps = SidebarItemBaseProps & {
  to: string;
  onClick?: (ev: React.MouseEvent) => void;
} & NavLinkProps;

type SidebarItemWithSubmenuProps = SidebarItemBaseProps & {
  to?: string;
  onClick?: (ev: React.MouseEvent) => void;
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

const sidebarSubmenuType = React.createElement(SidebarSubmenu).type;

// TODO(Rugvip): Remove this once NavLink is updated in react-router-dom.
//               This is needed because react-router doesn't handle the path comparison
//               properly yet, matching for example /foobar with /foo.
export const WorkaroundNavLink = React.forwardRef<
  HTMLAnchorElement,
  NavLinkProps & { activeStyle?: CSSProperties; activeClassName?: string }
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
      className={clsx([className, isActive ? activeClassName : undefined])}
    />
  );
});

/**
 * Common component used by SidebarItem & SidebarItemWithSubmenu
 */
const SidebarItemBase = forwardRef<any, SidebarItemProps>((props, ref) => {
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
  const classes = useStyles({ sidebarConfig });
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
      className={clsx({ [classes.classes.closedItemIcon]: !isOpen })}
    >
      {displayItemIcon}
    </Badge>
  );

  const openContent = (
    <>
      <Box data-testid="login-button" className={classes.classes.iconContainer}>
        {itemIcon}
      </Box>
      {text && (
        <Typography variant="subtitle2" className={classes.classes.label}>
          {text}
        </Typography>
      )}
      <div className={classes.classes.secondaryAction}>{children}</div>
    </>
  );

  const content = isOpen ? openContent : itemIcon;

  const childProps = {
    onClick,
    className: clsx(
      className,
      classes.classes.root,
      isOpen ? classes.classes.open : classes.classes.closed,
      isButtonItem(props) && classes.classes.buttonItem,
      { [classes.classes.highlightable]: !disableHighlight },
    ),
  };

  const analyticsApi = useAnalytics();
  const { pathname: to } = useResolvedPath(
    !isButtonItem(props) && props.to ? props.to : '',
  );

  const handleClick = useCallback(
    (event: React.MouseEvent<HTMLAnchorElement | HTMLButtonElement>) => {
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

  if (isButtonItem(props)) {
    return (
      <Button
        role="button"
        aria-label={text}
        {...childProps}
        ref={ref}
        onClick={handleClick}
      >
        {content}
      </Button>
    );
  }

  return (
    <WorkaroundNavLink
      {...childProps}
      activeClassName={classes.classes.selected}
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
  children: React.ReactElement<SidebarSubmenuProps>;
}) => {
  const { sidebarConfig } = useContext(SidebarConfigContext);
  const classes = useStyles({ sidebarConfig });
  const [isHoveredOn, setIsHoveredOn] = useState(false);
  const location = useLocation();
  const isActive = useLocationMatch(children, location);
  const isSmallScreen = useMediaQuery<Theme>(theme =>
    theme.breakpoints.down('md'),
  );

  const handleMouseEnter = () => {
    setIsHoveredOn(true);
  };
  const handleMouseLeave = () => {
    setIsHoveredOn(false);
  };

  const arrowIcon = () => {
    if (isSmallScreen) {
      return isHoveredOn ? (
        <ArrowDropUp
          fontSize="small"
          className={classes.classes.submenuArrow}
        />
      ) : (
        <ArrowDropDown
          fontSize="small"
          className={classes.classes.submenuArrow}
        />
      );
    }
    return (
      !isHoveredOn && (
        <ArrowRightIcon
          fontSize="small"
          className={classes.classes.submenuArrow}
        />
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
        className={clsx(isHoveredOn && classes.classes.highlighted)}
      >
        <SidebarItemBase
          hasSubmenu
          className={isActive ? classes.classes.selected : ''}
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
export const SidebarItem = forwardRef<any, SidebarItemProps>((props, ref) => {
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
        {submenu as React.ReactElement<SidebarSubmenuProps>}
      </SidebarItemWithSubmenu>
    );
  }

  return <SidebarItemBase {...props} ref={ref} />;
}) as (props: SidebarItemProps) => JSX.Element;

type SidebarSearchFieldProps = {
  onSearch: (input: string) => void;
  to?: string;
  icon?: typeof SvgIcon;
};

export function SidebarSearchField(props: SidebarSearchFieldProps) {
  const { sidebarConfig } = useContext(SidebarConfigContext);
  const [input, setInput] = useState('');
  const classes = useStyles({ sidebarConfig });
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
    <Box className={classes.classes.searchRoot}>
      <SidebarItem
        icon={Icon}
        to={props.to}
        onClick={handleItemClick}
        disableHighlight
      >
        <TextField
          placeholder="Search"
          value={input}
          onClick={handleInputClick}
          onChange={handleInput}
          onKeyDown={handleEnter}
          className={classes.classes.searchContainer}
          InputProps={{
            disableUnderline: true,
            className: classes.classes.searchField,
          }}
          inputProps={{
            className: classes.classes.searchFieldHTMLInput,
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

const styledScrollbar = (theme: Theme) => ({
  overflowY: 'auto',
  '&::-webkit-scrollbar': {
    backgroundColor: theme.palette.background.default,
    width: '5px',
    borderRadius: '5px',
  },
  '&::-webkit-scrollbar-thumb': {
    backgroundColor: theme.palette.text.hint,
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
  const classes = useStyles({ sidebarConfig });
  const { isOpen, setOpen } = useSidebarOpenState();
  const isSmallScreen = useMediaQuery<Theme>(
    theme => theme.breakpoints.down('lg'),
    {
      noSsr: true,
    },
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
      className={classes.classes.expandButton}
      aria-label="Expand Sidebar"
      data-testid="sidebar-expand-button"
    >
      <Box className={classes.classes.arrows}>
        {isOpen ? <DoubleArrowLeft /> : <DoubleArrowRight />}
      </Box>
    </Button>
  );
};
