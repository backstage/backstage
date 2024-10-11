/*
 * Copyright 2022 The Backstage Authors
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
import Card from '@material-ui/core/Card';
import List from '@material-ui/core/List';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import MenuItem from '@material-ui/core/MenuItem';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import SettingsIcon from '@material-ui/icons/Settings';
import React, { Fragment } from 'react';
import {
  TranslationFunction,
  useTranslationRef,
} from '@backstage/core-plugin-api/alpha';
import { scaffolderTranslationRef } from '../../translation';

import AllIcon from '@material-ui/icons/FontDownload';

const useStyles = makeStyles(
  theme => ({
    root: {
      backgroundColor: 'rgba(0, 0, 0, .11)',
      boxShadow: 'none',
      margin: theme.spacing(1, 0, 1, 0),
    },
    title: {
      margin: theme.spacing(1, 0, 0, 1),
      textTransform: 'uppercase',
      fontSize: 12,
      fontWeight: 'bold',
    },
    listIcon: {
      minWidth: 30,
      color: theme.palette.text.primary,
    },
    menuItem: {
      minHeight: theme.spacing(6),
    },
    groupWrapper: {
      margin: theme.spacing(1, 1, 2, 1),
    },
  }),
  {
    name: 'ScaffolderReactOwnerListPicker',
  },
);

export type ButtonGroup = {
  name: string;
  items: {
    id: 'owned' | 'starred' | 'all';
    label: string;
    icon?: IconComponent;
  }[];
};

function getFilterGroups(
  t: TranslationFunction<typeof scaffolderTranslationRef.T>,
): ButtonGroup[] {
  return [
    {
      name: t('ownerListPicker.title'),
      items: [
        {
          id: 'owned',
          label: t('ownerListPicker.options.owned'),
          icon: SettingsIcon,
        },
        {
          id: 'all',
          label: t('ownerListPicker.options.all'),
          icon: AllIcon,
        },
      ],
    },
  ];
}

export const OwnerListPicker = (props: {
  filter: string;
  onSelectOwner: (id: 'owned' | 'all') => void;
}) => {
  const { filter, onSelectOwner } = props;
  const classes = useStyles();
  const { t } = useTranslationRef(scaffolderTranslationRef);

  const filterGroups = getFilterGroups(t);
  return (
    <Card className={classes.root}>
      {filterGroups.map(group => (
        <Fragment key={group.name}>
          <Typography
            variant="subtitle2"
            component="span"
            className={classes.title}
          >
            {group.name}
          </Typography>
          <Card className={classes.groupWrapper}>
            <List disablePadding dense role="menu">
              {group.items.map((item, index) => (
                <MenuItem
                  key={item.id}
                  divider={index !== group.items.length - 1}
                  ContainerProps={{ role: 'menuitem' }}
                  onClick={() => onSelectOwner(item.id as 'owned' | 'all')}
                  selected={item.id === filter}
                  className={classes.menuItem}
                  data-testid={`owner-picker-${item.id}`}
                >
                  {item.icon && (
                    <ListItemIcon className={classes.listIcon}>
                      <item.icon fontSize="small" />
                    </ListItemIcon>
                  )}
                  <ListItemText>
                    <Typography variant="body1">{item.label}</Typography>
                  </ListItemText>
                </MenuItem>
              ))}
            </List>
          </Card>
        </Fragment>
      ))}
    </Card>
  );
};
