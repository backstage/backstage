/*
 * Copyright 2020 Spotify AB
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
  makeStyles,
  styled,
  TextField,
  Theme,
  Typography,
  Badge,
} from '@material-ui/core';
import { IconComponent } from '@backstage/core-api';
import SearchIcon from '@material-ui/icons/Search';
import clsx from 'clsx';
import React, { FC, useContext, useState, KeyboardEventHandler } from 'react';
import { NavLink } from 'react-router-dom';
import { sidebarConfig, SidebarContext } from './config';

const useStyles = makeStyles<Theme>(theme => {
  const {
    selectedIndicatorWidth,
    drawerWidthClosed,
    drawerWidthOpen,
    iconContainerWidth,
    iconSize,
  } = sidebarConfig;

  return {
    root: {
      color: '#b5b5b5',
      display: 'flex',
      flexFlow: 'row nowrap',
      alignItems: 'center',
      height: 48,
      cursor: 'pointer',
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
    icon: {
      width: iconSize,
      height: iconSize,
    },
    searchRoot: {
      marginBottom: 12,
    },
    searchField: {
      color: '#b5b5b5',
      fontWeight: 'bold',
      fontSize: theme.typography.fontSize,
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
        borderLeft: `solid ${selectedIndicatorWidth}px #9BF0E1`,
        color: '#ffffff',
      },
      '&$closed': {
        width: drawerWidthClosed - selectedIndicatorWidth,
      },
      '& $iconContainer': {
        marginLeft: -selectedIndicatorWidth,
      },
    },
  };
});

type SidebarItemProps = {
  icon: IconComponent;
  text?: string;
  to?: string;
  disableSelected?: boolean;
  hasNotifications?: boolean;
  onClick?: () => void;
};

export const SidebarItem: FC<SidebarItemProps> = ({
  icon: Icon,
  text,
  to = '#',
  // TODO: isActive is not in v6
  // disableSelected = false,
  hasNotifications = false,
  onClick,
  children,
}) => {
  const classes = useStyles();
  // XXX (@koroeskohr): unsure this is optimal. But I just really didn't want to have the item component
  // depend on the current location, and at least have it being optionally forced to selected.
  // Still waiting on a Q answered to fine tune the implementation
  const { isOpen } = useContext(SidebarContext);

  const itemIcon = (
    <Badge
      color="secondary"
      variant="dot"
      overlap="circle"
      invisible={!hasNotifications}
    >
      <Icon fontSize="small" className={classes.icon} />
    </Badge>
  );

  if (!isOpen) {
    return (
      <NavLink
        className={clsx(classes.root, classes.closed)}
        activeClassName={classes.selected}
        end
        to={to}
        onClick={onClick}
      >
        {itemIcon}
      </NavLink>
    );
  }
  return (
    <NavLink
      className={clsx(classes.root, classes.open)}
      activeClassName={classes.selected}
      end
      to={to}
      onClick={onClick}
    >
      <div data-testid="login-button" className={classes.iconContainer}>
        {itemIcon}
      </div>
      {text && (
        <Typography variant="subtitle2" className={classes.label}>
          {text}
        </Typography>
      )}
      <div className={classes.secondaryAction}>{children}</div>
    </NavLink>
  );
};

type SidebarSearchFieldProps = {
  onSearch: (input: string) => void;
};

export const SidebarSearchField: FC<SidebarSearchFieldProps> = props => {
  const [input, setInput] = useState('');
  const classes = useStyles();

  const handleEnter: KeyboardEventHandler = ev => {
    if (ev.key === 'Enter') {
      props.onSearch(input);
    }
  };

  const handleInput = (ev: React.ChangeEvent<HTMLInputElement>) => {
    setInput(ev.target.value);
  };

  return (
    <div className={classes.searchRoot}>
      <SidebarItem icon={SearchIcon} disableSelected>
        <TextField
          placeholder="Search"
          onChange={handleInput}
          onKeyDown={handleEnter}
          className={classes.searchContainer}
          InputProps={{
            disableUnderline: true,
            className: classes.searchField,
          }}
        />
      </SidebarItem>
    </div>
  );
};

export const SidebarSpace = styled('div')({
  flex: 1,
});

export const SidebarSpacer = styled('div')({
  height: 8,
});

export const SidebarDivider = styled('hr')({
  height: 1,
  width: '100%',
  background: '#383838',
  border: 'none',
  margin: 0,
});
