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
import { resolvePath, useLocation, useResolvedPath } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import Tooltip from '@material-ui/core/Tooltip';
import Typography from '@material-ui/core/Typography';
import { Link } from '../../components/Link';
import { IconComponent } from '@backstage/core-plugin-api';
import classnames from 'classnames';
import { BackstageTheme } from '@backstage/theme';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import ArrowDropUpIcon from '@material-ui/icons/ArrowDropUp';
import { SidebarItemWithSubmenuContext } from './config';
import { isLocationMatch } from './utils';

const useStyles = makeStyles<BackstageTheme>(
  theme => ({
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
      whiteSpace: 'nowrap',
      overflow: 'hidden',
      'text-overflow': 'ellipsis',
      lineHeight: 1,
    },
    subtitle: {
      fontSize: 10,
      whiteSpace: 'nowrap',
      overflow: 'hidden',
      'text-overflow': 'ellipsis',
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
      '&:hover': {
        background: '#6f6f6f',
        color: theme.palette.navigation.selectedColor,
      },
    },
    textContent: {
      color: theme.palette.navigation.color,
      paddingLeft: theme.spacing(4),
      paddingRight: theme.spacing(1),
      fontSize: '14px',
      whiteSpace: 'nowrap',
      overflow: 'hidden',
      'text-overflow': 'ellipsis',
    },
  }),
  { name: 'BackstageSidebarSubmenuItem' },
);

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
};

/**
 * Item used inside a submenu within the sidebar.
 *
 * @public
 */
export const SidebarSubmenuItem = (props: SidebarSubmenuItemProps) => {
  const { title, subtitle, to, icon: Icon, dropdownItems } = props;
  const classes = useStyles();
  const { setIsHoveredOn } = useContext(SidebarItemWithSubmenuContext);
  const closeSubmenu = () => {
    setIsHoveredOn(false);
  };
  const toLocation = useResolvedPath(to ?? '');
  const currentLocation = useLocation();
  let isActive = isLocationMatch(currentLocation, toLocation);

  const [showDropDown, setShowDropDown] = useState(false);
  const handleClickDropdown = () => {
    setShowDropDown(!showDropDown);
  };
  if (dropdownItems !== undefined) {
    dropdownItems.some(item => {
      const resolvedPath = resolvePath(item.to);
      isActive = isLocationMatch(currentLocation, resolvedPath);
      return isActive;
    });
    return (
      <div className={classes.itemContainer}>
        <Tooltip title={title} enterDelay={500} enterNextDelay={500}>
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
              <br />
              {subtitle && (
                <Typography variant="caption" className={classes.subtitle}>
                  {subtitle}
                </Typography>
              )}
            </Typography>
            {showDropDown ? (
              <ArrowDropUpIcon className={classes.dropdownArrow} />
            ) : (
              <ArrowDropDownIcon className={classes.dropdownArrow} />
            )}
          </button>
        </Tooltip>
        {dropdownItems && showDropDown && (
          <div className={classes.dropdown}>
            {dropdownItems.map((object, key) => (
              <Tooltip
                key={key}
                title={object.title}
                enterDelay={500}
                enterNextDelay={500}
              >
                <Link
                  to={object.to}
                  underline="none"
                  className={classes.dropdownItem}
                  onClick={closeSubmenu}
                  onTouchStart={e => e.stopPropagation()}
                >
                  <Typography className={classes.textContent}>
                    {object.title}
                  </Typography>
                </Link>
              </Tooltip>
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className={classes.itemContainer}>
      <Tooltip title={title} enterDelay={500} enterNextDelay={500}>
        <Link
          to={to!}
          underline="none"
          className={classnames(
            classes.item,
            isActive ? classes.selected : undefined,
          )}
          onClick={closeSubmenu}
          onTouchStart={e => e.stopPropagation()}
        >
          {Icon && <Icon fontSize="small" />}
          <Typography variant="subtitle1" className={classes.label}>
            {title}
            <br />
            {subtitle && (
              <Typography variant="caption" className={classes.subtitle}>
                {subtitle}
              </Typography>
            )}
          </Typography>
        </Link>
      </Tooltip>
    </div>
  );
};
