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

import { IconComponent } from '@backstage/core-plugin-api';
import { BackstageTheme } from '@backstage/theme';
import { makeStyles, styled, Theme } from '@material-ui/core/styles';
import Badge from '@material-ui/core/Badge';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import { CreateCSSProperties } from '@material-ui/core/styles/withStyles';
import SearchIcon from '@material-ui/icons/Search';
import clsx from 'clsx';
import React, {
  forwardRef,
  KeyboardEventHandler,
  ReactNode,
  useContext,
  useState,
} from 'react';
import {
  Link,
  NavLinkProps,
  useLocation,
  useResolvedPath,
} from 'react-router-dom';
import { sidebarConfig, SidebarContext } from './config';

export type SidebarItemClassKey =
  | 'root'
  | 'buttonItem'
  | 'closed'
  | 'open'
  | 'label'
  | 'iconContainer'
  | 'searchRoot'
  | 'searchField'
  | 'searchFieldHTMLInput'
  | 'searchContainer'
  | 'secondaryAction'
  | 'selected';

const useStyles = makeStyles<BackstageTheme>(
  theme => {
    const {
      selectedIndicatorWidth,
      drawerWidthClosed,
      drawerWidthOpen,
      iconContainerWidth,
    } = sidebarConfig;
    return {
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
        width: 'auto',
        margin: 0,
        padding: 0,
        textAlign: 'inherit',
        font: 'inherit',
      },
      closed: {
        width: drawerWidthClosed,
        justifyContent: 'center',
      },
      open: {
        [theme.breakpoints.up('sm')]: {
          width: drawerWidthOpen,
        },
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
        width: iconContainerWidth,
        marginRight: -theme.spacing(2),
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      },
      searchRoot: {
        marginBottom: 12,
      },
      searchField: {
        color: '#b5b5b5',
        fontWeight: 'bold',
        fontSize: theme.typography.fontSize,
      },
      searchFieldHTMLInput: {
        padding: `${theme.spacing(2)} 0 ${theme.spacing(2)}`,
      },
      searchContainer: {
        width: drawerWidthOpen - iconContainerWidth,
      },
      secondaryAction: {
        width: theme.spacing(6),
        textAlign: 'center',
        marginRight: theme.spacing(1),
      },
      selected: {
        '&$root': {
          borderLeft: `solid ${selectedIndicatorWidth}px ${theme.palette.navigation.indicator}`,
          color: theme.palette.navigation.selectedColor,
        },
        buttonItem: {
          background: 'none',
          border: 'none',
          width: 'auto',
          margin: 0,
          padding: 0,
          textAlign: 'inherit',
          font: 'inherit',
        },
        closed: {
          width: drawerWidthClosed,
          justifyContent: 'center',
        },
        open: {
          width: drawerWidthOpen,
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
          width: iconContainerWidth,
          marginRight: -theme.spacing(2),
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        },
        searchRoot: {
          marginBottom: 12,
        },
        searchField: {
          color: '#b5b5b5',
          fontWeight: 'bold',
          fontSize: theme.typography.fontSize,
        },
        searchFieldHTMLInput: {
          padding: `${theme.spacing(2)} 0 ${theme.spacing(2)}`,
        },
        searchContainer: {
          width: drawerWidthOpen - iconContainerWidth,
        },
        secondaryAction: {
          width: theme.spacing(6),
          textAlign: 'center',
          marginRight: theme.spacing(1),
        },
        selected: {
          '&$root': {
            borderLeft: `solid ${selectedIndicatorWidth}px ${theme.palette.navigation.indicator}`,
            color: theme.palette.navigation.selectedColor,
          },
          '&$closed': {
            width: drawerWidthClosed - selectedIndicatorWidth,
          },
          '& $iconContainer': {
            marginLeft: -selectedIndicatorWidth,
          },
        },
      },
    };
  },
  { name: 'BackstageSidebarItem' },
);

type SidebarItemBaseProps = {
  icon: IconComponent;
  text?: string;
  hasNotifications?: boolean;
  children?: ReactNode;
  className?: string;
};

type SidebarItemButtonProps = SidebarItemBaseProps & {
  onClick: (ev: React.MouseEvent) => void;
};

type SidebarItemLinkProps = SidebarItemBaseProps & {
  to: string;
  onClick?: (ev: React.MouseEvent) => void;
} & NavLinkProps;

type SidebarItemProps = SidebarItemButtonProps | SidebarItemLinkProps;

function isButtonItem(
  props: SidebarItemProps,
): props is SidebarItemButtonProps {
  return (props as SidebarItemLinkProps).to === undefined;
}

// TODO(Rugvip): Remove this once NavLink is updated in react-router-dom.
//               This is needed because react-router doesn't handle the path comparison
//               properly yet, matching for example /foobar with /foo.
export const WorkaroundNavLink = React.forwardRef<
  HTMLAnchorElement,
  NavLinkProps
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

export const SidebarItem = forwardRef<any, SidebarItemProps>((props, ref) => {
  const {
    icon: Icon,
    text,
    hasNotifications = false,
    onClick,
    children,
    className,
    ...navLinkProps
  } = props;
  const classes = useStyles();
  // XXX (@koroeskohr): unsure this is optimal. But I just really didn't want to have the item component
  // depend on the current location, and at least have it being optionally forced to selected.
  // Still waiting on a Q answered to fine tune the implementation
  const { isOpen } = useContext(SidebarContext);

  const itemIcon = (
    <Badge
      color="secondary"
      variant="dot"
      overlap="circular"
      invisible={!hasNotifications}
    >
      <Icon fontSize="small" />
    </Badge>
  );

  const closedContent = itemIcon;

  const openContent = (
    <>
      <div data-testid="login-button" className={classes.iconContainer}>
        {itemIcon}
      </div>
      {text && (
        <Typography variant="subtitle2" className={classes.label}>
          {text}
        </Typography>
      )}
      <div className={classes.secondaryAction}>{children}</div>
    </>
  );

  const content = isOpen ? openContent : closedContent;

  const childProps = {
    onClick,
    className: clsx(
      className,
      classes.root,
      isOpen ? classes.open : classes.closed,
      isButtonItem(props) && classes.buttonItem,
    ),
  };

  if (isButtonItem(props)) {
    return (
      <button aria-label={text} {...childProps} ref={ref}>
        {content}
      </button>
    );
  }

  return (
    <WorkaroundNavLink
      {...childProps}
      activeClassName={classes.selected}
      to={props.to}
      ref={ref}
      aria-label={text ? text : props.to}
      {...navLinkProps}
    >
      {content}
    </WorkaroundNavLink>
  );
});

type SidebarSearchFieldProps = {
  onSearch: (input: string) => void;
  to?: string;
};

export function SidebarSearchField(props: SidebarSearchFieldProps) {
  const [input, setInput] = useState('');
  const classes = useStyles();

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
    <div className={classes.searchRoot}>
      <SidebarItem icon={SearchIcon} to={props.to} onClick={handleItemClick}>
        <TextField
          placeholder="Search"
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
    </div>
  );
}

export const SidebarSpace = styled('div')(
  {
    flex: 1,
  },
  { name: 'BackstageSidebarSpace' },
);

export const SidebarSpacer = styled('div')(
  {
    height: 8,
  },
  { name: 'BackstageSidebarSpacer' },
);

export const SidebarDivider = styled('hr')(
  {
    height: 1,
    width: '100%',
    background: '#383838',
    border: 'none',
    margin: '12px 0px',
  },
  { name: 'BackstageSidebarDivider' },
);

const styledScrollbar = (theme: Theme): CreateCSSProperties => ({
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
});
