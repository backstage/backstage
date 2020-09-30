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

import React from 'react';
import {
  MenuList,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Typography,
  Badge,
} from '@material-ui/core';
import { useNavigationStyles } from '../../utils/styles';
import { useConfig, useScroll } from '../../hooks';
import { findAlways } from '../../types';
import {
  DefaultNavigation,
  NavigationItem,
  getDefaultNavigationItems,
} from '../../utils/navigation';

type CostInsightsNavigationProps = {
  alerts: number;
};

const CostInsightsNavigation = ({ alerts }: CostInsightsNavigationProps) => {
  const classes = useNavigationStyles();
  const { products, icons } = useConfig();

  const productNavigationItems: NavigationItem[] = products.map(product => ({
    navigation: product.kind,
    icon: findAlways(icons, i => i.kind === product.kind).component,
    title: product.name,
  }));

  const navigationItems = getDefaultNavigationItems(alerts).concat(
    productNavigationItems,
  );

  return (
    <MenuList className={classes.menuList}>
      {navigationItems.map((item: NavigationItem) => (
        <NavigationMenuItem
          key={`navigation-menu-item-${item.navigation}`}
          navigation={item.navigation}
          icon={
            item.navigation === DefaultNavigation.AlertInsightsHeader ? (
              <Badge badgeContent={alerts} color="secondary">
                {React.cloneElement(item.icon, {
                  className: classes.navigationIcon,
                })}
              </Badge>
            ) : (
              React.cloneElement(item.icon, {
                className: classes.navigationIcon,
              })
            )
          }
          title={item.title}
        />
      ))}
    </MenuList>
  );
};

const NavigationMenuItem = ({ navigation, icon, title }: NavigationItem) => {
  const classes = useNavigationStyles();
  const { scrollIntoView } = useScroll(navigation);
  return (
    <MenuItem
      button
      data-testid={`menu-item-${navigation}`}
      className={classes.menuItem}
      onClick={scrollIntoView}
    >
      <ListItemIcon className={classes.listItemIcon}>{icon}</ListItemIcon>
      <ListItemText
        primary={<Typography className={classes.title}>{title}</Typography>}
      />
    </MenuItem>
  );
};

export default CostInsightsNavigation;
