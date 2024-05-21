/*
 * Copyright 2024 The Backstage Authors
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
  Children,
  ReactNode,
  MouseEvent,
  useCallback,
  useState,
} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import ArrowDropUpIcon from '@material-ui/icons/ArrowDropUp';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import { IconComponent } from '@backstage/frontend-plugin-api';
import { SidebarItem } from './SidebarItem';
import { useSidebarPinState } from '@backstage/core-components';

const useStyles = makeStyles({
  menuItem: {
    padding: 0,
    '&:hover': {
      backgroundColor: 'unset',
    },
  },
});

export function SidebarDropdown(props: {
  icon: IconComponent;
  title: string;
  children: ReactNode;
  select?: true;
}) {
  const { icon, title, select, children } = props;
  const classes = useStyles();
  const [anchorEl, setAnchorEl] = useState<Element | null>(null);
  const { isMobile } = useSidebarPinState();

  const handleClick = useCallback(
    (event: MouseEvent) => setAnchorEl(event.currentTarget),
    [setAnchorEl],
  );

  const handleClose = useCallback(() => setAnchorEl(null), [setAnchorEl]);

  const open = Boolean(anchorEl);

  return isMobile ? (
    children
  ) : (
    <>
      <SidebarItem icon={icon} title={title} onClick={handleClick}>
        {select && open ? <ArrowDropUpIcon fontSize="small" /> : null}
        {select && !open ? <ArrowDropDownIcon fontSize="small" /> : null}
      </SidebarItem>
      <Menu
        open={open}
        onClose={handleClose}
        anchorEl={anchorEl}
        transitionDuration={0}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
      >
        {Children.map(children, child => (
          <MenuItem className={classes.menuItem} onClick={handleClose}>
            {child}
          </MenuItem>
        ))}
      </Menu>
    </>
  );
}
