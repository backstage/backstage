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
import React, { useContext, useState } from 'react';
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
import clsx from 'clsx';
import { BackstageTheme } from '@backstage/theme';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import ArrowDropUpIcon from '@material-ui/icons/ArrowDropUp';
import { ItemWithSubmenuContext } from './config';

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
    width: '72%',
    margin: '10px 0 10px 0',
    color: theme.palette.navigation.color,
  },
}));

type DropDownItem = {
  title: string;
  to: string;
};
type SubmenuItemProps = {
  title: string;
  to: string;
  hasDropDown?: boolean;
  icon: IconComponent;
  dropdownItems?: DropDownItem[];
};

export const SubmenuItem = ({
  title,
  to,
  hasDropDown = false,
  icon: Icon,
  dropdownItems,
}: SubmenuItemProps) => {
  const classes = useStyles();
  const { pathname: locationPathname } = useLocation();
  const { pathname: toPathname } = useResolvedPath(to);
  const { setIsHoveredOn } = useContext(ItemWithSubmenuContext);
  const closeSubmenu = () => {
    setIsHoveredOn(false);
  };

  let isActive = locationPathname === toPathname;

  const [showDropDown, setShowDropDown] = useState(false);
  const handleClickDropdown = () => {
    setShowDropDown(!showDropDown);
  };
  if (hasDropDown && dropdownItems !== undefined) {
    dropdownItems.some(item => {
      const resolvedPath = resolvePath(item.to);
      isActive = locationPathname === resolvedPath.pathname;
      return isActive;
    });
    return (
      <div className={classes.itemContainer}>
        <button
          onClick={handleClickDropdown}
          className={clsx(
            classes.item,
            isActive ? classes.selected : undefined,
          )}
        >
          <Icon fontSize="small" />
          <Typography variant="subtitle1" className={classes.label}>
            {title}
          </Typography>
          {showDropDown ? (
            <ArrowDropUpIcon className={classes.dropdownArrow} />
          ) : (
            <ArrowDropDownIcon className={classes.dropdownArrow} />
          )}
        </button>
        {hasDropDown && showDropDown && (
          <div className={classes.dropdown}>
            {dropdownItems.map((object, key) => (
              <Link
                component={NavLink}
                to={object.to}
                underline="none"
                className={classes.dropdownItem}
                onClick={closeSubmenu}
                key={key}
              >
                {object.title}
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
        component={NavLink}
        to={to}
        underline="none"
        className={clsx(classes.item, isActive ? classes.selected : undefined)}
        onClick={closeSubmenu}
      >
        <Icon fontSize="small" />
        <Typography variant="subtitle1" className={classes.label}>
          {title}
        </Typography>
      </Link>
    </div>
  );
};
