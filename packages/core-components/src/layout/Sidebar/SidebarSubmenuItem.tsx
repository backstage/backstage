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
import React, { HTMLAttributeAnchorTarget, useContext, useState } from 'react';
import {
  NavLink,
  resolvePath,
  useLocation,
  useResolvedPath,
} from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Link from '@material-ui/core/Link';
import { IconComponent } from '@backstage/core-plugin-api';
import classnames from 'classnames';
import { BackstageTheme } from '@backstage/theme';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import ArrowDropUpIcon from '@material-ui/icons/ArrowDropUp';
import { SidebarItemWithSubmenuContext } from './config';
import { isLocationMatch } from './utils';

const useStyles = makeStyles<BackstageTheme>(theme => ({
  item: {
    height: 48,
    width: '100%',
    '&:hover': {
      background: '#6f6f6f',
      color: theme.palette.navigation.selectedColor,
    },
    display: 'flex',
    alignItems: 'center',
    color: theme.palette.navigation.color,
    padding: 20,
    cursor: 'pointer',
    position: 'relative',
    background: 'none',
    border: 'none',
  },
  itemContainer: {
    width: '100%',
  },
  selected: {
    background: '#6f6f6f',
    color: '#FFF',
  },
  label: {
    margin: 14,
    marginLeft: 7,
    fontSize: 14,
  },
  dropdownArrow: {
    position: 'absolute',
    right: 21,
  },
  dropdown: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'end',
  },
  dropdownItem: {
    width: '100%',
    padding: '10px 0 10px 0',
  },
  textContent: {
    color: theme.palette.navigation.color,
    display: 'flex',
    justifyContent: 'center',
    [theme.breakpoints.down('xs')]: {
      display: 'block',
      paddingLeft: theme.spacing(4),
    },
    fontSize: '14px',
  },
}));

/**
 * Clickable item displayed when submenu item is clicked.
 * It can be an internal or external link.
 *
 * @public
 */
export type SidebarSubmenuItemDropdownItem =
  | SidebarSubmenuInternalLink
  | SidebarSubmenuExternalLink;

/**
 * Clickable item displayed when submenu item is clicked.
 * It can be an internal or external link.
 *
 * @public
 *
 * to: internal relative path to navigate to when item is clicked
 */
export type SidebarSubmenuInternalLink = {
  title: string;
  icon?: IconComponent;
  to: string;
  href?: never;
  target?: never;
  dropdownItems?: never;
};

/**
 * Clickable item displayed when submenu item is clicked.
 * It can be an internal or external link.
 *
 * @public
 *
 */
export type SidebarSubmenuExternalLink = {
  title: string;
  icon?: IconComponent;
  href: string;
  target?: HTMLAttributeAnchorTarget;
  to?: never;
  dropdownItems?: never;
};

/**
 * Render a drop-down menu.
 *
 * @public
 *
 * dropdownItems: items to be displayed once the component is clicked
 */
export type SidebarSubmenuDropdownProps = {
  title: string;
  icon?: IconComponent;
  dropdownItems: SidebarSubmenuItemDropdownItem[];
  href?: never;
  target?: never;
  to?: never;
};

/**
 * Holds submenu item content.
 *
 * title: Text content of submenu item
 * to: Path to navigate to when item is clicked
 * href: External url to navigate to when item is clicked
 * target: Where to display the external url
 * icon: Icon displayed on the left of text content
 * dropdownItems: Optional array of dropdown items displayed when submenu item is clicked.
 *
 * @public
 */
export type SidebarSubmenuItemProps =
  | SidebarSubmenuInternalLink
  | SidebarSubmenuExternalLink
  | SidebarSubmenuDropdownProps;

/**
 * Item used inside a submenu within the sidebar.
 *
 * @public
 */
export const SidebarSubmenuItem = (props: SidebarSubmenuItemProps) => {
  const { title, to, href, target, icon: Icon, dropdownItems } = props;
  const classes = useStyles();
  const { setIsHoveredOn } = useContext(SidebarItemWithSubmenuContext);
  const closeSubmenu = () => {
    setIsHoveredOn(false);
  };
  const toLocation = useResolvedPath(to || '/');
  const currentLocation = useLocation();
  let isActive = to ? isLocationMatch(currentLocation, toLocation) : false;

  const [showDropDown, setShowDropDown] = useState(false);
  const handleClickDropdown = () => {
    setShowDropDown(!showDropDown);
  };
  if (dropdownItems !== undefined) {
    dropdownItems.some(item => {
      if (item.to) {
        const resolvedPath = resolvePath(item.to);
        isActive = isLocationMatch(currentLocation, resolvedPath);
        return isActive;
      }
      return false;
    });
    return (
      <div className={classes.itemContainer}>
        <button
          onClick={handleClickDropdown}
          onTouchStart={e => e.stopPropagation()}
          className={classnames(
            classes.item,
            isActive ? classes.selected : undefined,
          )}
        >
          {Icon && <Icon fontSize="small" />}
          <Typography variant="subtitle1" className={classes.label}>
            {title}
          </Typography>
          {showDropDown ? (
            <ArrowDropUpIcon className={classes.dropdownArrow} />
          ) : (
            <ArrowDropDownIcon className={classes.dropdownArrow} />
          )}
        </button>
        {showDropDown && (
          <div className={classes.dropdown}>
            {dropdownItems.map((object, key) => (
              <Link
                underline="none"
                className={classes.dropdownItem}
                onClick={closeSubmenu}
                onTouchStart={e => e.stopPropagation()}
                key={key}
                {...(object.href
                  ? { href: object.href, target: object.target }
                  : { component: NavLink, to: object.to })}
              >
                <Typography className={classes.textContent}>
                  {object.title}
                </Typography>
              </Link>
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className={classes.itemContainer}>
      <Link
        underline="none"
        className={classnames(
          classes.item,
          isActive ? classes.selected : undefined,
        )}
        onClick={closeSubmenu}
        onTouchStart={e => e.stopPropagation()}
        {...(href ? { href, target } : { component: NavLink, to })}
      >
        {Icon && <Icon fontSize="small" />}
        <Typography variant="subtitle1" className={classes.label}>
          {title}
        </Typography>
      </Link>
    </div>
  );
};
